#!/usr/bin/env python3
"""Mobile-first homepage hero banners — big products, minimal readable text."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "marketing" / "hero"
# Portrait 4:5 — reads clearly on phone carousels
W, H = 1080, 1350

BG = (252, 251, 248)
GREEN = (28, 58, 42)
DARK = (10, 10, 10)
MUTED = (80, 80, 80)

FONT_SERIF_B = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"
FONT_SANS_B = "/Library/Fonts/Arial Bold.ttf"


def ft(path: str, size: int) -> ImageFont.FreeTypeFont:
    try:
        return ImageFont.truetype(path, size)
    except OSError:
        return ImageFont.load_default()


def paste_product(base: Image.Image, rel: str, box: tuple[int, int, int, int]):
    path = ROOT / "public" / rel.lstrip("/")
    if not path.exists():
        return
    thumb = Image.open(path).convert("RGBA")
    thumb = ImageOps.contain(thumb, (box[2] - box[0], box[3] - box[1]), Image.Resampling.LANCZOS)
    x = box[0] + ((box[2] - box[0]) - thumb.width) // 2
    y = box[1] + ((box[3] - box[1]) - thumb.height) // 2
    base.paste(thumb, (x, y), thumb)


def center_text(draw, y: int, text: str, font, fill, canvas_w: int = W):
    tw = draw.textlength(text, font=font)
    draw.text(((canvas_w - tw) / 2, y), text, fill=fill, font=font)


def price_pill(draw, cx: int, cy: int, label: str, price: str):
    f_label = ft(FONT_SANS_B, 22)
    f_price = ft(FONT_SANS_B, 32)
    lw = draw.textlength(label, font=f_label)
    pw = draw.textlength(price, font=f_price)
    w = int(max(lw, pw) + 48)
    h = 88
    x0, y0 = cx - w // 2, cy - h // 2
    draw.rounded_rectangle((x0, y0, x0 + w, y0 + h), 14, fill=GREEN)
    draw.text((cx - lw / 2, y0 + 14), label, fill=(255, 255, 255), font=f_label)
    draw.text((cx - pw / 2, y0 + 44), price, fill=(255, 255, 255), font=f_price)


def slide_full_range():
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)

    center_text(draw, 44, "MISKA", ft(FONT_SANS_B, 24), GREEN)
    center_text(draw, 88, "Hair fall routine", ft(FONT_SERIF_B, 52), DARK)
    center_text(draw, 158, "Oil · Shampoo · Serum", ft(FONT_SANS_B, 28), MUTED)

    products = [
        ("products/rosemary-hair-oil/image-1.jpg", W // 6),
        ("products/rosemary-shampoo/image-1.jpg", W // 2),
        ("products/hair-scalp-serum/image-1.jpg", 5 * W // 6),
    ]
    y0, y1 = 200, 1120
    slot_w = 340
    for rel, cx in products:
        paste_product(img, rel, (cx - slot_w // 2, y0, cx + slot_w // 2, y1))

    price_pill(draw, W // 6, 1180, "Oil", "₹399")
    price_pill(draw, W // 2, 1180, "Shampoo", "₹349")
    price_pill(draw, 5 * W // 6, 1180, "Serum", "₹899")

    center_text(draw, 1280, "Dermatologist tested · Made in India", ft(FONT_SANS_B, 22), MUTED)
    return img


def slide_single_product(
    *,
    product_rel: str,
    headline: str,
    subline: str,
    price: str,
    volume: str,
):
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)

    center_text(draw, 48, "MISKA", ft(FONT_SANS_B, 24), GREEN)
    center_text(draw, 96, headline, ft(FONT_SERIF_B, 56), DARK)
    center_text(draw, 172, subline, ft(FONT_SANS_B, 32), GREEN)

    paste_product(img, product_rel, (80, 220, W - 80, 1140))

    draw.rounded_rectangle((W // 2 - 160, 1140, W // 2 + 160, 1240), 18, fill=GREEN)
    center_text(draw, 1168, price, ft(FONT_SANS_B, 52), (255, 255, 255))
    center_text(draw, 1228, volume, ft(FONT_SANS_B, 26), MUTED)

    return img


def slide_duo(product_a: str, name_a: str, price_a: str, product_b: str, name_b: str, price_b: str, title: str):
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)

    center_text(draw, 44, "MISKA", ft(FONT_SANS_B, 24), GREEN)
    center_text(draw, 92, title, ft(FONT_SERIF_B, 52), DARK)
    center_text(draw, 162, "Clinical hair fall care", ft(FONT_SANS_B, 28), MUTED)

    paste_product(img, product_a, (20, 210, W // 2 - 10, 1120))
    paste_product(img, product_b, (W // 2 + 10, 210, W - 20, 1120))

    price_pill(draw, W // 4, 1180, name_a, price_a)
    price_pill(draw, 3 * W // 4, 1180, name_b, price_b)

    return img


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    slides = [
        ("hero-mobile-range.jpg", slide_full_range()),
        (
            "hero-mobile-oil.jpg",
            slide_single_product(
                product_rel="products/rosemary-hair-oil/image-1.jpg",
                headline="Rosemary Hair Oil",
                subline="Hair fall · weak roots",
                price="₹399",
                volume="200 ml · Bestseller",
            ),
        ),
        (
            "hero-mobile-serum-shampoo.jpg",
            slide_duo(
                "products/rosemary-shampoo/image-1.jpg",
                "Shampoo",
                "₹349",
                "products/hair-scalp-serum/image-1.jpg",
                "Serum",
                "₹899",
                "Cleanse + treat",
            ),
        ),
    ]
    for name, im in slides:
        path = OUT / name
        im.save(path, "JPEG", quality=94, optimize=True)
        print(f"Wrote {path} ({path.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
