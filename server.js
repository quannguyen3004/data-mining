const express = require('express');
const mysql = require('mysql2/promise');
const { spawn } = require('child_process');
require('dotenv').config();

const app = express();
app.use(express.json());

// Kết nối cơ sở dữ liệu hệ thống tầng Data Warehouse (DWH)
const dwhPool = mysql.createPool({
    host: process.env.DWH_HOST || 'localhost',
    user: process.env.DWH_USER || 'root',
    password: process.env.DWH_PASS || 'password',
    database: process.env.DWH_NAME || 'ecommerce_dwh',
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
        return res.status(400).json({ success: false, message: "Yêu cầu cung cấp đầy đủ tham số đầu vào" });
    }

    try {
        // 1. Truy vấn các đặc trưng tĩnh cố định của sản phẩm từ tầng Data Warehouse
        const [rows] = await dwhPool.execute(
            `SELECT price, brand_encoded, category_code_encoded 
             FROM product_metadata 
             WHERE product_id = ? LIMIT 1`,
            [product_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy thông tin sản phẩm trong tầng DWH" });
        }

        const product = rows[0];
        
        // 2. Tự động trích xuất các đặc trưng thời gian thực (Real-time Context)
        const now = new Date();
        const hour = now.getHours();
        const day_of_week_encoded = now.getDay(); // 0: Chủ nhật, 1: Thứ 2...

        // Thiết lập cấu trúc mảng đúng thứ tự ma trận đầu vào của mô hình học máy:
        // ['price', 'hour', 'day_of_week_encoded', 'brand_encoded', 'category_code_encoded']
        const features = [
            product.price,
            hour,
            day_of_week_encoded,
            product.brand_encoded,
            product.category_code_encoded
        ];

        // 3. Sử dụng Child Process liên thông dữ liệu sang tập lệnh Python predict.py
        const pythonProcess = spawn('python3', ['predict.py', JSON.stringify(features)]);

        let pythonData = "";
        pythonProcess.stdout.on('data', (data) => {
            pythonData += data.toString();
        });

        pythonProcess.on('close', (code) => {
            try {
                const result = JSON.parse(pythonData.trim());
                
                if (result.error) {
                    return res.status(500).json({ success: false, error: result.error });
                }

                // 4. Đóng gói dữ liệu và phản hồi kết quả phân lớp nhị phân cho Client
                return res.json({
                    success: true,
                    user_id: Number(user_id),
                    product_id: Number(product_id),
                    realtime_context: { hour, day_of_week_encoded },
                    prediction: result.is_purchase, // 1: Đóng gói hành vi Mua hàng, 0: Bỏ qua
                    confidence_score: result.confidence_score // Điểm khoảng cách biên quyết định SVM
                });
            } catch (err) {
                console.error("Lỗi đồng bộ luồng dữ liệu từ Python Script:", pythonData);
                return res.status(500).json({ success: false, message: "Lỗi xử lý hệ thống phản hồi AI" });
            }
        });

    } catch (error) {
        console.error("Lỗi kết nối hoặc truy vấn dữ liệu tầng DWH:", error);
        return res.status(500).json({ success: false, message: "Lỗi hệ thống liên thông Data Warehouse" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`[Express Node.js] API Backend đang lắng nghe tại Port ${PORT}`));