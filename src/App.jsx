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
  glassPanel: "rgba(255, 255, 255, 0.8)", 
  border: "rgba(0, 0, 0, 0.04)", 
  text: "#111827",           
  textMuted: "#6B7280",      
  primaryText: "#1F6FEB",    
};

// Dữ liệu danh mục và cơ cấu thương hiệu bên trong phục vụ Popup tương tác gộp
const categoryData = [
  { id: "cat_phone", name: "Thiết bị Di động (Smartphone)", pct: 45, bg: COLORS.pastelBlue, textColor: "#1E40AF", brands: [{ name: "Apple", p: 55 }, { name: "Samsung", p: 30 }, { name: "Xiaomi", p: 10 }, { name: "Huawei", p: 5 }] },
  { id: "cat_appliance", name: "Điện máy & Gia dụng", pct: 25, bg: COLORS.pastelPurple, textColor: "#6B21A8", brands: [{ name: "Samsung", p: 50 }, { name: "LG", p: 35 }, { name: "Xiaomi", p: 15 }] },
  { id: "cat_computer", name: "Máy tính & Laptop", pct: 15, bg: COLORS.pastelOrange, textColor: "#9A3412", brands: [{ name: "Apple", p: 60 }, { name: "Lenovo", p: 25 }, { name: "Asus", p: 15 }] },
  { id: "cat_apparel", name: "Thời trang & May mặc", pct: 10, bg: COLORS.pastelPink, textColor: "#9D174D", brands: [{ name: "Nike", p: 40 }, { name: "Adidas", p: 40 }, { name: "Puma", p: 20 }] },
  { id: "cat_others", name: "Các nhóm ngành khác", pct: 5, bg: "linear-gradient(180deg, #F3F4F6 0%, #F9FAFB 100%)", textColor: "#374151", brands: [{ name: "Khác", p: 100 }] },
];

const priceStats = [
  { label: "Mức giá trung bình", value: "$292.18" },
  { label: "Điểm giá trung vị (50%)", value: "$172.18" },
  { label: "Độ lệch chuẩn giá", value: "$347.59" },
  { label: "Ngưỡng giá cao nhất", value: "$2,574.07" },
];

const icebergCube = [
  { dim: "Apple × Smartphone × Thứ Tư × 09:00", support: "0.015", count: 1591, revenue: "$1,393,887", bg: COLORS.pastelBlue },
  { dim: "Apple × Smartphone × Thứ Ba × 09:00", support: "0.014", count: 1533, revenue: "$1,332,871", bg: COLORS.pastelPurple },
  { dim: "Apple × Smartphone × Thứ Năm × 08:00", support: "0.013", count: 1439, revenue: "$1,267,793", bg: COLORS.pastelOrange },
  { dim: "Apple × Smartphone × Thứ Ba × 07:00", support: "0.013", count: 1407, revenue: "$1,246,109", bg: COLORS.pastelPink },
];

// Cơ sở dữ liệu Khai phá hành vi mua sắm chéo phục vụ bộ lọc nút bấm
const miningRulesDatabase = {
  "Huawei-Xiaomi": { sup: "0.011", conf: "23.0%", lift: "2.13", comment: "Hệ số tương quan vượt bậc (Độ nâng cao = 2.13). Minh chứng nhóm khách hàng ưa chuộng phân khúc tối ưu chi phí có hành vi cân nhắc chuyển dịch cực kỳ nhạy bén giữa hai thương hiệu này. Khuyến nghị điều phối: Đẩy mạnh chiến dịch giảm giá đối đầu trực diện." },
  "Huawei-Samsung": { sup: "0.014", conf: "30.0%", lift: "1.54", comment: "Độ tin cậy đạt mức cao (Độ tin cậy = 30%). Người dùng có xu hướng lựa chọn hệ sinh thái đa dụng của Samsung khi có ý định thay đổi nâng cấp từ phân khúc tầm trung của Huawei." },
  "Xiaomi-Samsung": { sup: "0.019", conf: "18.0%", lift: "0.91", comment: "Hệ số tương quan ở trạng thái độc lập tự nhiên. Nhóm khách hàng cốt lõi của hai thương hiệu này ít có sự giao thoa hành vi mua sắm chéo cùng thời điểm trên giỏ hàng." },
  "Apple-Samsung": { sup: "0.021", conf: "12.0%", lift: "0.59", comment: "Hệ số tương quan đạt mức phân cực thị phần đối nghịch (Độ nâng cao < 1). Cho thấy tính trung thành thương hiệu của hai nhóm đối tượng này tách biệt hoàn toàn, rất hiếm khi mua thử nghiệm chéo." },
};

