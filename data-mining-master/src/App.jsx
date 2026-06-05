import { useState } from "react";

// Bảng màu cao cấp phối hợp giữa Minimalist White-Ice và Dark Glassmorphism
const COLORS = {
  primaryGradient: "linear-gradient(135deg, #00F0FF 0%, #9D4EDD 100%)", 
  pastelBlue: "linear-gradient(180deg, #EBF5FF 0%, #F5F9FF 100%)",
  pastelPurple: "linear-gradient(180deg, #F5EDFF 0%, #FAF5FF 100%)",
  pastelOrange: "linear-gradient(180deg, #FFF4EC 0%, #FFFAF5 100%)",
  pastelPink: "linear-gradient(180deg, #FFEBF2 0%, #FFF5F9 100%)",
  pastelGreen: "linear-gradient(180deg, #E6FBF0 0%, #F3FDF8 100%)",
  bg: "#0B0F19",             
  innerBg: "#FAF9F6",         
  glassPanel: "rgba(255, 255, 255, 0.8)", 
  border: "rgba(0, 0, 0, 0.04)", 
  text: "#111827",           
  textMuted: "#6B7280",      
  primaryText: "#1F6FEB",    
};

// Dữ liệu Tổng quan ngành hàng
const categoryData = [
  { id: "cat_phone", name: "Thiết bị Di động (Smartphone)", pct: 45, color: "#1F6FEB", bg: "linear-gradient(180deg, #EBF5FF 0%, #F5F9FF 100%)", textColor: "#1E40AF", brands: [{ name: "Apple", p: 55, color: "#3B82F6" }, { name: "Samsung", p: 30, color: "#10B981" }, { name: "Xiaomi", p: 10, color: "#F59E0B" }, { name: "Huawei", p: 5, color: "#EF4444" }] },
  { id: "cat_appliance", name: "Điện máy & Gia dụng", pct: 25, color: "#9D4EDD", bg: "linear-gradient(180deg, #F5EDFF 0%, #FAF5FF 100%)", textColor: "#6B21A8", brands: [{ name: "Samsung", p: 50, color: "#10B981" }, { name: "LG", p: 35, color: "#EC4899" }, { name: "Xiaomi", p: 15, color: "#F59E0B" }] },
  { id: "cat_computer", name: "Máy tính & Laptop", pct: 15, color: "#F59E0B", bg: "linear-gradient(180deg, #FFF4EC 0%, #FFFAF5 100%)", textColor: "#9A3412", brands: [{ name: "Apple", p: 60, color: "#3B82F6" }, { name: "Lenovo", p: 25, color: "#64748B" }, { name: "Asus", p: 15, color: "#A855F7" }] },
  { id: "cat_apparel", name: "Thời trang & May mặc", pct: 10, color: "#EC4899", bg: "linear-gradient(180deg, #FFEBF2 0%, #FFF5F9 100%)", textColor: "#9D174D", brands: [{ name: "Nike", p: 40, color: "#111827" }, { name: "Adidas", p: 40, color: "#06B6D4" }, { name: "Puma", p: 20, color: "#F97316" }] },
  { id: "cat_others", name: "Các nhóm ngành khác", pct: 5, color: "#10B981", bg: "linear-gradient(180deg, #F3F4F6 0%, #F9FAFB 100%)", textColor: "#374151", brands: [{ name: "Khác", p: 100, color: "#64748B" }] },
];

// Dữ liệu phân hệ EDA tổng thể hành vi người dùng
const edaBehaviorData = [
  { type: "View (Xem)", count: "967,225", pct: 96.72, color: "#3B82F6" },
  { type: "Cart (Giỏ hàng)", count: "14,958", pct: 1.50, color: "#F59E0B" },
  { type: "Purchase (Mua)", count: "17,817", pct: 1.78, color: "#10B981" },
];

// ĐÃ ĐỒNG BỘ: Biến động chi tiết luồng hành vi theo giờ khớp với đồ thị mật độ EDA thực tế (Đỉnh View tập trung cao điểm 13h-16h)
const edaHourlyData = [
  { hour: "00-04", view: 15, cart: 1, purchase: 0.2, label: "Thấp điểm" },
  { hour: "05-08", view: 65, cart: 2, purchase: 0.5, label: "Tăng trưởng mạnh" },
  { hour: "09-12", view: 75, cart: 2.5, purchase: 0.6, label: "Duy trì ổn định" },
  { hour: "13-16", view: 98, cart: 4.5, purchase: 1.2, label: "Đỉnh điểm hệ thống" },
  { hour: "17-20", view: 85, cart: 3.2, purchase: 0.9, label: "Cao điểm tối" },
  { hour: "21-23", view: 25, cart: 1.2, purchase: 0.3, label: "Giảm dần" },
];

// ĐÃ ĐỒNG BỘ: Tần suất chốt đơn thành công theo ngày trong tuần (Saturday & Sunday bùng nổ vượt bậc, các ngày trong tuần đi ngang ổn định)
const edaWeeklyData = [
  { day: "Thứ 2", val: 41, count: "104,500 đơn", isPeak: false }, 
  { day: "Thứ 3", val: 38, count: "96,200 đơn", isPeak: false }, 
  { day: "Thứ 4", val: 38, count: "96,800 đơn", isPeak: false }, 
  { day: "Thứ 5", val: 38, count: "96,100 đơn", isPeak: false }, 
  { day: "Thứ 6", val: 41, count: "103,900 đơn", isPeak: false }, 
  { day: "Thứ 7", val: 64, count: "162,400 đơn", isPeak: true }, 
  { day: "Chủ Nhật", val: 100, count: "253,100 đơn", isPeak: true }
];

const edaPriceDistribution = [
  { range: "Dưới $100", pct: 35, count: "338,528 sp", color: "#BAE6FD", textCol: "#0369A1" },
  { range: "$100 - $300", pct: 42, count: "406,234 sp", color: "#7DD3FC", textCol: "#075985" },
  { range: "$300 - $700", pct: 15, count: "145,083 sp", color: "#38BDF8", textCol: "#0C4A6E" },
  { range: "Trên $700", pct: 8, count: "77,380 sp", color: "#0EA5E9", textCol: "#0F172A" },
];

const priceStatsExtended = [
  { label: "Mức giá trung bình", value: "$292.18", desc: "Kỳ vọng trung bình phân khúc", icon: "📊", badgeColor: "#EBF5FF" },
  { label: "Điểm giá trung vị (50%)", value: "$172.18", desc: "Ngưỡng tập trung thực tế", icon: "⚖️", badgeColor: "#F5EDFF" },
  { label: "Độ lệch chuẩn giá", value: "$347.59", desc: "Biên độ dao động thị trường", icon: "📉", badgeColor: "#FFF4EC" },
  { label: "Ngưỡng giá cao nhất", value: "$2,574.07", desc: "Trần giá trị danh mục tối đa", icon: "👑", badgeColor: "#FFEBF2" },
];

const icebergCube = [
  { id: "ice_1", dim: "Apple × Smartphone × Chủ Nhật × 15:00", support: "0.024", count: 2531, revenue: "$2,154,800", bg: "linear-gradient(180deg, #EBF5FF 0%, #F5F9FF 100%)", details: { brand: "Apple", category: "electronics.smartphone", day: "Chủ Nhật", hour: "15:00", support_raw: 0.0242, sales_count: 2531, profit_revenue: 2154800 } },
  { id: "ice_2", dim: "Samsung × Smartphone × Chủ Nhật × 14:00", support: "0.019", count: 1982, revenue: "$1,643,500", bg: "linear-gradient(180deg, #F5EDFF 0%, #FAF5FF 100%)", details: { brand: "Samsung", category: "electronics.smartphone", day: "Chủ Nhật", hour: "14:00", support_raw: 0.0191, sales_count: 1982, profit_revenue: 1643500 } },
  { id: "ice_3", dim: "Apple × Smartphone × Thứ Bảy × 16:00", support: "0.017", count: 1724, revenue: "$1,490,200", bg: "linear-gradient(180deg, #FFF4EC 0%, #FFFAF5 100%)", details: { brand: "Apple", category: "electronics.smartphone", day: "Thứ Bảy", hour: "16:00", support_raw: 0.0173, sales_count: 1724, profit_revenue: 1490200 } },
  { id: "ice_4", dim: "Samsung × Appliance × Thứ Bảy × 15:00", support: "0.015", count: 1511, revenue: "$1,289,400", bg: "linear-gradient(180deg, #FFEBF2 0%, #FFF5F9 100%)", details: { brand: "Samsung", category: "appliances.environment", day: "Thứ Bảy", hour: "15:00", support_raw: 0.0154, sales_count: 1511, profit_revenue: 1289400 } },
];

const miningRulesDatabase = {
  "Huawei-Xiaomi": { sup: "0.011", conf: "23.0%", lift: "2.13", comment: "Hệ số tương quan vượt bậc (Độ nâng cao = 2.13). Minh chứng nhóm khách hàng ưa chuộng phân khúc tối ưu chi phí có hành vi cân nhắc chuyển dịch cực kỳ nhạy bén giữa hai thương hiệu này. Khuyến nghị điều phối: Đẩy mạnh chiến dịch giảm giá đối đầu trực diện." },
  "Huawei-Samsung": { sup: "0.014", conf: "30.0%", lift: "1.54", comment: "Độ tin cậy đạt mức cao (Độ tin cậy = 30%). Người dùng có xu hướng lựa chọn hệ sinh thái đa dụng của Samsung khi có ý định thay đổi nâng cấp từ phân khúc tầm trung của Huawei." },
  "Xiaomi-Samsung": { sup: "0.019", conf: "18.0%", lift: "0.91", comment: "Hệ số tương quan ở trạng thái độc lập tự nhiên. Nhóm khách hàng cốt lõi của hai thương hiệu này ít có sự giao thoa hành vi mua sắm chéo cùng thời điểm trên giỏ hàng." },
  "Apple-Samsung": { sup: "0.021", conf: "12.0%", lift: "0.59", comment: "Hệ số tương quan đạt mức phân cực thị phần đối nghịch (Độ nâng cao < 1). Cho thấy tính trung thành thương hiệu của hai nhóm đối tượng này tách biệt hoàn toàn, rất hiếm khi mua thử nghiệm chéo." },
};

