from flask_pymongo import PyMongo
from typing import List
import os

mongo = None


class MongoHandler:
    def __init__(self, app):
        self.app = app

    def __get_mongo(self):
        global mongo

        if 'MONGO_URI' not in self.app.config:
            self.app.config["MONGO_URI"] = "mongodb://root:pass@mongodb:27017/db?authSource=admin"
        if not mongo:
            mongo = PyMongo(self.app)
        return mongo

    def get_all(self):
        return self.__get_mongo().db.move.find({})

    def add_one(self, data):
        return self.__get_mongo().db.move.insert_one(data)

    def add_many(self, data):
        return self.__get_mongo().db.move.insert_many(data)
