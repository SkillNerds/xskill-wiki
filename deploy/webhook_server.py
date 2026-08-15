#!/usr/bin/env python3
"""GitHub push webhook. HMAC 通过后后台跑 pull_and_deploy.sh。

只监听 docker bridge 网关，公网不直接暴露；由 nginx 把
https://xskill.wiki/_github-deploy 反代过来。
"""
import hashlib
import hmac
import json
import os
import subprocess
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

SECRET_FILE = os.environ.get(
    "XSKILL_WIKI_WEBHOOK_SECRET",
    "/home/admin/.config/xskill-wiki/webhook.secret",
)
DEPLOY = os.environ.get(
    "XSKILL_WIKI_DEPLOY_SH",
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "pull_and_deploy.sh"),
)
HOST = os.environ.get("XSKILL_WIKI_WEBHOOK_HOST", "10.255.1.1")
PORT = int(os.environ.get("XSKILL_WIKI_WEBHOOK_PORT", "8029"))
BRANCH = os.environ.get("XSKILL_WIKI_DEPLOY_BRANCH", "main")
MAX_BODY = 2_000_000


def load_secret():
    with open(SECRET_FILE, "rb") as fh:
        return fh.read().strip()


SECRET = load_secret()


def _run_deploy(after):
    print("deploy start after=%s" % after, flush=True)
    try:
        subprocess.run(["bash", DEPLOY], check=False)
    except Exception as exc:
        print("deploy error: %s" % exc, flush=True)


class Handler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def log_message(self, fmt, *args):
        print("%s - %s" % (self.address_string(), fmt % args), flush=True)

    def _send(self, code, obj):
        body = json.dumps(obj).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)

    def do_GET(self):
        self._send(404, {"error": "not found"})

    def do_HEAD(self):
        self._send(404, {"error": "not found"})

    def do_POST(self):
        path = self.path.split("?", 1)[0].rstrip("/") or "/"
        if path != "/_github-deploy":
            self._send(404, {"error": "not found"})
            return
        try:
            length = int(self.headers.get("Content-Length") or 0)
        except ValueError:
            self._send(400, {"error": "bad length"})
            return
        if length > MAX_BODY:
            self._send(413, {"error": "too large"})
            return
        body = self.rfile.read(length)
        sig = self.headers.get("X-Hub-Signature-256") or ""
        digest = hmac.new(SECRET, body, hashlib.sha256).hexdigest()
        expected = "sha256=" + digest
        if not hmac.compare_digest(expected, sig):
            self._send(401, {"error": "bad signature"})
            return
        event = self.headers.get("X-GitHub-Event") or ""
        if event == "ping":
            self._send(200, {"ok": True, "pong": True})
            return
        if event != "push":
            self._send(200, {"ok": True, "ignored": event})
            return
        try:
            payload = json.loads(body.decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError):
            self._send(400, {"error": "bad json"})
            return
        ref = payload.get("ref") or ""
        if ref != "refs/heads/%s" % BRANCH:
            self._send(200, {"ok": True, "ignored": ref})
            return
        after = payload.get("after") or ""
        threading.Thread(target=_run_deploy, args=(after,), daemon=True).start()
        self._send(202, {"ok": True, "accepted": after})


def main():
    httpd = ThreadingHTTPServer((HOST, PORT), Handler)
    print("webhook on http://%s:%s/_github-deploy" % (HOST, PORT), flush=True)
    httpd.serve_forever()


if __name__ == "__main__":
    main()
