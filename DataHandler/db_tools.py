import sqlite3
from sqlite3 import Error

def create_connection(db_file):
    """ Create a database connection to a SQLite database """
    try:
        conn = sqlite3.connect(db_file)
        return conn
    except Error as e:
        print(f"Error connecting to database: {e}")
        return None

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

def add_purchase(conn, purchase):
    """ Add a new purchase to the purchases table """
    sql = ''' INSERT INTO purchases(purchase_date, purchase_time, items)
              VALUES(?,?,?) '''
    try:
        cursor = conn.cursor()
        cursor.execute(sql, purchase)
        conn.commit()
        return cursor.lastrowid
    except Error as e:
        print(e)
        return None

def count_products(
        conn,
        start_date=None, end_date=None,
        start_time=None, end_time=None,
        items=None
    ):
    if conn is None:
        return {}

    query = "SELECT items FROM purchases WHERE 1=1"
    params = []

    if start_date and end_date:
        query += " AND purchase_date BETWEEN ? AND ?"
        params.extend([start_date, end_date])

    if start_time and end_time:
        query += " AND purchase_time BETWEEN ? AND ?"
        params.extend([start_time, end_time])

    try:
        with conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            rows = cursor.fetchall()
    except Error as e:
        print(f"Error executing query: {e}")
        return {}

    # Count items
    item_count = {}
    for row in rows:
        row_items = row[0].split(', ')
        for item in row_items:
            if items is None or item in items:
                if item in item_count:
                    item_count[item] += 1
                else:
                    item_count[item] = 1

    return item_count
