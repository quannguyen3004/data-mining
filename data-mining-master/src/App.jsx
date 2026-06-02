import { useState } from "react";

// Bảng màu kết hợp giữa Minimalist White-Ice, Smooth Gradient và Pastel cao cấp
const COLORS = {
  primaryGradient: "linear-gradient(135deg, #00F0FF 0%, #9D4EDD 100%)", 
  pastelBlue: "linear-gradient(180deg, #EBF5FF 0%, #F5F9FF 100%)",
  pastelPurple: "linear-gradient(180deg, #F5EDFF 0%, #FAF5FF 100%)",
  pastelOrange: "linear-gradient(180deg, #FFF4EC 0%, #FFFAF5 100%)",
  pastelPink: "linear-gradient(180deg, #FFEBF2 0%, #FFF5F9 100%)",
  bg: "#0B0F19",             
  innerBg: "#FAF9F6",         
  glassPanel: "rgba(255, 255, 255, 0.75)", 
  border: "rgba(0, 0, 0, 0.04)", 
  text: "#111827",           
  textMuted: "#6B7280",      
  primaryText: "#1F6FEB",    
};

const mockKPIs = [
  { label: "Quy mô tương tác (Events)", value: "1,000,000", desc: "Tổng lưu lượng nạp dữ liệu", bg: COLORS.pastelBlue, textColor: "#1E40AF" },
  { label: "Lượt xem sản phẩm (View)", value: "967,225", desc: "Chủ lực phễu tiếp cận (96.7%)", bg: COLORS.pastelPurple, textColor: "#6B21A8" },
  { label: "Tỷ lệ thêm giỏ (Cart)", value: "14,958", desc: "Chuyển đổi chặng giữa (1.5%)", bg: COLORS.pastelOrange, textColor: "#9A3412" },
  { label: "Đơn hàng thành công (Purchase)", value: "17,817", desc: "Tỷ lệ chốt đơn mục tiêu (1.78%)", bg: COLORS.pastelPink, textColor: "#9D174D" },
];

const priceStats = [
  { label: "Mức giá trung bình", value: "$292.18" },
  { label: "Điểm giá trung vị (50%)", value: "$172.18" },
  { label: "Độ lệch chuẩn giá", value: "$347.59" },
  { label: "Ngưỡng giá cao nhất", value: "$2,574.07" },
];

const categorySales = [
  { name: "Thiết bị Di động (Smartphone)", pct: 45, width: "45%" },
  { name: "Điện máy & Gia dụng", pct: 25, width: "25%" },
  { name: "Máy tính & Laptop", pct: 15, width: "15%" },
  { name: "Thời trang & May mặc", pct: 10, width: "10%" },
  { name: "Các nhóm ngành khác", pct: 5, width: "5%" },
];

const brandRevenue = [
  { name: "Apple", v: 102.54, grad: "linear-gradient(90deg, #58A6FF, #9D4EDD)" },
  { name: "Samsung", v: 37.37, grad: "linear-gradient(90deg, #3FB950, #58A6FF)" },
  { name: "Xiaomi", v: 8.05, grad: "linear-gradient(90deg, #F59E0B, #EF4444)" },
  { name: "Huawei", v: 4.21, grad: "linear-gradient(90deg, #6366F1, #A78BFA)" },
  { name: "LG", v: 3.15, grad: "linear-gradient(90deg, #EF4444, #EC4899)" },
];

const icebergCube = [
  { dim: "Apple × Smartphone × Thứ Tư × 09:00", support: "0.015", count: 1591, revenue: "$1,393,887" },
  { dim: "Apple × Smartphone × Thứ Ba × 09:00", support: "0.014", count: 1533, revenue: "$1,332,871" },
  { dim: "Apple × Smartphone × Thứ Năm × 08:00", support: "0.013", count: 1439, revenue: "$1,267,793" },
  { dim: "Apple × Smartphone × Thứ Ba × 07:00", support: "0.013", count: 1407, revenue: "$1,246,109" },
  { dim: "Apple × Smartphone × Thứ Ba × 08:00", support: "0.013", count: 1431, revenue: "$1,245,303" },
];

