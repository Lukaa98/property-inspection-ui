from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pdfplumber

app = FastAPI()

# Allow React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health():
    return {"status": "ok"}

@app.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        return {"error": "Only PDF files supported"}

    text_blocks = []

    with pdfplumber.open(file.file) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text() or ""
            for line in page_text.split("\n"):
                line = line.strip()
                if line:
                    text_blocks.append({
                        "text": line,
                        "type": guess_block_type(line),
                    })

    return {"blocks": text_blocks}


def guess_block_type(text: str) -> str:
    if text.isupper() and len(text) < 40:
        return "section_title"
    if text.startswith(("-", "•", "*")):
        return "experience_bullet"
    if any(char.isdigit() for char in text) and "-" in text:
        return "experience_header"
    return "unknown"
