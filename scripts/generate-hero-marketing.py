#!/usr/bin/env python3
"""Per-product hero slides: real bottle + actives infographic (high-contrast text)."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "marketing" / "hero"
W, H = 1400, 1260
SPLIT = 500

BG = (249, 248, 245)
PANEL = (255, 255, 255)
GREEN = (28, 58, 42)
GREEN_LT = (210, 228, 218)
DARK = (10, 10, 10)
MUTED = (55, 55, 55)
LINE = (200, 196, 188)

FONT_SERIF_B = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"
FONT_SANS = "/Library/Fonts/Arial.ttf"
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


def draw_active_row(draw, x: int, y: int, w: int, index: int, name: str, action: str, bar_pct: int):
    h = 128
    rounded_rect(draw, (x, y, x + w, y + h), 12, fill=PANEL, outline=LINE, width=2)
    draw.ellipse((x + 18, y + 28, x + 82, y + 92), fill=GREEN)
    draw.text((x + 38, y + 44), str(index), fill=(255, 255, 255), font=ft(FONT_SERIF_B, 30))
    draw.text((x + 98, y + 22), name, fill=DARK, font=ft(FONT_SANS_B, 28))
    draw.text((x + 98, y + 58), action, fill=GREEN, font=ft(FONT_SANS_B, 22))
    bx0, by0 = x + 98, y + 94
    bar_w = w - 118
    rounded_rect(draw, (bx0, by0, bx0 + bar_w, by0 + 18), 5, fill=GREEN_LT)
    rounded_rect(draw, (bx0, by0, bx0 + int(bar_w * bar_pct / 100), by0 + 18), 5, fill=GREEN)


def draw_flow_nodes(draw, x: int, y: int, panel_w: int, nodes: list[tuple[str, str]]):
    step = (panel_w - 40) // len(nodes)
    for i, (title, sub) in enumerate(nodes):
        cx = x + 30 + i * step + step // 2
        draw.ellipse((cx - 58, y, cx + 58, y + 110), fill=GREEN_LT, outline=GREEN, width=3)
        draw.text((cx - 52, y + 24), title, fill=DARK, font=ft(FONT_SANS_B, 20))
        draw.text((cx - 48, y + 56), sub, fill=MUTED, font=ft(FONT_SANS_B, 18))
        if i < len(nodes) - 1:
            nx = x + 30 + (i + 1) * step + step // 2
            draw.line((cx + 60, y + 55, nx - 60, y + 55), fill=GREEN, width=3)
            draw.polygon([(nx - 60, y + 55), (nx - 76, y + 47), (nx - 76, y + 63)], fill=GREEN)


def build_slide(
    *,
    filename: str,
    product_rel: str,
    label: str,
    name: str,
    tag: str,
    concern: str,
    volume: str,
    price: str,
    efficacy_title: str,
    formula: list[tuple[str, str, int]],
    flow_nodes: list[tuple[str, str]] | None = None,
):
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)

    rounded_rect(draw, (36, 36, SPLIT - 20, H - 36), 20, fill=PANEL, outline=LINE, width=2)
    paste_product(img, product_rel, (52, 110, SPLIT - 36, H - 200))
    draw.text((52, H - 150), volume, fill=MUTED, font=ft(FONT_SANS_B, 22))
    rounded_rect(draw, (52, H - 108, 240, H - 52), 10, fill=GREEN)
    draw.text((72, H - 88), price, fill=(255, 255, 255), font=ft(FONT_SANS_B, 28))

    rx = SPLIT + 4
    rounded_rect(draw, (rx, 36, W - 36, H - 36), 20, fill=PANEL, outline=LINE, width=2)

    ix = rx + 40
    iw = W - ix - 52

    draw.text((ix, 64), label.upper(), fill=GREEN, font=ft(FONT_SANS_B, 18))
    draw.text((ix, 96), name, fill=DARK, font=ft(FONT_SERIF_B, 44))
    draw.text((ix, 158), concern, fill=MUTED, font=ft(FONT_SANS_B, 24))

    rounded_rect(draw, (ix, 200, ix + 160, 242), 8, fill=GREEN_LT, outline=GREEN, width=1)
    draw.text((ix + 16, 210), tag, fill=GREEN, font=ft(FONT_SANS_B, 18))

    draw.text((ix, 268), efficacy_title.upper(), fill=GREEN, font=ft(FONT_SANS_B, 18))
    y = 304
    if flow_nodes:
        draw_flow_nodes(draw, ix, y, iw, flow_nodes)
        y += 138

    draw.text((ix, y), "KEY ACTIVES", fill=DARK, font=ft(FONT_SANS_B, 17))
    y += 36
    for i, (active, action, pct) in enumerate(formula, 1):
        draw_active_row(draw, ix, y, iw, i, active, action, pct)
        y += 140

    path = OUT / filename
    img.save(path, "JPEG", quality=95, optimize=True)
    print(f"Wrote {path}")


def main():
    OUT.mkdir(parents=True, exist_ok=True)

    build_slide(
        filename="hero-rosemary-hair-oil.jpg",
        product_rel="products/rosemary-hair-oil/image-1.jpg",
        label="No. 01",
        name="Rosemary Hair Oil",
        tag="Bestseller",
        concern="Hair fall · thinning · weak roots",
        volume="200 ml",
        price="₹399",
        efficacy_title="Works at the follicle",
        flow_nodes=[("Scalp", "Circulation"), ("Follicle", "DHT"), ("Strand", "Strength")],
        formula=[
            ("Rosemary", "Boosts scalp circulation", 90),
            ("Caffeine", "Helps block DHT", 88),
            ("Biotin", "Stronger hair shaft", 86),
            ("Castor Oil", "Seals moisture", 82),
        ],
    )

    build_slide(
        filename="hero-rosemary-shampoo.jpg",
        product_rel="products/rosemary-shampoo/image-1.jpg",
        label="No. 02",
        name="Rosemary Shampoo",
        tag="Treatment wash",
        concern="Hair fall · oily scalp · breakage",
        volume="200 ml",
        price="₹399",
        efficacy_title="Actives every wash",
        flow_nodes=[("Cleanse", "SLS-free"), ("Activate", "Scalp"), ("Strengthen", "Strands")],
        formula=[
            ("Rosemary", "Stimulates follicles", 88),
            ("Caffeine", "Scalp penetration", 86),
            ("Moringa", "Antioxidant care", 84),
            ("Capilia Longa", "Density support", 82),
        ],
    )

    build_slide(
        filename="hero-hair-scalp-serum.jpg",
        product_rel="products/hair-scalp-serum/image-1.jpg",
        label="No. 03",
        name="Hairfall Control Serum",
        tag="Clinical · New",
        concern="Severe hair loss · weak follicles",
        volume="60 ml",
        price="₹499",
        efficacy_title="Growth-phase follicles",
        flow_nodes=[("Anagen", "Extend"), ("Anchor", "Root"), ("Density", "Thicker")],
        formula=[
            ("Redensyl", "Reactivates stem cells", 92),
            ("Procapil", "Stronger root anchor", 90),
            ("Anagain", "Extends growth phase", 87),
            ("Capilia Longa", "Density & thickness", 85),
        ],
    )


if __name__ == "__main__":
    main()
