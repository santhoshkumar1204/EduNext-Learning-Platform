"""eduNext Flask attention-analysis server. Port 5001.

POST /analyze  { image: <base64>, studentId, sessionId }
  -> { emotion, attention_score, eye_status, head_pos }

Falls back to a pure-stdlib HTTP server if Flask isn't installed, so the
endpoint is always available during development.
"""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from video_analyzer import analyze_frame  # noqa: E402

PORT = 5001


def _handle(payload):
    image = payload.get("image", "")
    student_id = payload.get("studentId", "unknown")
    session_id = payload.get("sessionId", "session")
    if not image:
        return {"error": "no image provided"}, 400
    return analyze_frame(image, student_id, session_id), 200


# ---------- Preferred: Flask ----------
try:
    from flask import Flask, request, jsonify  # type: ignore
    from flask_cors import CORS  # type: ignore

    app = Flask(__name__)
    CORS(app)

    @app.route("/analyze", methods=["POST"])
    def analyze():
        data = request.get_json(force=True, silent=True) or {}
        result, status = _handle(data)
        return jsonify(result), status

    @app.route("/health")
    def health():
        return jsonify({"status": "ok"})

    if __name__ == "__main__":
        print(f"[eduNext] Flask attention server on http://localhost:{PORT}")
        app.run(host="0.0.0.0", port=PORT)

except ImportError:
    # ---------- Fallback: stdlib http.server ----------
    from http.server import BaseHTTPRequestHandler, HTTPServer

    class Handler(BaseHTTPRequestHandler):
        def _cors(self):
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type")

        def do_OPTIONS(self):
            self.send_response(204)
            self._cors()
            self.end_headers()

        def do_GET(self):
            self.send_response(200)
            self._cors()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "ok"}).encode())

        def do_POST(self):
            length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(length) if length else b"{}"
            try:
                payload = json.loads(body or b"{}")
            except Exception:
                payload = {}
            result, status = _handle(payload)
            self.send_response(status)
            self._cors()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())

        def log_message(self, *args):
            pass

    if __name__ == "__main__":
        print(f"[eduNext] stdlib attention server (Flask not installed) on http://localhost:{PORT}")
        HTTPServer(("0.0.0.0", PORT), Handler).serve_forever()
