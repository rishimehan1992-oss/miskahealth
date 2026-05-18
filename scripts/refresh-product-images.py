#!/usr/bin/env python3
"""Download high-res Amazon product images and export optimized gallery JPGs."""

from __future__ import annotations

import io
import urllib.request
from pathlib import Path

from PIL import Image, ImageChops, ImageOps

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public" / "products"
CANVAS = 2000
MAX_CONTENT = 1840
BG = (255, 255, 255)
JPEG_QUALITY = 95

PRODUCTS = {
    "rosemary-hair-oil": [
        "https://m.media-amazon.com/images/I/51hzXAX7ddL._SL1500_.jpg",
        "https://m.media-amazon.com/images/I/61U45l91hSL._SL1500_.jpg",
        "https://m.media-amazon.com/images/I/61XRHhou+qL._SL1500_.jpg",
        "https://m.media-amazon.com/images/I/61P7k4vF1IL._SL1500_.jpg",
    ],
    "rosemary-shampoo": [
        "https://m.media-amazon.com/images/I/51TMAc1tHCL._SL1500_.jpg",
        "https://m.media-amazon.com/images/I/61WDeR18M+L._SL1500_.jpg",
        "https://m.media-amazon.com/images/I/619q5eRVdaL._SL1500_.jpg",
        "https://m.media-amazon.com/images/I/71KAK1KSwzL._SL1500_.jpg",
    ],
}


def fetch(url: str) -> Image.Image:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = resp.read()
    img = Image.open(io.BytesIO(data))
    return ImageOps.exif_transpose(img.convert("RGB"))


BOTTLE_HEIGHT = 1500


def corner_bg_color(img: Image.Image) -> tuple[int, int, int]:
    w, h = img.size
    samples = [img.getpixel((2, 2)), img.getpixel((w - 3, 2)), img.getpixel((2, h - 3)), img.getpixel((w - 3, h - 3))]
    return max(samples, key=lambda c: sum(c))


def trim_to_product(img: Image.Image, threshold: int = 28) -> Image.Image:
    bg_color = corner_bg_color(img)
    bg = Image.new("RGB", img.size, bg_color)
    diff = ImageChops.difference(img, bg)
    mask = ImageOps.grayscale(diff).point(lambda p: 255 if p > threshold else 0)
    bbox = mask.getbbox()
    if not bbox:
        return img
    pad = 12
    return img.crop((
        max(0, bbox[0] - pad),
        max(0, bbox[1] - pad),
        min(img.width, bbox[2] + pad),
        min(img.height, bbox[3] + pad),
    ))


def export_square(img: Image.Image, dest: Path) -> None:
    trimmed = trim_to_product(img)
    scale = BOTTLE_HEIGHT / trimmed.height
    new_w = int(trimmed.width * scale)
    resized = trimmed.resize((new_w, BOTTLE_HEIGHT), Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", (CANVAS, CANVAS), BG)
    x = (CANVAS - resized.width) // 2
    y = (CANVAS - BOTTLE_HEIGHT) // 2
    canvas.paste(resized, (x, y))
    dest.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(dest, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)
    print(f"  -> {dest.name} trim {trimmed.size} -> {new_w}x{BOTTLE_HEIGHT}")


def main() -> None:
    for slug, urls in PRODUCTS.items():
        out_dir = PUBLIC / slug
        print(f"\n{slug}")
        for i, url in enumerate(urls, start=1):
            print(f"  downloading {url}")
            img = fetch(url)
            export_square(img, out_dir / f"image-{i}.jpg")


if __name__ == "__main__":
    main()
