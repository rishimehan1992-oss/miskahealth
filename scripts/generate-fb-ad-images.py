#!/usr/bin/env python3
"""
Facebook ad static images (1080x1080 feed + 1080x1350 feed).
Minimalist-inspired: science, whitespace, actives.
Pilgrim-inspired: lifestyle warmth, bundle offers, bold CTAs.
"""

from __future__ import annotations

import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
OUT = ROOT / "marketing" / "facebook-ads" / "static"

# Feed square + 4:5 (Meta recommends both)
SIZES = {
    "1080x1080": (1080, 1080),
    "1080x1350": (1080, 1350),
}

BG = (255, 255, 255)
BG_WARM = (252, 249, 244)
GREEN = (28, 58, 42)
GREEN_LT = (225, 238, 230)
WHITE = (255, 255, 255)
BLACK = (18, 18, 18)
MUTED = (100, 100, 100)
RED = (195, 65, 55)
CREAM = (245, 242, 235)

FONT_REG = "/System/Library/Fonts/Supplemental/Arial.ttf"
FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_SERIF = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"

OIL = {"price": 399, "mrp": 799, "vol": "200 ml"}
SHAMPOO = {"price": 349, "mrp": 699, "vol": "200 ml"}
SERUM = {"price": 899, "mrp": 1299, "vol": "60 ml"}
COMBO = OIL["price"] + SHAMPOO["price"]

PRODUCTS = {
    "oil": "products/rosemary-hair-oil/image-1.jpg",
    "shampoo": "products/rosemary-shampoo/image-1.jpg",
    "serum": "products/hair-scalp-serum/image-1.jpg",
    "oil_life": "products/rosemary-hair-oil/lifestyle/lifestyle-2.jpg",
    "oil_info": "products/rosemary-hair-oil/image-2.jpg",
}


def rs(n: int) -> str:
    return f"Rs.{n}"


def save_pct(price: int, mrp: int) -> int:
    return round((mrp - price) / mrp * 100)


def fnt(size: int, bold: bool = True, serif: bool = False) -> ImageFont.FreeTypeFont:
    path = FONT_SERIF if serif else (FONT_BOLD if bold else FONT_REG)
    if not os.path.isfile(path):
        raise FileNotFoundError(path)
    return ImageFont.truetype(path, size)


def load(rel: str) -> Image.Image:
    return Image.open(PUBLIC / rel).convert("RGB")


