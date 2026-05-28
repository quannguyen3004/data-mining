import sys
import json
import joblib
import numpy as np
import pandas as pd  # Import thêm thư viện pandas để xử lý tên đặc trưng
import warnings

# Tắt các cảnh báo không cần thiết nếu có phát sinh ngầm định
warnings.filterwarnings("ignore", category=UserWarning)

def main():
    try:
        # Tải mô hình và bộ chuẩn hóa mang tri thức gộp từ pha huấn luyện
        model = joblib.load('svm_final_model.joblib')
        scaler = joblib.load('data_scaler_combined.joblib')

        # Tiếp nhận mảng dữ liệu đặc trưng tĩnh và động đẩy sang từ Node.js API
        input_features = json.loads(sys.argv[1])
        
        # Định nghĩa đúng danh sách tên các đặc trưng theo thứ tự ma trận huấn luyện
        feature_names = ['price', 'hour', 'day_of_week_encoded', 'brand_encoded', 'category_code_encoded']
        
        # Ép kiểu dữ liệu mảng đầu vào thành cấu trúc Pandas DataFrame để khớp thuộc tính tên
        features_df = pd.DataFrame([input_features], columns=feature_names)

        # Thực hiện chuẩn hóa dữ liệu đầu vào (Không còn bị cảnh báo UserWarning)
        features_scaled = scaler.transform(features_df)

        # Tính toán biên độ khoảng cách siêu phẳng quyết định của LinearSVC
        decision_score = model.decision_function(features_scaled)[0]
        
        # Định nghĩa ngưỡng quyết định phân lớp nhị phân
        threshold = 0.0  
        is_purchase = 1 if decision_score >= threshold else 0

        # Phản hồi cấu trúc dữ liệu kết quả về cho Node.js API
        output = {
            "is_purchase": int(is_purchase),
            "confidence_score": float(decision_score)
        }
        print(json.dumps(output))

    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()