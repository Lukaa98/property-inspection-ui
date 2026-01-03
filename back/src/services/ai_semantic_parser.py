import json
from typing import Dict, List
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
You ONLY classify resume content into semantic sections.

Valid section types:
- contact_info
- section_title
- experience_group
- education_group
- skills_group
- certificates_group
- other

Return strict JSON only.
"""

def analyze_resume_semantics(layout: Dict) -> List[Dict]:
    flat_text = [
        el["text"]
        for page in layout["pages"]
        for el in page["elements"]
        if el["text"].strip()
    ]

    prompt = {
        "instructions": "Classify each line into a resume section.",
        "lines": flat_text
    }

    response = client.chat.completions.create(
        model=settings.openai_model,
        temperature=0.0,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": json.dumps(prompt)}
        ],
    )

    return json.loads(response.choices[0].message.content)["items"]
