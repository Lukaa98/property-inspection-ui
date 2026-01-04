from typing import Dict, List

def extract_readable_text(layout: Dict) -> Dict:
    """
    Converts lossless layout JSON into clean readable text
    while preserving line -> element ID mapping.
    """

    lines: List[str] = []
    line_map: List[List[str]] = []

    for page in layout["pages"]:
        elements = sorted(
            page["elements"],
            key=lambda e: (round(e["y"], 1), e["x"])
        )

        current_y = None
        current_line = []
        current_ids = []

        for el in elements:
            text = el["text"].strip()
            if not text:
                continue

            if current_y is None or abs(el["y"] - current_y) < 2:
                current_line.append(text)
                current_ids.append(el["id"])
                current_y = el["y"]
            else:
                lines.append(" ".join(current_line))
                line_map.append(current_ids)

                current_line = [text]
                current_ids = [el["id"]]
                current_y = el["y"]

        if current_line:
            lines.append(" ".join(current_line))
            line_map.append(current_ids)

    return {
        "text": "\n".join(lines),
        "line_map": line_map
    }
