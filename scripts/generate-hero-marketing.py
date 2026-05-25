#!/usr/bin/env python3
"""Per-product hero slides: real bottle + actives infographic."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "marketing" / "hero"
W, H = 1200, 1080
SPLIT = 440

BG = (249, 248, 245)
PANEL = (255, 255, 255)
GREEN = (28, 58, 42)
GREEN_LT = (220, 232, 224)
DARK = (10, 10, 10)
MUTED = (102, 102, 102)
LINE = (229, 226, 219)

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
    rounded_rect(draw, (x, y, x + w, y + 108), 10, fill=PANEL, outline=LINE)
    draw.ellipse((x + 16, y + 24, x + 72, y + 80), fill=GREEN)
    draw.text((x + 36, y + 38), str(index), fill=(255, 255, 255), font=ft(FONT_SERIF_B, 24))
    draw.text((x + 88, y + 18), name, fill=DARK, font=ft(FONT_SANS_B, 24))
    draw.text((x + 88, y + 50), action, fill=GREEN, font=ft(FONT_SANS, 19))
    bx0, by0 = x + 88, y + 78
    bar_w = w - 110
    rounded_rect(draw, (bx0, by0, bx0 + bar_w, by0 + 14), 4, fill=GREEN_LT)
    rounded_rect(draw, (bx0, by0, bx0 + int(bar_w * bar_pct / 100), by0 + 14), 4, fill=GREEN)


def draw_flow_nodes(draw, x: int, y: int, nodes: list[tuple[str, str]]):
    """Small scalp → follicle → strand flow."""
    step = (W - SPLIT - 80) // len(nodes)
    for i, (title, sub) in enumerate(nodes):
        cx = x + 50 + i * step
        draw.ellipse((cx - 48, y, cx + 48, y + 96), fill=GREEN_LT, outline=GREEN, width=2)
        draw.text((cx - 40, y + 22), title, fill=DARK, font=ft(FONT_SANS_B, 16))
        draw.text((cx - 36, y + 48), sub, fill=MUTED, font=ft(FONT_SANS, 14))
        if i < len(nodes) - 1:
            nx = x + 50 + (i + 1) * step
            draw.line((cx + 52, y + 48, nx - 52, y + 48), fill=GREEN, width=2)
            draw.polygon([(nx - 52, y + 48), (nx - 64, y + 42), (nx - 64, y + 54)], fill=GREEN)


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

    # Left — product
    rounded_rect(draw, (32, 32, SPLIT - 16, H - 32), 18, fill=PANEL, outline=LINE)
    paste_product(img, product_rel, (48, 100, SPLIT - 32, H - 160))
    draw.text((48, H - 120), volume, fill=MUTED, font=ft(FONT_SANS, 18))
    rounded_rect(draw, (48, H - 88, 200, H - 48), 8, fill=GREEN)
    draw.text((64, H - 76), price, fill=(255, 255, 255), font=ft(FONT_SANS_B, 22))

    # Right — infographic panel
    rx = SPLIT + 8
    rounded_rect(draw, (rx, 32, W - 32, H - 32), 18, fill=PANEL, outline=LINE)
    draw.line((SPLIT, 32, SPLIT, H - 32), fill=LINE, width=2)

    ix = rx + 36
    iw = W - ix - 48

    draw.text((ix, 56), label.upper(), fill=GREEN, font=ft(FONT_SANS_B, 14))
    draw.text((ix, 82), name, fill=DARK, font=ft(FONT_SERIF_B, 36))
    draw.text((ix, 132), concern, fill=MUTED, font=ft(FONT_SANS, 20))

    rounded_rect(draw, (ix, 168, ix + 120, 200), 6, fill=GREEN_LT)
    draw.text((ix + 12, 176), tag, fill=GREEN, font=ft(FONT_SANS_B, 14))

    draw.text((ix, 220), efficacy_title.upper(), fill=GREEN, font=ft(FONT_SANS_B, 15))
    y = 252
    if flow_nodes:
        draw_flow_nodes(draw, ix, y, flow_nodes)
        y += 120

    draw.text((ix, y), "KEY ACTIVES & EFFICACY", fill=MUTED, font=ft(FONT_SANS_B, 13))
    y += 32
    for i, (active, action, pct) in enumerate(formula, 1):
        draw_active_row(draw, ix, y, iw, i, active, action, pct)
        y += 118

    draw.text((ix, H - 72), "MISKA · Hair & Skin Science", fill=MUTED, font=ft(FONT_SANS, 16))

    path = OUT / filename
    img.save(path, "JPEG", quality=94, optimize=True)
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
            ("Biotin", "Strengthens hair shaft", 86),
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
        efficacy_title="Deposits actives every wash",
        flow_nodes=[("Cleanse", "SLS-free"), ("Activate", "Scalp"), ("Strengthen", "Strands")],
        formula=[
            ("Rosemary", "Stimulates follicles", 88),
            ("Caffeine", "Deep scalp penetration", 86),
            ("Moringa", "Antioxidant scalp care", 84),
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
            ("Procapil", "Strengthens follicle anchor", 90),
            ("Anagain", "Extends growth phase", 87),
            ("Capilia Longa", "Density & thickness", 85),
        ],
    )


if __name__ == "__main__":
    main()
