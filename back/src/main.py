from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pdfplumber
import re

app = FastAPI()

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
    
    # Group into structured sections
    structured = structure_resume(text_blocks)
    return {"blocks": structured}

def guess_block_type(text: str) -> str:
    """Identify what type of content this line is"""
    # Section headers (all caps, short)
    if text.isupper() and len(text) < 50:
        return "section_title"
    
    # Bullets
    if text.startswith(("●", "•", "-", "*")):
        return "bullet"
    
    # Check for dates (job headers)
    date_patterns = [
        r'\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}',
        r'\b\d{4}\s*[-–]\s*\d{4}',
        r'\b\d{4}\s*[-–]\s*(Present|Current)',
    ]
    if any(re.search(pattern, text, re.IGNORECASE) for pattern in date_patterns):
        return "date_line"
    
    # Email
    if re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text):
        return "contact"
    
    # Phone
    if re.search(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', text):
        return "contact"
    
    # Links (LinkedIn, GitHub, Portfolio)
    if any(word in text.lower() for word in ["linkedin", "github", "portfolio", "http"]):
        return "contact"
    
    return "text"

def structure_resume(blocks):
    """Structure the resume into organized sections"""
    structured = []
    current_section = None
    contact_info = {"type": "contact_info", "name": None, "lines": []}
    skills = []
    
    i = 0
    while i < len(blocks):
        block = blocks[i]
        block_type = block["type"]
        text = block["text"]
        
        # First line is usually the name
        if i == 0 and block_type == "text":
            contact_info["name"] = text
            i += 1
            continue
        
        # Collect contact info at the top
        if i < 5 and block_type == "contact":
            contact_info["lines"].append(text)
            i += 1
            continue
        
        # Section headers
        if block_type == "section_title":
            # Save previous section
            if current_section:
                structured.append(current_section)
                current_section = None
            
            section_name = text.upper()
            
            # WORK EXPERIENCE Section
            if "WORK" in section_name and "EXPERIENCE" in section_name:
                structured.append({"type": "section_title", "text": text})
                work_experiences = parse_work_section(blocks, i + 1)
                structured.extend(work_experiences["items"])
                i = work_experiences["next_index"]
                continue
            
            # EDUCATION Section
            elif "EDUCATION" in section_name:
                structured.append({"type": "section_title", "text": text})
                education = parse_education_section(blocks, i + 1)
                structured.extend(education["items"])
                i = education["next_index"]
                continue
            
            # SKILLS Section
            elif "SKILL" in section_name:
                structured.append({"type": "section_title", "text": text})
                skills_section = parse_skills_section(blocks, i + 1)
                if skills_section["items"]:
                    structured.append(skills_section["items"])
                i = skills_section["next_index"]
                continue
            
            # CERTIFICATES Section
            elif "CERTIFICATE" in section_name or "CERTIFICATION" in section_name:
                structured.append({"type": "section_title", "text": text})
                certs = parse_certificates_section(blocks, i + 1)
                if certs["items"]:
                    structured.append(certs["items"])
                i = certs["next_index"]
                continue
            
            # PROJECTS or TRAINING Section
            elif "PROJECT" in section_name or "TRAINING" in section_name:
                structured.append({"type": "section_title", "text": text})
                projects = parse_projects_section(blocks, i + 1)
                structured.extend(projects["items"])
                i = projects["next_index"]
                continue
            
            else:
                structured.append({"type": "section_title", "text": text})
        
        i += 1
    
    # Add contact info at the beginning if we collected any
    if contact_info["name"] or contact_info["lines"]:
        structured.insert(0, contact_info)
    
    return structured

def parse_work_section(blocks, start_idx):
    """Parse work experience section"""
    experiences = []
    current_exp = None
    i = start_idx
    
    while i < len(blocks):
        block = blocks[i]
        
        # Stop if we hit another section
        if block["type"] == "section_title":
            break
        
        # Found a job header (has dates)
        if block["type"] == "date_line":
            if current_exp:
                experiences.append(current_exp)
            
            current_exp = {
                "type": "experience_group",
                "company": extract_company(block["text"]),
                "header": block["text"],
                "title": None,
                "bullets": []
            }
            
            # Next line is usually the title
            if i + 1 < len(blocks) and blocks[i + 1]["type"] == "text":
                current_exp["title"] = blocks[i + 1]["text"]
                i += 1
        
        # Collect bullets
        elif block["type"] == "bullet" and current_exp:
            bullet_text = block["text"].lstrip("●•-*• ").strip()
            current_exp["bullets"].append(bullet_text)
        
        i += 1
    
    if current_exp:
        experiences.append(current_exp)
    
    return {"items": experiences, "next_index": i}

def parse_education_section(blocks, start_idx):
    """Parse education section"""
    education_items = []
    current_edu = None
    i = start_idx
    
    while i < len(blocks):
        block = blocks[i]
        
        if block["type"] == "section_title":
            break
        
        # Education entries usually have dates or "Graduated"
        if block["type"] == "date_line" or "graduated" in block["text"].lower():
            if current_edu:
                education_items.append(current_edu)
            
            current_edu = {
                "type": "education_group",
                "degree": block["text"],
                "details": []
            }
        elif current_edu and block["type"] in ["text", "bullet"]:
            text = block["text"].lstrip("●•-* ").strip()
            if text:
                current_edu["details"].append(text)
        
        i += 1
    
    if current_edu:
        education_items.append(current_edu)
    
    return {"items": education_items, "next_index": i}

def parse_skills_section(blocks, start_idx):
    """Parse skills section"""
    i = start_idx
    skills = []
    
    while i < len(blocks):
        block = blocks[i]
        
        if block["type"] == "section_title":
            break
        
        if block["type"] in ["bullet", "text"]:
            text = block["text"].lstrip("●•-* ").strip()
            # Often skills are separated by ● or •
            if "●" in text or "•" in text:
                skill_list = [s.strip() for s in re.split(r'[●•]', text) if s.strip()]
                skills.extend(skill_list)
            else:
                skills.append(text)
        
        i += 1
    
    if skills:
        return {"items": {"type": "skills_group", "skills": skills}, "next_index": i}
    return {"items": None, "next_index": i}

def parse_certificates_section(blocks, start_idx):
    """Parse certificates section"""
    i = start_idx
    certificates = []
    
    while i < len(blocks):
        block = blocks[i]
        
        if block["type"] == "section_title":
            break
        
        if block["type"] in ["bullet", "text"]:
            text = block["text"].lstrip("●•-* ").strip()
            if text:
                certificates.append(text)
        
        i += 1
    
    if certificates:
        return {"items": {"type": "certificates_group", "certificates": certificates}, "next_index": i}
    return {"items": None, "next_index": i}

def parse_projects_section(blocks, start_idx):
    """Parse projects/training section"""
    projects = []
    current_project = None
    i = start_idx
    
    while i < len(blocks):
        block = blocks[i]
        
        if block["type"] == "section_title":
            break
        
        if block["type"] == "date_line":
            if current_project:
                projects.append(current_project)
            
            current_project = {
                "type": "project_group",
                "title": block["text"],
                "bullets": []
            }
        elif block["type"] == "bullet" and current_project:
            bullet_text = block["text"].lstrip("●•-* ").strip()
            current_project["bullets"].append(bullet_text)
        
        i += 1
    
    if current_project:
        projects.append(current_project)
    
    return {"items": projects, "next_index": i}

def extract_company(header_text: str) -> str:
    """Extract company name from header"""
    parts = re.split(r'\s{2,}|,\s*', header_text)
    if parts:
        return parts[0].strip()
    return header_text[:40].strip()