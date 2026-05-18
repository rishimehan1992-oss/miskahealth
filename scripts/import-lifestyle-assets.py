#!/usr/bin/env python3
"""Copy AI / brand lifestyle shots into public product folders."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
ASSETS = Path("/Users/rishimehan/.cursor/projects/Users-rishimehan-Desktop-shopify-website/assets")
PUBLIC = ROOT / "public" / "products"
CANVAS_W, CANVAS_H = 1600, 2000
JPEG_QUALITY = 92

SETS = {
    "rosemary-shampoo": [
        "lifestyle-bathroom.jpg",
        "lifestyle-flatlay.jpg",
        "lifestyle-shower.jpg",
        "reel-ingredients-lifestyle.png",
    ],
    "rosemary-hair-oil": [
        "oil-lifestyle-bathroom.jpg",
        "oil-lifestyle-flatlay.jpg",
        "oil-lifestyle-night-ritual.jpg",
    ],
    "hair-scalp-serum": [
        "serum-lifestyle-bathroom.jpg",
        "serum-lifestyle-application.jpg",
        "serum-lifestyle-flatlay.jpg",
    ],
}


def export_lifestyle(src: Path, dest: Path) -> None:
    img = ImageOps.exif_transpose(Image.open(src).convert("RGB"))
    fitted = ImageOps.contain(img, (CANVAS_W, CANVAS_H), Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", (CANVAS_W, CANVAS_H), (255, 255, 255))
    x = (CANVAS_W - fitted.width) // 2
    y = (CANVAS_H - fitted.height) // 2
    canvas.paste(fitted, (x, y))
    dest.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(dest, "JPEG", quality=JPEG_QUALITY, optimize=True)
    print(f"  -> {dest.relative_to(ROOT)} ({fitted.width}x{fitted.height})")


def main() -> None:
    for slug, files in SETS.items():
        out_dir = PUBLIC / slug / "lifestyle"
        print(slug)
        for i, name in enumerate(files, start=1):
            src = ASSETS / name
            if not src.exists():
                print(f"  skip missing {name}")
                continue
            export_lifestyle(src, out_dir / f"lifestyle-{i}.jpg")


if __name__ == "__main__":
    main()
