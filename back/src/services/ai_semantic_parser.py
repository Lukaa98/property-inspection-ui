import json
from typing import Dict
import httpx
from openai import OpenAI
from src.config import get_settings

settings = get_settings()

http_client = httpx.Client(trust_env=False)

client = OpenAI(
    api_key=settings.openai_api_key,
    http_client=http_client
)

SYSTEM_PROMPT = """
You are a resume analyzer.

You DO NOT change text.
You DO NOT rewrite content.

Your task:
- Identify resume sections from the text.
- Sections start at their header line.
- Sections end immediately BEFORE the next section header.

Rules:
- Line numbers are 0-based.
- Contact info may appear at the top OR bottom.
- If unsure, keep sections smaller rather than larger.
- Do NOT merge unrelated sections.

Return JSON ONLY in this format:
{
  "sections": [
    {
      "type": "experience",
      "start_line": 10,
      "end_line": 22
    }
  ]
}

Valid section types:
- contact_info
- education
- experience
- skills
- projects
- certificates
- training
- other
"""

def analyze_resume_semantics(text: str) -> Dict:
    response = client.chat.completions.create(
        model=settings.openai_model,
        temperature=0.0,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": text}
        ],
    )

    content = response.choices[0].message.content

    try:
        result = json.loads(content)
    except json.JSONDecodeError:
        raise ValueError(f"Invalid JSON returned by LLM:\n{content}")

    if "sections" not in result:
        raise ValueError("Missing 'sections' in LLM response")

    return result
