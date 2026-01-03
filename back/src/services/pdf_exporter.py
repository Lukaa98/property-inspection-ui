from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.pdfbase.pdfmetrics import getAscent
from io import BytesIO


FONT_MAP = {
    ("Times", False, False): "Times-Roman",
    ("Times", True, False): "Times-Bold",
    ("Times", False, True): "Times-Italic",
    ("Times", True, True): "Times-BoldItalic",
}



def resolve_font(font_name: str, bold: bool, italic: bool) -> str:
    base = "Times"
    return FONT_MAP.get((base, bold, italic), "Times-Roman")


def draw_text(c, text, x, y, font, size, page_height):
    """
    Draw text using baseline-corrected Y coordinate.
    """
    ascent = getAscent(font) / 1000 * size
    corrected_y = page_height - y - ascent
    c.drawString(x, corrected_y, text)
    return corrected_y


def draw_bullet(c, x, y, page_height, size):
    """
    Draw bullet as a vector circle (font-independent).
    """
    radius = size * 0.18
    cy = page_height - y - size * 0.55
    c.circle(x + radius, cy, radius, stroke=0, fill=1)


def export_resume_pdf(layout_data: dict) -> BytesIO:
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)

    for page in layout_data["pages"]:
        page_height = page["height"]

        for el in page["elements"]:
            font = resolve_font(
                el["font_name"],
                el["is_bold"],
                el["is_italic"]
            )

            # Slight normalization to counter font-metric inflation
            render_size = el["font_size"] * 0.97
            c.setFont(font, render_size)

            text = el["text"]

            # Bullet handling (strip glyph, draw manually)
            if text.strip().startswith(("●", "•")):
                clean_text = text.lstrip("●• ").lstrip()
                draw_bullet(c, el["x"], el["y"], page_height, render_size)
                text_x = el["x"] + render_size * 1.2
            else:
                clean_text = text
                text_x = el["x"]

            baseline_y = draw_text(
                c,
                clean_text,
                text_x,
                el["y"],
                font,
                render_size,
                page_height
            )

            # Link rectangle aligned to baseline
            if el.get("link"):
                text_width = c.stringWidth(clean_text, font, render_size)
                c.linkURL(
                    el["link"],
                    (
                        text_x,
                        baseline_y,
                        text_x + text_width,
                        baseline_y + render_size
                    ),
                    relative=0
                )

        c.showPage()

    c.save()
    buffer.seek(0)
    return buffer
