#!/usr/bin/env python3
"""Import brand shampoo assets into public gallery + marketing folders."""

from __future__ import annotations

import shutil
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
ASSETS = Path("/Users/rishimehan/.cursor/projects/Users-rishimehan-Desktop-shopify-website/assets")
OUT = ROOT / "public" / "products" / "rosemary-shampoo"
CANVAS = 2000
MAX_CONTENT = 1840
BG_LIGHT = (242, 239, 233)  # #F2EFE9
JPEG_QUALITY = 95

# (source filename suffix, output name, background)
GALLERY = [
    ("Hair_Fall_Reduction__15_-29e4cca8-4c0e-4fca-af35-115bee73e092.png", "image-1.jpg", BG_LIGHT),
    ("Hair_Fall_Reduction__16_-311cd7ac-5cc5-443e-8a5b-64b6b3dc98b3.png", "image-2.jpg", BG_LIGHT),
    ("Hair_Fall_Reduction__14_-08501d70-4b01-435f-a80e-918358568bee.png", "image-3.jpg", BG_LIGHT),
    ("Hair_Fall_Reduction__9_-b560f87a-cf4a-4d45-bd39-ce1d474ac6bc.png", "image-4.jpg", (10, 10, 10)),
    ("Hair_Fall_Reduction__10_-050b8bbc-d167-47e2-b2c9-6e227fbee144.png", "image-5.jpg", (10, 10, 10)),
]

MARKETING = [
    ("Hair_Fall_Reduction__14_-08501d70-4b01-435f-a80e-918358568bee.png", "benefits-card.jpg", BG_LIGHT),
    ("Hair_Fall_Reduction__9_-b560f87a-cf4a-4d45-bd39-ce1d474ac6bc.png", "hero-dark.jpg", (10, 10, 10)),
]


def find_asset(name: str) -> Path:
    matches = list(ASSETS.glob(f"*{name.split('_', 2)[-1]}" if False else name))
    path = ASSETS / name
    if not path.exists():
        raise FileNotFoundError(path)
    return path


def export_square(src: Path, dest: Path, bg: tuple[int, int, int]) -> None:
    img = ImageOps.exif_transpose(Image.open(src).convert("RGB"))
    fitted = ImageOps.contain(img, (MAX_CONTENT, MAX_CONTENT), Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", (CANVAS, CANVAS), bg)
    x = (CANVAS - fitted.width) // 2
    y = (CANVAS - fitted.height) // 2
    canvas.paste(fitted, (x, y))
    dest.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(dest, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)
    print(f"  {dest.relative_to(ROOT)} ({fitted.width}x{fitted.height})")


def main() -> None:
    print("Gallery")
    for src_name, out_name, bg in GALLERY:
        export_square(ASSETS / src_name, OUT / out_name, bg)

    marketing_dir = OUT / "marketing"
    print("\nMarketing copies")
    for src_name, out_name, bg in MARKETING:
        export_square(ASSETS / src_name, marketing_dir / out_name, bg)

    # Keep originals in marketing/originals for reference
    originals = marketing_dir / "originals"
    originals.mkdir(parents=True, exist_ok=True)
    for src_name, _, _ in GALLERY:
        shutil.copy2(ASSETS / src_name, originals / src_name)
    print(f"  originals -> {originals.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
