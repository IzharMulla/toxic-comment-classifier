import os
import sys
import json
from http.server import BaseHTTPRequestHandler

# Import joblib safely
try:
    import joblib
except ImportError:
    joblib = None

# Add root directory to sys.path so ml.preprocessing can be imported
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

try:
    from ml.preprocessing import clean_text
except ImportError:
    # Fallback inline clean_text if import structure varies in serverless container
    import re
    def clean_text(text: str) -> str:
        if not isinstance(text, str):
            text = str(text) if text is not None else ""
        text = text.lower()
        text = re.sub(r'https?://\S+|www\.\S+', ' ', text)
        text = re.sub(r'<.*?>', ' ', text)
        text = re.sub(r'\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b', ' ', text)
        text = re.sub(r'@\w+', ' ', text)
        text = re.sub(r'[\r\n\t]+', ' ', text)
        text = re.sub(r'[^a-z0-9\s]', ' ', text)
        return re.sub(r'\s+', ' ', text).strip()

TARGET_COLUMNS = ['toxic', 'severe_toxic', 'obscene', 'threat', 'insult', 'identity_hate']

# Module-level cache for serverless execution environment reuse
_MODEL_CACHE = None
_VECTORIZER_CACHE = None

def load_artifacts():
    global _MODEL_CACHE, _VECTORIZER_CACHE
    if _MODEL_CACHE is not None and _VECTORIZER_CACHE is not None:
        return _MODEL_CACHE, _VECTORIZER_CACHE
        
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    model_path = os.path.join(base_dir, 'models', 'toxic_classifier.joblib')
    vec_path = os.path.join(base_dir, 'models', 'tfidf_vectorizer.joblib')
    
    if not os.path.exists(model_path) or not os.path.exists(vec_path):
        raise FileNotFoundError("Trained model or vectorizer artifacts not found in models/ directory.")
        
    _MODEL_CACHE = joblib.load(model_path)
    _VECTORIZER_CACHE = joblib.load(vec_path)
    return _MODEL_CACHE, _VECTORIZER_CACHE

def process_prediction(comment_text: str) -> dict:
    model, vectorizer = load_artifacts()
    cleaned = clean_text(comment_text)
    
    # Transform input
    vec = vectorizer.transform([cleaned])
    
    # Predict probabilities (OneVsRestClassifier returns array of probabilities per class)
    probabilities = model.predict_proba(vec)[0]
    
    predictions_dict = {}
    active_labels = []
    
    # Standard threshold for active label tag display
    PROBABILITY_THRESHOLD = 0.40
    
    for idx, col in enumerate(TARGET_COLUMNS):
        prob_val = float(round(probabilities[idx], 4))
        predictions_dict[col] = prob_val
        if prob_val >= PROBABILITY_THRESHOLD:
            active_labels.append(col)

    # Positive & Wholesome sentiment keywords
    POSITIVE_KEYWORDS = {
        'love', 'awesome', 'amazing', 'great', 'thanks', 'thank', 'good', 'kind',
        'appreciate', 'wonderful', 'nice', 'fantastic', 'helpful', 'like', 'sweet',
        'bless', 'cool', 'happy', 'hello', 'hi', 'welcome', 'enjoy', 'best'
    }
    
    words = set(cleaned.split())
    is_positive = len(active_labels) == 0 and len(words.intersection(POSITIVE_KEYWORDS)) > 0
    
    sentiment = "toxic" if len(active_labels) > 0 else ("positive" if is_positive else "neutral")
    sentiment_label = "Potentially Toxic" if len(active_labels) > 0 else ("Positive & Wholesome" if is_positive else "Civil & Safe")

    return {
        "text": comment_text,
        "predictions": predictions_dict,
        "labels": active_labels,
        "sentiment": sentiment,
        "sentiment_label": sentiment_label,
        "is_positive": is_positive
    }

class handler(BaseHTTPRequestHandler):
    def _set_headers(self, status_code=200):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(200)

    def do_POST(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length == 0:
                self._set_headers(400)
                self.wfile.write(json.dumps({"error": "Comment cannot be empty."}).encode('utf-8'))
                return

            body = self.rfile.read(content_length).decode('utf-8')
            try:
                data = json.loads(body)
            except Exception:
                self._set_headers(400)
                self.wfile.write(json.dumps({"error": "Invalid JSON format in request body."}).encode('utf-8'))
                return

            comment_text = data.get('text', '')
            
            if not isinstance(comment_text, str) or not comment_text.strip():
                self._set_headers(400)
                self.wfile.write(json.dumps({"error": "Comment cannot be empty."}).encode('utf-8'))
                return

            if len(comment_text) > 5000:
                self._set_headers(400)
                self.wfile.write(json.dumps({"error": "Comment exceeds maximum limit of 5000 characters."}).encode('utf-8'))
                return

            # Execute prediction
            result = process_prediction(comment_text)
            
            self._set_headers(200)
            self.wfile.write(json.dumps(result).encode('utf-8'))

        except FileNotFoundError as fnf:
            self._set_headers(500)
            self.wfile.write(json.dumps({"error": "Model artifacts missing. Run ml.train first."}).encode('utf-8'))
        except Exception as e:
            self._set_headers(500)
            # Log error internally without exposing stack traces to caller
            print(f"[API ERROR] {str(e)}", file=sys.stderr)
            self.wfile.write(json.dumps({"error": "An internal error occurred while analyzing the comment."}).encode('utf-8'))

    def do_GET(self):
        self._set_headers(200)
        self.wfile.write(json.dumps({
            "status": "online",
            "message": "Toxic Comment Classifier API Endpoint is active.",
            "endpoint": "/api/predict"
        }).encode('utf-8'))

if __name__ == '__main__':
    from http.server import HTTPServer
    port = 3000
    server_address = ('', port)
    httpd = HTTPServer(server_address, handler)
    print("==================================================")
    print("  TOXIC COMMENT CLASSIFIER - LOCAL API SERVER     ")
    print("==================================================")
    print(f"[INFO] Server running on http://localhost:{port}")
    print(f"[INFO] Endpoint active at http://localhost:{port}/api/predict")
    print("Press Ctrl+C to stop.\n")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[INFO] Local API server stopped.")

