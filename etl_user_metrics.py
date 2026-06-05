import pandas as pd
import sqlalchemy
from sqlalchemy import create_engine

def run_etl_user_metrics():
    try:
        # 1. Đọc tệp dữ liệu thô (Hãy đổi '2019-Nov-Cleaned.csv' hoặc file thô của bạn cho đúng đường dẫn)
        print("--- Bắt đầu đọc tệp dữ liệu thô từ hệ thống ---")
        # Sử dụng thuộc tính usecols để chỉ bốc đúng cột user_id, giúp tiết kiệm RAM tối đa
        df_raw = pd.read_csv('2019-Nov-Cleaned.csv', usecols=['user_id'], dtype={'user_id': str})

        # 2. Xử lý dữ liệu: Gom nhóm theo user_id và đếm tổng số dòng sự kiện phát sinh
        print("Đang tính toán tổng số lượt tương tác tích lũy của từng user_id...")
        user_counts = df_raw.groupby('user_id').size().reset_index(name='interaction_score')

        # 3. Khởi tạo engine kết nối đến cơ sở dữ liệu MySQL của bạn
        print("Đang kết nối đến MySQL Data Warehouse...")
        engine = create_engine('mysql+pymysql://root:root@127.0.0.1:3306/ecommerce_dwh')

        # 4. Đẩy trực tiếp dữ liệu thật đã tổng hợp vào bảng phụ trong MySQL
        print(f"Đang tiến hành nạp {len(user_counts)} người dùng thực tế vào database...")
        user_counts.to_sql('user_interaction_metrics', con=engine, if_exists='append', index=False, chunksize=10000)
        print("-> ĐỒNG BỘ DỮ LIỆU THẬT THÀNH CÔNG! Bảng user_interaction_metrics đã sẵn sàng.")

    except Exception as e:
        print(f" Quá trình xử lý dữ liệu gặp lỗi: {e}")

if __name__ == "__main__":
    run_etl_user_metrics()