import sqlite3
from sqlite3 import Error
import json
from typing import List

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()
# Add CORS middleware to allow connections from any origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

DB_PATH = "data/test_data.db"
INVENTORY_PATH = "data/inventory.json"

# Database connection
def get_db_connection():
    """ Create a database connection to a SQLite database """
    try:
        conn = sqlite3.connect(DB_PATH)
        return conn
    except Error as e:
        print(f"Error connecting to database: {e}")
        return None

# Create table if it doesn't exist
def create_table(conn):
    """ Create a table """
    try:
        sql = ''' CREATE TABLE IF NOT EXISTS purchases (
                    id INTEGER PRIMARY KEY,
                    purchase_date TEXT NOT NULL,
                    purchase_time TEXT NOT NULL,
                    items TEXT NOT NULL
                  ); '''
        cursor = conn.cursor()
        cursor.execute(sql)
    except Error as e:
        print(e)

# Pydantic model for purchase data
class NewPurchase(BaseModel):
    purchase_date: str
    purchase_time: str
    items: str

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/item_names/")
async def get_item_names():
    inventory = dict()
    with open(INVENTORY_PATH, "r", encoding="utf-8") as f:
        inventory = json.load(f)
    return inventory

@app.post("/purchases/")
async def add_purchase(purchase: NewPurchase):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO purchases (purchase_date, purchase_time, items) VALUES (?, ?, ?)',
                   (purchase.purchase_date, purchase.purchase_time, purchase.items))
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return {"id": new_id}

@app.get("/purchase_history/")
async def get_item_history(
    item_name: str = Query(""),
    checked_items: List[str] = Query([]),
    start_date: str = Query(""),
    end_date: str = Query("")
):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Initialize an empty SQL query
    sql = "SELECT * FROM purchases"

    conditions = []

    # Add conditions based on query parameters
    if item_name != "":
        conditions.append(f"items LIKE '%{item_name}%'")
    elif checked_items != []:
        conditions.append(" OR ".join([f"items LIKE '%{item}%'" for item in checked_items]))

    # Combine conditions with AND
    if conditions:
        if start_date:
            conditions.append(f"purchase_date >= '{start_date}'")
        if end_date:
            conditions.append(f"purchase_date <= '{end_date}'")
        sql += " WHERE " + " AND ".join(conditions) + ";"
    else:
        # If both item_name and checked_items are empty, return all zeros
        return {f"{hour}:00": 0 for hour in range(24)}

    cursor.execute(sql)
    rows = cursor.fetchall()
    conn.close()

    # Count purchases at each hour of the day
    purchases = {}
    for row in rows:
        time = row[2]
        hour = time.split(":")[0]
        purchases[hour] = purchases.get(hour, 0) + 1

    # Format the result
    purchases_formatted = {
        f"{hour}:00": purchases.get(str(hour), 0) for hour in range(24)
    }

    return purchases_formatted
