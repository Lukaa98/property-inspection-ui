import json
from typing import Dict, List

import httpx
from openai import OpenAI

from src.config import get_settings

settings = get_settings()

# ------------------------------------------------------------
# IMPORTANT:
# Explicitly disable proxies to avoid Windows/httpx crash:
# "Client.__init__() got an unexpected keyword argument 'proxies'"
# ------------------------------------------------------------
http_client = httpx.Client(trust_env=False)

client = OpenAI(
    api_key=settings.openai_api_key,
    http_client=http_client,
)


async def parse_resume_with_ai(resume_text: str) -> List[Dict]:
    """
    Use GPT-4o-mini to intelligently parse resume into structured sections.
    Returns a list of blocks.
    """

    prompt = f"""
You are a resume parser. Parse the following resume text into a structured JSON format.

Return ONLY valid JSON (no markdown, no explanation) with this exact structure:

{{
  "blocks": [
    {{
      "type": "contact_info",
      "name": "Full Name",
      "lines": ["email", "phone", "location", "linkedin", "github"]
    }},
    {{
      "type": "section_title",
      "text": "SECTION NAME"
    }},
    {{
      "type": "experience_group",
      "title": "Job Title",
      "header": "Company, Location Dates",
      "company": "Company Name",
      "bullets": ["bullet point 1", "bullet point 2"]
    }},
    {{
      "type": "skills_group",
      "skills": ["skill1", "skill2", "skill3"]
    }},
    {{
      "type": "education_group",
      "degree": "Degree Name, School",
      "details": ["additional info"]
    }},
    {{
      "type": "certificates_group",
      "certificates": ["cert1", "cert2"]
    }}
  ]
}}

Rules:
1. Detect ALL section types: WORK EXPERIENCE, PROFESSIONAL EXPERIENCE, EMPLOYMENT, EDUCATION, SKILLS, CERTIFICATES, PROJECTS, TRAINING
2. Group job experiences with their company/location/dates header, title, and bullet points
3. Extract skills as individual items (split by bullets, pipes, or commas)
4. Keep original section names in section_title blocks
5. Preserve all bullet points exactly as written

Resume Text:
{resume_text}
""".strip()

    try:
        response = client.chat.completions.create(
            model=settings.openai_model,  # gpt-4o-mini is correct
            messages=[
                {
                    "role": "system",
                    "content": "You are a resume parsing expert. Return only valid JSON."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.1,
            max_tokens=2000,
        )

        content = response.choices[0].message.content.strip()

        # Defensive cleanup (in case the model wraps JSON in code fences)
        if content.startswith("```"):
            content = content.split("```")[1].strip()

        parsed = json.loads(content)

        blocks = parsed.get("blocks")
        if not isinstance(blocks, list):
            raise ValueError("Parsed JSON does not contain a 'blocks' list")

        return blocks

    except Exception as e:
        # Fail loudly during development (do NOT silently return [])
        raise RuntimeError(f"AI parsing failed: {e}") from e


def fallback_to_simple_parse(text_blocks: List[Dict]) -> List[Dict]:
    """
    Fallback parser if AI fails - uses keyword matching.
    """
    structured: List[Dict] = []

    for block in text_blocks:
        text = block.get("text", "")
        block_type = block.get("type", "text")

        if text.isupper() and len(text) < 60:
            structured.append({"type": "section_title", "text": text})
        elif block_type == "bullet":
            structured.append({"type": "text", "text": text})
        else:
            structured.append({"type": "text", "text": text})

    return structured