const associationRules = [
  { antecedent: "Huawei", consequent: "Xiaomi", conf: "23.0%", lift: "2.13", status: "Cạnh tranh/Thay thế mạnh" },
  { antecedent: "Huawei", consequent: "Samsung", conf: "30.0%", lift: "1.54", status: "Chuyển dịch phân khúc" },
  { antecedent: "Xiaomi", consequent: "Samsung", conf: "18.0%", lift: "0.91", status: "Tương quan độc lập" },
  { antecedent: "Apple", consequent: "Samsung", conf: "12.0%", lift: "0.59", status: "Thị phần đối nghịch" },
];

const clusterData = [
  { name: "Tín đồ Tech Cao Cấp (Apple)", size: "326K KH", ticket: "$889", conversion: "3.50%", grad: "linear-gradient(135deg, #E0F2FE 0%, #F0F9FF 100%)", stroke: "#38BDF8" },
  { name: "Hệ sinh thái Đa dụng (Samsung)", size: "376K KH", ticket: "$261", conversion: "3.80%", grad: "linear-gradient(135deg, #DCFCE7 0%, #F0FDF4 100%)", stroke: "#4ADE80" },
  { name: "Khách hàng Tối ưu Chi phí", size: "219K KH", ticket: "$207", conversion: "1.76%", grad: "linear-gradient(135deg, #FEF3C7 0%, #FFFDF2 100%)", stroke: "#FBBF24" },
  { name: "Nhóm khảo sát vãng lai", size: "79K KH", ticket: "$0", conversion: "0.00%", grad: "linear-gradient(135deg, #FCE7F3 0%, #FDF2F8 100%)", stroke: "#F472B6" },
];

// Thêm lựa chọn điều hướng thứ 6 cho phân hệ dự đoán AI
const navItems = [
  { id: "overview", label: "Tổng quan thị trường" },
  { id: "warehouse", label: "Cấu trúc kho dữ liệu" },
  { id: "iceberg", label: "Tối ưu hóa Iceberg Cube" },
  { id: "mining", label: "Khai phá hành vi mua sắm" },
  { id: "cluster", label: "Phân cụm RFM chiến lược" },
  { id: "prediction", label: "Dự đoán hành vi AI (SVM)" }, 
];

