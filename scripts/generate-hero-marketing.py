#!/usr/bin/env python3
"""Mobile-first hero banners — products, Rs. prices, light ingredient strips."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "marketing" / "hero"
W, H = 1080, 1350

BG = (252, 251, 248)
GREEN = (28, 58, 42)
GREEN_LT = (220, 234, 226)
DARK = (10, 10, 10)
MUTED = (80, 80, 80)

FONT_SERIF_B = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"
FONT_SANS = "/Library/Fonts/Arial.ttf"
FONT_SANS_B = "/Library/Fonts/Arial Bold.ttf"

# Arial lacks ₹ glyph on many systems — use Rs. for reliable rendering
OIL_PRICE = 399
SHAMPOO_PRICE = 349
SERUM_PRICE = 899


def ft(path: str, size: int) -> ImageFont.FreeTypeFont:
    try:
        return ImageFont.truetype(path, size)
    except OSError:
        return ImageFont.load_default()


def rs(amount: int) -> str:
    return f"Rs.{amount}"


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


def price_pill(draw, cx: int, cy: int, label: str, amount: int):
    price = rs(amount)
    f_label = ft(FONT_SANS_B, 22)
    f_price = ft(FONT_SANS_B, 34)
    lw = draw.textlength(label, font=f_label)
    pw = draw.textlength(price, font=f_price)
    w = int(max(lw, pw) + 52)
    h = 92
    x0, y0 = cx - w // 2, cy - h // 2
    draw.rounded_rectangle((x0, y0, x0 + w, y0 + h), 14, fill=GREEN)
    draw.text((cx - lw / 2, y0 + 12), label, fill=(255, 255, 255), font=f_label)
    draw.text((cx - pw / 2, y0 + 44), price, fill=(255, 255, 255), font=f_price)


def draw_ingredient_strip(draw, y: int, title: str, items: list[tuple[str, str]]):
    """Compact 2x2 ingredient infographic row."""
    draw.rounded_rectangle((48, y, W - 48, y + 168), 16, fill=(255, 255, 255), outline=(210, 206, 198), width=2)
    draw.text((68, y + 16), title.upper(), fill=GREEN, font=ft(FONT_SANS_B, 18))

    col_w = (W - 136) // 2
    for idx, (name, hint) in enumerate(items[:4]):
        col, row = idx % 2, idx // 2
        x = 68 + col * (col_w + 8)
        yy = y + 48 + row * 56
        draw.ellipse((x, yy + 4, x + 36, yy + 40), fill=GREEN_LT, outline=GREEN, width=2)
        draw.text((x + 10, yy + 12), name[:2].upper(), fill=GREEN, font=ft(FONT_SANS_B, 14))
        draw.text((x + 44, yy + 6), name, fill=DARK, font=ft(FONT_SANS_B, 20))
        draw.text((x + 44, yy + 30), hint, fill=MUTED, font=ft(FONT_SANS, 17))


def slide_full_range():
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)

    center_text(draw, 40, "MISKA", ft(FONT_SANS_B, 24), GREEN)
    center_text(draw, 84, "Hair fall routine", ft(FONT_SERIF_B, 50), DARK)
    center_text(draw, 150, "Oil · Shampoo · Serum", ft(FONT_SANS_B, 26), MUTED)

    products = [
        ("products/rosemary-hair-oil/image-1.jpg", W // 6),
        ("products/rosemary-shampoo/image-1.jpg", W // 2),
        ("products/hair-scalp-serum/image-1.jpg", 5 * W // 6),
    ]
    y0, y1 = 190, 900
    slot_w = 320
    for rel, cx in products:
        paste_product(img, rel, (cx - slot_w // 2, y0, cx + slot_w // 2, y1))

    price_pill(draw, W // 6, 960, "Oil", OIL_PRICE)
    price_pill(draw, W // 2, 960, "Shampoo", SHAMPOO_PRICE)
    price_pill(draw, 5 * W // 6, 960, "Serum", SERUM_PRICE)

    draw_ingredient_strip(
        draw,
        1020,
        "Key actives in the range",
        [
            ("Rosemary", "Circulation"),
            ("Biotin", "Strength"),
            ("Redensyl", "Growth"),
            ("Caffeine", "DHT care"),
        ],
    )
    return img


def slide_single_product(
    *,
    product_rel: str,
    headline: str,
    subline: str,
    amount: int,
    volume: str,
    actives: list[tuple[str, str]],
):
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)

    center_text(draw, 44, "MISKA", ft(FONT_SANS_B, 24), GREEN)
    center_text(draw, 88, headline, ft(FONT_SERIF_B, 54), DARK)
    center_text(draw, 160, subline, ft(FONT_SANS_B, 30), GREEN)

    paste_product(img, product_rel, (80, 200, W - 80, 920))

    price = rs(amount)
    draw.rounded_rectangle((W // 2 - 170, 940, W // 2 + 170, 1020), 18, fill=GREEN)
    center_text(draw, 962, price, ft(FONT_SANS_B, 54), (255, 255, 255))
    center_text(draw, 1028, volume, ft(FONT_SANS_B, 24), MUTED)

    draw_ingredient_strip(draw, 1060, "Key actives", actives)
    return img


def slide_duo(
    product_a: str,
    name_a: str,
    amount_a: int,
    actives_a: list[tuple[str, str]],
    product_b: str,
    name_b: str,
    amount_b: int,
    actives_b: list[tuple[str, str]],
    title: str,
):
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)

    center_text(draw, 40, "MISKA", ft(FONT_SANS_B, 24), GREEN)
    center_text(draw, 84, title, ft(FONT_SERIF_B, 50), DARK)
    center_text(draw, 150, "Treatment wash + clinical serum", ft(FONT_SANS_B, 26), MUTED)

    paste_product(img, product_a, (20, 190, W // 2 - 10, 880))
    paste_product(img, product_b, (W // 2 + 10, 190, W - 20, 880))

    price_pill(draw, W // 4, 940, name_a, amount_a)
    price_pill(draw, 3 * W // 4, 940, name_b, amount_b)

    draw_ingredient_strip(draw, 1010, f"{name_a} actives", actives_a[:2] + actives_b[:2])
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
                amount=OIL_PRICE,
                volume="200 ml · Bestseller",
                actives=[
                    ("Rosemary", "Circulation"),
                    ("Biotin", "Strength"),
                    ("Caffeine", "DHT block"),
                    ("Castor", "Moisture"),
                ],
            ),
        ),
        (
            "hero-mobile-serum-shampoo.jpg",
            slide_duo(
                "products/rosemary-shampoo/image-1.jpg",
                "Shampoo",
                SHAMPOO_PRICE,
                [("Rosemary", "Follicles"), ("Moringa", "Antioxidant")],
                "products/hair-scalp-serum/image-1.jpg",
                "Serum",
                SERUM_PRICE,
                [("Redensyl", "Stem cells"), ("Procapil", "Root anchor")],
                "Cleanse + treat",
            ),
        ),
    ]
    for name, im in slides:
        path = OUT / name
        im.save(path, "JPEG", quality=94, optimize=True)
        print(f"Wrote {path}")


if __name__ == "__main__":
    main()
