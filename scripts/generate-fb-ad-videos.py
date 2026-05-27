#!/usr/bin/env python3
"""Generate 9:16 Facebook/Reels ad videos from MISKA product assets."""

from __future__ import annotations

import os
from pathlib import Path

import imageio.v3 as iio
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
OUT = ROOT / "marketing" / "facebook-ads"
OUT.mkdir(parents=True, exist_ok=True)

W, H = 1080, 1920
FPS = 30
BG = (245, 242, 235)
GREEN = (28, 58, 42)
GOLD = (201, 162, 39)
WHITE = (255, 255, 255)


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        "/System/Library/Fonts/Supplemental/Georgia Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Georgia.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
        "/Library/Fonts/Arial.ttf",
    ]
    for path in candidates:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except OSError:
                continue
    return ImageFont.load_default()


def cover_crop(img: Image.Image, tw: int, th: int) -> Image.Image:
    src = img.convert("RGB")
    scale = max(tw / src.width, th / src.height)
    nw, nh = int(src.width * scale), int(src.height * scale)
    resized = src.resize((nw, nh), Image.Resampling.LANCZOS)
    left = (nw - tw) // 2
    top = (nh - th) // 2
    return resized.crop((left, top, left + tw, top + th))


def load(path: str | Path) -> Image.Image:
    return Image.open(PUBLIC / str(path).lstrip("/"))