const clusterData = [
  { id: "cluster_1", name: "Tín đồ công nghệ cao cấp", size: "326K Khách hàng", ticket: "$889", conversion: "3.50%", grad: "linear-gradient(135deg, #E0F2FE 0%, #F0F9FF 100%)", stroke: "#38BDF8", icon: "💎", strategy: "Tập trung phân phối độc quyền các gói bảo hành thiết bị cao cấp, ưu đãi nâng cấp dung lượng và mở rộng giỏ hàng sang các dòng thiết bị đeo sinh thái thông minh." },
  { id: "cluster_2", name: "Hệ sinh thái đa dụng", size: "376K Khách hàng", ticket: "$261", conversion: "3.80%", grad: "linear-gradient(135deg, #DCFCE7 0%, #F0FDF4 100%)", stroke: "#4ADE80", icon: "🏡", strategy: "Đẩy mạnh các gói ưu đãi thu cũ đổi mới, tích hợp mã giảm giá chéo sang phân hệ sản phẩm điện máy gia dụng thông minh cùng thương hiệu." },
  { id: "cluster_3", name: "Khách hàng tối ưu chi phí", size: "219K Khách hàng", ticket: "$207", conversion: "1.76%", grad: "linear-gradient(135deg, #FEF3C7 0%, #FFFDF2 100%)", stroke: "#FBBF24", icon: "🏷️", strategy: "Duy trì tương tác qua chiến dịch giảm giá chớp nhắn tự động theo khung giờ cao điểm đêm, tối ưu cấu trúc giá rẻ để cạnh tranh chiếm lĩnh thị trường." },
  { id: "cluster_4", name: "Nhóm khảo sát vãng lai", size: "79K Khách hàng", ticket: "$0", conversion: "0.00%", grad: "linear-gradient(135deg, #FCE7F3 0%, #FDF2F8 100%)", stroke: "#F472B6", icon: "👀", strategy: "Kích hoạt luồng tiếp thị lại tự động hiển thị lại chính xác mã danh mục họ đã dành thời gian xem nhiều nhất, kết hợp mã miễn phí vận chuyển ngắn hạn." },
];

const navItems = [
  { id: "overview", label: "Tổng quan thị trường" },
  { id: "eda", label: "Khám phá dữ liệu (EDA)" },
  { id: "warehouse", label: "Kho dữ liệu (DWH)" },
  { id: "iceberg", label: "Tối ưu hóa Iceberg Cube" },
  { id: "mining", label: "Khai phá hành vi mua sắm" },
  { id: "cluster", label: "Phân cụm RFM chiến lược" },
  { id: "prediction", label: "Dự đoán hành vi AI (SVM)" },
];

function MiniDonutChart({ percent, color, label }) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div style={{ 
      display: "flex", flexDirection: "column", justifyContent: "space-between", 
      background: "#FFFFFF", padding: "20px", borderRadius: "20px", 
      border: `1px solid ${COLORS.border}`, flex: 1, minWidth: "190px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.01)", transition: "all 0.3s ease" 
    }} className="bento-hover">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", marginBottom: "16px" }}>
        <span style={{ fontSize: "12px", color: COLORS.textMuted, fontWeight: 600, lineHeight: "1.4" }}>{label}</span>
        <svg width="48" height="48" viewBox="0 0 52 52" style={{ transform: "rotate(-90deg)", overflow: "visible", flexShrink: 0 }}>
          <circle cx="26" cy="26" r={radius} fill="transparent" stroke="#F3F4F6" strokeWidth="4" />
          <circle cx="26" cy="26" r={radius} fill="transparent" stroke={color} strokeWidth="4" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.5s ease" }} />
        </svg>
      </div>
      <div style={{ fontSize: "28px", fontWeight: 800, color: COLORS.text, fontFamily: "system-ui, -apple-system, sans-serif" }}>{percent}%</div>
    </div>
  );
}

