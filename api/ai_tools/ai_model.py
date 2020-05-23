from pymongo import MongoClient
from tensorflow.keras.datasets import mnist
from tensorflow.keras import  models, layers
from tensorflow.keras.utils import to_categorical
from numpy import array

direction_map = {"w": 1, "s": 0, "d": 2, "a": 3}
def format_database_data_to_list(cursor):

    formated_data_x = []
    formated_data_y = []
    for row in cursor:
        formated_data_x.append([
            row["pacman"]["x"],
            row["pacman"]["y"],
            row["ghost_1"]["x"],
            row["ghost_1"]["y"],
            row["ghost_2"]["x"],
            row["ghost_2"]["y"],
            row["ghost_3"]["x"],
            row["ghost_3"]["y"],
            row["ghost_4"]["x"],
            row["ghost_4"]["y"],
        ])

        formated_data_y.append(direction_map[row["direction"]])
    return formated_data_x, formated_data_y


client = MongoClient("mongodb://root:pass@mongodb:27017/db?authSource=admin")
db = client.db.move
database_records = db.find({})
data_x, data_y = format_database_data_to_list(database_records)

data_x = array(data_x)
data_y = to_categorical(data_y)
model = models.Sequential()
model.add(layers.Dense(512, activation="relu", input_shape=(10,)))
model.add(layers.Dense(4, activation="softmax"))
model.compile(optimizer="rmsprop", loss="categorical_crossentropy", metrics=["accuracy"])
model.fit(data_x, data_y, epochs=35, batch_size=128)
model.save("pacman.h5")
