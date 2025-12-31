import pdfplumber
import re
from typing import List, Dict

def extract_text_from_pdf(file) -> str:
    """Extract all text from PDF"""
    text_lines = []
    
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text() or ""
            text_lines.append(page_text)
    
    return "\n".join(text_lines)


def guess_block_type(text: str) -> str:
    """Basic type detection for fallback parsing"""
    
    # Section headers
    if text.isupper() and len(text) < 60:
        return "section_title"
    
    # Bullets
    if text.startswith(("●", "•", "-", "*")):
        return "bullet"
    
    # Dates
    date_patterns = [
        r'\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}',
        r'\b\d{4}\s*[-–]\s*\d{4}',
        r'\b\d{2}/\d{4}',
    ]
    if any(re.search(pattern, text, re.IGNORECASE) for pattern in date_patterns):
        return "date_line"
    
    # Contact info
    if re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text):
        return "contact"
    
    if re.search(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', text):
        return "contact"
    
    return "text"


def extract_blocks_from_text(text: str) -> List[Dict]:
    """Convert text to basic blocks for fallback"""
    blocks = []
    
    for line in text.split("\n"):
        line = line.strip()
        if line:
            blocks.append({
                "text": line,
                "type": guess_block_type(line)
            })
    
    return blocks