def base_frame() -> Image.Image:
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)
    draw.rectangle((0, 0, W, 140), fill=GREEN)
    draw.text((W // 2, 70), "MISKA", font=font(52, True), fill=WHITE, anchor="mm")
    draw.text((W // 2, 118), "Hair & Skin Science · Bangalore", font=font(22), fill=(220, 220, 220), anchor="mm")
    return img


def paste_product(frame: Image.Image, path: str, box: tuple[int, int, int, int]) -> None:
    product = cover_crop(load(path), box[2] - box[0], box[3] - box[1])
    frame.paste(product, box)


def draw_cta(frame: Image.Image, lines: list[str], footer: str) -> None:
    draw = ImageDraw.Draw(frame)
    y = H - 340
    for line in lines:
        draw.text((W // 2, y), line, font=font(44, True), fill=GREEN, anchor="mm")
        y += 56
    draw.rounded_rectangle((W // 2 - 280, H - 200, W // 2 + 280, H - 110), radius=40, fill=GREEN)
    draw.text((W // 2, H - 155), footer, font=font(34, True), fill=WHITE, anchor="mm")
    draw.text((W // 2, H - 70), "miskahealth.in", font=font(26), fill=GREEN, anchor="mm")


def fade_blend(a: Image.Image, b: Image.Image, t: float) -> Image.Image:
    t = max(0.0, min(1.0, t))
    return Image.blend(a, b, t)


def render_video(slides: list[tuple[callable, float]], out_name: str) -> None:
    """slides: list of (builder_fn, duration_seconds)"""
    frames: list[np.ndarray] = []
    built: list[Image.Image] = []

    for builder, dur in slides:
        built.append(builder())

    durations = [dur for _, dur in slides]
    for i, img in enumerate(built):
        dur = durations[i]
        hold = int(dur * FPS)
        next_img = built[i + 1] if i + 1 < len(built) else None
        cross = int(0.4 * FPS) if next_img else 0
        for f in range(hold):
            if next_img and f >= hold - cross:
                t = (f - (hold - cross)) / max(cross, 1)
                frame = fade_blend(img, next_img, t)
            else:
                frame = img
            frames.append(np.array(frame))

    path = OUT / out_name
    iio.imwrite(
        path,
        np.stack(frames),
        fps=FPS,
        codec="libx264",
        pixelformat="yuv420p",
        output_params=["-movflags", "+faststart"],
    )
    print(f"Wrote {path} ({len(frames) / FPS:.1f}s)")


def slide_combo_hook() -> Image.Image:
    f = base_frame()
    d = ImageDraw.Draw(f)
    d.text((W // 2, 200), "Complete hair fall routine", font=font(48, True), fill=GREEN, anchor="mm")
    d.text((W // 2, 265), "Oil · Shampoo · Serum", font=font(30), fill=GREEN, anchor="mm")
    paste_product(f, "/marketing/hero/hero-mobile-range.jpg", (60, 320, W - 60, 1180))
    d.text((W // 2, 1240), "Clinic-formulated in Bangalore", font=font(28), fill=GREEN, anchor="mm")
    draw_cta(f, ["Shampoo + Oil OR Shampoo + Serum"], "Use code COMBO99 → ₹99 OFF")
    return f


def slide_combo_ingredients() -> Image.Image:
    f = base_frame()
    d = ImageDraw.Draw(f)
    d.text((W // 2, 200), "Not cosmetic — clinical actives", font=font(42, True), fill=GREEN, anchor="mm")
    items = [
        ("Rosemary", "Scalp circulation"),
        ("Biotin + Caffeine", "Strength · DHT care"),
        ("Redensyl + Procapil", "Growth-phase support"),
    ]
    y = 300
    for title, sub in items:
        d.rounded_rectangle((80, y, W - 80, y + 110), radius=20, fill=WHITE, outline=GREEN, width=2)
        d.text((120, y + 30), title, font=font(34, True), fill=GREEN)
        d.text((120, y + 68), sub, font=font(26), fill=GREEN)
        y += 140
    paste_product(f, "/products/rosemary-hair-oil/image-1.jpg", (140, 780, W - 140, 1280))
    draw_cta(f, ["Bundle & save at checkout"], "Shop → miskahealth.in")
    return f


def slide_combo_prices() -> Image.Image:
    f = base_frame()
    d = ImageDraw.Draw(f)
    d.text((W // 2, 200), "Starter combo from ₹649", font=font(46, True), fill=GREEN, anchor="mm")
    d.text((W // 2, 270), "Oil ₹399 · Shampoo ₹349", font=font(30), fill=GREEN, anchor="mm")
    paste_product(f, "/marketing/hero/hero-mobile-serum-shampoo.jpg", (60, 340, W - 60, 1200))
    d.rounded_rectangle((120, 1220, W - 120, 1320), radius=24, fill=GOLD)
    d.text((W // 2, 1270), "COMBO99 = ₹99 extra off", font=font(36, True), fill=WHITE, anchor="mm")
    draw_cta(f, ["COD & online payment"], "Order now · Free delivery*")
    return f


def slide_problem() -> Image.Image:
    f = Image.new("RGB", (W, H), (30, 30, 30))
    d = ImageDraw.Draw(f)
    d.text((W // 2, 280), "Hair fall after", font=font(56, True), fill=WHITE, anchor="mm")
    d.text((W // 2, 360), "stress · postpartum · hard water?", font=font(36), fill=(220, 220, 220), anchor="mm")
    d.text((W // 2, 520), "You need actives at the follicle —", font=font(32), fill=GOLD, anchor="mm")
    d.text((W // 2, 575), "not just another cosmetic oil.", font=font(32), fill=GOLD, anchor="mm")
    paste_product(f, "/products/rosemary-hair-oil/lifestyle/lifestyle-1.jpg", (0, 700, W, 1500))
    d.rectangle((0, 0, W, 140), fill=GREEN)
    d.text((W // 2, 70), "MISKA", font=font(52, True), fill=WHITE, anchor="mm")
    return f


def slide_oil_solution() -> Image.Image:
    f = base_frame()
    d = ImageDraw.Draw(f)
    d.text((W // 2, 200), "Rosemary Hair Oil", font=font(48, True), fill=GREEN, anchor="mm")
    d.text((W // 2, 265), "₹399 · 200ml · Bestseller", font=font(30), fill=GREEN, anchor="mm")
    paste_product(f, "/products/rosemary-hair-oil/image-1.jpg", (100, 320, W - 100, 1050))
    d.text((W // 2, 1100), "Biotin · Caffeine · Castor · Rosemary", font=font(28), fill=GREEN, anchor="mm")
    d.text((W // 2, 1155), "Works at the follicle level", font=font(32, True), fill=GREEN, anchor="mm")
    draw_cta(f, ["Massage 3×/week · overnight"], "Shop on miskahealth.in")
    return f


def slide_routine() -> Image.Image:
    f = base_frame()
    d = ImageDraw.Draw(f)
    d.text((W // 2, 200), "Your 3-step routine", font=font(48, True), fill=GREEN, anchor="mm")
    steps = [
        ("1. Shampoo", "Treatment wash — sulphate free"),
        ("2. Oil", "Scalp massage — growth support"),
        ("3. Serum", "Targeted — Redensyl & Procapil"),
    ]
    y = 290
    for title, sub in steps:
        d.rounded_rectangle((70, y, W - 70, y + 100), radius=18, fill=WHITE, outline=GREEN, width=2)
        d.text((100, y + 22), title, font=font(32, True), fill=GREEN)
        d.text((100, y + 58), sub, font=font(24), fill=GREEN)
        y += 120
    paste_product(f, "/marketing/hero/hero-mobile-range.jpg", (60, 720, W - 60, 1280))
    draw_cta(f, ["Made in India · Bangalore"], "miskahealth.in")
    return f


def main() -> None:
    render_video(
        [
            (slide_combo_hook, 3.5),
            (slide_combo_ingredients, 3.5),
            (slide_combo_prices, 4.0),
        ],
        "miska-combo99-offer-9x16.mp4",
    )
    render_video(
        [
            (slide_problem, 3.0),
            (slide_oil_solution, 4.0),
            (slide_routine, 4.5),
        ],
        "miska-hairfall-routine-9x16.mp4",
    )


if __name__ == "__main__":
    main()
