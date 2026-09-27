from __future__ import annotations

import json
import os
import shutil
from pathlib import Path

from PIL import Image, ImageFilter, ImageOps


ROOT = Path(__file__).resolve().parent
SITES = ROOT.parent / "sites"
SITE_IMAGES = {
    "usa": [SITES / "usa" / "images" / "usa", SITES / "haiti" / "images" / "usa"],
    "haiti": [SITES / "haiti" / "images" / "haiti"],
}
USA_MEDIA = ROOT / "usa" / "usa-portfolio" / "media"
HAITI_MIXED = ROOT / "mixed" / "mixed-portfolio" / "haiti-media"
HAITI_LIVRET = ROOT / "haiti" / "haiti-livret" / "media"
USER_MEDIA = ROOT / "user-provided"
FOUR_K_LONG_EDGE = 3840

ASSETS = [
    ("usa", "townhouse-waterbury", "cover", USA_MEDIA / "image12.jpeg", "townhouse-waterbury-cover.webp", None),
    ("usa", "townhouse-waterbury", "photo", USA_MEDIA / "image3.jpeg", "townhouse-waterbury-side.webp", None),
    ("usa", "townhouse-waterbury", "photo", USA_MEDIA / "image13.jpeg", "townhouse-waterbury-rear.webp", None),
    ("usa", "townhouse-waterbury", "photo", USA_MEDIA / "image14.jpeg", "townhouse-waterbury-end.webp", None),
    ("usa", "townhouse-waterbury", "plan", USA_MEDIA / "image4.jpeg", "townhouse-waterbury-foundation.webp", None),
    ("usa", "townhouse-waterbury", "plan", USA_MEDIA / "image5.png", "townhouse-waterbury-first-floor.webp", None),
    ("usa", "townhouse-waterbury", "plan", USA_MEDIA / "image9.png", "townhouse-waterbury-front-elevation.webp", None),
    ("usa", "water-view-east", "cover", USA_MEDIA / "image15.jpeg", "water-view-east-cover.webp", None),
    ("usa", "water-view-east", "photo", USA_MEDIA / "image27.jpeg", "water-view-east-exterior.webp", None),
    ("usa", "water-view-east", "photo", USA_MEDIA / "image28.jpeg", "water-view-east-walkway.webp", None),
    ("usa", "water-view-east", "photo", USA_MEDIA / "image29.jpeg", "water-view-east-kitchen.webp", None),
    ("usa", "water-view-east", "photo", USA_MEDIA / "image30.jpeg", "water-view-east-living.webp", None),
    ("usa", "water-view-east", "plan", USA_MEDIA / "image16.png", "water-view-east-basement.webp", None),
    ("usa", "water-view-east", "plan", USA_MEDIA / "image21.jpeg", "water-view-east-front-elevation.webp", None),
    ("usa", "forest-street", "cover", USA_MEDIA / "image31.jpeg", "forest-street-cover.webp", None),
    ("usa", "forest-street", "photo", USA_MEDIA / "image39.jpeg", "forest-street-entry.webp", None),
    ("usa", "forest-street", "photo", USA_MEDIA / "image40.jpeg", "forest-street-living.webp", None),
    ("usa", "forest-street", "photo", USA_MEDIA / "image41.jpeg", "forest-street-stair.webp", None),
    ("usa", "forest-street", "plan", USA_MEDIA / "image32.jpeg", "forest-street-plans.webp", None),
    ("usa", "forest-street", "plan", USA_MEDIA / "image36.png", "forest-street-elevations.webp", None),
    ("haiti", "beach-house-pierre-payen", "cover", USER_MEDIA / "haiti-hero-beach-house.png", "beach-house-cover.webp", None),
    ("haiti", "beach-house-pierre-payen", "render", HAITI_MIXED / "page-046-image-02.webp", "beach-house-render.webp", 46),
    ("haiti", "beach-house-pierre-payen", "render", HAITI_MIXED / "page-051-image-03.webp", "beach-house-render-angle.webp", 51),
    ("haiti", "beach-house-pierre-payen", "photo", HAITI_MIXED / "page-052-image-02.webp", "beach-house-construction.webp", 52),
    ("haiti", "beach-house-pierre-payen", "photo", HAITI_MIXED / "page-052-image-03.webp", "beach-house-patio.webp", 52),
    ("haiti", "beach-house-pierre-payen", "photo", HAITI_MIXED / "page-053-image-02.webp", "beach-house-sea-view.webp", 53),
    ("haiti", "beach-house-pierre-payen", "photo", HAITI_MIXED / "page-053-image-03.webp", "beach-house-window-view.webp", 53),
    ("haiti", "beach-house-pierre-payen", "plan", HAITI_MIXED / "page-047-image-03.webp", "beach-house-floor-plan.webp", 47),
    ("haiti", "beach-house-pierre-payen", "plan", HAITI_MIXED / "page-048-image-03.webp", "beach-house-sections.webp", 48),
    ("haiti", "extension-uce", "cover", HAITI_MIXED / "page-056-image-02.webp", "uce-cover.webp", 56),
    ("haiti", "extension-uce", "photo", HAITI_MIXED / "page-062-image-02.webp", "uce-framing-interior.webp", 62),
    ("haiti", "extension-uce", "photo", HAITI_MIXED / "page-062-image-03.webp", "uce-framing-exterior.webp", 62),
    ("haiti", "extension-uce", "photo", HAITI_MIXED / "page-063-image-02.webp", "uce-construction.webp", 63),
    ("haiti", "extension-uce", "photo", HAITI_MIXED / "page-064-image-02.webp", "uce-completed.webp", 64),
    ("haiti", "extension-uce", "photo", HAITI_MIXED / "page-064-image-03.webp", "uce-interior.webp", 64),
    ("haiti", "extension-uce", "plan", HAITI_MIXED / "page-057-image-03.webp", "uce-office-plan.webp", 57),
    ("haiti", "extension-uce", "plan", HAITI_MIXED / "page-059-image-03.webp", "uce-foundation-plan.webp", 59),
    ("haiti", "maisons-grand-sud", "cover", HAITI_LIVRET / "page-005-image-03.webp", "grand-sud-cover.webp", 5),
    ("haiti", "maisons-grand-sud", "photo", HAITI_LIVRET / "page-004-image-05.webp", "grand-sud-house-green.webp", 4),
    ("haiti", "maisons-grand-sud", "photo", HAITI_LIVRET / "page-004-image-08.webp", "grand-sud-construction.webp", 4),
    ("haiti", "maisons-grand-sud", "photo", HAITI_LIVRET / "page-005-image-04.webp", "grand-sud-house-veranda.webp", 5),
    ("haiti", "maisons-grand-sud", "plan", HAITI_LIVRET / "page-029-image-04.webp", "grand-sud-two-bedroom-plan.webp", 29),
    ("haiti", "maisons-grand-sud", "render", HAITI_LIVRET / "page-029-image-03.webp", "grand-sud-two-bedroom-render.webp", 29),
    ("haiti", "maisons-grand-sud", "plan", HAITI_LIVRET / "page-032-image-03.webp", "grand-sud-three-bedroom-plan.webp", 32),
]


