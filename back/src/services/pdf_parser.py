import fitz  # PyMuPDF
from dataclasses import dataclass, asdict
from typing import Dict, List
import uuid


@dataclass
class TextElement:
    id: str
    text: str
    x: float
    y: float
    font_name: str
    font_size: float
    is_bold: bool
    is_italic: bool
    color: str
    link: str | None = None


def extract_resume_with_layout(file_obj) -> Dict:
    """
    Lossless PDF parser.
    Extracts absolute-positioned text + link annotations.
    """
    import tempfile
    import os

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(file_obj.read())
        tmp_path = tmp.name

    try:
        doc = fitz.open(tmp_path)
        pages = []

        for page_index, page in enumerate(doc):
            elements: List[TextElement] = []

            text_blocks = page.get_text("dict")["blocks"]
            links = page.get_links()

            for block in text_blocks:
                if block["type"] != 0:
                    continue

                for line in block["lines"]:
                    for span in line["spans"]:
                        span_rect = fitz.Rect(span["bbox"])
                        link_url = None

                        for link in links:
                            if "uri" in link and fitz.Rect(link["from"]).intersects(span_rect):
                                link_url = link["uri"]
                                break

                        elements.append(
                            TextElement(
                                id=str(uuid.uuid4()),
                                text=span["text"],
                                x=span["bbox"][0],
                                y=span["bbox"][1],
                                font_name=span["font"],
                                font_size=span["size"],
                                is_bold="Bold" in span["font"],
                                is_italic=("Italic" in span["font"] or "Oblique" in span["font"]),
                                color="#000000",
                                link=link_url
                            )
                        )

            pages.append({
                "page_number": page_index,
                "width": page.rect.width,
                "height": page.rect.height,
                "elements": [asdict(e) for e in elements]
            })

        doc.close()
        return {"pages": pages}

    finally:
        os.unlink(tmp_path)