export default function App() {
  const [activeNav, setActiveNav] = useState("overview");
  const [icebergThreshold, setIcebergThreshold] = useState(0.012);

  // Khởi tạo các trạng thái Form phục vụ kết nối Giai đoạn 4
  const [userId, setUserId] = useState("5123456");
  const [productId, setProductId] = useState("1003461");
  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorLog, setErrorLog] = useState("");

  // Hàm xử lý gọi API liên thông xuống Express Server
  const handlePredict = async () => {
    if (!userId || !productId) {
      alert("Vui lòng nhập đầy đủ mã định danh!");
      return;
    }
    setLoading(true);
    setErrorLog("");
    setPredictionResult(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/v1/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, product_id: productId }),
      });
      const data = await response.json();
      
      if (data.success) {
        setPredictionResult(data);
      } else {
        setErrorLog(data.message || "Lỗi không xác định từ Backend.");
      }
    } catch (err) {
      setErrorLog("Không thể kết nối đến Express Server (Cổng 5000). Hãy đảm bảo Backend đã bật.");
    } finally {
      setLoading(false);
    }
  };

  const sections = {
    overview: (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", gridAutoRows: "minmax(130px, auto)" }}>
        {mockKPIs.map((k, i) => (
          <div key={i} style={{ background: k.bg, borderRadius: "20px", padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between", border: `1px solid ${COLORS.border}` }}>
            <div style={{ fontSize: "12px", color: COLORS.textMuted, fontWeight: 500 }}>{k.label}</div>
            <div>
              <div style={{ fontSize: "28px", fontWeight: 700, color: k.textColor, margin: "6px 0 2px", fontFamily: "sans-serif" }}>{k.value}</div>
              <div style={{ fontSize: "11px", color: COLORS.textMuted }}>{k.desc}</div>
            </div>
          </div>
        ))}

        <div style={{ gridColumn: "span 2", gridRow: "span 2", background: COLORS.glassPanel, border: `1px solid ${COLORS.border}`, borderRadius: "24px", padding: "28px" }}>
          <div style={{ fontSize: "15px", fontWeight: 600, color: COLORS.text, marginBottom: "4px" }}>Doanh thu ước tính theo thương hiệu</div>
          <div style={{ fontSize: "12px", color: COLORS.textMuted, marginBottom: "28px" }}>Đơn vị tính: Triệu USD (Dữ liệu trích xuất chuẩn hóa)</div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
            {brandRevenue.map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "90px", fontSize: "13px", color: COLORS.text, fontWeight: 500 }}>{b.name}</div>
                <div style={{ flex: 1, height: "8px", background: "#E5E7EB", borderRadius: "10px", overflow: "hidden" }}>
                  <div style={{ width: `${(b.v / 102.54) * 100}%`, height: "100%", background: b.grad, borderRadius: "10px" }} />
                </div>
                <div style={{ width: "70px", fontSize: "13px", color: COLORS.text, textAlign: "right", fontWeight: 600 }}>${b.v}M</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ gridColumn: "span 2", gridRow: "span 2", background: "linear-gradient(145deg, #F0F7FF 0%, #FFFFFF 100%)", border: `1px solid ${COLORS.border}`, borderRadius: "24px", padding: "28px", display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: "15px", fontWeight: 600, color: COLORS.text, marginBottom: "4px" }}>Tỷ trọng phân bổ hành vi ngành hàng</div>
          <div style={{ fontSize: "12px", color: COLORS.textMuted, marginBottom: "24px" }}>Cơ cấu danh mục chiếm lĩnh thị trường thực tế</div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", justifyContent: "center", flex: 1 }}>
            {categorySales.map((c, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: COLORS.text, fontWeight: 500 }}>
                  <span>{c.name}</span>
                  <span>{c.pct}%</span>
                </div>
                <div style={{ height: "4px", background: "#E5E7EB", borderRadius: "2px" }}>
                  <div style={{ width: c.width, height: "100%", background: COLORS.primaryGradient, borderRadius: "2px" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ gridColumn: "span 4", background: COLORS.glassPanel, border: `1px solid ${COLORS.border}`, borderRadius: "24px", padding: "28px" }}>
          <div style={{ fontSize: "15px", fontWeight: 600, color: COLORS.text, marginBottom: "20px" }}>Phân tích cấu trúc giá bán trên thị trường dữ liệu</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
            {priceStats.map((s, i) => (
              <div key={i} style={{ background: "#F9FAFB", padding: "20px", borderRadius: "14px", border: `1px solid ${COLORS.border}` }}>
                <div style={{ fontSize: "12px", color: COLORS.textMuted, marginBottom: "6px" }}>{s.label}</div>
                <div style={{ fontSize: "22px", fontWeight: 700, color: COLORS.text }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    warehouse: (
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
          {[{ label: "Sơ đồ dữ kiện (Fact Table)", v: "1 Bảng chính" }, { label: "Sơ đồ chiều kết nối (Dimension)", v: "4 Chiều Star Schema" }, { label: "Quy mô lưu trữ kho mẫu", v: "1,000,000 Dòng" }, { label: "Chu kỳ thời gian tích hợp", v: "Tháng 10 & 11/2019" }].map((k, i) => (
            <div key={i} style={{ background: COLORS.glassPanel, border: `1px solid ${COLORS.border}`, borderRadius: "20px", padding: "24px" }}>
              <div style={{ fontSize: "18px", fontWeight: 700, color: COLORS.text }}>{k.v}</div>
              <div style={{ fontSize: "12px", color: COLORS.textMuted, marginTop: "6px" }}>{k.label}</div>
            </div>
          ))}
        </div>

        <div style={{ background: COLORS.glassPanel, border: `1px solid ${COLORS.border}`, borderRadius: "24px", padding: "32px" }}>
          <div style={{ fontSize: "15px", fontWeight: 600, color: COLORS.text, marginBottom: "32px", textAlign: "center" }}>Kiến trúc Kho dữ liệu đa chiều (Star Schema Cuboid)</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr 1fr", gap: "24px", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ border: `1px solid ${COLORS.border}`, background: "#F9FAFB", padding: "16px", borderRadius: "12px" }}>
                <div style={{ color: COLORS.text, fontWeight: "600", fontSize: "13px", marginBottom: "8px" }}>Chiều Thương hiệu (Dim_Brand)</div>
                <div style={{ fontSize: "12px", color: COLORS.textMuted, lineHeight: "1.6" }}>• brand_id (Khóa chính)<br />• brand_name</div>
              </div>
              <div style={{ border: `1px solid ${COLORS.border}`, background: "#F9FAFB", padding: "16px", borderRadius: "12px" }}>
                <div style={{ color: COLORS.text, fontWeight: "600", fontSize: "13px", marginBottom: "8px" }}>Chiều Ngành hàng (Dim_Category)</div>
                <div style={{ fontSize: "12px", color: COLORS.textMuted, lineHeight: "1.6" }}>• category_key (Khóa chính)<br />• category_code</div>
              </div>
            </div>

            <div style={{ border: `1px solid ${COLORS.border}`, background: "linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)", padding: "24px", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
              <div style={{ color: COLORS.text, fontWeight: 700, fontSize: "14px", marginBottom: "14px", textAlign: "center" }}>Bảng dữ kiện chuyển đổi (Fact)</div>
              <div style={{ fontSize: "12px", color: COLORS.textMuted, lineHeight: "1.7" }}>
                <span style={{ color: COLORS.text, fontWeight: 500 }}>[Khóa liên kết ngoại]</span><br />
                • brand_id | category_key | day_of_week | hour_id<br />
                <span style={{ color: COLORS.text, fontWeight: 500 }}>[Chỉ số đo lường]</span><br />
                • Tổng tương tác | Lượt đơn thành công | Doanh số ước tính
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ border: `1px solid ${COLORS.border}`, background: "#F9FAFB", padding: "16px", borderRadius: "12px" }}>
                <div style={{ color: COLORS.text, fontWeight: "600", fontSize: "13px", marginBottom: "8px" }}>Chiều Thứ trong tuần (Dim_Week)</div>
                <div style={{ fontSize: "12px", color: COLORS.textMuted, lineHeight: "1.6" }}>• day_of_week (Khóa chính)<br />• weekend_flag</div>
              </div>
              <div style={{ border: `1px solid ${COLORS.border}`, background: "#F9FAFB", padding: "16px", borderRadius: "12px" }}>
                <div style={{ color: COLORS.text, fontWeight: "600", fontSize: "13px", marginBottom: "8px" }}>Chiều Khung giờ (Dim_Hour)</div>
                <div style={{ fontSize: "12px", color: COLORS.textMuted, lineHeight: "1.6" }}>• hour_id (Khóa chính)<br />• time_segment</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    iceberg: (
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div style={{ background: COLORS.glassPanel, border: `1px solid ${COLORS.border}`, borderRadius: "24px", padding: "24px" }}>
          <div style={{ fontSize: "15px", fontWeight: 600, color: COLORS.text, marginBottom: "16px" }}>Bảng điều khiển điều kiện biên hạ tầng Iceberg Cube</div>
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <div style={{ display: "flex", flex: 1, alignItems: "center", gap: 16, background: "#F9FAFB", padding: "14px 20px", border: `1px solid ${COLORS.border}`, borderRadius: "12px" }}>
              <span style={{ fontSize: "12px", color: COLORS.textMuted }}>Ngưỡng hỗ trợ (Min Support):</span>
              <input type="range" min="0.010" max="0.015" step="0.001" value={icebergThreshold} onChange={e => setIcebergThreshold(parseFloat(e.target.value))} style={{ flex: 1, accentColor: "#1F6FEB" }} />
              <span style={{ color: COLORS.text, fontWeight: "bold", fontSize: "15px" }}>{icebergThreshold.toFixed(3)}</span>
            </div>
            <div style={{ background: "linear-gradient(90deg, #FFFBEB 0%, #FEF3C7 100%)", padding: "14px 20px", fontSize: "12px", color: "#B45309", borderRadius: "12px", fontWeight: 500, border: "1px solid #FDE68A" }}>
              Ràng buộc lõi: Đơn hàng thành công ≥ 500 đơn & Doanh thu ≥ $10,000 USD
            </div>
          </div>
        </div>

        <div style={{ background: COLORS.glassPanel, border: `1px solid ${COLORS.border}`, borderRadius: "24px", padding: "24px" }}>
          <div style={{ fontSize: "15px", fontWeight: 600, color: COLORS.text, marginBottom: "20px" }}>Tổ hợp khối băng nổi đạt doanh số bứt phá</div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ borderBottom: `2px solid #E5E7EB`, textAlign: "left", color: COLORS.textMuted }}>
                  <th style={{ padding: "12px" }}>Tổ hợp chiều chiến lược (Hãng × Ngành hàng × Thời gian)</th>
                  <th style={{ padding: "12px" }}>Độ hỗ trợ</th>
                  <th style={{ padding: "12px" }}>Lượng đơn thành công</th>
                  <th style={{ padding: "12px" }}>Doanh thu thu về</th>
                </tr>
              </thead>
              <tbody>
                {icebergCube.map((row, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid #F3F4F6`, background: i % 2 === 0 ? "transparent" : "#F9FAFB" }}>
                    <td style={{ padding: "14px 12px", color: COLORS.text, fontSize: "13px" }}>{row.dim}</td>
                    <td style={{ padding: "14px 12px", color: COLORS.text, fontWeight: "bold" }}>{row.support}</td>
                    <td style={{ padding: "14px 12px", color: COLORS.textMuted }}>{row.count} đơn</td>
                    <td style={{ padding: "14px 12px", color: "#10B981", fontWeight: 600 }}>{row.revenue} USD</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    ),
    mining: (
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div style={{ background: COLORS.glassPanel, border: `1px solid ${COLORS.border}`, borderRadius: "24px", padding: "24px" }}>
          <div style={{ fontSize: "15px", fontWeight: 600, color: COLORS.text, marginBottom: "4px" }}>Khai phá quy luật liên kết thương hiệu giỏ hàng chéo</div>
          <div style={{ fontSize: "12px", color: COLORS.textMuted, marginBottom: "20px" }}>Thuật toán tăng trưởng cây phổ biến FP-Growth xác định mối quan hệ tương quan hành vi thương hiệu</div>
          
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: `2px solid #E5E7EB`, textAlign: "left", color: COLORS.textMuted }}>
                <th style={{ padding: "12px" }}>Thương hiệu tiền đề</th>
                <th style={{ padding: "12px" }}>Thương hiệu hệ quả</th>
                <th style={{ padding: "12px" }}>Độ tin cậy (Confidence)</th>
                <th style={{ padding: "12px" }}>Hệ số tương quan chéo (Lift)</th>
                <th style={{ padding: "12px" }}>Đánh giá xu hướng</th>
              </tr>
            </thead>
            <tbody>
              {associationRules.map((r, i) => (
                <tr key={i} style={{ borderBottom: `1px solid #F3F4F6`, background: i % 2 === 0 ? "transparent" : "#F9FAFB" }}>
                  <td style={{ padding: "14px 12px" }}><span style={{ border: "1px solid #EF4444", color: "#EF4444", padding: "3px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 500 }}>{r.antecedent}</span></td>
                  <td style={{ padding: "14px 12px" }}><span style={{ border: "1px solid #3B82F6", color: "#3B82F6", padding: "3px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 500 }}>{r.consequent}</span></td>
                  <td style={{ padding: "14px 12px", color: COLORS.text, fontWeight: "bold" }}>{r.conf}</td>
                  <td style={{ padding: "14px 12px", color: COLORS.text, fontWeight: "bold" }}>{r.lift}</td>
                  <td style={{ padding: "14px 12px", color: COLORS.textMuted }}>{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
          {[
            { title: "Liên kết bậc nhất chéo", ant: "Huawei", con: "Xiaomi", desc: "Hệ số tương quan Lift đạt mức cao nhất 2.13. Minh chứng nhóm khách hàng ưa chuộng phân khúc tối ưu chi phí có hành vi chuyển dịch cực kỳ nhạy bén." },
            { title: "Định hướng nâng cấp", ant: "Huawei", con: "Samsung", desc: "Độ tin cậy đạt cao nhất 30.0%. Người dùng có xu hướng lựa chọn hệ sinh thái đa dụng của Samsung khi có ý định thay đổi phân khúc cao hơn." },
            { title: "Tính phân cực thị phần", ant: "Apple", con: "Samsung", desc: "Hệ số Lift thấp (0.59). Cho thấy tính trung thành thương hiệu của hai nhóm đối tượng này tách biệt hoàn toàn, rất ít khi mua thử nghiệm chéo." },
          ].map((c, i) => (
            <div key={i} style={{ background: COLORS.glassPanel, border: `1px solid ${COLORS.border}`, borderRadius: "20px", padding: "24px" }}>
              <div style={{ fontSize: "11px", color: COLORS.primaryText, fontWeight: "600", textTransform: "uppercase", marginBottom: "8px" }}>{c.title}</div>
              <div style={{ fontSize: "15px", fontWeight: "bold", color: COLORS.text, marginBottom: "12px" }}>{c.ant} ➔ {c.con}</div>
              <div style={{ fontSize: "13px", color: COLORS.textMuted, lineHeight: "1.5" }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    cluster: (
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px" }}>
          {clusterData.map((c, i) => (
            <div key={i} style={{ background: c.grad, border: `1px solid ${c.stroke}`, borderRadius: "20px", padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <span style={{ fontSize: "15px", fontWeight: "bold", color: COLORS.text }}>{c.name}</span>
                <span style={{ fontSize: "11px", color: COLORS.textMuted, fontWeight: "bold", background: "#FFFFFF", padding: "3px 10px", borderRadius: "6px", border: "1px solid #E5E7EB" }}>{c.id}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
                <div style={{ background: "#FFFFFF", padding: "10px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.03)", textAlign: "center" }}>
                  <div style={{ fontSize: "11px", color: COLORS.textMuted, marginBottom: "4px" }}>Quy mô phân cụm</div>
                  <div style={{ fontSize: "14px", fontWeight: "bold", color: COLORS.text }}>{c.size}</div>
                </div>
                <div style={{ background: "#FFFFFF", padding: "10px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.03)", textAlign: "center" }}>
                  <div style={{ fontSize: "11px", color: COLORS.textMuted, marginBottom: "4px" }}>Giá trị đơn (Avg)</div>
                  <div style={{ fontSize: "14px", fontWeight: "bold", color: COLORS.text }}>{c.ticket}</div>
                </div>
                <div style={{ background: "#FFFFFF", padding: "10px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.03)", textAlign: "center" }}>
                  <div style={{ fontSize: "11px", color: COLORS.textMuted, marginBottom: "4px" }}>Tỷ lệ mua hàng</div>
                  <div style={{ fontSize: "14px", fontWeight: "bold", color: COLORS.text }}>{c.conversion}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: COLORS.glassPanel, border: `1px solid ${COLORS.border}`, borderRadius: "24px", padding: "28px" }}>
          <div style={{ fontSize: "15px", fontWeight: 600, color: COLORS.text, marginBottom: "20px" }}>Định hướng điều phối chiến lược kinh doanh chiến dịch</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[
              { label: "Chiến lược Nhóm A (Tín đồ Apple Cao Cấp)", text: "Tập trung phân phối độc quyền các gói bảo hành thiết bị, ưu đãi nâng cấp dung lượng và mở rộng giỏ hàng sang các dòng thiết bị đeo sinh thái.", stroke: "#38BDF8" },
              { label: "Chiến lược Nhóm B (Hệ sinh thái Samsung)", text: "Đẩy mạnh các gói ưu đãi thu cũ đổi mới (Trade-in), tích hợp mã giảm giá chéo sang phân hệ sản phẩm điện máy gia dụng thông minh cùng thương hiệu.", stroke: "#4ADE80" },
              { label: "Chiến lược Nhóm C (Khách hàng Tối ưu Chi phục)", text: "Duy trì phễu tương tác qua các chương trình Flash Sale tự động theo khung giờ cao điểm đêm, tối ưu cấu trúc giá rẻ để cạnh tranh chiếm lĩnh volume doanh số.", stroke: "#FBBF24" },
              { label: "Chiến lược Nhóm D (Nhóm Khảo Sát Vãng Lai)", text: "Kích hoạt luồng Remarketing tự động hiển thị lại chính xác mã danh mục họ đã dành thời gian xem nhiều nhất, kết hợp mã miễn phí vận chuyển ngắn hạn.", stroke: "#F472B6" },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "20px", padding: "16px", background: "#F9FAFB", border: `1px solid ${COLORS.border}`, borderLeft: `4px solid ${s.stroke}`, borderRadius: "12px" }}>
                <span style={{ fontSize: "13px", fontWeight: "bold", color: COLORS.text, minWidth: "260px" }}>{s.label}</span>
                <span style={{ fontSize: "13px", color: COLORS.textMuted, lineHeight: "1.4" }}>{s.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    // --- KHỐI GIAO DIỆN PHÂN HỆ DỰ ĐOÁN AI ĐƯỢC THÊM VÀO ĐÂY ---
    prediction: (
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div style={{ background: COLORS.glassPanel, border: `1px solid ${COLORS.border}`, borderRadius: "24px", padding: "32px" }}>
          <div style={{ fontSize: "16px", fontWeight: 600, color: COLORS.text, marginBottom: "20px" }}>
            Mô phỏng tương tác người dùng và phân lớp hành vi thời gian thực
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: COLORS.textMuted, marginBottom: "8px" }}>Mã định danh khách hàng (User ID):</label>
              <input type="number" value={userId} onChange={e => setUserId(e.target.value)} style={{ width: "100%", padding: "12px", border: "1px solid #E5E7EB", borderRadius: "10px", fontSize: "14px", background: "#fff", color: "#000" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: COLORS.textMuted, marginBottom: "8px" }}>Mã định danh sản phẩm (Product ID):</label>
              <input type="number" value={productId} onChange={e => setProductId(e.target.value)} style={{ width: "100%", padding: "12px", border: "1px solid #E5E7EB", borderRadius: "10px", fontSize: "14px", background: "#fff", color: "#000" }} />
            </div>
          </div>

          <button onClick={handlePredict} disabled={loading} style={{ width: "100%", padding: "14px", background: COLORS.primaryGradient, color: "white", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "bold", cursor: "pointer" }}>
            {loading ? "Hệ thống đang truy vấn Kho dữ liệu & Chấm điểm siêu phẳng SVM..." : "Kích hoạt mô hình phân lớp AI"}
          </button>
        </div>

        {errorLog && (
          <div style={{ background: "#FEF2F2", borderLeft: "5px solid #EF4444", padding: "16px", borderRadius: "8px", color: "#991B1B", fontSize: "14px" }}>
            ⚠️ <b>Lỗi liên thông:</b> {errorLog}
          </div>
        )}

        {predictionResult && (
          <div style={{ 
            background: predictionResult.prediction === 1 ? "#F0FDF4" : "#F8FAFC", 
            borderLeft: predictionResult.prediction === 1 ? "5px solid #16A34A" : "5px solid #475569", 
            padding: "24px", borderRadius: "12px", color: COLORS.text 
          }}>
            <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "12px", color: predictionResult.prediction === 1 ? "#14532d" : "#1e293b" }}>
              {predictionResult.prediction === 1 ? "🎯 Kết quả phân lớp: KHÁCH HÀNG SẼ MUA (Purchase)" : "👀 Kết quả phân lớp: CHỈ XEM SẢN PHẨM (Non-Purchase)"}
            </div>
            <div style={{ fontSize: "14px", lineHeight: "1.7", color: COLORS.textMuted }}>
              • Bối cảnh thời gian thực tế: Khung giờ <b>{predictionResult.realtime_context.hour}:00</b>, Thứ trong tuần mã hóa dạng số nguyên là <b>{predictionResult.realtime_context.day_of_week_encoded}</b>.<br />
              • Khoảng cách biên quyết định định vị siêu phẳng SVM: <b style={{ color: "#000" }}>{predictionResult.confidence_score.toFixed(4)}</b>.<br />
              • Đánh giá tác vụ hệ thống: {predictionResult.prediction === 1 ? "Mức độ tin cậy an toàn vượt ngưỡng quyết định, tự động kích hoạt đẩy sản phẩm vào danh mục Flash Sale." : "Khách hàng có xu hướng lướt vãng lai, chuyển đổi luồng Remarketing bám đuôi."}
            </div>
          </div>
        )}
      </div>
    )
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: COLORS.bg, padding: "20px", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ 
        display: "flex", 
        flex: 1, 
        background: COLORS.innerBg, 
        borderRadius: "32px", 
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.15)",
        overflow: "hidden"
      }}>
        <div style={{ 
          width: "260px", 
          background: "linear-gradient(180deg, #F3F4F6 0%, #E5E7EB 100%)", 
          borderRight: `1px solid ${COLORS.border}`, 
          padding: "40px 0 40px 24px", 
          display: "flex", 
          flexDirection: "column", 
          flexShrink: 0 
        }}>
          <div style={{ padding: "0 0 32px 12px", borderBottom: `1px solid ${COLORS.border}` }}>
            <div style={{ fontSize: "16px", fontWeight: 700, color: COLORS.text, letterSpacing: "0.5px" }}>E-Commerce Cube</div>
            <div style={{ fontSize: "11px", color: COLORS.textMuted, marginTop: "4px" }}>Hệ thống Quản trị BI</div>
          </div>
          
          <nav style={{ padding: "32px 0", flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
            {navItems.map(n => (
              <button key={n.id} onClick={() => setActiveNav(n.id)} style={{
                width: "100%", padding: "14px 20px", border: "none", borderRadius: "20px 0 0 20px", cursor: "pointer", fontSize: "13px", fontWeight: activeNav === n.id ? 600 : 400, textAlign: "left",
                background: activeNav === n.id ? COLORS.innerBg : "transparent",
                color: activeNav === n.id ? COLORS.primaryText : COLORS.textMuted,
                boxShadow: activeNav === n.id ? "-5px 5px 15px rgba(0,0,0,0.03)" : "none",
                transition: "all 0.2s ease"
              }}>
                {n.label}
              </button>
            ))}
          </nav>
          
          <div style={{ padding: "16px 12px", borderTop: `1px solid ${COLORS.border}`, fontSize: "11px", color: COLORS.textMuted }}>
            <div>Hội đồng Quản trị BI</div>
            <div style={{ color: COLORS.textMuted, marginTop: "2px" }}>Đồ án Khai phá Dữ liệu</div>
          </div>
        </div>
        
        <div style={{ flex: 1, padding: "40px 48px", overflowY: "auto", maxWidth: "calc(100vw - 300px)" }}>
          {sections[activeNav]}
        </div>
      </div>
    </div>
  );
}