def main() -> None:
    only_asset = os.environ.get("MGM_ASSET")
    for targets in SITE_IMAGES.values():
        for target in targets:
            target.mkdir(parents=True, exist_ok=True)

    manifest_path = ROOT / "web-asset-manifest.json"
    if only_asset and manifest_path.exists():
        manifest = [entry for entry in json.loads(manifest_path.read_text(encoding="utf-8")) if not entry["web_asset"].endswith("/" + only_asset)]
    else:
        manifest = []
    for market, project, asset_type, source, filename, page in ASSETS:
        if only_asset and filename != only_asset:
            continue
        if not source.exists():
            raise FileNotFoundError(source)
        targets = [directory / filename for directory in SITE_IMAGES[market]]
        with Image.open(source) as image:
            converted = ImageOps.exif_transpose(image).convert("RGB")
            scale = FOUR_K_LONG_EDGE / max(converted.size)
            size = (max(1, round(converted.width * scale)), max(1, round(converted.height * scale)))
            converted = converted.resize(size, Image.Resampling.LANCZOS)
            if asset_type in {"cover", "photo", "render"}:
                converted = converted.filter(ImageFilter.UnsharpMask(radius=1.3, percent=115, threshold=3))
            for target in targets:
                converted.save(target, "WEBP", quality=95, method=6)
        manifest.append(
            {
                "market": market,
                "project": project,
                "type": asset_type,
                "web_asset": str(targets[0].relative_to(ROOT.parent)).replace("\\", "/"),
                "web_assets": [str(target.relative_to(ROOT.parent)).replace("\\", "/") for target in targets],
                "source": str(source.relative_to(ROOT)).replace("\\", "/"),
                "source_page": page,
                "output_width": converted.width,
                "output_height": converted.height,
                "quality_profile": "4K long edge, WebP quality 95",
            }
        )
    manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(f"Prepared {len(manifest)} traced web assets.")


if __name__ == "__main__":
    main()
