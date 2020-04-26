import unittest
import os

from app import app

from mockupdb import MockupDB, go, Command
from pymongo import MongoClient
from mockupdb._bson import ObjectId as mockup_oid
from json import dumps


class GetDataSourceTestCase(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.server = MockupDB(auto_ismaster=True, verbose=True)
        self.server.run()
        app.testing = True
        app.config["MONGO_URI"] = self.server.uri
        self.app = app.test_client()

    @classmethod
    def tearDownClass(self):
        self.server.stop()

    def test_addDataSource(self):
        id = "5a924d7a29a6e5484dcf68be"
        headers = [("Content-Type", "application/json")]
        toInsert = {"data": [[1, 2, 3, 4], [1, 2, 3, 4]]}
        future = go(self.app.post, "/api/save_move",
                    data=dumps(toInsert), headers=headers)
        request = self.server.receives(
            Command({
                "insert": "move",
                "ordered": True,
                "documents": [{"name": "new", "_id": mockup_oid(id)}]
            }, namespace="app"))
        request.ok(cursor={"status": "OK"})

        # act
        http_response = future()

        # assert
        data = http_response.get_data(as_text=True)
        self.assertIn(id, data)
        self.assertEqual(http_response.status_code, 201)
