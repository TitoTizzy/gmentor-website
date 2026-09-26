from __future__ import annotations

import hashlib
import io
import json
import shutil
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from pypdf import PdfReader


ROOT = Path(__file__).resolve().parent
JOBS = [
    {
        "id": "haiti-livret",
        "source": Path(r"C:\Users\ouhha\OneDrive\Documents\Marie Gaelle Mentor\Les Entreprises\MGM\Livret MGM\Livret MGM-Haiti.pdf"),
        "pages": [1, 3, 4, 5, 23, 24, 25, 26, 27, 28, 29, 32, 35, 38],
        "output": ROOT / "haiti" / "haiti-livret" / "media",
    },
    {
        "id": "mixed-portfolio-haiti",
        "source": Path(r"C:\Users\ouhha\OneDrive\Documents\Marie Gaelle Mentor\Les Entreprises\MGM\Stuff\portfolio Mme Mentor_Haiti et USA.pdf"),
        "pages": list(range(46, 65)),
        "output": ROOT / "mixed" / "mixed-portfolio" / "haiti-media",
    },
]


def make_sheet(files: list[Path], output: Path) -> None:
    columns = 4
    rows = (len(files) + columns - 1) // columns
    sheet = Image.new("RGB", (columns * 390, rows * 330), "white")
    draw = ImageDraw.Draw(sheet)
    for index, file in enumerate(files):
        with Image.open(file) as source:
            image = source.convert("RGB")
            image.thumbnail((360, 275))
        x = (index % columns) * 390 + 15
        y = (index // columns) * 330 + 35
        sheet.paste(image, (x + (360 - image.width) // 2, y))
        draw.text((x, y - 24), file.name, fill="black", font=ImageFont.load_default())
    sheet.save(output, quality=88, optimize=True)


def main() -> None:
    index = []
    for job in JOBS:
        if job["output"].exists():
            shutil.rmtree(job["output"])
        job["output"].mkdir(parents=True)
        reader = PdfReader(job["source"])
        seen: set[str] = set()
        files: list[Path] = []
        records = []
        for page_number in job["pages"]:
            page = reader.pages[page_number - 1]
            for image_number, pdf_image in enumerate(page.images, start=1):
                digest = hashlib.sha1(pdf_image.data).hexdigest()
                if digest in seen:
                    continue
                seen.add(digest)
                try:
                    with Image.open(io.BytesIO(pdf_image.data)) as source:
                        converted = source.convert("RGB")
                        if converted.width < 250 or converted.height < 180:
                            continue
                        filename = f"page-{page_number:03d}-image-{image_number:02d}.webp"
                        target = job["output"] / filename
                        converted.save(target, "WEBP", quality=88, method=6)
                        files.append(target)
                        records.append(
                            {
                                "file": filename,
                                "page": page_number,
                                "source_name": pdf_image.name,
                                "width": converted.width,
                                "height": converted.height,
                            }
                        )
                except Exception as exc:
                    records.append({"page": page_number, "source_name": pdf_image.name, "error": str(exc)})
        for start in range(0, len(files), 12):
            batch = files[start : start + 12]
            make_sheet(batch, job["output"] / f"contact-{start + 1:03d}-{start + len(batch):03d}.jpg")
        (job["output"] / "index.json").write_text(json.dumps(records, indent=2), encoding="utf-8")
        index.append({"id": job["id"], "images": len(files), "output": str(job["output"].relative_to(ROOT))})
    print(json.dumps(index, indent=2))


if __name__ == "__main__":
    main()
