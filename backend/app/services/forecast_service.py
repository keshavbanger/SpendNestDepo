import pandas as pd

def get_income_forecast(df: pd.DataFrame) -> dict:
    """
    Predicts next month's income using a Simple Moving Average (SMA)
    of up to the last 3 recorded months.
    """
    # 1. Gracefully handle empty or invalid data
    if df is None or df.empty or 'date' not in df.columns:
        return {"historical_income": [], "predicted_month": "Unknown", "predicted_income": 0.0}
        
    temp_df = df.copy()
    temp_df['date'] = pd.to_datetime(temp_df['date'], errors='coerce')
    temp_df = temp_df.dropna(subset=['date'])
    
    if temp_df.empty:
        return {"historical_income": [], "predicted_month": "Unknown", "predicted_income": 0.0}
        
    # 2. Extract and format the month period (e.g., 2023-01)
    temp_df['month_sort'] = temp_df['date'].dt.to_period('M')
    
    # 3. Filter only income transactions and group them by month
    income_df = temp_df[temp_df['type'] == 'income']
    monthly_income = income_df.groupby('month_sort')['amount'].sum().reset_index()
    monthly_income = monthly_income.sort_values(by='month_sort')
    
    # Build historical data array for the frontend
    historical_data = []
    for _, row in monthly_income.iterrows():
        historical_data.append({
            "month": row['month_sort'].strftime('%b %Y'),
            "income": round(float(row['amount']), 2)
        })
        
    # Determine what "next month" should be labelled as based on latest transaction
    last_overall_period = temp_df['month_sort'].max()
    next_period = last_overall_period + 1
    predicted_month_label = next_period.strftime('%b %Y')

    if not historical_data:
        return {
            "historical_income": [],
            "predicted_month": predicted_month_label,
            "predicted_income": 0.0
        }
        
    # 4. Grab up to the last 3 months
    recent_months = historical_data[-3:]
    
    # 5. Calculate the Simple Moving Average
    total_recent_income = sum(item['income'] for item in recent_months)
    average_income = total_recent_income / len(recent_months)
    
    return {
        "historical_income": historical_data,
        "predicted_month": predicted_month_label,
        "predicted_income": round(average_income, 2)
    }
