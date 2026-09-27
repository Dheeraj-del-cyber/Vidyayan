"""Extract selectable text from the opening pages of a syllabus PDF."""

from __future__ import annotations

import json
import sys
from pathlib import Path

from pypdf import PdfReader

PAGE_LIMIT = 30

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")


def extract_pdf_text(pdf_path: Path) -> dict[str, object]:
    """Return page-numbered text and flag PDFs that need OCR."""
    if not pdf_path.is_file() or pdf_path.suffix.lower() != ".pdf":
        raise ValueError("The supplied document must be an existing PDF file.")

    reader = PdfReader(pdf_path, strict=False)
    pages = []
    for page_number, page in enumerate(reader.pages[:PAGE_LIMIT], start=1):
        page_text = (page.extract_text() or "").strip()
        pages.append({"page": page_number, "text": page_text})

    text_page_count = sum(bool(page["text"]) for page in pages)
    status = "text_extracted" if text_page_count else "ocr_required"
    return {
        "status": status,
        "pageCount": len(reader.pages),
        "checkedPageCount": len(pages),
        "textPageCount": text_page_count,
        "totalCharacters": sum(len(page["text"]) for page in pages),
        "pages": pages,
    }


def main() -> int:
    if len(sys.argv) != 2:
        print(json.dumps({"error": "Usage: extract_syllabus.py <pdf-path>"}))
        return 2

    try:
        result = extract_pdf_text(Path(sys.argv[1]))
    except Exception as error:
        print(json.dumps({"error": str(error)}))
        return 1

    print(json.dumps(result, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())