def paste(img: Image.Image, rel: str, box: tuple[int, int, int, int], bg=BG) -> None:
    p = load(rel)
    s = min((box[2] - box[0]) / p.width, (box[3] - box[1]) / p.height)
    nw, nh = int(p.width * s), int(p.height * s)
    r = p.resize((nw, nh), Image.Resampling.LANCZOS)
    c = Image.new("RGB", (box[2] - box[0], box[3] - box[1]), bg)
    c.paste(r, ((box[2] - box[0] - nw) // 2, (box[3] - box[1] - nh) // 2))
    img.paste(c, (box[0], box[1]))


def cx(
    draw: ImageDraw.ImageDraw,
    y: int,
    text: str,
    font,
    fill,
    W: int,
    x0: int = 0,
) -> int:
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text((x0 + (W - tw) // 2, y), text, font=font, fill=fill)
    return y + th


def brand_bar(draw: ImageDraw.ImageDraw, W: int, h_top: int = 88) -> None:
    draw.rectangle((0, 0, W, h_top), fill=GREEN)
    t = fnt(36, True)
    bbox = draw.textbbox((0, 0), "MISKA", font=t)
    draw.text(((W - bbox[2]) // 2, 18), "MISKA", font=t, fill=WHITE)
    s = fnt(18, False)
    sub = "Hair & Skin Science · Bangalore"
    b2 = draw.textbbox((0, 0), sub, font=s)
    draw.text(((W - b2[2]) // 2, 54), sub, font=s, fill=(215, 228, 220))


def chip_row(draw: ImageDraw.ImageDraw, y: int, items: list[str], W: int, x0: int = 48) -> int:
    """Minimalist-style active chips in a row/wrap."""
    gap = 12
    x, row_y = x0, y
    row_h = 0
    for item in items:
        f = fnt(22, True)
        tw = draw.textlength(item, font=f) + 36
        if x + tw > W - 48:
            x = x0
            row_y += row_h + gap
            row_h = 0
        draw.rounded_rectangle((x, row_y, x + int(tw), row_y + 48), 24, fill=GREEN_LT, outline=GREEN, width=2)
        draw.text((x + 18, row_y + 12), item, font=f, fill=GREEN)
        row_h = max(row_h, 48)
        x += int(tw) + gap
    return row_y + row_h + 16


def cta_button(draw: ImageDraw.ImageDraw, y: int, text: str, W: int, sub: str | None = None) -> int:
    h = 100 if not sub else 130
    draw.rounded_rectangle((56, y, W - 56, y + h), 28, fill=GREEN)
    f = fnt(34, True)
    cx(draw, y + 28, text, f, WHITE, W)
    if sub:
        cx(draw, y + 72, sub, fnt(22, False), (220, 235, 225), W)
    return y + h + 20


def scale_layout(fn, target_w: int, target_h: int) -> Image.Image:
    """Design at 1080x1080 then letterbox/pad to other sizes."""
    base_w, base_h = 1080, 1080
    base = fn(base_w, base_h)
    if (target_w, target_h) == (base_w, base_h):
        return base
    out = Image.new("RGB", (target_w, target_h), BG)
    # 4:5 — fit width, center vertically
    scale = target_w / base_w
    nh = int(base_h * scale)
    resized = base.resize((target_w, nh), Image.Resampling.LANCZOS)
    y_off = (target_h - nh) // 2
    out.paste(resized, (0, y_off))
    if y_off > 0:
        draw = ImageDraw.Draw(out)
        draw.rectangle((0, 0, target_w, y_off), fill=BG)
        draw.rectangle((0, y_off + nh, target_w, target_h), fill=BG)
    return out


# ─── Creative 1: Minimalist science ───────────────────────────────────────────


def ad_science(W: int, H: int) -> Image.Image:
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    brand_bar(d, W)
    y = 110
    y = cx(d, y, "Hair fall is a", fnt(44, serif=True), BLACK, W) + 8
    y = cx(d, y, "follicle problem.", fnt(44, serif=True), BLACK, W) + 20
    y = cx(d, y, "Not a cosmetic oil problem.", fnt(26, False), MUTED, W) + 28
    y = chip_row(d, y, ["Biotin", "Caffeine", "Redensyl", "Procapil", "Rosemary", "Capilia Longa"], W)
    paste(img, PRODUCTS["oil_info"], (120, y, W - 120, y + 380))
    y += 400
    cx(d, y, "Full formula on every pack.", fnt(24, True), GREEN, W)
    cta_button(d, H - 150, "Shop miskahealth.in", W, f"Oil from {rs(OIL['price'])}")
    return img


# ─── Creative 2: Pilgrim-style bundle offer ─────────────────────────────────


def ad_combo_offer(W: int, H: int) -> Image.Image:
    img = Image.new("RGB", (W, H), BG_WARM)
    d = ImageDraw.Draw(img)
    brand_bar(d, W)
    y = 108
    y = cx(d, y, "Complete hair fall routine", fnt(40, serif=True), BLACK, W) + 12
    y = cx(d, y, "Oil + Shampoo + Serum", fnt(26, False), MUTED, W) + 24
    cw = (W - 80 - 32) // 3
    top = y
    for i, (key, label, p) in enumerate([("oil", "Oil", OIL), ("shampoo", "Shampoo", SHAMPOO), ("serum", "Serum", SERUM)]):
        x0 = 40 + i * (cw + 16)
        paste(img, PRODUCTS[key], (x0, top, x0 + cw, top + 340), bg=BG_WARM)
        d.rectangle((x0, top + 350, x0 + cw, top + 420), fill=GREEN)
        cx(d, top + 358, label, fnt(24, True), WHITE, cw, x0)
        cx(d, top + 388, rs(p["price"]), fnt(28, True), WHITE, cw, x0)
    y = top + 450
    # Offer badge — Pilgrim style
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle((W // 2 - 200, y, W // 2 + 200, y + 72), 36, fill=RED)
    cx(draw, y + 18, f"COMBO99 · {rs(99)} OFF", fnt(32, True), WHITE, W)
    y += 90
    cx(draw, y, f"Bundle from {rs(COMBO)}", fnt(36, True), BLACK, W)
    cta_button(draw, H - 140, "Order now · COD available", W, "miskahealth.in")
    return img


# ─── Creative 3: Single hero + price (D2C classic) ───────────────────────────


def ad_oil_hero(W: int, H: int) -> Image.Image:
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    brand_bar(d, W)
    y = 108
    y = cx(d, y, "Rosemary Hair Oil", fnt(42, serif=True), BLACK, W) + 8
    y = cx(d, y, "Biotin · Caffeine · Castor", fnt(26, True), GREEN, W) + 20
    paste(img, PRODUCTS["oil"], (160, y, W - 160, y + 520))
    y += 540
    pct = save_pct(OIL["price"], OIL["mrp"])
    y = cx(d, y, rs(OIL["price"]), fnt(80, True), GREEN, W) + 8
    mrp = rs(OIL["mrp"])
    f = fnt(32, False)
    mw = d.textlength(mrp, font=f)
    cx_pos = (W - mw) // 2
    d.text((cx_pos, y), mrp, font=f, fill=(170, 170, 170))
    d.line((cx_pos - 8, y + 18, cx_pos + mw + 8, y + 18), fill=(170, 170, 170), width=3)
    y += 44
    draw = ImageDraw.Draw(img)
    bw = d.textlength(f"SAVE {pct}%", font=fnt(26, True)) + 40
    draw.rounded_rectangle(((W - bw) // 2, y, (W + bw) // 2, y + 50), 25, fill=GREEN)
    cx(d, y + 10, f"SAVE {pct}%", fnt(26, True), WHITE, W)
    cta_button(d, H - 140, "Shop now", W, "miskahealth.in")
    return img


# ─── Creative 4: Before / After static ────────────────────────────────────────


def ad_before_after(W: int, H: int) -> Image.Image:
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    brand_bar(d, W)
    y = 108
    y = cx(d, y, "Before  vs  After", fnt(44, serif=True), BLACK, W) + 8
    y = cx(d, y, "8-12 weeks · consistent routine", fnt(24, False), MUTED, W) + 24
    half = (W - 48) // 2

    def col(x0, title, lines, bg, fg, title_bg):
        d.rounded_rectangle((x0, y, x0 + half, y + 52), 12, fill=title_bg)
        cx(d, y + 10, title, fnt(28, True), WHITE, half, x0)
        py = y + 64
        for line in lines:
            d.rounded_rectangle((x0, py, x0 + half, py + 72), 12, fill=bg)
            cx(d, py + 20, line, fnt(22, True), fg, half, x0)
            py += 80
        return py

    col(24, "BEFORE", ["Excess hair fall", "Thinning hair", "Weak roots"], (55, 55, 58), WHITE, RED)
    col(24 + half + 8, "AFTER", ["Less daily fall*", "Stronger look*", "Healthier scalp*"], GREEN, WHITE, GREEN)
    paste(img, PRODUCTS["oil"], (200, y + 260, W - 200, y + 560))
    cx(d, y + 580, "*Results vary · patch test first", fnt(20, False), MUTED, W)
    cta_button(d, H - 130, "Start your MISKA routine", W, "miskahealth.in")
    return img


# ─── Creative 5: Trust + lifestyle (Pilgrim warmth) ───────────────────────────


def ad_lifestyle_trust(W: int, H: int) -> Image.Image:
    img = Image.new("RGB", (W, H), BG_WARM)
    d = ImageDraw.Draw(img)
    brand_bar(d, W)
    paste(img, PRODUCTS["oil_life"], (0, 88, W, 520), bg=BG_WARM)
    # gradient overlay for text
    overlay = Image.new("RGBA", (W, 200), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    for i in range(200):
        od.rectangle((0, i, W, i + 1), fill=(252, 249, 244, int(255 * i / 200)))
    img.paste(overlay.convert("RGB"), (0, 420))
    d = ImageDraw.Draw(img)
    y = 540
    y = cx(d, y, "Clinic-formulated", fnt(48, serif=True), BLACK, W) + 8
    y = cx(d, y, "in Bangalore", fnt(48, serif=True), BLACK, W) + 24
    for line in [
        "Sulphate & paraben free",
        "COD + prepaid on miskahealth.in",
        f"Oil {rs(OIL['price'])} · Shampoo {rs(SHAMPOO['price'])}",
    ]:
        y = cx(d, y, line, fnt(26, False), MUTED, W) + 12
    cta_button(d, H - 140, "Shop the hair fall routine", W, "miskahealth.in")
    return img


CREATIVES = [
    ("ad-01-science-actives", ad_science),
    ("ad-02-combo-offer", ad_combo_offer),
    ("ad-03-oil-hero-price", ad_oil_hero),
    ("ad-04-before-after", ad_before_after),
    ("ad-05-lifestyle-trust", ad_lifestyle_trust),
]


def main() -> None:
    fnt(24, True)  # verify fonts
    OUT.mkdir(parents=True, exist_ok=True)
    for name, builder in CREATIVES:
        for size_name, (tw, th) in SIZES.items():
            img = scale_layout(builder, tw, th)
            path = OUT / f"{name}-{size_name}.jpg"
            img.save(path, "JPEG", quality=95, optimize=True)
            print(f"Wrote {path}")


if __name__ == "__main__":
    main()
