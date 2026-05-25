#!/usr/bin/env python3
"""Generate homepage hero infographic slides (visual, minimal copy)."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "marketing" / "hero"
W, H = 1080, 1080

BG = (249, 248, 245)
SURFACE = (255, 255, 255)
GREEN = (28, 58, 42)
GREEN_LT = (220, 232, 224)
DARK = (10, 10, 10)
MUTED = (102, 102, 102)
LINE = (229, 226, 219)

FONT_SERIF_B = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"
FONT_SERIF = "/System/Library/Fonts/Supplemental/Georgia.ttf"
FONT_SANS = "/Library/Fonts/Arial.ttf"
FONT_SANS_B = "/Library/Fonts/Arial Bold.ttf"


def ft(path: str, size: int) -> ImageFont.FreeTypeFont:
    try:
        return ImageFont.truetype(path, size)
    except OSError:
        return ImageFont.load_default()


def rounded_rect(draw, xy, r: int, fill, outline=None, width=1):
    draw.rounded_rectangle(xy, radius=r, fill=fill, outline=outline, width=width)


def draw_arrow_h(draw, x1: int, y: int, x2: int):
    draw.line((x1, y, x2 - 14, y), fill=GREEN, width=3)
    draw.polygon([(x2, y), (x2 - 16, y - 8), (x2 - 16, y + 8)], fill=GREEN)


def draw_follicle_icon(draw, cx: int, cy: int, scale: float = 1.0):
    s = scale
    draw.ellipse((cx - 28 * s, cy - 18 * s, cx + 28 * s, cy + 18 * s), fill=GREEN_LT, outline=GREEN, width=2)
    draw.rectangle((cx - 6 * s, cy - 50 * s, cx + 6 * s, cy - 18 * s), fill=GREEN)
    for i in range(5):
        ox = (i - 2) * 10 * s
        draw.line((cx + ox, cy - 50 * s, cx + ox * 0.6, cy - 72 * s), fill=DARK, width=2)


def slide_hair_fall_actives():
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)

    draw.text((56, 48), "HOW ACTIVES FIGHT HAIR FALL", fill=GREEN, font=ft(FONT_SANS_B, 16))
    draw.text((56, 82), "Follicle → shaft", fill=DARK, font=ft(FONT_SERIF_B, 40))

    # Hair cycle flow
    nodes = [
        (200, 200, "SCALP", "Circulation"),
        (540, 200, "FOLLICLE", "DHT block"),
        (880, 200, "STRAND", "Strength"),
    ]
    draw_arrow_h(draw, 248, 200, 492)
    draw_arrow_h(draw, 588, 200, 832)

    actives = [
        ("Rosemary", "Boosts blood flow to roots"),
        ("Caffeine", "Helps block DHT"),
        ("Biotin", "Stronger, less breakage"),
    ]

    for i, (cx, cy, label, sub) in enumerate(nodes):
        draw.ellipse((cx - 70, cy - 70, cx + 70, cy + 70), fill=SURFACE, outline=GREEN, width=3)
        draw.text((cx - 52, cy - 12), label, fill=DARK, font=ft(FONT_SANS_B, 22))
        draw.text((cx - 48, cy + 18), sub, fill=MUTED, font=ft(FONT_SANS, 16))

    y = 340
    for i, (name, benefit) in enumerate(actives):
        rounded_rect(draw, (56, y, W - 56, y + 120), 14, fill=SURFACE, outline=LINE)
        draw.rectangle((56, y, 68, y + 120), fill=GREEN)
        draw.ellipse((88, y + 28, 148, y + 88), fill=GREEN)
        draw.text((108, y + 42), str(i + 1), fill=(255, 255, 255), font=ft(FONT_SERIF_B, 26))
        draw.text((168, y + 28), name, fill=DARK, font=ft(FONT_SANS_B, 28))
        draw.text((168, y + 68), benefit, fill=GREEN, font=ft(FONT_SANS, 22))
        y += 136

    draw_follicle_icon(draw, 880, 520, 1.4)
    draw.text((56, H - 88), "Hair fall · thinning · weak roots", fill=MUTED, font=ft(FONT_SANS, 18))
    rounded_rect(draw, (56, H - 56, 320, H - 20), 8, fill=GREEN)
    draw.text((72, H - 44), "MISKA", fill=(255, 255, 255), font=ft(FONT_SANS_B, 18))

    return img


def slide_clinical_peptides():
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)

    draw.text((56, 48), "SERUM PEPTIDE SCIENCE", fill=GREEN, font=ft(FONT_SANS_B, 16))
    draw.text((56, 82), "Growth-phase follicles", fill=DARK, font=ft(FONT_SERIF_B, 40))

    peptides = [
        ("Redensyl", 92, "Stem cells"),
        ("Procapil", 88, "Root anchor"),
        ("Anagain", 85, "Growth phase"),
        ("Capilia Longa", 80, "Density"),
    ]

    y = 160
    bar_max_w = W - 280
    for name, score, label in peptides:
        rounded_rect(draw, (56, y, W - 56, y + 148), 12, fill=SURFACE, outline=LINE)
        draw.text((80, y + 20), name, fill=DARK, font=ft(FONT_SANS_B, 26))
        draw.text((80, y + 54), label, fill=MUTED, font=ft(FONT_SANS, 20))
        bx0, by0 = 80, y + 92
        rounded_rect(draw, (bx0, by0, bx0 + bar_max_w, by0 + 22), 6, fill=GREEN_LT)
        fill_w = int(bar_max_w * score / 100)
        rounded_rect(draw, (bx0, by0, bx0 + fill_w, by0 + 22), 6, fill=GREEN)
        draw.text((bx0 + bar_max_w + 16, by0 - 2), f"{score}%", fill=GREEN, font=ft(FONT_SANS_B, 20))
        y += 164

    draw_follicle_icon(draw, W - 180, H - 220, 1.2)
    draw.text((56, H - 72), "Hairfall Control Serum · 60 ml", fill=DARK, font=ft(FONT_SANS_B, 20))
    draw.text((56, H - 44), "Severe hair loss & weak follicles", fill=MUTED, font=ft(FONT_SANS, 18))

    return img


def paste_thumb(base: Image.Image, rel_path: str, box: tuple[int, int, int, int]):
    path = ROOT / "public" / rel_path.lstrip("/")
    if not path.exists():
        return
    thumb = Image.open(path).convert("RGBA")
    thumb = ImageOps.contain(thumb, (box[2] - box[0], box[3] - box[1]), Image.Resampling.LANCZOS)
    x = box[0] + ((box[2] - box[0]) - thumb.width) // 2
    y = box[1] + ((box[3] - box[1]) - thumb.height) // 2
    base.paste(thumb, (x, y), thumb)


def slide_three_step_routine():
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)

    draw.text((56, 48), "3-STEP HAIR FALL SYSTEM", fill=GREEN, font=ft(FONT_SANS_B, 16))
    draw.text((56, 82), "Cleanse · Treat · Seal", fill=DARK, font=ft(FONT_SERIF_B, 40))

    steps = ["OIL", "SHAMPOO", "SERUM"]
    cx = [200, 540, 880]
    for i in range(2):
        draw_arrow_h(draw, cx[i] + 80, 168, cx[i + 1] - 80)

    for i, (x, label) in enumerate(zip(cx, steps)):
        draw.ellipse((x - 56, 120, x + 56, 232), fill=GREEN if i == 1 else SURFACE, outline=GREEN, width=3)
        color = (255, 255, 255) if i == 1 else DARK
        draw.text((x - 42, 158), label, fill=color, font=ft(FONT_SANS_B, 20))

    products = [
        ("products/rosemary-hair-oil/image-1.jpg", "Night roots"),
        ("products/rosemary-shampoo/image-1.jpg", "Daily wash"),
        ("products/hair-scalp-serum/image-1.jpg", "Follicle boost"),
    ]
    slot_w = 300
    y0 = 280
    for i, (rel, caption) in enumerate(products):
        x0 = 56 + i * (slot_w + 24)
        rounded_rect(draw, (x0, y0, x0 + slot_w, y0 + 520), 16, fill=SURFACE, outline=LINE)
        paste_thumb(img, rel, (x0 + 16, y0 + 16, x0 + slot_w - 16, y0 + 440))
        draw.text((x0 + 20, y0 + 468), caption, fill=GREEN, font=ft(FONT_SANS_B, 20))

    draw.text((56, H - 48), "Dermatologist tested · Made in India", fill=MUTED, font=ft(FONT_SANS, 18))

    return img


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for name, fn in [
        ("hair-fall-actives.jpg", slide_hair_fall_actives),
        ("clinical-peptides.jpg", slide_clinical_peptides),
        ("three-step-routine.jpg", slide_three_step_routine),
    ]:
        path = OUT / name
        fn().save(path, "JPEG", quality=93, optimize=True)
        print(f"Wrote {path}")


if __name__ == "__main__":
    main()
