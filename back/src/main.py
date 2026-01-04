from fastapi import FastAPI, UploadFile, File, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse

from src.config import get_settings
from src.services.pdf_parser import extract_resume_with_layout
from src.services.layout_text_extractor import extract_readable_text
from src.services.ai_semantic_parser import analyze_resume_semantics
from src.services.pdf_exporter import export_resume_pdf

import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()
app = FastAPI(title="Resume Import / Export API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health():
    return {"status": "ok"}

# -------------------------
# 1️⃣ Lossless layout
# -------------------------

@app.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        return JSONResponse(status_code=400, content={"error": "PDF only"})

    layout = extract_resume_with_layout(file.file)
    return layout

# -------------------------
# 2️⃣ Clean text extractor
# -------------------------

@app.post("/parse-resume-text")
async def parse_resume_text(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        return JSONResponse(status_code=400, content={"error": "PDF only"})

    layout = extract_resume_with_layout(file.file)
    extracted = extract_readable_text(layout)

    return extracted

# -------------------------
# 3️⃣ Semantic analysis
# -------------------------

@app.post("/analyze-resume")
async def analyze_resume(payload: dict):
    """
    Expects:
    {
      "text": "clean resume text"
    }
    """

    if "text" not in payload:
        return JSONResponse(status_code=400, content={"error": "Missing text"})

    semantic = analyze_resume_semantics(payload["text"])
    return semantic

# -------------------------
# 4️⃣ Export PDF
# -------------------------

@app.post("/export-resume")
async def export_resume(layout_data: dict):
    pdf = export_resume_pdf(layout_data)

    return StreamingResponse(
        pdf,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=resume.pdf"}
    )
