from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from src.config import get_settings
from src.services.pdf_parser import extract_text_from_pdf
from src.services.ai_parser import parse_resume_with_ai
from src.services.pdf_exporter import generate_resume_pdf

settings = get_settings()
app = FastAPI(title="Resume Tailor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health():
    return {"status": "ok123", "version": "1.0.0"}

@app.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    print("DEBUG: endpoint hit")
    print("DEBUG filename:", file.filename)
    print("DEBUG content-type:", file.content_type)
    """Parse uploaded PDF resume using AI"""
    if file.content_type != "application/pdf":
        return {"error": "Only PDF files supported"}
    
    try:
        # Extract text from PDF
        resume_text = extract_text_from_pdf(file.file)
        
        # Parse with AI
        structured_blocks = await parse_resume_with_ai(resume_text)
        
        return {"blocks": structured_blocks}
        
    except Exception as e:
        return {"error": f"Parsing failed: {str(e)}"}

@app.post("/export-resume")
async def export_resume(resume_data: dict):
    """Export structured resume data to PDF"""
    try:
        pdf_buffer = generate_resume_pdf(resume_data)
        
        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=resume_updated.pdf"}
        )
    except Exception as e:
        return {"error": f"Export failed: {str(e)}"}