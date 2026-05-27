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
