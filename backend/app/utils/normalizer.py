import pandas as pd
import numpy as np

# Common variations of bank statement column names mapped to our standard
COLUMN_MAPPINGS = {
    'date': ['date', 'transaction date', 'posting date', 'value date'],
    'description': ['description', 'narration', 'remarks', 'details', 'transaction details', 'payee'],
    'debit': ['debit', 'withdrawal', 'withdrawals', 'paid out', 'amount (-)', 'dr'],
    'credit': ['credit', 'deposit', 'deposits', 'paid in', 'amount (+)', 'cr'],
    'balance': ['balance', 'available balance', 'running balance'],
    # some banks just have 'amount' with positive/negative instead of debit/credit
    'amount_single': ['amount', 'transaction amount'] 
}

def clean_currency(series):
    """
    Removes currency symbols, commas, and spaces from a pandas Series,
    then converts it safely to float.
    """
    if series.dtype == 'object':
        # Remove $, £, €, commas, spaces using regex
        cleaned = series.astype(str).str.replace(r'[$,£€\s]', '', regex=True)
        # Convert empty strings to NaN
        cleaned = cleaned.replace('', np.nan)
        return pd.to_numeric(cleaned, errors='coerce').fillna(0.0)
    return pd.to_numeric(series, errors='coerce').fillna(0.0)

def normalize_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """
    Takes a raw pandas DataFrame from a bank CSV and normalizes its columns,
    data types, and formats into a standard schema.
    """
    # 1. Lowercase all columns and strip whitespace to make matching easier
    df.columns = df.columns.str.lower().str.strip()
    
    # Initialize with the same index to ensure we don't lose rows if columns don't match
    normalized_df = pd.DataFrame(index=df.index)
    
    # Helper to find matching column in the raw dataframe
    def find_column(target_names):
        for col in df.columns:
            if col in target_names:
                return col
        return None

    date_col = find_column(COLUMN_MAPPINGS['date'])
    desc_col = find_column(COLUMN_MAPPINGS['description'])
    debit_col = find_column(COLUMN_MAPPINGS['debit'])
    credit_col = find_column(COLUMN_MAPPINGS['credit'])
    bal_col = find_column(COLUMN_MAPPINGS['balance'])
    amt_col = find_column(COLUMN_MAPPINGS['amount_single'])

    # 2. Apply standard schema: DATE
    if date_col:
        # Parse dates and convert to standard YYYY-MM-DD string format
        normalized_df['date'] = pd.to_datetime(df[date_col], errors='coerce').dt.strftime('%Y-%m-%d')
    else:
        normalized_df['date'] = None

    # 3. Apply standard schema: DESCRIPTION
    if desc_col:
        normalized_df['description'] = df[desc_col].astype(str).str.strip()
    else:
        normalized_df['description'] = "Unknown Transaction"

    # 4. Apply standard schema: BALANCE
    if bal_col:
        normalized_df['balance'] = clean_currency(df[bal_col])
    else:
        normalized_df['balance'] = 0.0

    # 5. Handle AMOUNTS, DEBIT, CREDIT
    # Scenario A: Bank provides separate Debit and Credit columns
    if debit_col and credit_col:
        debit_series = clean_currency(df[debit_col])
        credit_series = clean_currency(df[credit_col])
        
        # Debits are absolute values in our schema
        normalized_df['debit'] = debit_series.abs()
        normalized_df['credit'] = credit_series.abs()
        
        # Single amount column: positive for credit, negative for debit
        normalized_df['amount'] = normalized_df['credit'] - normalized_df['debit']
        
    # Scenario B: Bank provides a single Amount column
    elif amt_col:
        amt_series = clean_currency(df[amt_col])
        normalized_df['amount'] = amt_series
        # Separate them out for the standard schema
        normalized_df['credit'] = amt_series.apply(lambda x: x if x > 0 else 0.0)
        normalized_df['debit'] = amt_series.apply(lambda x: abs(x) if x < 0 else 0.0)
        
    else:
        # Fallback if no financial columns are found
        normalized_df['amount'] = 0.0
        normalized_df['credit'] = 0.0
        normalized_df['debit'] = 0.0

    # 6. Determine TYPE
    normalized_df['type'] = normalized_df['amount'].apply(
        lambda x: 'income' if x > 0 else ('expense' if x < 0 else 'transfer')
    )
    
    # 7. Final cleaning: Handle NaNs for JSON serialization
    normalized_df = normalized_df.where(pd.notnull(normalized_df), None)
    
    # Rearrange columns to the requested standard schema order
    ordered_cols = ['date', 'description', 'debit', 'credit', 'amount', 'type', 'balance']
    normalized_df = normalized_df[ordered_cols]
    
    return normalized_df
