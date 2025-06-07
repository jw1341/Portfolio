from dotenv import load_dotenv
import os
from sqlalchemy import create_engine
import pandas as pd

load_dotenv()  # Load the environment variables from .env

db_url = os.getenv("DATABASE_URL")
engine = create_engine(db_url)

csv_dir = "../"



for filename in os.listdir(csv_dir):
    if filename.endswith(".csv"):
        print(filename)
        csv_path = os.path.join(csv_dir, filename)
        table_name = os.path.splitext(filename)[0].lower()
        print(f"Inserting {filename} into table {table_name} ...")

        df = pd.read_csv(csv_path)
        df.to_sql(table_name, engine, if_exists="append", index=False)

print("All CSVs uploaded successfully")