const clusterData = [
  { id: "cluster_1", name: "Tín đồ Tech cao cấp", size: "326K Khách hàng", ticket: "$889", conversion: "3.50%", grad: "linear-gradient(135deg, #E0F2FE 0%, #F0F9FF 100%)", stroke: "#38BDF8", strategy: "Tập trung phân phối độc quyền các gói bảo hành thiết bị cao cấp, ưu đãi nâng cấp dung lượng và mở rộng giỏ hàng sang các dòng thiết bị đeo sinh thái thông minh." },
  { id: "cluster_2", name: "Hệ sinh thái Đa dụng", size: "376K Khách hàng", ticket: "$261", conversion: "3.80%", grad: "linear-gradient(135deg, #DCFCE7 0%, #F0FDF4 100%)", stroke: "#4ADE80", strategy: "Đẩy mạnh các gói ưu đãi thu cũ đổi mới (Trade-in), tích hợp mã giảm giá chéo sang phân hệ sản phẩm điện máy gia dụng thông minh cùng thương hiệu." },
  { id: "cluster_3", name: "Khách hàng tối ưu chi phí", size: "219K Khách hàng", ticket: "$207", conversion: "1.76%", grad: "linear-gradient(135deg, #FEF3C7 0%, #FFFDF2 100%)", stroke: "#FBBF24", strategy: "Duy trì tương tác qua Flash Sale tự động theo khung giờ cao điểm đêm, tối ưu cấu trúc giá rẻ để cạnh tranh chiếm lĩnh volume số lượng." },
  { id: "cluster_4", name: "Nhóm khảo sát vãng lai", size: "79K Khách hàng", ticket: "$0", conversion: "0.00%", grad: "linear-gradient(135deg, #FCE7F3 0%, #FDF2F8 100%)", stroke: "#F472B6", strategy: "Kích hoạt luồng Remarketing tự động hiển thị lại chính xác mã danh mục họ đã dành thời gian xem nhiều nhất, kết hợp mã miễn phí vận chuyển ngắn hạn." },
];

const navItems = [
  { id: "overview", label: "Tổng quan thị trường" },
  { id: "warehouse", label: "Cấu trúc kho dữ liệu" },
  { id: "iceberg", label: "Tối ưu hóa Iceberg Cube" },
  { id: "mining", label: "Khai phá hành vi mua sắm" },
  { id: "cluster", label: "Phân cụm RFM chiến lược" },
];

// Thành phần đồ họa mô phỏng biểu đồ quạt tối giản (Mini Donut Chart) bằng CSS SVG
function MiniDonutChart({ percent, color, label }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "16px", background: "#FFFFFF", padding: "16px 20px", borderRadius: "16px", border: `1px solid ${COLORS.border}`, flex: 1 }}>
      <svg width="50" height="50" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="25" cy="25" r={radius} fill="transparent" stroke="#F3F4F6" strokeWidth="5" />
        <circle cx="25" cy="25" r={radius} fill="transparent" stroke={color} strokeWidth="5" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
      </svg>
      <div>
        <div style={{ fontSize: "11px", color: COLORS.textMuted, fontWeight: 500, marginBottom: "2px" }}>{label}</div>
        <div style={{ fontSize: "20px", fontWeight: 700, color: "#111827", fontFamily: "sans-serif" }}>{percent}%</div>
      </div>
    </div>
  );
}

