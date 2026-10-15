"""API tests: run the real handler on a random port against a throwaway SQLite file."""
import json
import os
import sys
import tempfile
import threading
import unittest
from http.server import ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request, urlopen

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import server


class QuietHandler(server.Handler):
    def log_message(self, *args):
        pass


class ServerTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.TemporaryDirectory()
        server.DB_PATH = os.path.join(cls.tmp.name, "test.db")
        server.init_db()
        cls.httpd = ThreadingHTTPServer(("127.0.0.1", 0), QuietHandler)
        cls.base = f"http://127.0.0.1:{cls.httpd.server_port}"
        threading.Thread(target=cls.httpd.serve_forever, daemon=True).start()

    @classmethod
    def tearDownClass(cls):
        cls.httpd.shutdown()
        cls.httpd.server_close()
        cls.tmp.cleanup()

    def setUp(self):
        server.run("DELETE FROM countdowns")

    def request(self, method, path, body=None):
        data = json.dumps(body).encode() if body is not None else None
        req = Request(self.base + path, data=data, method=method,
                      headers={"Content-Type": "application/json"} if data else {})
        try:
            with urlopen(req) as r:
                raw = r.read()
                return r.status, json.loads(raw) if raw else None
        except HTTPError as e:
            raw = e.read()
            return e.code, json.loads(raw) if raw else None

    def create(self, **overrides):
        body = {"title": "Trip", "target": "2030-01-01", "start": "2029-01-01", **overrides}
        status, item = self.request("POST", "/api/countdowns", body)
        self.assertEqual(status, 201, item)
        return item

    def test_index_served(self):
        with urlopen(self.base + "/") as r:
            self.assertEqual(r.status, 200)
            self.assertIn("text/html", r.headers["Content-Type"])
            self.assertIn(b"<title>Countdwn</title>", r.read())

    def test_list_empty(self):
        self.assertEqual(self.request("GET", "/api/countdowns"), (200, []))

    def test_create_and_list(self):
        item = self.create()
        self.assertEqual(item, {"id": item["id"], "title": "Trip", "target": "2030-01-01", "start": "2029-01-01"})
        self.assertEqual(self.request("GET", "/api/countdowns"), (200, [item]))

    def test_list_sorted_by_target(self):
        later = self.create(title="Later", target="2031-01-01")
        sooner = self.create(title="Sooner", target="2030-06-01")
        _, rows = self.request("GET", "/api/countdowns")
        self.assertEqual([r["id"] for r in rows], [sooner["id"], later["id"]])

    def test_create_trims_title_and_defaults_start(self):
        _, item = self.request("POST", "/api/countdowns", {"title": "  Trip  ", "target": "2999-01-01"})
        self.assertEqual(item["title"], "Trip")
        self.assertRegex(item["start"], r"^\d{4}-\d{2}-\d{2}$")

    def test_create_validation(self):
        cases = [
            {"title": "", "target": "2030-01-01"},
            {"title": "x" * 201, "target": "2030-01-01"},
            {"title": "Trip", "target": "not-a-date"},
            {"title": "Trip", "target": "2030-01-01", "start": "2031-01-01"},
            ["not", "an", "object"],
        ]
        for body in cases:
            with self.subTest(body=body):
                status, resp = self.request("POST", "/api/countdowns", body)
                self.assertEqual(status, 400)
                self.assertIn("error", resp)

    def test_update(self):
        item = self.create()
        status, updated = self.request("PUT", f"/api/countdowns/{item['id']}",
                                       {"title": "Renamed", "target": "2030-02-01", "start": "2029-01-01"})
        self.assertEqual(status, 200)
        self.assertEqual(updated["title"], "Renamed")
        self.assertEqual(updated["target"], "2030-02-01")

    def test_update_missing(self):
        status, _ = self.request("PUT", "/api/countdowns/9999", {"title": "X", "target": "2030-01-01"})
        self.assertEqual(status, 404)

    def test_delete(self):
        item = self.create()
        self.assertEqual(self.request("DELETE", f"/api/countdowns/{item['id']}"), (204, None))
        self.assertEqual(self.request("GET", "/api/countdowns"), (200, []))
        self.assertEqual(self.request("DELETE", f"/api/countdowns/{item['id']}")[0], 404)

    def test_unknown_routes(self):
        self.assertEqual(self.request("GET", "/nope")[0], 404)
        self.assertEqual(self.request("POST", "/api/other", {})[0], 404)
        self.assertEqual(self.request("DELETE", "/api/countdowns/abc")[0], 404)


if __name__ == "__main__":
    unittest.main()
