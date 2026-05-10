import pandas as pd
import io
from fastapi import HTTPException
from app.utils.normalizer import normalize_dataframe
from app.utils.categorizer import categorize_dataframe
from app.services.store import current_data

def process_csv_file(file_content: bytes, filename: str):
    """
    Reads CSV bytes, normalizes the data, and returns standard preview information.
    """
    try:
        # Read the bytes into a file-like object and parse with Pandas
        raw_df = pd.read_csv(io.BytesIO(file_content))
        
        if raw_df.empty:
            raise HTTPException(status_code=400, detail="The uploaded CSV file contains no data rows.")
            
        # --- NORMALIZE the data using our new utility ---
        df = normalize_dataframe(raw_df)
        
        # --- CATEGORIZE transactions based on description keywords ---
        df = categorize_dataframe(df)
        
        # --- STORE globally for analytics endpoints ---
        current_data["df"] = df
        current_data["filename"] = filename
        
        # Extract basic information from the normalized dataframe
        row_count = len(df)
        column_names = df.columns.tolist()
        
        # Calculate some quick high-level metrics
        total_income = float(df['credit'].sum())
        total_expense = float(df['debit'].sum())
        
        if total_income == 0 and total_expense == 0:
            raise ValueError("No financial columns (Amount, Debit, Credit) could be identified. Please ensure this is a valid bank statement.")
            
        # Get the first 10 rows for preview
        preview_df = df.head(10)
        preview_data = preview_df.to_dict(orient="records")
        
        return {
            "filename": filename,
            "row_count": row_count,
            "columns": column_names,
            "metrics": {
                "total_income": round(total_income, 2),
                "total_expense": round(total_expense, 2)
            },
            "preview": preview_data
        }
        
    except pd.errors.EmptyDataError:
        raise HTTPException(status_code=400, detail="The uploaded CSV file is completely empty or invalid.")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading or normalizing CSV file: {str(e)}")
