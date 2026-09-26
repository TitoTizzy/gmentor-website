from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parent
MEDIA_DIR = ROOT / "usa" / "usa-portfolio" / "media"
OUTPUT_DIR = ROOT / "usa" / "usa-portfolio" / "media-contact-sheets"


def numeric_key(path: Path) -> tuple[str, int]:
    digits = "".join(character for character in path.stem if character.isdigit())
    return (path.stem.rstrip(digits), int(digits or 0))


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    files = sorted(
        [path for path in MEDIA_DIR.iterdir() if path.suffix.lower() in {".jpg", ".jpeg", ".png"}],
        key=numeric_key,
    )
    columns = 4
    for start in range(0, len(files), 12):
        batch = files[start : start + 12]
        rows = (len(batch) + columns - 1) // columns
        sheet = Image.new("RGB", (columns * 390, rows * 330), "white")
        draw = ImageDraw.Draw(sheet)
        for index, file in enumerate(batch):
            with Image.open(file) as source:
                image = source.convert("RGB")
                image.thumbnail((360, 275))
            x = (index % columns) * 390 + 15
            y = (index // columns) * 330 + 35
            sheet.paste(image, (x + (360 - image.width) // 2, y))
            draw.text((x, y - 24), file.name, fill="black", font=ImageFont.load_default())
        end = start + len(batch)
        sheet.save(OUTPUT_DIR / f"media-{start + 1:03d}-{end:03d}.jpg", quality=90, optimize=True)


if __name__ == "__main__":
    main()