export default function App() {
  const [activeNav, setActiveNav] = useState("overview");
  const [icebergThreshold, setIcebergThreshold] = useState(0.012);

  // Khai báo lại chuẩn xác các trạng thái tương tác động (Đã fix lỗi sập trắng web)
  const [selectedCategoryPopup, setSelectedCategoryPopup] = useState(null);
  const [brandA, setBrandA] = useState("Huawei");
  const [brandB, setBrandB] = useState("Xiaomi");
  const [activeMiningResult, setActiveMiningResult] = useState(null);
  const [selectedCluster, setSelectedCluster] = useState(null);

  // Hàm xử lý kích hoạt bảng khai phá tương ứng của 2 thương hiệu
  const handleRunMining = () => {
    const key1 = `${brandA}-${brandB}`;
    const key2 = `${brandB}-${brandA}`;
    const result = miningRulesDatabase[key1] || miningRulesDatabase[key2];
    if (result) {
      setActiveMiningResult({ brandA, brandB, ...result });
    } else {
      setActiveMiningResult({ brandA, brandB, sup: "0.000", conf: "0.0%", lift: "0.00", comment: "Hệ thống không tìm thấy luật tương quan chéo mạnh vượt ngưỡng giữa 2 thương hiệu được chọn trong kỳ dữ liệu này." });
    }
  };

  const sections = {
    overview: (
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        
        {/* 4 biểu đồ quạt trực quan đầy màu sắc sắc nét */}
        <div style={{ display: "flex", gap: "20px" }}>
          <MiniDonutChart percent={100} color="#1F6FEB" label="Quy mô tương tác (Tổng nạp)" />
          <MiniDonutChart percent={96.7} color="#9D4EDD" label="Tỷ lệ xem sản phẩm" />
          <MiniDonutChart percent={1.5} color="#F59E0B" label="Tỷ lệ thêm giỏ hàng" />
          <MiniDonutChart percent={1.8} color="#10B981" label="Tỷ lệ đơn hàng thành công" />
        </div>

        {/* Gộp Doanh thu và Tỷ trọng ngành hàng thành 1 ô chung tương tác Popup */}
        <div style={{ background: COLORS.glassPanel, border: `1px solid ${COLORS.border}`, borderRadius: "24px", padding: "28px" }}>
          <div style={{ fontSize: "15px", fontWeight: 600, color: COLORS.text, marginBottom: "4px" }}>Phân cấp cơ cấu thị phần ngành hàng cốt lõi</div>
          <div style={{ fontSize: "12px", color: COLORS.textMuted, marginBottom: "20px" }}>Mẹo điều hành: Nhấn vào dòng ngành hàng bất kỳ để mở cửa sổ phân tích doanh thu thương hiệu bên trong</div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
            {categoryData.map((c, i) => (
              <div 
                key={i} 
                onClick={() => setSelectedCategoryPopup(c)}
                style={{ background: c.bg, padding: "20px", borderRadius: "16px", border: `1px solid ${COLORS.border}`, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                className="bento-hover"
              >
                <span style={{ fontSize: "13px", fontWeight: 600, color: c.textColor }}>{c.name}</span>
                <span style={{ fontSize: "16px", fontWeight: 700, color: c.textColor, fontFamily: "monospace" }}>{c.pct}% ➔</span>
              </div>
            ))}
          </div>
        </div>

        {/* Khối Bento cấu trúc giá phía dưới */}
        <div style={{ background: COLORS.glassPanel, border: `1px solid ${COLORS.border}`, borderRadius: "20px", padding: "24px" }}>
          <div style={{ fontSize: "15px", fontWeight: 600, color: COLORS.text, marginBottom: "16px" }}>Cấu trúc phân phối chỉ số giá bán thị trường</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
            {priceStats.map((s, i) => (
              <div key={i} style={{ background: "#F9FAFB", padding: "16px 20px", borderRadius: "12px", border: `1px solid ${COLORS.border}` }}>
                <div style={{ fontSize: "12px", color: COLORS.textMuted, marginBottom: "4px" }}>{s.label}</div>
                <div style={{ fontSize: "22px", fontWeight: 700, color: COLORS.text }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    ),
    warehouse: (
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
          <div style={{ background: COLORS.pastelBlue, padding: "24px", borderRadius: "20px", border: `1px solid ${COLORS.border}` }}>
            <div style={{ fontSize: "12px", color: COLORS.textMuted }}>Mô hình kho</div>
            <div style={{ fontSize: "18px", fontWeight: 700, color: "#1E40AF", marginTop: "8px" }}>1 Bảng dữ kiện chính</div>
          </div>
          <div style={{ background: COLORS.pastelPurple, padding: "24px", borderRadius: "20px", border: `1px solid ${COLORS.border}` }}>
            <div style={{ fontSize: "12px", color: COLORS.textMuted }}>Kiến trúc sơ đồ hình sao</div>
            <div style={{ fontSize: "18px", fontWeight: 700, color: "#6B21A8", marginTop: "8px" }}>4 Chiều liên kết đa chiều</div>
          </div>
          <div style={{ background: COLORS.pastelOrange, padding: "24px", borderRadius: "20px", border: `1px solid ${COLORS.border}` }}>
            <div style={{ fontSize: "12px", color: COLORS.textMuted }}>Quy mô xử lý trích xuất</div>
            <div style={{ fontSize: "18px", fontWeight: 700, color: "#9A3412", marginTop: "8px" }}>1,000,000 Dòng ghi nhận</div>
          </div>
          <div style={{ background: COLORS.pastelPink, padding: "24px", borderRadius: "20px", border: `1px solid ${COLORS.border}` }}>
            <div style={{ fontSize: "12px", color: COLORS.textMuted }}>Chu kỳ thời gian tích hợp</div>
            <div style={{ fontSize: "18px", fontWeight: 700, color: "#9D174D", marginTop: "8px" }}>Tháng 10 & 11 năm 2019</div>
          </div>
        </div>

        <div style={{ background: COLORS.glassPanel, border: `1px solid ${COLORS.border}`, borderRadius: "24px", padding: "32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr 1fr", gap: "24px", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ background: COLORS.pastelBlue, padding: "16px", borderRadius: "12px", border: `1px solid ${COLORS.border}` }}>
                <div style={{ color: "#1E40AF", fontWeight: "600", fontSize: "13px" }}>Chiều Thương hiệu</div>
              </div>
              <div style={{ background: COLORS.pastelPurple, padding: "16px", borderRadius: "12px", border: `1px solid ${COLORS.border}` }}>
                <div style={{ color: "#6B21A8", fontWeight: "600", fontSize: "13px" }}>Chiều Ngành hàng</div>
              </div>
            </div>
            <div style={{ border: `1px solid ${COLORS.border}`, background: "linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)", padding: "24px", borderRadius: "16px", textAlign: "center" }}>
              <div style={{ color: COLORS.text, fontWeight: 700, fontSize: "14px", marginBottom: "8px" }}>Bảng dữ kiện kho (Fact)</div>
              <div style={{ fontSize: "12px", color: COLORS.textMuted }}>Tích hợp toàn bộ khóa ngoại và chỉ số đo lường</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ background: COLORS.pastelOrange, padding: "16px", borderRadius: "12px", border: `1px solid ${COLORS.border}` }}>
                <div style={{ color: "#9A3412", fontWeight: "600", fontSize: "13px" }}>Chiều Thứ trong tuần</div>
              </div>
              <div style={{ background: COLORS.pastelPink, padding: "16px", borderRadius: "12px", border: `1px solid ${COLORS.border}` }}>
                <div style={{ color: "#9D174D", fontWeight: "600", fontSize: "13px" }}>Chiều Khung giờ</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    iceberg: (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", height: "100%" }}>
        <div style={{ background: COLORS.glassPanel, border: `1px solid ${COLORS.border}`, borderRadius: "20px", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <div style={{ display: "flex", flex: 1, alignItems: "center", gap: 16, background: "#F9FAFB", padding: "12px 20px", border: `1px solid ${COLORS.border}`, borderRadius: "12px" }}>
              <span style={{ fontSize: "12px", color: COLORS.textMuted }}>Ngưỡng hỗ trợ thiết lập:</span>
              <input type="range" min="0.010" max="0.015" step="0.001" value={icebergThreshold} onChange={e => setIcebergThreshold(parseFloat(e.target.value))} style={{ flex: 1, accentColor: "#1F6FEB" }} />
              <span style={{ color: COLORS.text, fontWeight: "bold", fontSize: "15px" }}>{icebergThreshold.toFixed(3)}</span>
            </div>
            <div style={{ background: "linear-gradient(90deg, #FFFBEB 0%, #FEF3C7 100%)", padding: "12px 20px", fontSize: "12px", color: "#B45309", borderRadius: "12px", fontWeight: 500, border: "1px solid #FDE68A" }}>
              Điều kiện: Đơn chốt thành công ≥ 500 & Doanh thu ≥ $10,000 USD
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
          {icebergCube.map((row, i) => (
            <div key={i} style={{ background: row.bg, borderRadius: "20px", padding: "20px", border: `1px solid ${COLORS.border}`, display: "flex", flexDirection: "column", gap: "8px" }} className="bento-hover">
              <div style={{ fontSize: "11px", color: COLORS.textMuted, fontFamily: "monospace" }}>{row.dim}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                <span style={{ fontSize: "13px", color: COLORS.text, fontWeight: "bold" }}>Hỗ trợ: {row.support}</span>
                <span style={{ fontSize: "14px", color: "#10B981", fontWeight: 700 }}>{row.revenue} USD</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    mining: (
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div style={{ background: COLORS.glassPanel, border: `1px solid ${COLORS.border}`, borderRadius: "24px", padding: "28px" }}>
          <div style={{ fontSize: "15px", fontWeight: 600, color: COLORS.text, marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Hệ thống phân tích tương quan quy luật hành vi mua sắm chéo
          </div>
          
          <div style={{ display: "flex", gap: "20px", alignItems: "center", marginBottom: "12px" }}>
            {/* Dropdown chọn thương hiệu A */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", color: COLORS.textMuted, fontWeight: 500 }}>Thương hiệu tiền đề thứ nhất:</label>
              <select value={brandA} onChange={(e) => { setBrandA(e.target.value); setActiveMiningResult(null); }} style={{ padding: "10px 14px", borderRadius: "12px", border: `1px solid ${COLORS.border}`, background: "#FFFFFF", fontSize: "13px", color: COLORS.text, outline: "none" }}>
                <option value="Huawei">Huawei</option>
                <option value="Xiaomi">Xiaomi</option>
                <option value="Apple">Apple</option>
                <option value="Samsung">Samsung</option>
              </select>
            </div>

            <div style={{ fontSize: "16px", color: COLORS.textMuted, marginTop: "20px", fontWeight: "bold" }}>➔</div>

            {/* Dropdown chọn thương hiệu B */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", color: COLORS.textMuted, fontWeight: 500 }}>Thương hiệu hệ quả thứ hai:</label>
              <select value={brandB} onChange={(e) => { setBrandB(e.target.value); setActiveMiningResult(null); }} style={{ padding: "10px 14px", borderRadius: "12px", border: `1px solid ${COLORS.border}`, background: "#FFFFFF", fontSize: "13px", color: COLORS.text, outline: "none" }}>
                <option value="Xiaomi">Xiaomi</option>
                <option value="Huawei">Huawei</option>
                <option value="Samsung">Samsung</option>
                <option value="Apple">Apple</option>
              </select>
            </div>

            {/* Nút bấm chạy khai phá */}
            <button 
              onClick={handleRunMining}
              style={{
                alignSelf: "flex-end", padding: "11px 28px", borderRadius: "12px", border: "none", background: COLORS.primaryGradient, color: "#FFFFFF", fontSize: "13px", fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 15px rgba(0, 240, 255, 0.2)"
              }}
            >
              Khởi chạy khai phá
            </button>
          </div>
        </div>

        {/* Kết quả chỉ xuất hiện khi nhấn nút */}
        {activeMiningResult && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", animation: "fadeIn 0.4s ease" }}>
            <div style={{ display: "flex", gap: "20px" }}>
              <div style={{ background: COLORS.pastelBlue, padding: "20px", borderRadius: "16px", border: `1px solid ${COLORS.border}`, flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: "12px", color: COLORS.textMuted }}>Độ hỗ trợ</div>
                <div style={{ fontSize: "22px", fontWeight: 700, color: "#1E40AF", marginTop: "4px" }}>{activeMiningResult.sup}</div>
              </div>
              <div style={{ background: COLORS.pastelPurple, padding: "20px", borderRadius: "16px", border: `1px solid ${COLORS.border}`, flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: "12px", color: COLORS.textMuted }}>Độ tin cậy</div>
                <div style={{ fontSize: "22px", fontWeight: 700, color: "#6B21A8", marginTop: "4px" }}>{activeMiningResult.conf}</div>
              </div>
              <div style={{ background: COLORS.pastelOrange, padding: "20px", borderRadius: "16px", border: `1px solid ${COLORS.border}`, flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: "12px", color: COLORS.textMuted }}>Độ nâng cao</div>
                <div style={{ fontSize: "22px", fontWeight: 700, color: "#9A3412", marginTop: "4px" }}>{activeMiningResult.lift}</div>
              </div>
            </div>

            <div style={{ background: "#FFFFFF", border: `1px solid ${COLORS.border}`, borderRadius: "16px", padding: "24px", borderLeft: "4px solid #1F6FEB" }}>
              <div style={{ fontSize: "13px", fontWeight: "bold", color: COLORS.text, marginBottom: "8px" }}>
                Nhận xét chiến lược điều hành (Mối liên kết {activeMiningResult.brandA} và {activeMiningResult.brandB}):
              </div>
              <p style={{ fontSize: "13px", color: COLORS.textMuted, lineHeight: "1.6", margin: 0 }}>
                {activeMiningResult.comment}
              </p>
            </div>
          </div>
        )}
      </div>
    ),
    cluster: (
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
          {clusterData.map((c, i) => {
            const isClusterActive = selectedCluster === c.id;
            return (
              <div 
                key={i} 
                onClick={() => setSelectedCluster(isClusterActive ? null : c.id)}
                style={{ 
                  background: c.grad, 
                  border: isClusterActive ? `2px solid ${c.stroke}` : `1px solid ${COLORS.border}`, 
                  borderRadius: "20px", 
                  padding: "24px",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                className="bento-hover"
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "15px", fontWeight: "bold", color: COLORS.text }}>{c.name}</span>
                  <span style={{ fontSize: "11px", color: COLORS.textMuted, fontWeight: "bold", background: "#FFFFFF", padding: "3px 10px", borderRadius: "6px", border: "1px solid #E5E7EB" }}>
                    {isClusterActive ? "Thu gọn ▲" : "Xem thông số ▼"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {selectedCluster && (
          <div style={{ 
            background: "#FFFFFF", 
            border: `1px solid ${COLORS.border}`, 
            borderRadius: "24px", 
            padding: "28px",
            animation: "fadeIn 0.3s ease-out",
            borderLeft: `4px solid ${clusterData.find(c => c.id === selectedCluster)?.stroke}`
          }}>
            <div style={{ fontSize: "14px", fontWeight: "bold", color: COLORS.text, marginBottom: "16px", textTransform: "uppercase" }}>
              Hồ sơ phân tích chi tiết: {clusterData.find(c => c.id === selectedCluster)?.name}
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "20px" }}>
              <div style={{ background: "#F9FAFB", padding: "12px", borderRadius: "10px", border: `1px solid ${COLORS.border}`, textAlign: "center" }}>
                <div style={{ fontSize: "11px", color: COLORS.textMuted, marginBottom: "4px" }}>Quy mô cụm</div>
                <div style={{ fontSize: "14px", fontWeight: "bold", color: COLORS.text }}>{clusterData.find(c => c.id === selectedCluster)?.size}</div>
              </div>
              <div style={{ background: "#F9FAFB", padding: "12px", borderRadius: "10px", border: `1px solid ${COLORS.border}`, textAlign: "center" }}>
                <div style={{ fontSize: "11px", color: COLORS.textMuted, marginBottom: "4px" }}>Giá đơn trung bình</div>
                <div style={{ fontSize: "14px", fontWeight: "bold", color: COLORS.text }}>{clusterData.find(c => c.id === selectedCluster)?.ticket}</div>
              </div>
              <div style={{ background: "#F9FAFB", padding: "12px", borderRadius: "10px", border: `1px solid ${COLORS.border}`, textAlign: "center" }}>
                <div style={{ fontSize: "11px", color: COLORS.textMuted, marginBottom: "4px" }}>Tỷ lệ mua hàng</div>
                <div style={{ fontSize: "14px", fontWeight: "bold", color: COLORS.text }}>{clusterData.find(c => c.id === selectedCluster)?.conversion}</div>
              </div>
            </div>

            <div style={{ background: "#F9FAFB", padding: "16px", borderRadius: "12px", border: `1px solid ${COLORS.border}` }}>
              <div style={{ fontSize: "12px", fontWeight: "bold", color: COLORS.text, marginBottom: "6px" }}>Chiến lược điều phối kinh doanh đề xuất:</div>
              <div style={{ fontSize: "13px", color: COLORS.textMuted, lineHeight: "1.5" }}>
                {clusterData.find(c => c.id === selectedCluster)?.strategy}
              </div>
            </div>
          </div>
        )}
      </div>
    ),
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: COLORS.bg, padding: "20px", justifyContent: "center", alignItems: "center", position: "relative" }}>
      <div style={{ 
        display: "flex", 
        width: "100vw",
        minHeight: "100vh", 
        background: COLORS.innerBg, 
        overflow: "hidden"
      }}>
        
        {/* Sidebar điều hướng */}
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
              <button key={n.id} onClick={() => { setActiveNav(n.id); setActiveMiningResult(null); setSelectedCluster(null); }} style={{
                width: "100%", padding: "14px 20px", border: "none", borderRadius: "20px 0 0 20px", cursor: "pointer", fontSize: "13px", fontWeight: activeNav === n.id ? 600 : 400, textAlign: "left",
                background: activeNav === n.id ? COLORS.innerBg : "transparent",
                color: activeNav === n.id ? COLORS.primaryText : COLORS.textMuted,
                boxShadow: activeNav === n.id ? "-5px 5px 15px rgba(0,0,0,0.02)" : "none",
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
        
        {/* Vùng Content Chính */}
        <div style={{ flex: 1, padding: "40px 48px", overflowY: "auto", boxSizing: "border-box" }}>
          {sections[activeNav]}
        </div>
      </div>

      {/* CỬA SỔ POPUP TẬP TRUNG CHI TIẾT NGÀNH HÀNG GỘP (MODAL OVERLAY) */}
      {selectedCategoryPopup && (
        <div 
          onClick={() => setSelectedCategoryPopup(null)}
          style={{
            position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 999,
            background: "rgba(11, 15, 25, 0.4)", backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)", display: "flex", justifyContent: "center", alignItems: "center",
            animation: "fadeIn 0.2s ease-out"
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

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
              {selectedCategoryPopup.brands.map((b, idx) => (
                <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: COLORS.text, fontWeight: 500 }}>
                    <span>{b.name}</span>
                    <span style={{ fontFamily: "monospace", fontWeight: "bold" }}>{b.p}% thị phần</span>
                  </div>
                  <div style={{ height: "6px", background: "#E5E7EB", borderRadius: "3px" }}>
                    <div style={{ width: `${b.p}%`, height: "100%", background: COLORS.primaryGradient, borderRadius: "3px" }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setSelectedCategoryPopup(null)} style={{ background: COLORS.primaryGradient, color: "#FFFFFF", border: "none", padding: "10px 24px", borderRadius: "12px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                Đóng báo cáo
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .bento-hover:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.04) !important;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

    </div>
  );
}