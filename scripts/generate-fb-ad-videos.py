#!/usr/bin/env python3
"""9:16 Reels — one big message per slide, readable on a phone."""

from __future__ import annotations

import os
import subprocess
from pathlib import Path

import imageio.v3 as iio
import imageio_ffmpeg
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
OUT = ROOT / "marketing" / "facebook-ads"
AUDIO = OUT / "audio" / "ambient-beauty.mp3"

W, H = 1088, 1920
FPS = 30
BG = (255, 255, 255)
GREEN = (28, 58, 42)
WHITE = (255, 255, 255)
BLACK = (15, 15, 15)
MUTED = (90, 90, 90)
RED = (185, 60, 50)
GREEN_LT = (225, 238, 230)

OIL = {"price": 399, "mrp": 799}
SHAMPOO = {"price": 349, "mrp": 699}
SERUM = {"price": 899, "mrp": 1299}

ASSETS = {
    "oil": "/products/rosemary-hair-oil/image-1.jpg",
    "shampoo": "/products/rosemary-shampoo/image-1.jpg",
    "serum": "/products/hair-scalp-serum/image-1.jpg",
    "oil_life": "/products/rosemary-hair-oil/lifestyle/lifestyle-2.jpg",
}

# Correct macOS paths — /Library/Fonts/Arial.ttf does NOT exist (was breaking all text)
FONT_REGULAR = "/System/Library/Fonts/Supplemental/Arial.ttf"
FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"

_font_cache: dict[tuple[str, int], ImageFont.FreeTypeFont] = {}


def rs(n: int) -> str:
    return f"Rs.{n}"


def get_font(size: int, bold: bool = True) -> ImageFont.FreeTypeFont:
    key = ("b" if bold else "r", size)
    if key in _font_cache:
        return _font_cache[key]
    path = FONT_BOLD if bold else FONT_REGULAR
    if not os.path.isfile(path):
        raise FileNotFoundError(f"Font missing: {path}")
    _font_cache[key] = ImageFont.truetype(path, size)
    return _font_cache[key]


def load(path: str) -> Image.Image:
    return Image.open(PUBLIC / path.lstrip("/")).convert("RGB")


