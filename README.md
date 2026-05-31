Preprocessing helper

This repository contains `preprocess.py` which performs basic preprocessing on CSV files in a directory:

- Missing value handling (numeric: median, categorical: mode)
- Outlier capping using IQR (1.5*IQR)
- Robust-style normalization (median / IQR)
- Categorical encoding (one-hot for <=10 unique, factorize for larger)

Usage:

```bash
python preprocess.py --input-dir . --output-dir cleaned
```

Cleaned CSVs will be saved in the `cleaned` folder.
----------------------------------
Initialize and Load the Data Warehouse (DWH) in the Local Environment:
- After successfully installing MySQL Server and activating the service on the default port 3306, executes the following SQL code segment to initialize the system database named ecommerce_dwh

CREATE DATABASE IF NOT EXISTS ecommerce_dwh;
USE ecommerce_dwh;

CREATE TABLE IF NOT EXISTS product_metadata (
    product_id BIGINT PRIMARY KEY,
    price DECIMAL(10, 2) NOT NULL,
    brand_encoded INT NOT NULL,
    category_code_encoded INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);