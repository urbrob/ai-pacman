from random import randint
from pymongo import MongoClient
client = MongoClient("mongodb://root:pass@mongodb:27017/db?authSource=admin")
db = client.db.move

def generate_position():
    return {"x": randint(0, 100), "y": randint(0, 100)}

def generate_direction():
    moves = ["a", "s", "w", "d"]
    return moves[randint(0, 3)]

for _ in range(10000):
    db.insert_one({
        'pacman': generate_position(),
        'ghost_1': generate_position(),
        'ghost_2': generate_position(),
        'ghost_3': generate_position(),
        'ghost_4': generate_position(),
        'direction': generate_direction()
    })
