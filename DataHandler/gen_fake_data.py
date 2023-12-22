"""
Generate a text file containing a fake purchase history.
For a period of 3 months (Oct 1 to Dec 31), generate a bunch of random purchases per day.
A purchase can contain 1 to 5 items. More items in a purchase is less likely.
Some times of day are more likely than others.
Some items are more likely to be purchased together than others.
The purchase history is saved in a text file.
Each line in the text file is a purchase.
Each purchase is the time of day, date, and list of items separated by a comma.
"""

import random
from datetime import datetime, timedelta
import json
import db_tools

inventory = json.load(open("data/inventory.json"))

# a list of common combinations of items that are purchased together
common_combinations = [
    ["Vicks Vaporub", "Sudafed Max"],
    ["E45 Psoriasis cream", "Eurax Skin cream", "Dermalex Eczema cream"],
    ["Nurofen Meltlets", "Dioralyte Blackcurrant"],
    ["Dioralyte Blackcurrant", "Beconase Relief"],
    ["TCP Liquid", "Beconase Relief"]
]

# the probability of a purchase at a given time of day
purchase_frequency_time_of_day = {
    "0:00" : 0.04,
    "1:00" : 0.02,
    "2:00" : 0.01,
    "3:00" : 0.01,
    "4:00" : 0.01,
    "5:00" : 0.01,
    "6:00" : 0.01,
    "7:00" : 0.04,
    "8:00" : 0.07,
    "9:00" : 0.09,
    "10:00" : 0.11,
    "11:00" : 0.12,
    "12:00" : 0.12,
    "13:00" : 0.12,
    "14:00" : 0.11,
    "15:00" : 0.10,
    "16:00" : 0.09,
    "17:00" : 0.08,
    "18:00" : 0.07,
    "19:00" : 0.06,
    "20:00" : 0.05,
    "21:00" : 0.04,
    "22:00" : 0.03,
    "23:00" : 0.03
}

# the period is from Oct 1 to Dec 31
start_date = datetime(2023, 10, 1)
end_date = datetime(2023, 12, 31)

def daterange(start_date, end_date):
    """
    A generator that returns a date for each day in a given range.
    """
    for n in range(int((end_date - start_date).days)):
        yield start_date + timedelta(n)

def generate_fake_data():
    """
    Generate a text file containing a fake purchase history.
    """
    database = "data/test_data.db"

    # Create a database connection
    conn = db_tools.create_connection(database)

    # Create table
    if conn is not None:
        db_tools.create_table(conn)
    else:
        print("Error! Cannot create the database connection.")
        return

    # Add purchases
    for date in daterange(start_date, end_date):
        num_purchases = random.randint(5, 30)
        for i in range(num_purchases):
            time_of_day = random.choices(
                list(purchase_frequency_time_of_day.keys()),
                list(purchase_frequency_time_of_day.values())
            )[0]
            items = []
            num_items = random.randint(1, 5)
            for j in range(num_items):
                if random.random() < 0.4:
                    # 20% chance of buying a common combination of items
                    items += random.choice(common_combinations)
                else:
                    # 80% chance of buying a random item
                    category = random.choice(list(inventory.keys()))
                    items.append(random.choice(inventory[category]))
            date_str = date.strftime("%Y-%m-%d")
            items_str = ", ".join(items) if len(items) > 1 else items[0]
            purchase_data = (date_str, time_of_day, items_str)
            db_tools.add_purchase(conn, purchase_data)

    # Close the connection
    conn.close()

if __name__ == "__main__":
    generate_fake_data()
