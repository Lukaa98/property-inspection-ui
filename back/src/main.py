from fastapi import FastAPI, UploadFile, File, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from src.services.pdf_parser import extract_resume_with_layout
from src.services.pdf_exporter import export_resume_pdf
from src.services.ai_semantic_parser import analyze_resume_semantics
from src.config import get_settings

import logging

# -------------------------
# Logging Setup
# -------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)

# -------------------------
# App Setup
# -------------------------

settings = get_settings()
app = FastAPI(title="Resume Import / Export API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# Health
# -------------------------

@app.get("/")
def health():
    logger.info("Health check hit")
    return {
        "status": "ok",
        "mode": "lossless + semantic"
    }

# -------------------------
# 1️⃣ Parse PDF (Lossless)
# -------------------------

@app.post("/parse-resume")
async def parse_resume(
    request: Request,
    file: UploadFile = File(...)
):
    logger.info("parse-resume endpoint hit")

    # Log headers
    logger.info(f"Request headers: {dict(request.headers)}")

    # Log file presence
    if not file:
        logger.error("No file received by FastAPI")
        return JSONResponse(
            status_code=400,
            content={"error": "File missing in request"}
        )

    logger.info(f"Received file: {file.filename}")
    logger.info(f"Content-Type: {file.content_type}")

    if file.content_type != "application/pdf":
        logger.warning("Rejected non-PDF upload")
        return JSONResponse(
            status_code=400,
            content={"error": "Only PDF files supported"}
        )

    try:
        logger.info("Starting PDF layout extraction")
        result = extract_resume_with_layout(file.file)
        logger.info("PDF layout extraction successful")
        return result

    except Exception as e:
        logger.exception("PDF parsing failed")
        return JSONResponse(
            status_code=500,
            content={"error": f"Parsing failed: {str(e)}"}
        )

# -------------------------
# 2️⃣ Analyze Semantics (LLM)
# -------------------------

@app.post("/analyze-resume")
async def analyze_resume(layout_data: dict):
    logger.info("analyze-resume endpoint hit")

    try:
        items = analyze_resume_semantics(layout_data)
        logger.info(f"Semantic analysis completed ({len(items)} items)")
        return {"items": items}

    except Exception as e:
        logger.exception("Semantic analysis failed")
        return JSONResponse(
            status_code=500,
            content={"error": f"Semantic analysis failed: {str(e)}"}
        )

# -------------------------
# 3️⃣ Export PDF (Exact)
# -------------------------

@app.post("/export-resume")
async def export_resume(layout_data: dict):
    logger.info("export-resume endpoint hit")

    try:
        pdf = export_resume_pdf(layout_data)
        logger.info("PDF export successful")

        return StreamingResponse(
            pdf,
            media_type="application/pdf",
            headers={
                "Content-Disposition": "attachment; filename=resume_exact.pdf"
            }
        )

    except Exception as e:
        logger.exception("PDF export failed")
        return JSONResponse(
            status_code=500,
            content={"error": f"Export failed: {str(e)}"}
        )
