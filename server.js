const express = require('express');
const mysql = require('mysql2/promise');
const { spawn } = require('child_process');
require('dotenv').config();

const app = express();
app.use(express.json());

// Cấu hình CORS Middleware cho phép ứng dụng Frontend truy cập và giao tiếp API cục bộ
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Kết nối cơ sở dữ liệu hệ thống tầng Data Warehouse (DWH)
const dwhPool = mysql.createPool({
    host: process.env.DWH_HOST,
    user: process.env.DWH_USER,
    password: process.env.DWH_PASS,
    database: process.env.DWH_NAME,
    waitForConnections: true,
    connectionLimit: 15,
    queueLimit: 0
});

/**
 * Endpoint tiếp nhận và phản hồi kết quả dự đoán hành vi người dùng
 * POST /api/v1/predict
 */
app.post('/api/v1/predict', async (req, res) => {
    const { user_id, product_id } = req.body;

    if (!user_id || !product_id) {
        return res.status(400).json({ success: false, message: "Yêu cầu cung cấp đầy đủ tham số đầu vào (user_id và product_id)" });
    }

    try {
        // 1. Truy vấn các đặc trưng tĩnh cố định của sản phẩm từ bảng product_metadata [khớp schema của bạn]
        const [productRows] = await dwhPool.execute(
            `SELECT price, brand_encoded, category_code_encoded 
             FROM product_metadata 
             WHERE product_id = ? LIMIT 1`,
            [Number(product_id)]
        );

        if (productRows.length === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy thông tin sản phẩm trong tầng DWH" });
        }

        const product = productRows[0];
        let inputPrice = Number(product.price);

        // 2. TRUY VẤN DỮ LIỆU THẬT: Lấy tổng số lượt tương tác thực tế của user_id vừa nhập từ bảng metrics
        const safeUserId = String(user_id).trim();
        const [userRows] = await dwhPool.execute(
            `SELECT interaction_score FROM user_interaction_metrics 
             WHERE user_id = ? LIMIT 1`,
            [safeUserId]
        );

        // Nếu user mới tinh chưa có trong database, mặc định số lần tương tác bằng 0
        const interactions = userRows.length > 0 ? userRows[0].interaction_score : 0;

        // 3. LOGIC FEATURE ENGINEERING: Điều chỉnh động tham số giá đầu vào dựa trên mức độ tương tác thực tế
        if (interactions > 0) {
            // Sử dụng hàm Logarithm để kìm hãm sự tăng trưởng đột biến của dữ liệu thật (tránh giá trị bị âm)
            // Tương tác càng nhiều, hệ thống BI ngầm hiểu khách hàng có xu hướng đắn đo cao và áp dụng hệ số ưu đãi giảm nhẹ giá đầu vào để kích cầu
            const logFactor = Math.log10(interactions + 1) * 0.02;
            const discountFactor = Math.min(logFactor, 0.15); // Ngưỡng trần giảm giá tối đa không quá 15%
            inputPrice = inputPrice * (1 - discountFactor);
        }

        // 4. Trích xuất bối cảnh thời gian thực
        const now = new Date();
        const hour = now.getHours();
        const jsDay = now.getDay();
        const day_of_week_encoded = jsDay === 0 ? 6 : jsDay - 1;

        // Đóng gói mảng đặc trưng 5 chiều khớp hoàn toàn với pipeline huấn luyện SVM hiện tại trong predict.py
        const features = [
            inputPrice, 
            hour,
            day_of_week_encoded,
            product.brand_encoded,
            product.category_code_encoded
        ];

        // Khởi chạy tiến trình Python truyền đối số ma trận đã được cá nhân hóa
        const pythonProcess = spawn('python', ['predict.py', JSON.stringify(features)]);

        let pythonData = "";
        let pythonError = ""; 

        pythonProcess.stdout.on('data', (data) => { pythonData += data.toString(); });
        pythonProcess.stderr.on('data', (data) => { pythonError += data.toString(); });

        pythonProcess.on('close', (code) => {
            try {
                const result = JSON.parse(pythonData.trim());
                
                if (result.error) {
                    return res.status(500).json({ success: false, error: result.error });
                }

                // Trả dữ liệu đồng bộ cá nhân hóa thành công về cho React Frontend hiển thị
                return res.json({
                    success: true,
                    user_id: Number(user_id),
                    product_id: Number(product_id),
                    realtime_context: { hour, day_of_week_encoded },
                    prediction: result.prediction, 
                    confidence_score: result.confidence_score 
                });
            } catch (err) {
                console.error("Lỗi đồng bộ luồng xử lý JSON Python:", pythonData);
                return res.status(500).json({ success: false, message: "Lỗi xử lý hệ thống phản hồi AI" });
            }
        });

    } catch (error) {
        console.error("Lỗi hệ thống liên thông hạ tầng vĩ mô:", error);
        return res.status(500).json({ success: false, message: "Lỗi hệ thống liên thông Data Warehouse" });
    }
});
const fs = require('fs').promises;
const path = require('path');

// ================= API CHO FRONTEND LẤY KẾT QUẢ TỪ FILE JSON =================

// 1. API lấy dữ liệu kết quả phân tích khám phá (EDA) từ file
app.get('/api/v1/eda', async (req, res) => {
    try {
        const filePath = path.join(__dirname, 'eda_results.json');
        const data = await fs.readFile(filePath, 'utf8');
        return res.json({ success: true, data: JSON.parse(data) });
    } catch (error) {
        console.error("Lỗi hệ thống khi đọc file EDA:", error);
        return res.status(500).json({ success: false, message: "Không thể tải dữ liệu phân tích EDA" });
    }
});

// 2. API lấy dữ liệu Iceberg Cube đa chiều từ file
app.get('/api/v1/iceberg', async (req, res) => {
    try {
        const filePath = path.join(__dirname, 'iceberg_cube.json');
        const data = await fs.readFile(filePath, 'utf8');
        return res.json({ success: true, data: JSON.parse(data) });
    } catch (error) {
        console.error("Lỗi hệ thống khi đọc file Iceberg Cube:", error);
        return res.status(500).json({ success: false, message: "Không thể tải cấu trúc Iceberg Cube" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`[Express Node.js] API Backend đang lắng nghe tại Port ${PORT}`));