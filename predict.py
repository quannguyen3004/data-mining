import sys
import json
import joblib
import numpy as np
import pandas as pd
import warnings

warnings.filterwarnings("ignore", category=UserWarning)

def main():
    try:
        model = joblib.load('svm_final_model.joblib')
        scaler = joblib.load('data_scaler_combined.joblib')

        # Nhận mảng JSON thực tế do biến pythonProcess trong server.js truyền sang
        raw_input = sys.argv[1].strip()
        features_array = json.loads(raw_input)

        # Ánh xạ chính xác các đặc trưng thực tế từ DWH và Context thời gian thực
        price = float(features_array[0])
        hour = int(features_array[1])
        day_of_week = int(features_array[2])
        brand_encoded = int(features_array[3])
        category_code_encoded = int(features_array[4])

        feature_names = ['price', 'hour', 'day_of_week_encoded', 'brand_encoded', 'category_code_encoded']
        
        input_data = [price, hour, day_of_week, brand_encoded, category_code_encoded]
        features_df = pd.DataFrame([input_data], columns=feature_names)

        features_scaled = scaler.transform(features_df)
        decision_score = float(model.decision_function(features_scaled)[0])
        
        threshold = 0.0  
        is_purchase = 1 if decision_score >= threshold else 0

        output = {
            "success": True,
            "prediction": is_purchase,
            "confidence_score": round(decision_score, 4),
            "realtime_context": {
                "hour": hour,
                "day_of_week_encoded": day_of_week,
                "dynamic_price_applied": price
            }
        }
        print(json.dumps(output))

    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))

if __name__ == "__main__":
    main()