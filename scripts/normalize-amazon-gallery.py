#!/usr/bin/env python3
"""Normalize Amazon studio + lifestyle shots: white canvas, consistent product scale."""

from __future__ import annotations

import io
import urllib.request
from pathlib import Path

from PIL import Image, ImageChops, ImageOps

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public" / "products"
CANVAS = 2000
BOTTLE_HEIGHT = 1680
BG = (255, 255, 255)
JPEG_QUALITY = 95

CATALOG = {
    "rosemary-shampoo": {
        "studio": [
            "https://m.media-amazon.com/images/I/51TMAc1tHCL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/61WDeR18M+L._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71KAK1KSwzL._SL1500_.jpg",
        ],
        "lifestyle": [
            "https://m.media-amazon.com/images/I/619q5eRVdaL._SL1500_.jpg",
        ],
    },
    "rosemary-hair-oil": {
        "studio": [
            "https://m.media-amazon.com/images/I/51hzXAX7ddL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/61U45l91hSL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/61P7k4vF1IL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/61XRHhou+qL._SL1500_.jpg",
        ],
        "lifestyle": [
            "https://m.media-amazon.com/images/I/71TI5m-xGOL._SL1500_.jpg",
        ],
    },
    "hair-scalp-serum": {
        "studio": [
            "https://m.media-amazon.com/images/I/51FxOVzaRlL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/51Qg31QQ+XL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/61rVPnfRQLL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/7111xZst2zL._SL1500_.jpg",
        ],
        "lifestyle": [],
    },
}


def fetch(url: str) -> Image.Image:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return ImageOps.exif_transpose(Image.open(io.BytesIO(resp.read())).convert("RGB"))


def corner_bg(img: Image.Image) -> tuple[int, int, int]:
    w, h = img.size
    pts = [(4, 4), (w - 5, 4), (4, h - 5), (w - 5, h - 5)]
    return max((img.getpixel(p) for p in pts), key=sum)


def trim_product(img: Image.Image, threshold: int = 22) -> Image.Image:
    bg = corner_bg(img)
    bg_layer = Image.new("RGB", img.size, bg)
    diff = ImageChops.difference(img, bg_layer)
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


def paste_centered(canvas: Image.Image, img: Image.Image) -> None:
    x = (CANVAS - img.width) // 2
    y = (CANVAS - img.height) // 2
    canvas.paste(img, (x, y))


def normalize_studio(raw: Image.Image) -> Image.Image:
    trimmed = trim_product(raw)
    scale = BOTTLE_HEIGHT / trimmed.height
    new_w = int(trimmed.width * scale)
    product = trimmed.resize((new_w, BOTTLE_HEIGHT), Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", (CANVAS, CANVAS), BG)
    paste_centered(canvas, product)
    return canvas


def normalize_lifestyle(raw: Image.Image) -> Image.Image:
    """Full scene — fit on white, no product-only crop."""
    fitted = ImageOps.contain(raw, (1880, 1880), Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", (CANVAS, CANVAS), BG)
    paste_centered(canvas, fitted)
    return canvas


def save(img: Image.Image, path: Path) -> None:
    img.save(path, "JPEG", quality=JPEG_QUALITY, subsampling=0, optimize=True)


def process_slug(slug: str, spec: dict) -> list[str]:
    out = PUBLIC / slug
    out.mkdir(parents=True, exist_ok=True)
    paths: list[str] = []
    idx = 1

    print(f"\n{slug}")
    for url in spec["studio"]:
        print(f"  studio [{idx}]")
        save(normalize_studio(fetch(url)), out / f"image-{idx}.jpg")
        paths.append(f"/products/{slug}/image-{idx}.jpg")
        idx += 1

    for url in spec["lifestyle"]:
        print(f"  lifestyle [{idx}]")
        save(normalize_lifestyle(fetch(url)), out / f"image-{idx}.jpg")
        paths.append(f"/products/{slug}/image-{idx}.jpg")
        idx += 1

    # remove orphans
    for f in out.glob("image-*.jpg"):
        if int(f.stem.split("-")[1]) >= idx:
            f.unlink()

    return paths


def main() -> None:
    for slug, spec in CATALOG.items():
        process_slug(slug, spec)


if __name__ == "__main__":
    main()