def contain(img: Image.Image, tw: int, th: int, bg=BG) -> Image.Image:
    s = min(tw / img.width, th / img.height)
    nw, nh = int(img.width * s), int(img.height * s)
    r = img.resize((nw, nh), Image.Resampling.LANCZOS)
    c = Image.new("RGB", (tw, th), bg)
    c.paste(r, ((tw - nw) // 2, (th - nh) // 2))
    return c


def paste(frame: Image.Image, path: str, box: tuple[int, int, int, int]) -> None:
    x0, y0, x1, y1 = box
    frame.paste(contain(load(path), x1 - x0, y1 - y0), (x0, y0))


def text_center(
    draw: ImageDraw.ImageDraw,
    y: int,
    lines: list[str],
    *,
    size: int = 72,
    fill=BLACK,
    bold: bool = True,
    spacing: int = 16,
) -> int:
    """Draw centred lines; return y after last line."""
    f = get_font(size, bold)
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=f)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        draw.text(((W - tw) // 2, y), line, font=f, fill=fill)
        y += th + spacing
    return y


def bar(draw: ImageDraw.ImageDraw, y: int, h: int, color=GREEN) -> None:
    draw.rectangle((0, y, W, y + h), fill=color)


def card(
    draw: ImageDraw.ImageDraw,
    y: int,
    text: str,
    *,
    bg=GREEN,
    fg=WHITE,
    height: int = 100,
    font_size: int = 44,
) -> int:
    """Full-width solid card — text always visible."""
    draw.rounded_rectangle((40, y, W - 40, y + height), radius=20, fill=bg)
    f = get_font(font_size, True)
    bbox = draw.textbbox((0, 0), text, font=f)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text(((W - tw) // 2, y + (height - th) // 2), text, font=f, fill=fg)
    return y + height + 16


def header(draw: ImageDraw.ImageDraw) -> int:
    bar(draw, 0, 120, GREEN)
    f = get_font(56, True)
    bbox = draw.textbbox((0, 0), "MISKA", font=f)
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) // 2, 28), "MISKA", font=f, fill=WHITE)
    f2 = get_font(24, False)
    sub = "Hair & Skin Science"
    bbox2 = draw.textbbox((0, 0), sub, font=f2)
    draw.text(((W - bbox2[2]) // 2, 88), sub, font=f2, fill=(220, 230, 225))
    return 140


def cta_bottom(draw: ImageDraw.ImageDraw, y: int, line1: str, line2: str) -> None:
    draw.rounded_rectangle((48, y, W - 48, y + 120), radius=28, fill=GREEN)
    text_center(draw, y + 18, [line1], size=40, fill=WHITE, spacing=0)
    text_center(draw, y + 68, [line2], size=32, fill=(220, 235, 225), bold=False, spacing=0)


# ── Slides: ONE idea each, huge type ─────────────────────────────────────────


def slide_hook() -> Image.Image:
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    y = header(d)
    y = text_center(d, y + 40, ["HAIR FALL WON'T STOP"], size=64, fill=BLACK)
    y = text_center(d, y + 8, ["WITH COSMETIC OIL"], size=64, fill=BLACK)
    y = text_center(d, y + 48, ["You need actives at the follicle."], size=40, fill=GREEN, bold=True)
    paste(img, ASSETS["oil_life"], (60, y + 20, W - 60, y + 520))
    cta_bottom(d, H - 200, "Clinic-formulated in Bangalore", "miskahealth.in")
    return img


def slide_actives() -> Image.Image:
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    y = header(d)
    y = text_center(d, y + 30, ["WHAT'S INSIDE MISKA"], size=56, fill=BLACK)
    y = text_center(d, y + 12, ["Not just rosemary"], size=44, fill=MUTED, bold=False)
    y += 20
    for label in [
        "Biotin + Caffeine",
        "Redensyl + Procapil",
        "Castor + Rosemary",
        "Sulphate-free shampoo",
    ]:
        y = card(d, y, label, bg=GREEN, fg=WHITE, height=108, font_size=42)
    paste(img, ASSETS["oil"], (200, y + 10, W - 200, y + 480))
    cta_bottom(d, H - 180, f"Oil from {rs(OIL['price'])}", "miskahealth.in")
    return img


def slide_prices() -> Image.Image:
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    y = header(d)
    y = text_center(d, y + 24, ["COMPLETE ROUTINE"], size=56, fill=BLACK)
    y = text_center(d, y + 8, ["Oil + Shampoo + Serum"], size=40, fill=MUTED, bold=False)
    gap = 16
    cw = (W - 80 - gap * 2) // 3
    items = [("Oil", ASSETS["oil"], OIL), ("Shampoo", ASSETS["shampoo"], SHAMPOO), ("Serum", ASSETS["serum"], SERUM)]
    top = y + 30
    for i, (name, path, p) in enumerate(items):
        x0 = 40 + i * (cw + gap)
        paste(img, path, (x0, top, x0 + cw, top + 520))
        y2 = top + 540
        d.rounded_rectangle((x0, y2, x0 + cw, y2 + 110), radius=16, fill=GREEN)
        f = get_font(36, True)
        for j, txt in enumerate([name, rs(p["price"])]):
            b = d.textbbox((0, 0), txt, font=f)
            tw = b[2] - b[0]
            d.text((x0 + (cw - tw) // 2, y2 + 18 + j * 44), txt, font=f, fill=WHITE)
    y = top + 680
    y = card(d, y, f"Combo {rs(748)} · Code COMBO99", bg=BLACK, fg=WHITE, height=100, font_size=38)
    y = card(d, y, f"Extra {rs(99)} OFF at checkout", bg=RED, fg=WHITE, height=100, font_size=40)
    cta_bottom(d, H - 170, "COD + Prepaid available", "miskahealth.in")
    return img


def slide_before_after() -> Image.Image:
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    y = header(d)
    y = text_center(d, y + 20, ["BEFORE  vs  AFTER"], size=56, fill=BLACK)
    y = text_center(d, y + 8, ["8-12 weeks consistent use"], size=36, fill=MUTED, bold=False)
    y += 24
    y = card(d, y, "BEFORE: Excess fall · thinning", bg=(50, 50, 54), fg=WHITE, height=96, font_size=36)
    y = card(d, y, "BEFORE: Weak roots · breakage", bg=(50, 50, 54), fg=WHITE, height=96, font_size=36)
    y = card(d, y, "AFTER: Less fall · stronger hair*", bg=GREEN, fg=WHITE, height=96, font_size=36)
    y = card(d, y, "AFTER: Healthier scalp feel*", bg=GREEN, fg=WHITE, height=96, font_size=36)
    paste(img, ASSETS["oil"], (120, y + 8, W - 120, y + 420))
    y += 440
    text_center(d, y, ["*Results vary · patch test first"], size=28, fill=MUTED, bold=False)
    cta_bottom(d, H - 170, "Shop the routine", "miskahealth.in")
    return img


def slide_offer() -> Image.Image:
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    y = header(d)
    y = text_center(d, y + 60, ["ROSEMARY HAIR OIL"], size=52, fill=BLACK)
    paste(img, ASSETS["oil"], (140, y + 20, W - 140, y + 700))
    y += 720
    pct = round((OIL["mrp"] - OIL["price"]) / OIL["mrp"] * 100)
    y = text_center(d, y, [rs(OIL["price"])], size=96, fill=GREEN)
    y = text_center(d, y, [f"MRP {rs(OIL['mrp'])}  ·  SAVE {pct}%"], size=40, fill=MUTED, bold=False)
    y = card(d, y + 20, "Massage 3x/week · overnight", bg=GREEN_LT, fg=GREEN, height=90, font_size=36)
    cta_bottom(d, H - 180, "Order now", "miskahealth.in")
    return img


def slide_problem() -> Image.Image:
    img = Image.new("RGB", (W, H), (25, 28, 30))
    d = ImageDraw.Draw(img)
    y = header(d)
    text_center(d, y + 80, ["STILL LOSING HAIR?"], size=68, fill=WHITE)
    text_center(d, y + 200, ["Stress · postpartum · hard water"], size=40, fill=(200, 200, 200), bold=False)
    text_center(d, y + 320, ["Your scalp needs"], size=48, fill=WHITE)
    text_center(d, y + 390, ["BIOTIN · CAFFEINE · REDENSYL"], size=44, fill=(160, 210, 180), bold=True)
    text_center(d, y + 480, ["Not fragrance-only products."], size=38, fill=(180, 180, 180), bold=False)
    cta_bottom(d, H - 180, "MISKA · Clinic routine", "miskahealth.in")
    return img


def build_frames(slides: list[tuple]) -> list[np.ndarray]:
    """No Ken Burns — keeps text sharp."""
    frames: list[np.ndarray] = []
    images = [fn() for fn, _ in slides]
    for i, img in enumerate(images):
        hold = int(slides[i][1] * FPS)
        nxt = images[i + 1] if i + 1 < len(images) else None
        cross = int(0.25 * FPS) if nxt else 0
        arr = np.array(img)
        for f in range(hold):
            if nxt is not None and f >= hold - cross:
                t = (f - (hold - cross)) / max(cross, 1)
                frames.append(np.asarray(Image.blend(img, nxt, t)))
            else:
                frames.append(arr)
    return frames


def mux_audio(path: Path, dur: float) -> None:
    if not AUDIO.is_file():
        return
    ff = imageio_ffmpeg.get_ffmpeg_exe()
    tmp = path.with_suffix(".tmp.mp4")
    subprocess.run(
        [
            ff, "-y", "-i", str(path), "-i", str(AUDIO),
            "-filter_complex", f"[1:a]volume=0.25,afade=t=in:st=0:d=0.8,afade=t=out:st={max(0,dur-2)}:d=1.5[a]",
            "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-shortest",
            "-movflags", "+faststart", str(tmp),
        ],
        check=True, capture_output=True,
    )
    tmp.replace(path)


def render(slides: list[tuple], name: str) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    frames = build_frames(slides)
    path = OUT / name
    iio.imwrite(
        path,
        np.stack(frames),
        fps=FPS,
        codec="libx264",
        pixelformat="yuv420p",
        output_params=["-crf", "18", "-movflags", "+faststart"],
    )
    mux_audio(path, len(frames) / FPS)
    print(f"Wrote {path} ({len(frames)/FPS:.1f}s)")


def main() -> None:
    # Verify fonts up front
    get_font(48, True)
    print("Font OK:", FONT_BOLD)

    # ~14s each — 4 slides, 3.5s each
    render(
        [
            (slide_hook, 3.5),
            (slide_actives, 3.5),
            (slide_prices, 3.5),
            (slide_before_after, 3.5),
        ],
        "miska-combo99-offer-9x16.mp4",
    )
    render(
        [
            (slide_problem, 3.5),
            (slide_offer, 3.5),
            (slide_before_after, 3.5),
            (slide_prices, 3.5),
        ],
        "miska-hairfall-routine-9x16.mp4",
    )


if __name__ == "__main__":
    main()
