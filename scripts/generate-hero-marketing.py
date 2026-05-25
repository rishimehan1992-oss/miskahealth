#!/usr/bin/env python3
"""Visual-first hero slides: product + glanceable ingredient graphic."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "marketing" / "hero"
W, H = 1400, 1260
SPLIT = 520

BG = (249, 248, 245)
PANEL = (255, 255, 255)
GREEN = (28, 58, 42)
GREEN_LT = (220, 234, 226)
DARK = (10, 10, 10)
LINE = (210, 206, 198)

FONT_SERIF_B = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"
FONT_SANS_B = "/Library/Fonts/Arial Bold.ttf"


def ft(path: str, size: int) -> ImageFont.FreeTypeFont:
    try:
        return ImageFont.truetype(path, size)
    except OSError:
        return ImageFont.load_default()


def rounded_rect(draw, xy, r: int, fill, outline=None, width=1):
    draw.rounded_rectangle(xy, radius=r, fill=fill, outline=outline, width=width)


def paste_product(base: Image.Image, rel: str, box: tuple[int, int, int, int]):
    path = ROOT / "public" / rel.lstrip("/")
    if not path.exists():
        return
    thumb = Image.open(path).convert("RGBA")
    thumb = ImageOps.contain(thumb, (box[2] - box[0], box[3] - box[1]), Image.Resampling.LANCZOS)
    x = box[0] + ((box[2] - box[0]) - thumb.width) // 2
    y = box[1] + ((box[3] - box[1]) - thumb.height) // 2
    base.paste(thumb, (x, y), thumb)


def draw_arrow_flow(draw, x: int, y: int, w: int, steps: list[str]):
    n = len(steps)
    gap = w // n
    for i, label in enumerate(steps):
        cx = x + gap * i + gap // 2
        draw.ellipse((cx - 72, y, cx + 72, y + 144), fill=GREEN_LT, outline=GREEN, width=4)
        f = ft(FONT_SANS_B, 26)
        tw = draw.textlength(label, font=f)
        draw.text((cx - tw / 2, y + 54), label, fill=DARK, font=f)
        if i < n - 1:
            nx = x + gap * (i + 1) + gap // 2
            draw.line((cx + 76, y + 72, nx - 76, y + 72), fill=GREEN, width=5)
            draw.polygon([(nx - 76, y + 72), (nx - 96, y + 60), (nx - 96, y + 84)], fill=GREEN)


def draw_ingredient_tile(draw, x: int, y: int, abbr: str, name: str, hint: str, accent: tuple[int, int, int]):
    size = 200
    rounded_rect(draw, (x, y, x + size, y + size), 16, fill=PANEL, outline=LINE, width=2)
    draw.ellipse((x + 50, y + 28, x + 150, y + 128), fill=accent)
    af = ft(FONT_SANS_B, 36)
    atw = draw.textlength(abbr, font=af)
    draw.text((x + (size - atw) / 2, y + 58), abbr, fill=(255, 255, 255), font=af)
    nf = ft(FONT_SANS_B, 22)
    ntw = draw.textlength(name, font=nf)
    draw.text((x + (size - ntw) / 2, y + 142), name, fill=DARK, font=nf)
    hf = ft(FONT_SANS_B, 17)
    htw = draw.textlength(hint, font=hf)
    draw.text((x + (size - htw) / 2, y + 170), hint, fill=GREEN, font=hf)


def build_slide(
    *,
    filename: str,
    product_rel: str,
    name: str,
    tag: str,
    outcome: str,
    volume: str,
    price: str,
    flow: list[str],
    tiles: list[tuple[str, str, str, tuple[int, int, int]]],
):
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)

    # Product panel
    rounded_rect(draw, (40, 40, SPLIT - 24, H - 40), 22, fill=PANEL, outline=LINE, width=2)
    paste_product(img, product_rel, (56, 80, SPLIT - 40, H - 220))
    rounded_rect(draw, (56, H - 180, 280, H - 56), 14, fill=GREEN)
    draw.text((80, H - 148), price, fill=(255, 255, 255), font=ft(FONT_SANS_B, 40))
    draw.text((80, H - 96), volume, fill=(220, 230, 220), font=ft(FONT_SANS_B, 22))

    # Infographic panel
    rx = SPLIT + 8
    rounded_rect(draw, (rx, 40, W - 40, H - 40), 22, fill=PANEL, outline=LINE, width=2)
    ix = rx + 48
    iw = W - ix - 56

    draw.text((ix, 72), name, fill=DARK, font=ft(FONT_SERIF_B, 48))
    rounded_rect(draw, (ix, 148, ix + 200, 196), 10, fill=GREEN_LT, outline=GREEN, width=2)
    draw.text((ix + 20, 160), tag, fill=GREEN, font=ft(FONT_SANS_B, 20))

    rounded_rect(draw, (ix, 220, ix + iw, 300), 14, fill=GREEN)
    of = ft(FONT_SANS_B, 30)
    otw = draw.textlength(outcome, font=of)
    draw.text((ix + (iw - otw) / 2, 248), outcome, fill=(255, 255, 255), font=of)

    draw_arrow_flow(draw, ix, 330, iw, flow)

    tile_size = 220
    gap = 28
    grid_w = tile_size * 2 + gap
    gx = ix + (iw - grid_w) // 2
    ty = 500
    for idx, (abbr, ing_name, hint, color) in enumerate(tiles):
        col = idx % 2
        row = idx // 2
        tx = gx + col * (tile_size + gap)
        ty_row = ty + row * (tile_size + gap)
        draw_ingredient_tile(draw, tx, ty_row, abbr, ing_name, hint, color)

    path = OUT / filename
    img.save(path, "JPEG", quality=95, optimize=True)
    print(f"Wrote {path}")


# Ingredient accent colors (brand greens + variants)
C_ROSEMARY = (28, 58, 42)
C_CAFFEINE = (92, 64, 42)
C_BIOTIN = (42, 92, 82)
C_CASTOR = (58, 78, 48)
C_MORINGA = (72, 110, 52)
C_CAPILIA = (38, 72, 58)
C_REDENSYL = (28, 58, 42)
C_PROCAPIL = (48, 88, 72)
C_ANAGAIN = (62, 52, 88)
C_PEPTIDE = (34, 68, 54)


def main():
    OUT.mkdir(parents=True, exist_ok=True)

    build_slide(
        filename="hero-rosemary-hair-oil.jpg",
        product_rel="products/rosemary-hair-oil/image-1.jpg",
        name="Rosemary Hair Oil",
        tag="Bestseller",
        outcome="↓ Hair fall   ↑ Stronger roots",
        volume="200 ml",
        price="₹399",
        flow=["Scalp", "Root", "Hair"],
        tiles=[
            ("Ro", "Rosemary", "Circulation", C_ROSEMARY),
            ("Ca", "Caffeine", "Block DHT", C_CAFFEINE),
            ("Bi", "Biotin", "Strength", C_BIOTIN),
            ("Co", "Castor", "Moisture", C_CASTOR),
        ],
    )

    build_slide(
        filename="hero-rosemary-shampoo.jpg",
        product_rel="products/rosemary-shampoo/image-1.jpg",
        name="Rosemary Shampoo",
        tag="Treatment wash",
        outcome="↓ Breakage   ↑ Scalp health",
        volume="200 ml",
        price="₹399",
        flow=["Cleanse", "Activate", "Protect"],
        tiles=[
            ("Ro", "Rosemary", "Follicles", C_ROSEMARY),
            ("Ca", "Caffeine", "Penetrates", C_CAFFEINE),
            ("Mo", "Moringa", "Antioxidant", C_MORINGA),
            ("CL", "Capilia", "Density", C_CAPILIA),
        ],
    )

    build_slide(
        filename="hero-hair-scalp-serum.jpg",
        product_rel="products/hair-scalp-serum/image-1.jpg",
        name="Hairfall Serum",
        tag="Clinical",
        outcome="↓ Hair loss   ↑ Growth phase",
        volume="60 ml",
        price="₹499",
        flow=["Stem", "Root", "Growth"],
        tiles=[
            ("Re", "Redensyl", "Reactivate", C_REDENSYL),
            ("Pr", "Procapil", "Anchor", C_PROCAPIL),
            ("An", "Anagain", "Anagen", C_ANAGAIN),
            ("CL", "Capilia", "Thickness", C_CAPILIA),
        ],
    )


if __name__ == "__main__":
    main()
