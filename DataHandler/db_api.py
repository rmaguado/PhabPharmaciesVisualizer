import sqlite3
from sqlite3 import Error
import json

from fastapi import FastAPI
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
class Purchase(BaseModel):
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
    return {"inventory":inventory}

@app.post("/purchases/")
async def add_purchase(purchase: Purchase):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO purchases (purchase_date, purchase_time, items) VALUES (?, ?, ?)',
                   (purchase.purchase_date, purchase.purchase_time, purchase.items))
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return {"id": new_id}
