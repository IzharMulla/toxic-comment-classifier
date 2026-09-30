import re

def clean_text(text: str) -> str:
    """
    Preprocess raw comment text for ML model consumption.
    
    Steps:
    1. Convert to string and lowercase
    2. Remove URLs, HTML tags, and IP addresses
    3. Remove user mentions and hashtag symbols
    4. Replace non-alphanumeric characters (except basic punctuation) with spaces
    5. Collapse multiple spaces into a single space
    6. Strip leading and trailing whitespace
    """
    if not isinstance(text, str):
        text = str(text) if text is not None else ""
        
    text = text.lower()
    
    # Remove URLs (http, https, www)
    text = re.sub(r'https?://\S+|www\.\S+', ' ', text)
    
    # Remove HTML tags
    text = re.sub(r'<.*?>', ' ', text)
    
    # Remove IP addresses
    text = re.sub(r'\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b', ' ', text)
    
    # Remove user mentions (@username)
    text = re.sub(r'@\w+', ' ', text)
    
    # Replace line breaks and tabs with spaces
    text = re.sub(r'[\r\n\t]+', ' ', text)
    
    # Remove special characters while keeping letters, digits, and basic whitespace
    text = re.sub(r'[^a-z0-9\s]', ' ', text)
    
    # Normalize extra whitespaces
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text
