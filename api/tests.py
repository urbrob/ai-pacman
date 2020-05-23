import unittest
import json
from flask_testing import TestCase
from app import create_app


class ApiTestCase(TestCase):
    def create_app(self):
        self.app, self.db = create_app(testing=True)
        self.app.config["TESTING"] = True
        self.app.config["PRESERVE_CONTEXT_ON_EXCEPTION"] = False
        return self.app

    def setUp(self):
        self.payload = {
            "pacman": {"x": 1, "y": 2},
            "ghost_1": {"x": 1, "y": 2},
            "ghost_2": {"x": 1, "y": 2},
            "ghost_3": {"x": 1, "y": 2},
            "ghost_4": {"x": 1, "y": 2},
            "ghost_5": {"x": 1, "y": 2}
        }

    def tearDown(self):
        self.db.remove_all()

    def test_debug(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, b"")

    def test_save_data_with_empty_post(self):
        response = self.client.post("/api/save_move")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json['status'], "Missing request body")

    def test_save_data_with_payload(self):
        response = self.client.post("/api/save_move", json=self.payload, content_type='application/json')
        self.assertEqual(response.json['status'], "OK")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.db.get_all().count(), 1)

    def test_save_data_with_incorrect_payload(self):
        self.payload = {
            "pacman": {"x": 1, "y": 2},
            "ghost_1": {"x": 1, "y": 2},
            "ghost_2": {"x": 1, "y": 2},
            "ghost_3": {"x": 1, "y": 2},
            "ghost_5": {"x": 1, "y": 2}
        }
        response = self.client.post("/api/save_move", json=self.payload, content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json['status'], "'ghost_4' is a required property")
        self.assertEqual(self.db.get_all().count(), 0)

if __name__ == "__main__":
    unittest.main()
