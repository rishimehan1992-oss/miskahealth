#!/usr/bin/env python3
"""Generate homepage hero marketing slides (ingredients & efficacy)."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps

FONT_SERIF = "/System/Library/Fonts/Supplemental/Georgia.ttf"
FONT_SERIF_B = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"
FONT_SANS = "/Library/Fonts/Arial.ttf"
FONT_SANS_B = "/Library/Fonts/Arial Bold.ttf"


def ft(path: str, size: int) -> ImageFont.FreeTypeFont:
    try:
        return ImageFont.truetype(path, size)
    except OSError:
        return ImageFont.load_default()

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "marketing" / "hero"
W, H = 1200, 1500

BG = (249, 248, 245)  # #F9F8F5
SURFACE = (253, 252, 250)  # #FDFCFA
GREEN = (28, 58, 42)  # #1C3A2A
GREEN_SOFT = (28, 58, 42, 28)
DARK = (10, 10, 10)
MUTED = (102, 102, 102)
LINE = (229, 226, 219)  # #E5E2DB
ACCENT = (212, 208, 200)


def load_fonts() -> tuple[ImageFont.FreeTypeFont, ImageFont.FreeTypeFont, ImageFont.FreeTypeFont, ImageFont.FreeTypeFont]:
    return ft(FONT_SERIF, 44), ft(FONT_SERIF_B, 52), ft(FONT_SANS, 22), ft(FONT_SANS, 14)


def rounded_rect(draw: ImageDraw.ImageDraw, xy, r: int, fill, outline=None, width=1):
    draw.rounded_rectangle(xy, radius=r, fill=fill, outline=outline, width=width)


def draw_eyebrow(draw, text: str, y: int, small: ImageFont.FreeTypeFont):
    draw.text((80, y), text.upper(), fill=GREEN, font=small)


def draw_headline(draw, lines: list[str], y: int, serif: ImageFont.FreeTypeFont, serif_b: ImageFont.FreeTypeFont):
    cy = y
    for i, line in enumerate(lines):
        font = ft(FONT_SERIF_B, 52) if i == 0 else ft(FONT_SERIF, 44)
        size = 52 if i == 0 else 44
        draw.text((80, cy), line, fill=DARK, font=font)
        cy += size + 14


def active_card(
    draw: ImageDraw.ImageDraw,
    y: int,
    title: str,
    action: str,
    detail: str,
    index: int,
):
    rounded_rect(draw, (72, y, W - 72, y + 168), 16, fill=SURFACE, outline=LINE, width=1)
    draw.ellipse((96, y + 36, 156, y + 96), fill=GREEN)
    draw.text((112, y + 48), str(index), fill=(255, 255, 255), font=ft(FONT_SERIF_B, 28))
    draw.text((180, y + 32), title, fill=DARK, font=ft(FONT_SANS, 26))
    draw.text((180, y + 72), action, fill=GREEN, font=ft(FONT_SANS_B, 22))
    draw.text((180, y + 108), detail, fill=MUTED, font=ft(FONT_SANS, 20))


def slide_hair_fall_actives(serif, serif_b, sans, small):
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)

    draw_eyebrow(draw, "Clinical actives", 100, small)
    draw_headline(draw, ["Target hair fall", "at the follicle"], 140, serif, serif_b)

    draw.text(
        (80, 320),
        "Each active works on a different stage of the hair cycle — circulation, DHT, and shaft strength.",
        fill=MUTED,
        font=sans,
    )

    items = [
        ("Rosemary", "Boosts scalp circulation", "More nutrient delivery to the root"),
        ("Caffeine", "Helps block DHT", "Supports follicles against hormonal thinning"),
        ("Biotin", "Strengthens hair shaft", "Reduces breakage from weak strands"),
    ]
    y = 420
    for i, (title, action, detail) in enumerate(items, 1):
        active_card(draw, y, title, action, detail, i)
        y += 188

    rounded_rect(draw, (72, H - 200, W - 72, H - 88), 12, fill=GREEN)
    draw.text((100, H - 168), "MISKA · Hair & Skin Science", fill=(255, 255, 255), font=small)
    draw.text((100, H - 132), "Formulated for hair fall · thinning · weak roots", fill=(220, 230, 220), font=sans)

    return img


def slide_clinical_peptides(serif, serif_b, sans, small):
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)

    draw_eyebrow(draw, "Peptide science", 100, small)
    draw_headline(draw, ["Reactivate growth-phase", "follicles"], 140, serif, serif_b)

    draw.text(
        (80, 320),
        "Concentrated serum actives used in clinical hair-loss formulations.",
        fill=MUTED,
        font=sans,
    )

    peptides = [
        ("Redensyl", "Stem cell support", "Reactivates dormant follicles"),
        ("Procapil", "Follicle anchor", "Strengthens root attachment"),
        ("Anagain", "Growth phase", "Extends anagen (growth) window"),
        ("Capilia Longa", "Density support", "Thickness & visible fullness"),
    ]

    y = 400
    col_w = (W - 160) // 2
    for idx, (name, action, detail) in enumerate(peptides):
        col = idx % 2
        row = idx // 2
        x0 = 72 + col * (col_w + 16)
        y0 = y + row * 200
        rounded_rect(draw, (x0, y0, x0 + col_w, y0 + 176), 14, fill=SURFACE, outline=LINE)
        draw.rectangle((x0, y0, x0 + 6, y0 + 176), fill=GREEN)
        draw.text((x0 + 28, y0 + 24), name, fill=DARK, font=ft(FONT_SANS, 24))
        draw.text((x0 + 28, y0 + 62), action, fill=GREEN, font=ft(FONT_SANS, 20))
        draw.text((x0 + 28, y0 + 98), detail, fill=MUTED, font=ft(FONT_SANS, 18))

    draw.text((80, H - 120), "Hairfall Control Serum · 60 ml", fill=MUTED, font=sans)
    draw.text((80, H - 88), "Severe hair loss & weak follicles", fill=GREEN, font=sans)

    return img


def paste_thumb(base: Image.Image, rel_path: str, box: tuple[int, int, int, int]):
    path = ROOT / "public" / rel_path.lstrip("/")
    if not path.exists():
        return
    thumb = Image.open(path).convert("RGBA")
    thumb = ImageOps.contain(thumb, (box[2] - box[0], box[3] - box[1]), Image.Resampling.LANCZOS)
    x = box[0] + ((box[2] - box[0]) - thumb.width) // 2
    y = box[1] + ((box[3] - box[1]) - thumb.height) // 2
    if thumb.mode == "RGBA":
        base.paste(thumb, (x, y), thumb)
    else:
        base.paste(thumb, (x, y))


def slide_three_step_routine(serif, serif_b, sans, small):
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)

    draw_eyebrow(draw, "Complete routine", 100, small)
    draw_headline(draw, ["Oil → Shampoo → Serum"], 140, serif, serif_b)

    draw.text(
        (80, 300),
        "A simple 3-step system for hair fall — cleanse, treat, and seal actives daily.",
        fill=MUTED,
        font=sans,
    )

    steps = [
        ("01 · Oil", "Rosemary + Biotin + Caffeine", "Nourish roots · night massage"),
        ("02 · Shampoo", "Treatment wash · SLS-free", "Deposit actives every wash"),
        ("03 · Serum", "Redensyl · Procapil · Anagain", "Targeted follicle treatment"),
    ]
    y = 380
    for title, sub, detail in steps:
        rounded_rect(draw, (72, y, W - 72, y + 130), 14, fill=SURFACE, outline=LINE)
        draw.text((100, y + 22), title, fill=GREEN, font=ft(FONT_SANS_B, 24))
        draw.text((100, y + 58), sub, fill=DARK, font=sans)
        draw.text((100, y + 92), detail, fill=MUTED, font=ft(FONT_SANS, 19))
        y += 148

    # Product thumbs
    thumb_y = y + 24
    slot_w = (W - 144) // 3
    products = [
        "products/rosemary-hair-oil/image-1.jpg",
        "products/rosemary-shampoo/image-1.jpg",
        "products/hair-scalp-serum/image-1.jpg",
    ]
    for i, rel in enumerate(products):
        x0 = 72 + i * (slot_w + 12)
        rounded_rect(draw, (x0, thumb_y, x0 + slot_w, thumb_y + 280), 12, fill=(255, 255, 255), outline=LINE)
        paste_thumb(img, rel, (x0 + 12, thumb_y + 12, x0 + slot_w - 12, thumb_y + 268))

    draw.text((80, H - 72), "Shop the full range · Dermatologist tested", fill=MUTED, font=small)

    return img


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    serif, serif_b, sans, small = load_fonts()

    slides = [
        ("hair-fall-actives.jpg", slide_hair_fall_actives(serif, serif_b, sans, small)),
        ("clinical-peptides.jpg", slide_clinical_peptides(serif, serif_b, sans, small)),
        ("three-step-routine.jpg", slide_three_step_routine(serif, serif_b, sans, small)),
    ]

    for name, im in slides:
        path = OUT / name
        im.save(path, "JPEG", quality=92, optimize=True)
        print(f"Wrote {path} ({path.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
