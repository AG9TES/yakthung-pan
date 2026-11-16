import http.server
import socketserver
import os
import sys
import json
import re
from urllib.parse import urlparse, parse_qs

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
AUDIO_DIR = os.path.join(DIRECTORY, 'audio')
os.makedirs(AUDIO_DIR, exist_ok=True)

class PWAHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Allow Cross-Origin access and ensure correct cache headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, X-Audio-Id')
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == '/api/audio-list':
            # Scan audio folder and return list of available audio IDs
            try:
                files = os.listdir(AUDIO_DIR)
                audio_ids = [os.path.splitext(f)[0] for f in files if f.lower().endswith(('.mp3', '.wav', '.ogg', '.m4a', '.webm'))]
                response_data = json.dumps({'success': True, 'audioFiles': audio_ids}).encode('utf-8')
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Content-Length', str(len(response_data)))
                self.end_headers()
                self.wfile.write(response_data)
                return
            except Exception as e:
                self.send_error(500, f"Error listing audio files: {e}")
                return

        super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path == '/api/upload-audio':
            try:
                # Get item ID from query parameter or header
                qs = parse_qs(parsed.query)
                item_id = qs.get('id', [None])[0] or self.headers.get('X-Audio-Id', '').strip()
                if not item_id:
                    self.send_error(400, "Missing 'id' parameter")
                    return

                # Sanitize ID (allow alphanumeric and underscores)
                clean_id = re.sub(r'[^a-zA-Z0-9_\-]', '', item_id)
                if not clean_id:
                    self.send_error(400, "Invalid ID parameter")
                    return

                # Read body content
                content_len = int(self.headers.get('Content-Length', 0))
                if content_len <= 0:
                    self.send_error(400, "Empty audio payload")
                    return

                audio_data = self.rfile.read(content_len)
                target_path = os.path.join(AUDIO_DIR, f"{clean_id}.mp3")

                # Write directly to audio/<clean_id>.mp3 on disk
                with open(target_path, 'wb') as f:
                    f.write(audio_data)

                response_data = json.dumps({
                    'success': True,
                    'id': clean_id,
                    'filename': f"{clean_id}.mp3",
                    'size': len(audio_data),
                    'path': f"audio/{clean_id}.mp3"
                }).encode('utf-8')

                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Content-Length', str(len(response_data)))
                self.end_headers()
                self.wfile.write(response_data)
                print(f"[Audio Upload] Saved audio/{clean_id}.mp3 ({len(audio_data)} bytes)")
                sys.stdout.flush()
                return

            except Exception as e:
                self.send_error(500, f"Failed to save audio file: {e}")
                return

        self.send_error(404, "Endpoint not found")

    def guess_type(self, path):
        if path.endswith('.json'):
            return 'application/json'
        if path.endswith('.webmanifest'):
            return 'application/manifest+json'
        if path.endswith('.js'):
            return 'application/javascript'
        if path.endswith('.css'):
            return 'text/css'
        if path.endswith('.svg'):
            return 'image/svg+xml'
        if path.endswith('.mp3'):
            return 'audio/mpeg'
        if path.endswith('.apk'):
            return 'application/vnd.android.package-archive'
        return super().guess_type(path)

class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True

if __name__ == '__main__':
    with ReusableTCPServer(('0.0.0.0', PORT), PWAHandler) as httpd:
        print(f"Yakthung Pan Server running on port {PORT}...")
        print(f"Local Access:   http://localhost:{PORT}")
        print(f"Mobile Access:  http://192.168.100.10:{PORT}")
        sys.stdout.flush()
        httpd.serve_forever()