export default function App() {
  const [activeNav, setActiveNav] = useState("overview");
  const [icebergThreshold, setIcebergThreshold] = useState(0.012);

  // States tương tác Modals
  const [selectedCategoryPopup, setSelectedCategoryPopup] = useState(null);
  const [selectedEdaPopup, setSelectedEdaPopup] = useState(null); 
  const [selectedDwhPopup, setSelectedDwhPopup] = useState(null); 
  const [selectedIcebergPopup, setSelectedIcebergPopup] = useState(null); 
  const [selectedClusterPopup, setSelectedClusterPopup] = useState(null); 
  const [brandA, setBrandA] = useState("Huawei");
  const [brandB, setBrandB] = useState("Xiaomi");
  const [activeMiningResult, setActiveMiningResult] = useState(null);

  // States Dự đoán AI
  const [userId, setUserId] = useState("5123456");
  const [productId, setProductId] = useState("1003461");
  const [predictionResult, setPredictionResult] = useState(null);
  const [loadingPredict, setLoadingPredict] = useState(false);
  const [errorLogPredict, setErrorLogPredict] = useState("");

  const handleRunMining = () => {
    const key1 = `${brandA}-${brandB}`;
    const key2 = `${brandB}-${brandA}`;
    const result = miningRulesDatabase[key1] || miningRulesDatabase[key2];
    if (result) {
      setActiveMiningResult({ brandA, brandB, ...result });
    } else {
      setActiveMiningResult({ brandA, brandB, sup: "0.000", conf: "0.0%", lift: "0.00", comment: "Hệ thống không tìm thấy luật tương quan mạnh vượt ngưỡng giữa 2 hãng được chọn." });
    }
  };

  const handleCallPredictAPI = async () => {
    if (!userId || !productId) {
      alert("Vui lòng cung cấp đầy đủ thông tin mã định danh!");
      return;
    }
    setLoadingPredict(true);
    setErrorLogPredict("");
    setPredictionResult(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/v1/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, product_id: productId }),
      });
      const data = await response.json();

      if (!response.ok) {
        setErrorLogPredict(data.message || data.error || "Lỗi xử lý hệ thống từ API Backend.");
        return;
      }
      
      if (data.success) {
        setPredictionResult(data);
      } else {
        setErrorLogPredict(data.message || "Lỗi xử lý hệ thống phản hồi từ mô hình AI.");
      }
    } catch (err) {
      setErrorLogPredict("Không thể kết nối đến Flask/Express Server Backend (Cổng 5000). Hãy đảm bảo máy chủ cục bộ đã bật.");
    } {
      setLoadingPredict(false);
    }
  };

  const renderOverviewSection = () => {
    const mainRadius = 45;
    const mainCircumference = 2 * Math.PI * mainRadius; 
    let mainAccumulatedPercent = 0;

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div style={{ display: "flex", gap: "20px", width: "100%", flexWrap: "wrap" }}>
          <MiniDonutChart percent={100} color="#1F6FEB" label="Quy mô tương tác (Tổng nạp)" />
          <MiniDonutChart percent={96.7} color="#3B82F6" label="Tỷ lệ xem sản phẩm" />
          <MiniDonutChart percent={1.5} color="#F59E0B" label="Tỷ lệ thêm giỏ hàng" />
          <MiniDonutChart percent={1.8} color="#10B981" label="Tỷ lệ đơn hàng thành công" />
        </div>

        <div style={{ background: COLORS.glassPanel, border: `1px solid ${COLORS.border}`, borderRadius: "24px", padding: "28px" }}>
          <div style={{ fontSize: "15px", fontWeight: 600, color: COLORS.text, marginBottom: "4px" }}>Phân cấp cơ cấu thị phần ngành hàng cốt lõi</div>
          <div style={{ fontSize: "12px", color: COLORS.textMuted, marginBottom: "28px" }}>Mẹo điều hành: Click trực tiếp vào phân khúc hình tròn hoặc nhãn chú thích để mở cửa sổ phân tích sâu</div>
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", gap: "40px", flexWrap: "wrap" }}>
            <div style={{ position: "relative", width: "240px", height: "240px" }}>
              <svg width="100%" height="100%" viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
                {categoryData.map((c) => {
                  const strokeLength = (c.pct / 100) * mainCircumference;
                  const strokeOffset = - (mainAccumulatedPercent / 100) * mainCircumference;
                  mainAccumulatedPercent += c.pct;

                  return (
                    <circle
                      key={c.id}
                      cx="60"
                      cy="60"
                      r={mainRadius}
                      fill="transparent"
                      stroke={c.color}
                      strokeWidth="16"
                      strokeDasharray={`${strokeLength} ${mainCircumference}`}
                      strokeDashoffset={strokeOffset}
                      strokeLinecap="butt"
                      className="pie-segment"
                      style={{ cursor: "pointer", transition: "all 0.3s ease" }}
                      onClick={() => setSelectedCategoryPopup(c)}
                    />
                  );
                })}
              </svg>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", pointerEvents: "none" }}>
                <div style={{ fontSize: "20px", fontWeight: 800, color: COLORS.text }}>100%</div>
                <div style={{ fontSize: "10px", color: COLORS.textMuted, fontWeight: 500, marginTop: "2px" }}>Thị phần</div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1, minWidth: "280px" }}>
              {categoryData.map((c) => (
                <div 
                  key={c.id} 
                  onClick={() => setSelectedCategoryPopup(c)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: "12px", background: "#FFFFFF", border: `1px solid ${COLORS.border}`, cursor: "pointer", transition: "all 0.2s" }}
                  className="bento-hover"
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: c.color }} />
                    <span style={{ fontSize: "13px", fontWeight: 500, color: COLORS.text }}>{c.name}</span>
                  </div>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: c.color, fontFamily: "monospace" }}>{c.pct}% ➔</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ background: COLORS.glassPanel, border: `1px solid ${COLORS.border}`, borderRadius: "24px", padding: "28px" }}>
          <div style={{ fontSize: "15px", fontWeight: 600, color: COLORS.text, marginBottom: "4px" }}>Cấu trúc chỉ số giá bán thị trường</div>
          <div style={{ fontSize: "12px", color: COLORS.textMuted, marginBottom: "24px" }}>Các chỉ số thống kê mô tả đo lường xu hướng tập trung và độ phân tán giá sản phẩm trên sàn thương mại điện tử</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
            {priceStatsExtended.map((s, i) => (
              <div key={i} style={{ background: "#FFFFFF", padding: "24px 20px", borderRadius: "20px", border: `1px solid ${COLORS.border}`, display: "flex", flexDirection: "column", justifyContent: "space-between" }} className="bento-hover">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                  <div style={{ fontSize: "12px", color: COLORS.textMuted, fontWeight: 600 }}>{s.label}</div>
                  <span style={{ background: s.badgeColor, padding: "8px", borderRadius: "12px", fontSize: "18px", display: "inline-flex", justifyContent: "center", alignItems: "center", width: "36px", height: "36px" }}>{s.icon}</span>
                </div>
                <div>
                  <div style={{ fontSize: "26px", fontWeight: 800, color: COLORS.text, fontFamily: "sans-serif" }}>{s.value}</div>
                  <div style={{ fontSize: "11px", color: COLORS.textMuted, marginTop: "6px", fontWeight: 500 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderEdaSection = () => {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Hàng 1: Chỉ số nhanh */}
        <div style={{ display: "flex", gap: "20px" }}>
           <div style={{ flex: 1, background: COLORS.pastelBlue, padding: "24px", borderRadius: "24px", border: `1px solid ${COLORS.border}` }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#1E40AF", textTransform: "uppercase" }}>Tổng lưu lượng xử lý</div>
              <div style={{ fontSize: "32px", fontWeight: 800, color: COLORS.text, marginTop: "12px" }}>67.4 Tr</div>
              <div style={{ fontSize: "11px", color: COLORS.textMuted, marginTop: "4px" }}>Dòng sự kiện log hệ thống (Nov 2019)</div>
           </div>
           <div style={{ flex: 1, background: COLORS.pastelPurple, padding: "24px", borderRadius: "24px", border: `1px solid ${COLORS.border}` }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#6B21A8", textTransform: "uppercase" }}>Giá trị giao dịch Max</div>
              <div style={{ fontSize: "32px", fontWeight: 800, color: COLORS.text, marginTop: "12px" }}>$2,574</div>
              <div style={{ fontSize: "11px", color: COLORS.textMuted, marginTop: "4px" }}>Thiết bị công nghệ cao cấp bậc nhất</div>
           </div>
           <div style={{ flex: 1, background: COLORS.pastelGreen, padding: "24px", borderRadius: "24px", border: `1px solid ${COLORS.border}` }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#065F46", textTransform: "uppercase" }}>Trạng thái dữ liệu</div>
              <div style={{ fontSize: "32px", fontWeight: 800, color: COLORS.text, marginTop: "12px" }}>100% Sạch</div>
              <div style={{ fontSize: "11px", color: COLORS.textMuted, marginTop: "4px" }}>Lọc bỏ toàn bộ giá trị âm và rỗng</div>
           </div>
        </div>

        {/* Lưới Bento EDA */}
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "24px" }}>
          {/* Card 1: Biểu đồ khung giờ cao điểm đã đồng bộ */}
          <div 
            onClick={() => setSelectedEdaPopup({ type: "hourly", title: "Phân tích biến động luồng hành vi chi tiết theo khung giờ", data: edaHourlyData })}
            style={{ background: "#FFFFFF", borderRadius: "24px", padding: "28px", border: `1px solid ${COLORS.border}`, cursor: "pointer" }} 
            className="bento-hover"
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <div style={{ fontSize: "15px", fontWeight: 700, color: COLORS.text }}>Biến động hành vi theo khung giờ (24h)</div>
                <div style={{ fontSize: "12px", color: COLORS.textMuted }}>Dữ liệu thực tế: Đỉnh View hội tụ mạnh mẽ vào khung chiều từ 13h - 16h. Click xem chi tiết.</div>
              </div>
              <div style={{ display: "flex", gap: "8px", fontSize: "11px", fontWeight: 600 }}>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><i style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "#3B82F6" }}></i> View</span>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><i style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "#F59E0B" }}></i> Cart</span>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><i style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "#10B981" }}></i> Purchase</span>
              </div>
            </div>
            
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "4px", height: "160px", padding: "10px 0", borderBottom: "1px solid #F3F4F6" }}>
              {edaHourlyData.map((d, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", width: "100%", justifyContent: "center", height: "120px" }}>
                    <div style={{ width: "6px", background: "#3B82F6", height: `${d.view}%`, borderRadius: "3px 3px 0 0", transition: "all 0.4s" }} title={`View: ${d.view}%`} />
                    <div style={{ width: "6px", background: "#F59E0B", height: `${d.cart * 12}%`, borderRadius: "3px 3px 0 0", transition: "all 0.4s" }} title={`Cart: ${d.cart}%`} />
                    <div style={{ width: "6px", background: "#10B981", height: `${d.purchase * 12}%`, borderRadius: "3px 3px 0 0", transition: "all 0.4s" }} title={`Purchase: ${d.purchase}%`} />
                  </div>
                  <span style={{ fontSize: "10px", color: COLORS.textMuted, fontWeight: 600, marginTop: "8px" }}>{d.hour}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Phân phối sự kiện */}
          <div 
            onClick={() => setSelectedEdaPopup({ type: "behavior", title: "Cơ cấu loại hình hành vi người dùng", data: edaBehaviorData })}
            style={{ background: "#FFFFFF", borderRadius: "24px", padding: "28px", border: `1px solid ${COLORS.border}`, cursor: "pointer" }} 
            className="bento-hover"
          >
            <div style={{ fontSize: "15px", fontWeight: 700, color: COLORS.text, marginBottom: "24px" }}>Phân phối loại sự kiện tổng thể</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {edaBehaviorData.map((b, i) => (
                <div key={i}>
                   <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "6px" }}>
                      <span style={{ fontWeight: 600, color: COLORS.text }}>{b.type}</span>
                      <span style={{ fontWeight: 700, color: b.color }}>{b.count} ({b.pct}%)</span>
                   </div>
                   <div style={{ height: "8px", background: "#F3F4F6", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{ width: `${b.pct}%`, height: "100%", background: b.color }} />
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hàng 3: Ngày trong tuần (Đã sửa lỗi Thứ 4 thành Đỉnh Cuối tuần) & Phân phối giá */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "24px" }}>
            {/* Tần suất mua theo Thứ đã sửa đổi */}
            <div 
              onClick={() => setSelectedEdaPopup({ type: "weekly", title: "Thống kê số lượng đơn hàng thành công theo Thứ", data: edaWeeklyData })}
              style={{ background: "linear-gradient(180deg, #FFF4EC 0%, #FFFAF5 100%)", borderRadius: "24px", padding: "28px", border: `1px solid ${COLORS.border}`, cursor: "pointer" }} 
              className="bento-hover"
            >
               <div style={{ fontSize: "15px", fontWeight: 700, color: "#9A3412", textAlign: "center", marginBottom: "4px" }}>Tần suất mua theo Thứ</div>
               <div style={{ fontSize: "12px", color: "#B45309", textAlign: "center", marginBottom: "24px", fontWeight: 500 }}>Ghi nhận Thứ Bảy & Chủ Nhật là ngày cao điểm mua sắm vượt trội</div>
               
               <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "12px", height: "120px", padding: "0 10px 8px 10px", boxSizing: "border-box" }}>
                  {edaWeeklyData.map((w, i) => {
                    return (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
                        <div style={{ 
                          width: "100%", 
                          maxWidth: "35px",
                          background: w.isPeak ? "linear-gradient(180deg, #F97316 0%, #EA580C 100%)" : "linear-gradient(180deg, #3B82F6 0%, #2563EB 100%)", 
                          height: `${w.val}%`, 
                          borderRadius: "4px 4px 0 0", 
                          transition: "height 0.4s ease" 
                        }} />
                        <span style={{ fontSize: "11px", color: COLORS.textMuted, fontWeight: 600, marginTop: "6px" }}>{w.day}</span>
                      </div>
                    );
                  })}
               </div>
            </div>

            {/* Mật độ phân bổ khoảng giá */}
            <div 
              onClick={() => setSelectedEdaPopup({ type: "price", title: "Mật độ phân bổ các khoảng giá bán hàng hóa", data: edaPriceDistribution })}
              style={{ background: "#FFFFFF", borderRadius: "24px", padding: "28px", border: `1px solid ${COLORS.border}`, cursor: "pointer" }} 
              className="bento-hover"
            >
               <div style={{ fontSize: "15px", fontWeight: 700, color: COLORS.text, textAlign: "center", marginBottom: "24px" }}>Phân bổ mật độ khoảng giá</div>
               
               <div style={{ display: "flex", height: "40px", borderRadius: "12px", overflow: "hidden", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.06)", marginBottom: "32px" }}>
                  {edaPriceDistribution.map((p, i) => (
                    <div 
                      key={i} 
                      style={{ 
                        width: `${p.pct}%`, 
                        background: p.color, 
                        height: "100%", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center", 
                        fontSize: "11px", 
                        fontWeight: 700, 
                        color: p.textCol,
                        transition: "all 0.3s" 
                      }}
                      title={`${p.range}: ${p.pct}%`}
                    >
                      {p.pct}%
                    </div>
                  ))}
               </div>

               {/* Chú thích các nhãn khoảng mục */}
               <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px 40px", padding: "0 10px" }}>
                  {edaPriceDistribution.map((p, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                       <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: p.color }} />
                       <span style={{ fontSize: "12px", color: COLORS.textMuted, fontWeight: 500 }}>{p.range}</span>
                    </div>
                  ))}
               </div>
            </div>
        </div>
      </div>
    );
  };

  const renderEdaModalSection = () => {
    if (!selectedEdaPopup) return null;

    return (
      <div 
        onClick={() => setSelectedEdaPopup(null)}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 2000,
          background: "rgba(11, 15, 25, 0.4)", backdropFilter: "blur(12px)",
          display: "flex", justifyContent: "center", alignItems: "center",
        }}
      >
        <div 
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "680px", background: "#FFFFFF", borderRadius: "28px", padding: "36px",
            boxShadow: "0 40px 80px rgba(0, 0, 0, 0.25)", border: "1px solid rgba(255, 255, 255, 0.9)",
            animation: "slideUp 0.25s ease-out"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
             <div>
                <span style={{ fontSize: "11px", fontWeight: 800, color: "#1F6FEB", textTransform: "uppercase", letterSpacing: "1px" }}>Khám phá dữ liệu chuyên sâu (EDA Report) //</span>
                <h2 style={{ fontSize: "20px", fontWeight: 800, color: COLORS.text, marginTop: "4px", margin: 0 }}>{selectedEdaPopup.title}</h2>
             </div>
             <button onClick={() => setSelectedEdaPopup(null)} style={{ border: "none", background: "#F3F4F6", width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer", fontSize: "14px" }}>✕</button>
          </div>

          <div style={{ minHeight: "220px", marginBottom: "28px" }}>
             {selectedEdaPopup.type === "hourly" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                   {selectedEdaPopup.data.map((d, i) => (
                      <div key={i} style={{ display: "grid", gridTemplateColumns: "70px 1fr 130px", alignItems: "center", gap: "16px" }}>
                         <span style={{ fontSize: "13px", fontWeight: 600, color: COLORS.text }}>Khung {d.hour}</span>
                         <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                               <div style={{ flex: 1, height: "6px", background: "#F3F4F6", borderRadius: "3px" }}>
                                  <div style={{ width: `${d.view}%`, height: "100%", background: "#3B82F6", borderRadius: "3px" }} />
                               </div>
                               <span style={{ fontSize: "10px", width: "32px", color: COLORS.textMuted }}>V:{d.view}%</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                               <div style={{ flex: 1, height: "6px", background: "#F3F4F6", borderRadius: "3px" }}>
                                  <div style={{ width: `${d.cart * 10}%`, height: "100%", background: "#F59E0B", borderRadius: "3px" }} />
                               </div>
                               <span style={{ fontSize: "10px", width: "32px", color: COLORS.textMuted }}>C:{d.cart}%</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                               <div style={{ flex: 1, height: "6px", background: "#F3F4F6", borderRadius: "3px" }}>
                                  <div style={{ width: `${d.purchase * 10}%`, height: "100%", background: "#10B981", borderRadius: "3px" }} />
                               </div>
                               <span style={{ fontSize: "10px", width: "32px", color: COLORS.textMuted }}>P:{d.purchase}%</span>
                            </div>
                         </div>
                         <span style={{ fontSize: "12px", color: "#4B5563", fontWeight: 500, textAlign: "center", background: "#F3F4F6", padding: "4px 8px", borderRadius: "8px" }}>{d.label}</span>
                      </div>
                   ))}
                </div>
             )}

             {selectedEdaPopup.type === "behavior" && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginTop: "20px" }}>
                   {selectedEdaPopup.data.map((b, i) => (
                      <div key={i} style={{ padding: "28px 20px", borderRadius: "20px", background: "#F9FAFB", textAlign: "center", border: `1px solid ${COLORS.border}` }}>
                         <div style={{ fontSize: "13px", color: COLORS.textMuted, fontWeight: 600 }}>{b.type}</div>
                         <div style={{ fontSize: "28px", fontWeight: 800, color: b.color, margin: "14px 0", fontFamily: "monospace" }}>{b.count}</div>
                         <div style={{ fontSize: "12px", color: COLORS.textMuted, fontWeight: 500 }}>Tỷ trọng: <b>{b.pct}%</b></div>
                      </div>
                   ))}
                </div>
             )}

             {selectedEdaPopup.type === "weekly" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                   {selectedEdaPopup.data.map((w, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                         <span style={{ width: "70px", fontSize: "13px", fontWeight: 600, color: COLORS.text }}>{w.day}</span>
                         <div style={{ flex: 1, height: "20px", background: "#F3F4F6", borderRadius: "10px", overflow: "hidden" }}>
                            <div style={{ width: `${w.val}%`, height: "100%", background: w.isPeak ? "linear-gradient(90deg, #F97316 0%, #EA580C 100%)" : "linear-gradient(90deg, #3B82F6 0%, #1D4ED8 100%)", borderRadius: "10px" }} />
                         </div>
                         <span style={{ width: "100px", fontSize: "13px", fontWeight: "bold", color: w.isPeak ? "#EA580C" : "#1D4ED8", textAlign: "right" }}>{w.count}</span>
                      </div>
                   ))}
                </div>
             )}

             {selectedEdaPopup.type === "price" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                   <div style={{ fontSize: "13px", color: COLORS.textMuted, marginBottom: "10px", lineHeight: "1.5" }}>
                      Biểu đồ phân phối lũy kế mật độ xác suất giá sản phẩm trên sàn thương mại. Dữ liệu chứng minh quy luật Pareto: <b>77% lượng hàng hóa giao dịch nằm dưới phân khúc $300</b>.
                   </div>
                   {selectedEdaPopup.data.map((p, i) => (
                      <div key={i} style={{ background: "#F8FAFC", padding: "16px 20px", borderRadius: "16px", border: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                         <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: p.color }} />
                            <span style={{ fontSize: "14px", fontWeight: 600, color: COLORS.text }}>{p.range}</span>
                         </div>
                         <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                            <span style={{ fontSize: "13px", color: COLORS.textMuted }}>Số lượng mẫu: <b>{p.count}</b></span>
                            <span style={{ fontSize: "16px", fontWeight: 800, color: p.textCol, fontFamily: "monospace" }}>{p.pct}%</span>
                         </div>
                      </div>
                   ))}
                </div>
             )}
          </div>

          <div style={{ fontSize: "13px", color: COLORS.textMuted, fontStyle: "italic", padding: "16px", background: "#F8FAFC", borderRadius: "12px", borderLeft: "4px solid #1F6FEB" }}>
             * Tri thức trích xuất hệ thống: Sự bùng nổ hành vi mạnh mẽ vào hai ngày cuối tuần và các đỉnh chiều (13h-16h) chỉ ra khoảng thời gian vàng để hệ thống đẩy mã kích cầu hiệu quả.
          </div>
        </div>
      </div>
    );
  };

  const renderPopupModalSection = () => {
    if (!selectedCategoryPopup) return null;
    
    let popupAccumulatedPercent = 0;
    const popupRadius = 45;
    const popupCircumference = 2 * Math.PI * popupRadius;

    return (
      <div 
        onClick={() => setSelectedCategoryPopup(null)}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1999,
          background: "rgba(11, 15, 25, 0.4)", backdropFilter: "blur(16px)",
          display: "flex", justifyContent: "center", alignItems: "center",
        }}
      >
        <div 
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "550px", background: "#FFFFFF", borderRadius: "24px", padding: "32px",
            boxShadow: "0 30px 70px rgba(0, 0, 0, 0.25)", border: "1px solid rgba(255, 255, 255, 0.8)",
            animation: "slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: "bold", color: COLORS.primaryText, textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "4px" }}>
                Phân tích thị phần doanh thu thương hiệu bên trong //
              </span>
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: COLORS.text, margin: 0 }}>
                Ngành hàng: {selectedCategoryPopup.name}
              </h2>
            </div>
            <button onClick={() => setSelectedCategoryPopup(null)} style={{ border: "none", background: "#F3F4F6", width: "28px", height: "28px", borderRadius: "50%", cursor: "pointer", fontSize: "12px", color: COLORS.textMuted }}>✕</button>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "32px", marginBottom: "24px", flexWrap: "wrap" }}>
            <div style={{ position: "relative", width: "180px", height: "180px", flexShrink: 0 }}>
              <svg width="100%" height="100%" viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
                {selectedCategoryPopup.brands.map((b, idx) => {
                  const strokeLength = (b.p / 100) * popupCircumference;
                  const strokeOffset = - (popupAccumulatedPercent / 100) * popupCircumference;
                  popupAccumulatedPercent += b.p;

                  return (
                    <circle
                      key={idx}
                      cx="60"
                      cy="60"
                      r={popupRadius}
                      fill="transparent"
                      stroke={b.color}
                      strokeWidth="14"
                      strokeDasharray={`${strokeLength} ${popupCircumference}`}
                      strokeDashoffset={strokeOffset}
                      style={{ transition: "all 0.3s ease" }}
                    />
                  );
                })}
              </svg>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", pointerEvents: "none" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: COLORS.textMuted }}>Cơ cấu</div>
                <div style={{ fontSize: "11px", color: COLORS.textMuted }}>Doanh thu</div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px", flex: 1, minWidth: "240px" }}>
              {selectedCategoryPopup.brands.map((b, idx) => (
                <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: COLORS.text, fontWeight: 500 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: b.color }} />
                      <span>{b.name}</span>
                    </div>
                    <span style={{ fontFamily: "monospace", fontWeight: "bold", color: b.color }}>{b.p}%</span>
                  </div>
                  <div style={{ height: "6px", background: "#E5E7EB", borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{ width: `${b.p}%`, height: "100%", background: b.color, borderRadius: "3px" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={() => setSelectedCategoryPopup(null)} style={{ background: COLORS.primaryGradient, color: "#FFFFFF", border: "none", padding: "10px 24px", borderRadius: "12px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
              Đóng báo cáo
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDwhModalSection = () => {
    if (!selectedDwhPopup) return null;

    return (
      <div 
        onClick={() => setSelectedDwhPopup(null)}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 2001,
          background: "rgba(11, 15, 25, 0.4)", backdropFilter: "blur(12px)",
          display: "flex", justifyContent: "center", alignItems: "center"
        }}
      >
        <div 
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "600px", background: "#FFFFFF", borderRadius: "24px", padding: "36px",
            boxShadow: "0 30px 60px rgba(0, 0, 0, 0.25)", border: "1px solid rgba(255, 255, 255, 0.8)",
            animation: "slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: "bold", color: COLORS.primaryText, textTransform: "uppercase", letterSpacing: "1.2px", display: "block", marginBottom: "4px" }}>
                Metadata Schema Inspector // {selectedDwhPopup.type.toUpperCase()} TABLE
              </span>
              <h2 style={{ fontSize: "20px", fontWeight: 800, color: COLORS.text, margin: 0 }}>
                {selectedDwhPopup.title}
              </h2>
            </div>
            <button onClick={() => setSelectedDwhPopup(null)} style={{ border: "none", background: "#F3F4F6", width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer", fontSize: "14px" }}>✕</button>
          </div>

          <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "20px", marginBottom: "24px" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: COLORS.text, marginBottom: "8px" }}>Mô tả kiến trúc phân tầng:</div>
            <p style={{ fontSize: "13.5px", color: COLORS.textMuted, lineHeight: "1.6", margin: "0 0 16px 0" }}>{selectedDwhPopup.desc}</p>
            
            <div style={{ fontSize: "13px", fontWeight: 700, color: COLORS.text, marginBottom: "10px" }}>Định nghĩa cấu trúc thuộc tính trường (Schema Fields):</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {selectedDwhPopup.fields.map((f, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#FFFFFF", padding: "10px 14px", borderRadius: "10px", border: "1px solid rgba(0, 0, 0, 0.03)" }}>
                  <span style={{ fontFamily: "monospace", fontSize: "13px", fontWeight: "bold", color: COLORS.text }}>{f.name}</span>
                  <span style={{ fontSize: "12px", background: f.badgeBg || "#EDF2F7", color: f.badgeColor || "#4A5568", padding: "2px 8px", borderRadius: "6px", fontWeight: 600 }}>{f.type}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={() => setSelectedDwhPopup(null)} style={{ background: COLORS.primaryGradient, color: "#FFFFFF", border: "none", padding: "12px 28px", borderRadius: "12px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
              Đóng thông tin Schema
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderIcebergModalSection = () => {
    if (!selectedIcebergPopup) return null;

    return (
      <div 
        onClick={() => setSelectedIcebergPopup(null)}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 2002,
          background: "rgba(11, 15, 25, 0.4)", backdropFilter: "blur(12px)",
          display: "flex", justifyContent: "center", alignItems: "center",
        }}
      >
        <div 
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "580px", background: "#FFFFFF", borderRadius: "24px", padding: "36px",
            boxShadow: "0 35px 70px rgba(0, 0, 0, 0.25)", border: "1px solid rgba(255, 255, 255, 0.8)",
            animation: "slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: "bold", color: COLORS.primaryText, textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "4px" }}>
                Khám phá dữ liệu tảng băng // ICEBERG CELL INSPECTOR
              </span>
              <h2 style={{ fontSize: "18px", fontWeight: 800, color: COLORS.text, margin: 0 }}>
                Chi tiết ô: {selectedIcebergPopup.details.brand} × {selectedIcebergPopup.details.day}
              </h2>
            </div>
            <button onClick={() => setSelectedIcebergPopup(null)} style={{ border: "none", background: "#F3F4F6", width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer", fontSize: "12px" }}>✕</button>
          </div>

          <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "24px", marginBottom: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ fontSize: "13.5px", color: COLORS.text, lineHeight: "1.5" }}>• Phân tách chiều kích thước (Dimensions): <br /><b style={{ color: COLORS.primaryText }}>Thương hiệu {selectedIcebergPopup.details.brand} × Danh mục {selectedIcebergPopup.details.category} × {selectedIcebergPopup.details.day} × Khung giờ {selectedIcebergPopup.details.hour}</b>.</div>
            <div style={{ fontSize: "13.5px", color: COLORS.text }}>• Chỉ số hỗ trợ mẫu thực tế (Support): <b style={{ fontFamily: "monospace", color: "#9D4EDD" }}>{selectedIcebergPopup.details.support_raw.toFixed(4)}</b>.</div>
            <div style={{ fontSize: "13.5px", color: COLORS.text }}>• Tổng số lượng đơn chốt thành công: <b style={{ color: COLORS.text }}>{selectedIcebergPopup.details.sales_count.toLocaleString()} đơn hàng</b>.</div>
            <div style={{ fontSize: "13.5px", color: COLORS.text }}>• Tổng trị giá doanh số tích lũy ô: <b style={{ color: "#10B981", fontWeight: "bold" }}>{selectedIcebergPopup.revenue} USD</b>.</div>
          </div>

          <div style={{ fontSize: "12px", color: COLORS.textMuted, fontStyle: "italic", padding: "12px", background: "#FFFBEB", borderRadius: "12px", border: "1px solid #FDE68A", marginBottom: "24px" }}>
            * Định hướng tối ưu hóa: Ô dữ liệu này vượt trội hoàn toàn so với các khối chìm, chứng minh cụm phân đoạn chiến lược này mang lại dòng doanh thu cao điểm cốt lõi nhất.
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={() => setSelectedIcebergPopup(null)} style={{ background: COLORS.primaryGradient, color: "#FFFFFF", border: "none", padding: "10px 24px", borderRadius: "12px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
              Đóng ô lập phương
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderClusterModalSection = () => {
    if (!selectedClusterPopup) return null;

    return (
      <div 
        onClick={() => setSelectedClusterPopup(null)}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 2003,
          background: "rgba(11, 15, 25, 0.4)", backdropFilter: "blur(12px)",
          display: "flex", justifyContent: "center", alignItems: "center"
        }}
      >
        <div 
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "600px", background: "#FFFFFF", borderRadius: "24px", padding: "36px",
            boxShadow: "0 35px 70px rgba(0, 0, 0, 0.25)", border: "1px solid rgba(255, 255, 255, 0.8)",
            animation: "slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: "bold", color: COLORS.primaryText, textTransform: "uppercase", letterSpacing: "1.2px", display: "block", marginBottom: "4px" }}>
                Thuật toán K-Means Clustering // RFM Profile
              </span>
              <h2 style={{ fontSize: "20px", fontWeight: 800, color: COLORS.text, margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
                <span>{selectedClusterPopup.icon}</span> {selectedClusterPopup.name}
              </h2>
            </div>
            <button onClick={() => setSelectedClusterPopup(null)} style={{ border: "none", background: "#F3F4F6", width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer", fontSize: "14px", color: COLORS.textMuted }}>✕</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "28px" }}>
            <div style={{ background: "#F8FAFC", padding: "16px", borderRadius: "16px", border: `1px solid ${COLORS.border}`, textAlign: "center" }}>
              <div style={{ fontSize: "11px", color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase", marginBottom: "6px" }}>Quy mô cụm</div>
              <div style={{ fontSize: "15px", fontWeight: 800, color: COLORS.text }}>{selectedClusterPopup.size}</div>
            </div>
            <div style={{ background: "#F8FAFC", padding: "16px", borderRadius: "16px", border: `1px solid ${COLORS.border}`, textAlign: "center" }}>
              <div style={{ fontSize: "11px", color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase", marginBottom: "6px" }}>Đơn trung bình</div>
              <div style={{ fontSize: "15px", fontWeight: 800, color: COLORS.text, fontFamily: "monospace" }}>{selectedClusterPopup.ticket}</div>
            </div>
            <div style={{ background: "#F8FAFC", padding: "16px", borderRadius: "16px", border: `1px solid ${COLORS.border}`, textAlign: "center" }}>
              <div style={{ fontSize: "11px", color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase", marginBottom: "6px" }}>Tỷ lệ chuyển đổi</div>
              <div style={{ fontSize: "15px", fontWeight: 800, color: COLORS.text, fontFamily: "monospace" }}>{selectedClusterPopup.conversion}</div>
            </div>
          </div>

          <div style={{ background: "#F8FAFC", borderLeft: `6px solid ${selectedClusterPopup.stroke}`, borderRadius: "16px", padding: "20px", marginBottom: "28px" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: COLORS.text, marginBottom: "8px" }}>Định hướng chiến lược điều phối kinh doanh:</div>
            <p style={{ fontSize: "13.5px", color: COLORS.textMuted, lineHeight: "1.6", margin: 0 }}>{selectedClusterPopup.strategy}</p>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={() => setSelectedClusterPopup(null)} style={{ background: COLORS.primaryGradient, color: "#FFFFFF", border: "none", padding: "12px 28px", borderRadius: "12px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
              Đóng hồ sơ phân cụm
            </button>
          </div>
        </div>
      </div>
    );
  };

  const sections = {
    overview: renderOverviewSection(),
    eda: renderEdaSection(),
    warehouse: (
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
          <div style={{ background: "linear-gradient(180deg, #EBF5FF 0%, #F5F9FF 100%)", padding: "24px", borderRadius: "20px", border: `1px solid ${COLORS.border}` }}>
            <div style={{ fontSize: "12px", color: COLORS.textMuted }}>Kiến trúc cấu trúc</div>
            <div style={{ fontSize: "18px", fontWeight: 700, color: "#1E40AF", marginTop: "8px" }}>Sơ đồ hình sao đa chiều</div>
          </div>
          <div style={{ background: "linear-gradient(180deg, #F5EDFF 0%, #FAF5FF 100%)", padding: "24px", borderRadius: "20px", border: `1px solid ${COLORS.border}` }}>
            <div style={{ fontSize: "12px", color: COLORS.textMuted }}>Thành phần liên kết</div>
            <div style={{ fontSize: "18px", fontWeight: 700, color: "#6B21A8", marginTop: "8px" }}>1 Bảng dữ kiện × 4 Chiều</div>
          </div>
          <div style={{ background: "linear-gradient(180deg, #FFF4EC 0%, #FFFAF5 100%)", padding: "24px", borderRadius: "20px", border: `1px solid ${COLORS.border}` }}>
            <div style={{ fontSize: "12px", color: COLORS.textMuted }}>Kích thước khối lập phương</div>
            <div style={{ fontSize: "18px", fontWeight: 700, color: "#9A3412", marginTop: "8px" }}>573,914 Ô lập phương nền</div>
          </div>
          <div style={{ background: "linear-gradient(180deg, #FFEBF2 0%, #FFF5F9 100%)", padding: "24px", borderRadius: "20px", border: `1px solid ${COLORS.border}` }}>
            <div style={{ fontSize: "12px", color: COLORS.textMuted }}>Tốc độ nạp dữ liệu (ETL)</div>
            <div style={{ fontSize: "18px", fontWeight: 700, color: "#9D174D", marginTop: "8px" }}>~15,000 dòng / giây</div>
          </div>
        </div>

        <div style={{ background: COLORS.glassPanel, border: `1px solid ${COLORS.border}`, borderRadius: "24px", padding: "32px", position: "relative" }}>
          <div style={{ fontSize: "15px", fontWeight: 600, color: COLORS.text, marginBottom: "4px", textAlign: "center" }}>Bản đồ cấu trúc tương quan Kho dữ liệu đa chiều (Star Schema Overview)</div>
          <div style={{ fontSize: "12px", color: COLORS.textMuted, marginBottom: "36px", textAlign: "center" }}>Mẹo vận hành: Click trực tiếp vào các khối Bảng dữ kiện hoặc Bảng chiều để tra cứu Schema cấu trúc chi tiết</div>
          
          <div style={{ position: "relative", width: "100%", height: "350px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            
            <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", overflow: "visible" }}>
              <path d="M 170 80 L 290 140" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4 4" fill="none" />
              <path d="M 170 270 L 290 210" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4 4" fill="none" />
              <path d="M 580 80 L 460 140" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4 4" fill="none" />
              <path d="M 580 270 L 460 210" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4 4" fill="none" />
            </svg>

            <div 
              onClick={() => setSelectedDwhPopup({
                type: "fact",
                title: "Bảng dữ kiện tổng hợp (Fact Cube Table)",
                desc: "Đóng vai trò hạt nhân lõi trong Star Schema, lưu trữ tập hợp các khóa ngoại liên kết đa chiều đồng thời tính toán các chỉ số vĩ mô tích lũy (Measures) phục vụ phân tích dữ liệu đa chiều OLAP Cube.",
                fields: [
                  { name: "brand_key (FK)", type: "INT - Khóa hãng sản xuất", badgeBg: "#E0F2FE", badgeColor: "#0369A1" },
                  { name: "category_key (FK)", type: "INT - Khóa ngành hàng", badgeBg: "#E0F2FE", badgeColor: "#0369A1" },
                  { name: "day_key (FK)", type: "INT - Khóa ngày trong tuần", badgeBg: "#E0F2FE", badgeColor: "#0369A1" },
                  { name: "hour_key (FK)", type: "INT - Khóa mảnh khung giờ", badgeBg: "#E0F2FE", badgeColor: "#0369A1" },
                  { name: "total_interactions", type: "BIGINT - Tổng lưu lượng mẫu", badgeBg: "#DCFCE7", badgeColor: "#15803D" },
                  { name: "total_purchases", type: "BIGINT - Tổng số lượng đơn mua", badgeBg: "#DCFCE7", badgeColor: "#15803D" },
                  { name: "gross_revenue", type: "DECIMAL - Chỉ số tổng doanh thu", badgeBg: "#DCFCE7", badgeColor: "#15803D" }
                ]
              })}
              style={{ 
                position: "absolute", left: "calc(50% - 100px)", zIndex: 10, width: "200px", padding: "24px 16px",
                background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)", color: "#FFFFFF",
                borderRadius: "20px", textAlign: "center", boxShadow: "0 10px 30px rgba(15, 23, 42, 0.3)",
                cursor: "pointer", transition: "all 0.3s"
              }} 
              className="bento-hover"
            >
              <div style={{ fontSize: "22px", marginBottom: "8px" }}>📦</div>
              <div style={{ fontSize: "14px", fontWeight: 700, letterSpacing: "0.5px" }}>FACT CUBE TABLE</div>
              <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "4px" }}>Bảng dữ kiện hạt nhân</div>
            </div>

            <div 
              onClick={() => setSelectedDwhPopup({
                type: "dimension",
                title: "Bảng chiều hãng sản xuất (Dim Brand)",
                desc: "Lưu trữ thông tin chi tiết và định danh duy nhất của các nhà sản xuất/thương hiệu phân phối trên sàn thương mại điện tử.",
                fields: [
                  { name: "brand_key (PK)", type: "INT - Primary Key AUTO_INCREMENT", badgeBg: "#FEE2E2", badgeColor: "#991B1B" },
                  { name: "brand_name", type: "VARCHAR(100) - Tên thương hiệu", badgeBg: "#F3F4F6", badgeColor: "#4B5563" },
                  { name: "brand_encoded", type: "INT - Mã hóa số nguyên huấn luyện", badgeBg: "#F3F4F6", badgeColor: "#4B5563" }
                ]
              })}
              style={{ position: "absolute", top: "20px", left: "20px", width: "170px", background: "#FFFFFF", border: "1px solid rgba(0, 0, 0, 0.04)", padding: "16px", borderRadius: "16px", cursor: "pointer", transition: "all 0.2s" }}
              className="bento-hover"
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "18px", color: "#1E40AF" }}>🏷️</span>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: COLORS.text }}>Dim Brand</div>
                  <div style={{ fontSize: "11px", color: COLORS.textMuted }}>Chiều hãng sản xuất</div>
                </div>
              </div>
            </div>

            <div 
              onClick={() => setSelectedDwhPopup({
                type: "dimension",
                title: "Bảng chiều phân loại ngành hàng (Dim Category)",
                desc: "Phân mảnh và lưu trữ hệ thống mã hóa ngành hàng, phục vụ các tác vụ phân tích Drill-down/Roll-up danh mục.",
                fields: [
                  { name: "category_key (PK)", type: "INT - Primary Key AUTO_INCREMENT", badgeBg: "#FEE2E2", badgeColor: "#991B1B" },
                  { name: "category_id_raw", type: "BIGINT - Mã danh mục gốc hệ thống", badgeBg: "#F3F4F6", badgeColor: "#4B5563" },
                  { name: "category_code", type: "VARCHAR(150) - Chuỗi phân cấp ngành", badgeBg: "#F3F4F6", badgeColor: "#4B5563" },
                  { name: "category_code_encoded", type: "INT - Mã hóa phục vụ mô hình AI", badgeBg: "#F3F4F6", badgeColor: "#4B5563" }
                ]
              })}
              style={{ position: "absolute", bottom: "20px", left: "20px", width: "170px", background: "#FFFFFF", border: "1px solid rgba(0, 0, 0, 0.04)", padding: "16px", borderRadius: "16px", cursor: "pointer", transition: "all 0.2s" }}
              className="bento-hover"
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "18px", color: "#6B21A8" }}>🗂️</span>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: COLORS.text }}>Dim Category</div>
                  <div style={{ fontSize: "11px", color: COLORS.textMuted }}>Chiều phân loại ngành</div>
                </div>
              </div>
            </div>

            <div 
              onClick={() => setSelectedDwhPopup({
                type: "dimension",
                title: "Bảng chiều Thứ trong tuần (Dim DayOfWeek)",
                desc: "Ánh xạ và quản lý chu kỳ thời gian theo Thứ, hỗ trợ bóc tách tính chu kỳ hành vi chốt đơn cao điểm của khách hàng.",
                fields: [
                  { name: "day_key (PK)", type: "INT - Primary Key (1-7)", badgeBg: "#FEE2E2", badgeColor: "#991B1B" },
                  { name: "day_name_en", type: "VARCHAR(20) - Tên tiếng Anh", badgeBg: "#F3F4F6", badgeColor: "#4B5563" },
                  { name: "day_name_vi", type: "VARCHAR(20) - Tên tiếng Việt", badgeBg: "#F3F4F6", badgeColor: "#4B5563" },
                  { name: "day_of_week_encoded", type: "INT - Số nguyên mã hóa (0-6)", badgeBg: "#F3F4F6", badgeColor: "#4B5563" }
                ]
              })}
              style={{ position: "absolute", top: "20px", right: "20px", width: "170px", background: "#FFFFFF", border: "1px solid rgba(0, 0, 0, 0.04)", padding: "16px", borderRadius: "16px", cursor: "pointer", transition: "all 0.2s" }}
              className="bento-hover"
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "18px", color: "#9A3412" }}>📅</span>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: COLORS.text }}>Dim DayOfWeek</div>
                  <div style={{ fontSize: "11px", color: COLORS.textMuted }}>Chiều ngày trong tuần</div>
                </div>
              </div>
            </div>

            <div 
              onClick={() => setSelectedDwhPopup({
                type: "dimension",
                title: "Bảng chiều phân mảnh khung giờ (Dim Hour)",
                desc: "Băm nhỏ quỹ thời gian 24 giờ một ngày thành các cụm sự kiện mảnh để phân tích hành vi theo thời gian thực.",
                fields: [
                  { name: "hour_key (PK)", type: "INT - Primary Key (0-23)", badgeBg: "#FEE2E2", badgeColor: "#991B1B" },
                  { name: "hour_interval", type: "VARCHAR(20) - Định dạng chuỗi (vd: 00-04)", badgeBg: "#F3F4F6", badgeColor: "#4B5563" },
                  { name: "time_bucket_label", type: "VARCHAR(50) - Nhãn đặc trưng giờ", badgeBg: "#F3F4F6", badgeColor: "#4B5563" }
                ]
              })}
              style={{ position: "absolute", bottom: "20px", right: "20px", width: "170px", background: "#FFFFFF", border: "1px solid rgba(0, 0, 0, 0.04)", padding: "16px", borderRadius: "16px", cursor: "pointer", transition: "all 0.2s" }}
              className="bento-hover"
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "18px", color: "#9D174D" }}>⏰</span>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: COLORS.text }}>Dim Hour</div>
                  <div style={{ fontSize: "11px", color: COLORS.textMuted }}>Chiều phân mảnh giờ</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    ),

    iceberg: (
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div style={{ background: COLORS.glassPanel, border: `1px solid ${COLORS.border}`, borderRadius: "24px", padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", flex: 1, alignItems: "center", gap: "20px", background: "#F9FAFB", padding: "16px 24px", border: "1px solid rgba(0, 0, 0, 0.04)", borderRadius: "16px" }}>
              <span style={{ fontSize: "13px", color: COLORS.textMuted, fontWeight: 600 }}>Ngưỡng hỗ trợ tối thiểu (Threshold):</span>
              <input type="range" min="0.010" max="0.025" step="0.001" value={icebergThreshold} onChange={e => setIcebergThreshold(parseFloat(e.target.value))} style={{ flex: 1, accentColor: "#1F6FEB", cursor: "ew-resize" }} />
              <span style={{ color: "#9D4EDD", fontWeight: "bold", fontSize: "16px", fontFamily: "monospace" }}>{icebergThreshold.toFixed(3)}</span>
            </div>
            <div style={{ background: "linear-gradient(90deg, #FFFBEB 0%, #FEF3C7 100%)", padding: "16px 24px", fontSize: "12px", color: "#B45309", borderRadius: "14px", fontWeight: 600, border: "1px solid #FDE68A" }}>
              ⚠️ Điều kiện biên cắt tỉa: Số đơn hàng ≥ 1,500 & Doanh thu ≥ $1,000,000 USD (Hội tụ cao điểm cuối tuần)
            </div>
          </div>
        </div>

        <div>
          <div style={{ fontSize: "14px", fontWeight: 700, color: COLORS.text, marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Các ô lập phương nổi thỏa mãn điều kiện biên thực tế (Iceberg Cuboids Above Water)
          </div>
          <div style={{ gridTemplateColumns: "repeat(2, 1fr)", gap: "20px", display: "grid" }}>
            {icebergCube
              .filter(cube => cube.details.support_raw >= icebergThreshold)
              .map((row) => (
              <div 
                key={row.id} 
                onClick={() => setSelectedIcebergPopup(row)}
                style={{ 
                  background: row.bg, 
                  borderRadius: "24px", 
                  padding: "24px", 
                  border: `1px solid ${COLORS.border}`, 
                  display: "flex", 
                  flexDirection: "column", 
                  gap: "14px", 
                  cursor: "pointer",
                  position: "relative",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.01)"
                }} 
                className="bento-hover"
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                  <div style={{ fontSize: "14px", color: COLORS.text, fontWeight: "600", lineHeight: "1.5" }}>{row.dim}</div>
                  <span style={{ fontSize: "18px" }}>🧊</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px", borderTop: "1px dashed rgba(0,0,0,0.06)", paddingTop: "12px" }}>
                  <span style={{ fontSize: "13px", color: COLORS.textMuted }}>Độ hỗ trợ mẫu: <strong style={{ fontFamily: "monospace", color: COLORS.text }}>{row.support}</strong></span>
                  <span style={{ fontSize: "15px", color: "#10B981", fontWeight: 800, fontFamily: "monospace" }}>{row.revenue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),

    mining: (
      <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
        <div style={{ background: COLORS.glassPanel, border: `1px solid ${COLORS.border}`, borderRadius: "24px", padding: "32px", boxShadow: "0 4px 20px rgba(0,0,0,0.01)" }}>
          <div style={{ borderBottom: "1px solid #E5E7EB", paddingBottom: "16px", marginBottom: "24px" }}>
            <div style={{ fontSize: "11px", fontWeight: 800, color: COLORS.primaryText, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Thuật toán Market Basket Analysis // Apriori</div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: COLORS.text }}>HỆ THỐNG TRA CỨU QUY LUẬT TƯƠNG QUAN HÀNH VI MUA SẮM CHÉO</div>
          </div>
          
          <div style={{ display: "flex", gap: "24px", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "200px", background: "#FFFFFF", padding: "16px 20px", borderRadius: "16px", border: "1px solid #E5E7EB", position: "relative" }}>
              <label style={{ display: "block", fontSize: "11px", color: COLORS.textMuted, fontWeight: 700, textTransform: "uppercase", marginBottom: "8px", letterSpacing: "0.5px" }}>Thương hiệu tiền đề (Anticident - X)</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <span style={{ position: "absolute", left: "12px", fontSize: "16px" }}>🛒</span>
                <select value={brandA} onChange={(e) => { setBrandA(e.target.value); setActiveMiningResult(null); }} style={{ width: "100%", padding: "12px 12px 12px 38px", borderRadius: "10px", border: "1px solid #D1D5DB", background: "#FFF", fontSize: "14px", fontWeight: 600, color: COLORS.text, outline: "none", cursor: "pointer", appearance: "none" }}>
                  <option value="Huawei">Huawei Mobile</option>
                  <option value="Xiaomi">Xiaomi Ecosystem</option>
                  <option value="Apple">Apple Premium</option>
                  <option value="Samsung">Samsung Global</option>
                </select>
                <span style={{ position: "absolute", right: "12px", pointerEvents: "none", color: COLORS.textMuted, fontSize: "12px" }}>▼</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 8px" }}>
              <div style={{ fontSize: "20px", color: "#9D4EDD", fontWeight: "bold", animation: "pulse 2s infinite" }}>➔</div>
              <span style={{ fontSize: "10px", color: COLORS.textMuted, fontWeight: 600, fontFamily: "monospace", marginTop: "2px" }}>IMPLY</span>
            </div>

            <div style={{ flex: 1, minWidth: "200px", background: "#FFFFFF", padding: "16px 20px", borderRadius: "16px", border: "1px solid #E5E7EB", position: "relative" }}>
              <label style={{ display: "block", fontSize: "11px", color: COLORS.textMuted, fontWeight: 700, textTransform: "uppercase", marginBottom: "8px", letterSpacing: "0.5px" }}>Thương hiệu hệ quả (Consequent - Y)</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <span style={{ position: "absolute", left: "12px", fontSize: "16px" }}>🛍️</span>
                <select value={brandB} onChange={(e) => { setBrandB(e.target.value); setActiveMiningResult(null); }} style={{ width: "100%", padding: "12px 12px 12px 38px", borderRadius: "10px", border: "1px solid #D1D5DB", background: "#FFF", fontSize: "14px", fontWeight: 600, color: COLORS.text, outline: "none", cursor: "pointer", appearance: "none" }}>
                  <option value="Xiaomi">Xiaomi Ecosystem</option>
                  <option value="Huawei">Huawei Mobile</option>
                  <option value="Samsung">Samsung Global</option>
                  <option value="Apple">Apple Premium</option>
                </select>
                <span style={{ position: "absolute", right: "12px", pointerEvents: "none", color: COLORS.textMuted, fontSize: "12px" }}>▼</span>
              </div>
            </div>

            <button onClick={handleRunMining} style={{ minWidth: "180px", height: "54px", alignSelf: "flex-end", padding: "0 24px", borderRadius: "16px", border: "none", background: COLORS.primaryGradient, color: "#FFFFFF", fontSize: "14px", fontWeight: 700, cursor: "pointer", transition: "all 0.3s ease", boxShadow: "0 4px 15px rgba(157, 78, 221, 0.25)" }}>
              ⚡ Khởi chạy khai phá
            </button>
          </div>
        </div>

        {activeMiningResult && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", animation: "slideUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
              <div style={{ background: COLORS.pastelBlue, padding: "24px", borderRadius: "20px", border: "1px solid rgba(31, 111, 235, 0.08)", position: "relative" }} className="bento-hover">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", color: "#1E40AF", fontWeight: 700, textTransform: "uppercase" }}>Độ hỗ trợ toàn cục (Support)</span>
                  <span>📊</span>
                </div>
                <div style={{ fontSize: "28px", fontWeight: 800, color: "#1D4ED8", marginTop: "12px", fontFamily: "monospace" }}>{activeMiningResult.sup}</div>
                <div style={{ marginTop: "12px", height: "6px", background: "rgba(30, 64, 175, 0.06)", borderRadius: "3px" }}>
                  <div style={{ height: "100%", width: `${parseFloat(activeMiningResult.sup) * 2000}%`, background: "#1D4ED8", borderRadius: "3px" }} />
                </div>
              </div>

              <div style={{ background: COLORS.pastelPurple, padding: "24px", borderRadius: "20px", border: "1px solid rgba(157, 78, 221, 0.08)" }} className="bento-hover">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", color: "#6B21A8", fontWeight: 700, textTransform: "uppercase" }}>Độ tin cậy quy luật (Confidence)</span>
                  <span>🎯</span>
                </div>
                <div style={{ fontSize: "28px", fontWeight: 800, color: "#6B21A8", marginTop: "12px", fontFamily: "monospace" }}>{activeMiningResult.conf}</div>
                <div style={{ marginTop: "12px", height: "6px", background: "rgba(107, 33, 168, 0.06)", borderRadius: "3px" }}>
                  <div style={{ height: "100%", width: activeMiningResult.conf, background: "#7C3AED", borderRadius: "3px" }} />
                </div>
              </div>

              <div style={{ background: COLORS.pastelOrange, padding: "24px", borderRadius: "20px", border: "1px solid rgba(245, 158, 11, 0.08)" }} className="bento-hover">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", color: "#9A3412", fontWeight: 700, textTransform: "uppercase" }}>Độ nâng cao tương quan (Lift)</span>
                  <span>📈</span>
                </div>
                <div style={{ fontSize: "28px", fontWeight: 800, color: "#C2410C", marginTop: "12px", fontFamily: "monospace" }}>{activeMiningResult.lift}</div>
                <div style={{ marginTop: "12px", height: "6px", background: "rgba(154, 52, 18, 0.06)", borderRadius: "3px" }}>
                  <div style={{ height: "100%", width: `${(parseFloat(activeMiningResult.lift) / 3) * 100}%`, background: "#EA580C", borderRadius: "3px" }} />
                </div>
              </div>
            </div>

            <div style={{ background: "#FFFFFF", border: `1px solid ${COLORS.border}`, borderRadius: "20px", padding: "24px 28px", borderLeft: `6px solid ${parseFloat(activeMiningResult.lift) >= 1 ? "#10B981" : "#EF4444"}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <span>💡</span>
                <div style={{ fontSize: "14px", fontWeight: 800, color: COLORS.text }}>
                  Tri thức phân tích thuật toán ({activeMiningResult.brandA} ➔ {activeMiningResult.brandB}):
                </div>
              </div>
              <p style={{ fontSize: "13.5px", color: "#4B5563", lineHeight: "1.7", margin: 0 }}>
                {activeMiningResult.comment}
              </p>
            </div>
          </div>
        )}
      </div>
    ),

    cluster: (
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div style={{ background: COLORS.glassPanel, border: `1px solid ${COLORS.border}`, borderRadius: "24px", padding: "28px", marginBottom: "4px" }}>
          <div style={{ fontSize: "11px", fontWeight: 800, color: COLORS.primaryText, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Mô hình học máy phân lớp khách hàng // K-Means </div>
          <div style={{ fontSize: "16px", fontWeight: 700, color: COLORS.text }}>KẾT QUẢ PHÂN CỤM HỒ SƠ RFM CHIẾN LƯỢC</div>
          <div style={{ fontSize: "12px", color: COLORS.textMuted, marginTop: "6px" }}>Mẹo vận hành: Click trực tiếp vào các thẻ phân cụm bên dưới để mở cửa sổ thanh tra (Inspector) phân tích sâu cấu trúc KPI</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px" }}>
          {clusterData.map((c, i) => (
            <div 
              key={i} 
              onClick={() => setSelectedClusterPopup(c)} 
              style={{ 
                background: c.grad, 
                border: `1px solid ${COLORS.border}`, 
                borderRadius: "24px", 
                padding: "28px", 
                cursor: "pointer", 
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "20px",
                position: "relative"
              }} 
              className="bento-hover"
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: 800, color: COLORS.text, margin: "0 0 6px 0" }}>{c.name}</h3>
                  <span style={{ fontSize: "12px", color: COLORS.textMuted, fontWeight: 600, background: "#FFFFFF", padding: "4px 10px", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.04)" }}>
                    Quy mô: {c.size}
                  </span>
                </div>
                <span style={{ fontSize: "28px", background: "#FFFFFF", width: "52px", height: "52px", borderRadius: "14px", display: "inline-flex", justifyContent: "center", alignItems: "center" }}>
                  {c.icon}
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", borderTop: "1px dashed rgba(0,0,0,0.05)", paddingTop: "14px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: c.stroke }}>Khảo sát chi tiết hồ sơ cụm ➔</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),

    prediction: (
      <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
        <div style={{ background: COLORS.glassPanel, border: `1px solid ${COLORS.border}`, borderRadius: "24px", padding: "40px" }}>
          <div style={{ fontSize: "18px", fontWeight: 700, color: COLORS.text, marginBottom: "24px" }}>
            Mô phỏng tương tác người dùng và phân lớp hành vi thời gian thực (Real-time SVM Classification)
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: COLORS.textMuted, marginBottom: "10px" }}>Mã định danh khách hàng (User ID):</label>
              <input type="number" value={userId} onChange={e => setUserId(e.target.value)} style={{ width: "100%", padding: "14px 16px", border: `1px solid ${COLORS.border}`, borderRadius: "12px", fontSize: "15px", background: "#FFFFFF", color: COLORS.text, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: COLORS.textMuted, marginBottom: "10px" }}>Mã định danh sản phẩm (Product ID):</label>
              <input type="number" value={productId} onChange={e => setProductId(e.target.value)} style={{ width: "100%", padding: "14px 16px", border: `1px solid ${COLORS.border}`, borderRadius: "12px", fontSize: "15px", background: "#FFFFFF", color: COLORS.text, outline: "none", boxSizing: "border-box" }} />
            </div>
          </div>

          <button onClick={handleCallPredictAPI} disabled={loadingPredict} style={{ width: "100%", padding: "16px", background: COLORS.primaryGradient, color: "#FFFFFF", border: "none", borderRadius: "14px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", transition: "all 0.2s" }}>
            {loadingPredict ? "Hệ thống đang truy vấn Kho dữ liệu & Tính toán siêu phẳng SVM..." : "Kích hoạt mô hình phân lớp AI"}
          </button>
        </div>

        {errorLogPredict && (
          <div style={{ background: "#FEF2F2", borderLeft: "5px solid #EF4444", padding: "20px", borderRadius: "14px", color: "#991B1B", fontSize: "14px", fontWeight: 500 }}>
            ⚠️ <b>Lỗi liên thông hạ tầng:</b> {errorLogPredict}
          </div>
        )}

        {predictionResult && (
          <div style={{ 
            background: predictionResult.prediction === 1 ? "linear-gradient(180deg, #E6FBF0 0%, #F3FDF8 100%)" : "#F8FAFC", 
            borderLeft: predictionResult.prediction === 1 ? "6px solid #10B981" : "6px solid #475569", 
            padding: "28px", borderRadius: "20px", borderTop: `1px solid ${COLORS.border}`, borderRight: `1px solid ${COLORS.border}`, borderBottom: `1px solid ${COLORS.border}`,
            animation: "fadeIn 0.4s ease"
          }}>
            <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "14px", color: predictionResult.prediction === 1 ? "#065F46" : "#1E293B" }}>
              {predictionResult.prediction === 1 ? "🎯 Kết quả phân lớp: KHÁCH HÀNG SẼ MUA (Purchase)" : "👀 Kết quả phân lớp: CHỈ XEM SẢN PHẨM (Non-Purchase)"}
            </div>
            <div style={{ fontSize: "14px", lineHeight: "1.8", color: COLORS.textMuted }}>
              • Bối cảnh thời gian thực tế: Khung giờ <b>{predictionResult.realtime_context.hour}:00</b>, Thứ trong tuần mã hóa định dạng số nguyên là <b>{predictionResult.realtime_context.day_of_week_encoded}</b>.<br />
              • Biên độ khoảng cách siêu phẳng quyết định quyết định tuyến tính SVM: <b style={{ color: COLORS.text }}>{predictionResult.confidence_score.toFixed(4)}</b>.<br />
              • Đánh giá tác vụ kinh doanh: {predictionResult.prediction === 1 ? "Mức độ an toàn biên độ cao, kích hoạt ngay luồng đẩy thông báo gợi ý mã Voucher giảm giá ngắn hạn." : "Khách hàng có xu hướng lướt vãng lai, chuyển luồng tiếp thị lại (Remarketing) bám đuôi tự động danh mục."}
            </div>
          </div>
        )}
      </div>
    )
  };

  return (
    <div style={{ display: "flex", width: "100%", minHeight: "100vh", background: COLORS.innerBg, overflow: "hidden", position: "relative" }}>
      
      {/* Thanh điều phối Menu dọc (Width: 300px) */}
      <div style={{ width: "300px", background: "linear-gradient(180deg, #F3F4F6 0%, #E5E7EB 100%)", borderRight: `1px solid ${COLORS.border}`, padding: "44px 0 44px 32px", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "0 0 36px 16px", borderBottom: `1px solid ${COLORS.border}` }}>
          <div style={{ fontSize: "18px", fontWeight: 700, color: COLORS.text, letterSpacing: "0.5px" }}>Hệ thống Quản trị BI</div>
        </div>
        
        <nav style={{ padding: "28px 0", flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
          {navItems.map(n => (
            <button key={n.id} onClick={() => { setActiveNav(n.id); setActiveMiningResult(null); setPredictionResult(null); setErrorLogPredict(""); }} style={{
              width: "100%", padding: "14px 24px", border: "none", borderRadius: "24px 0 0 24px", cursor: "pointer", fontSize: "14px", fontWeight: activeNav === n.id ? 700 : 500, textAlign: "left",
              background: activeNav === n.id ? COLORS.innerBg : "transparent",
              color: activeNav === n.id ? COLORS.primaryText : COLORS.textMuted,
              boxShadow: activeNav === n.id ? "-5px 5px 15px rgba(0,0,0,0.02)" : "none",
              transition: "all 0.2s ease"
            }}>
              {n.label}
            </button>
          ))}
        </nav>
        
        <div style={{ padding: "20px 16px", borderTop: `1px solid ${COLORS.border}`, fontSize: "12px", color: COLORS.textMuted }}>
          <div>Hội đồng Quản trị BI</div>
          <div style={{ color: COLORS.textMuted, marginTop: "2px" }}>Giai đoạn Bảo vệ Nghiệm thu</div>
        </div>
      </div>
      
      {/* Vùng Lưới hiển thị chính */}
      <div style={{ flex: 1, padding: "40px 48px", overflowY: "auto", boxSizing: "border-box" }}>
        {sections[activeNav]}
      </div>

      {/* CỬA SỔ POPUP MODALS OVERLAY */}
      {renderPopupModalSection()}
      {renderEdaModalSection()}
      {renderDwhModalSection()}
      {renderIcebergModalSection()}
      {renderClusterModalSection()}

      <style>{`
        .bento-hover:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.05) !important;
          border-color: rgba(31, 111, 235, 0.2) !important;
        }
        .pie-segment:hover {
          stroke-width: 20 !important;
          filter: drop-shadow(0px 4px 8px rgba(0,0,0,0.15));
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.8; }
        }
      `}</style>

    </div>
  );
}