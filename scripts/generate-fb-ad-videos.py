#!/usr/bin/env python3
"""Generate 9:16 Facebook/Reels ad videos — real product shots, ingredients, before/after."""

from __future__ import annotations

import os
import subprocess
import tempfile
from pathlib import Path

import imageio.v3 as iio
import imageio_ffmpeg
import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
OUT = ROOT / "marketing" / "facebook-ads"
AUDIO = OUT / "audio" / "ambient-beauty.mp3"
OUT.mkdir(parents=True, exist_ok=True)
AUDIO.parent.mkdir(parents=True, exist_ok=True)

W, H = 1088, 1920  # divisible by 16 for H.264
FPS = 30
BG = (245, 242, 235)
GREEN = (28, 58, 42)
MUTED_GREEN = (60, 100, 75)
WHITE = (255, 255, 255)
BEFORE_BG = (38, 38, 42)
AFTER_BG = (232, 245, 236)

# Real product & ingredient assets only (no marketing hero composites / glass mock bottles)
ASSETS = {
    "oil_product": "/products/rosemary-hair-oil/image-1.jpg",
    "oil_ingredients": "/products/rosemary-hair-oil/ingredients/hero.jpg",
    "oil_lifestyle": "/products/rosemary-hair-oil/lifestyle/lifestyle-2.jpg",
    "shampoo_product": "/products/rosemary-shampoo/image-1.jpg",
    "shampoo_ingredients": "/products/rosemary-shampoo/ingredients/hero.jpg",
    "shampoo_lifestyle": "/products/rosemary-shampoo/lifestyle/lifestyle-1.jpg",
    "serum_product": "/products/hair-scalp-serum/image-1.jpg",
    "serum_ingredients": "/products/hair-scalp-serum/image-2.jpg",
}


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


def load(path: str) -> Image.Image:
    return Image.open(PUBLIC / path.lstrip("/")).convert("RGB")


def cover_crop(img: Image.Image, tw: int, th: int) -> Image.Image:
    scale = max(tw / img.width, th / img.height)
    nw, nh = int(img.width * scale), int(img.height * scale)
    resized = img.resize((nw, nh), Image.Resampling.LANCZOS)
    left = (nw - tw) // 2
    top = (nh - th) // 2
    return resized.crop((left, top, left + tw, top + th))


def contain_fit(img: Image.Image, tw: int, th: int, bg: tuple[int, int, int] = BG) -> Image.Image:
    scale = min(tw / img.width, th / img.height)
    nw, nh = int(img.width * scale), int(img.height * scale)
    resized = img.resize((nw, nh), Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", (tw, th), bg)
    canvas.paste(resized, ((tw - nw) // 2, (th - nh) // 2))
    return canvas


def paste_in(frame: Image.Image, path: str, box: tuple[int, int, int, int], mode: str = "cover") -> None:
    img = load(path)
    x0, y0, x1, y1 = box
    tw, th = x1 - x0, y1 - y0
    fitted = cover_crop(img, tw, th) if mode == "cover" else contain_fit(img, tw, th)
    frame.paste(fitted, (x0, y0))


def base_frame() -> Image.Image:
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)
    draw.rectangle((0, 0, W, 140), fill=GREEN)
    draw.text((W // 2, 70), "MISKA", font=font(52, True), fill=WHITE, anchor="mm")
    draw.text((W // 2, 118), "Hair & Skin Science · Bangalore", font=font(22), fill=(220, 220, 220), anchor="mm")
    return img


def draw_cta(frame: Image.Image, lines: list[str], footer: str) -> None:
    draw = ImageDraw.Draw(frame)
    y = H - 340
    for line in lines:
        draw.text((W // 2, y), line, font=font(40, True), fill=GREEN, anchor="mm")
        y += 52
    draw.rounded_rectangle((W // 2 - 300, H - 200, W // 2 + 300, H - 110), radius=40, fill=GREEN)
    draw.text((W // 2, H - 155), footer, font=font(32, True), fill=WHITE, anchor="mm")
    draw.text((W // 2, H - 68), "miskahealth.in", font=font(24), fill=GREEN, anchor="mm")


def fade_blend(a: Image.Image, b: Image.Image, t: float) -> Image.Image:
    t = max(0.0, min(1.0, t))
    return Image.blend(a, b, t)


def draw_three_products(frame: Image.Image, top: int, height: int) -> None:
    gap = 24
    col_w = (W - 80 - gap * 2) // 3
    paths = [ASSETS["oil_product"], ASSETS["shampoo_product"], ASSETS["serum_product"]]
    labels = ["Oil ₹399", "Shampoo ₹349", "Serum ₹899"]
    for i, (path, label) in enumerate(zip(paths, labels)):
        x0 = 40 + i * (col_w + gap)
        paste_in(frame, path, (x0, top, x0 + col_w, top + height), mode="contain")
        ImageDraw.Draw(frame).text(
            (x0 + col_w // 2, top + height + 28),
            label,
            font=font(24, True),
            fill=GREEN,
            anchor="mm",
        )


def slide_before_after(
    before_lines: list[str],
    after_lines: list[str],
    after_image: str,
    headline: str,
    sub: str,
) -> Image.Image:
    f = base_frame()
    d = ImageDraw.Draw(f)
    d.text((W // 2, 185), headline, font=font(44, True), fill=GREEN, anchor="mm")
    d.text((W // 2, 240), sub, font=font(26), fill=GREEN, anchor="mm")

    mid_y = 290
    panel_h = 880
    half = (W - 60) // 2

    # BEFORE panel
    before = Image.new("RGB", (half, panel_h), BEFORE_BG)
    bd = ImageDraw.Draw(before)
    bd.text((half // 2, 36), "BEFORE", font=font(38, True), fill=(220, 120, 110), anchor="mm")
    bd.line((40, 70, half - 40, 70), fill=(120, 80, 80), width=2)
    y = 110
    for line in before_lines:
        bd.text((half // 2, y), "✕  " + line, font=font(26), fill=(210, 200, 200), anchor="mm")
        y += 52
    # Subtle “thinning” visual — desaturated hair texture strip
    strip = cover_crop(load(ASSETS["oil_lifestyle"]), half - 48, 280)
    strip = ImageEnhance.Brightness(strip).enhance(0.45)
    strip = ImageOps.grayscale(strip).convert("RGB")
    strip = strip.filter(ImageFilter.GaussianBlur(radius=2))
    before.paste(strip, (24, panel_h - 300))
    bd.rectangle((0, 0, half - 1, panel_h - 1), outline=(90, 70, 70), width=3)
    f.paste(before, (30, mid_y))

    # AFTER panel
    after = Image.new("RGB", (half, panel_h), AFTER_BG)
    ad = ImageDraw.Draw(after)
    ad.text((half // 2, 36), "AFTER", font=font(38, True), fill=MUTED_GREEN, anchor="mm")
    ad.line((40, 70, half - 40, 70), fill=MUTED_GREEN, width=2)
    y = 110
    for line in after_lines:
        ad.text((half // 2, y), "✓  " + line, font=font(26), fill=GREEN, anchor="mm")
        y += 52
    photo = contain_fit(load(after_image), half - 48, 300, AFTER_BG)
    after.paste(photo, (24, panel_h - 320))
    ad.rectangle((0, 0, half - 1, panel_h - 1), outline=GREEN, width=3)
    f.paste(after, (30 + half + 8, mid_y))

    d.text(
        (W // 2, mid_y + panel_h + 24),
        "With consistent MISKA routine · 8–12 weeks*",
        font=font(22),
        fill=GREEN,
        anchor="mm",
    )
    d.text(
        (W // 2, mid_y + panel_h + 58),
        "*Individual results vary. Patch test before use.",
        font=font(18),
        fill=(120, 120, 120),
        anchor="mm",
    )
    return f


# --- Combo video slides ---


def slide_combo_products() -> Image.Image:
    f = base_frame()
    d = ImageDraw.Draw(f)
    d.text((W // 2, 185), "Complete hair fall routine", font=font(46, True), fill=GREEN, anchor="mm")
    d.text((W // 2, 245), "Real clinic-formulated actives", font=font(28), fill=GREEN, anchor="mm")
    draw_three_products(f, 300, 720)
    draw_cta(f, ["Shampoo + Oil OR Shampoo + Serum"], "Code COMBO99 → ₹99 OFF")
    return f


def slide_combo_oil_ingredients() -> Image.Image:
    f = base_frame()
    d = ImageDraw.Draw(f)
    d.text((W // 2, 175), "What’s inside the Oil", font=font(44, True), fill=GREEN, anchor="mm")
    d.text((W // 2, 230), "Rosemary · Biotin · Caffeine · Castor", font=font(28), fill=GREEN, anchor="mm")
    paste_in(f, ASSETS["oil_ingredients"], (40, 270, W - 40, 1180), mode="contain")
    d.text((W // 2, 1200), "Works at the follicle — not cosmetic-only", font=font(30, True), fill=GREEN, anchor="mm")
    draw_cta(f, ["See full formula on pack"], "miskahealth.in")
    return f


def slide_combo_before_after() -> Image.Image:
    return slide_before_after(
        before_lines=["Excessive hair fall", "Thinning & breakage", "Weak, dull roots"],
        after_lines=["Less daily hair fall*", "Stronger-looking hair", "Healthier scalp feel"],
        after_image=ASSETS["oil_lifestyle"],
        headline="Visible routine impact",
        sub="Before vs after consistent MISKA use",
    )


def slide_combo_offer() -> Image.Image:
    f = base_frame()
    d = ImageDraw.Draw(f)
    d.text((W // 2, 185), "Starter combo from ₹649", font=font(44, True), fill=GREEN, anchor="mm")
    paste_in(f, ASSETS["shampoo_product"], (80, 260, W // 2 - 20, 900), mode="contain")
    paste_in(f, ASSETS["oil_product"], (W // 2 + 20, 260, W - 80, 900), mode="contain")
    d.rounded_rectangle((100, 920, W - 100, 1020), radius=24, fill=GREEN)
    d.text((W // 2, 970), "COMBO99 → ₹99 extra off at checkout", font=font(34, True), fill=WHITE, anchor="mm")
    draw_cta(f, ["COD & Razorpay available"], "Order now on miskahealth.in")
    return f


# --- Hairfall routine video slides ---


def slide_problem() -> Image.Image:
    f = Image.new("RGB", (W, H), BEFORE_BG)
    d = ImageDraw.Draw(f)
    d.rectangle((0, 0, W, 140), fill=GREEN)
    d.text((W // 2, 70), "MISKA", font=font(52, True), fill=WHITE, anchor="mm")
    d.text((W // 2, 300), "Still losing hair?", font=font(54, True), fill=WHITE, anchor="mm")
    d.text((W // 2, 380), "Stress · postpartum · hard water", font=font(32), fill=(200, 200, 200), anchor="mm")
    d.text((W // 2, 480), "Cosmetic oils won’t fix the follicle.", font=font(30), fill=(180, 210, 190), anchor="mm")
    d.text((W // 2, 530), "You need clinical actives.", font=font(34, True), fill=WHITE, anchor="mm")
    return f


def slide_shampoo_ingredients() -> Image.Image:
    f = base_frame()
    d = ImageDraw.Draw(f)
    d.text((W // 2, 175), "Treatment Shampoo", font=font(44, True), fill=GREEN, anchor="mm")
    d.text((W // 2, 230), "Rosemary · Caffeine · Moringa · Capilia Longa", font=font(26), fill=GREEN, anchor="mm")
    paste_in(f, ASSETS["shampoo_ingredients"], (40, 270, W - 40, 1150), mode="contain")
    d.text((W // 2, 1175), "Sulphate & paraben free", font=font(30, True), fill=GREEN, anchor="mm")
    draw_cta(f, ["Deposits actives every wash"], "Pair with MISKA Oil")
    return f


def slide_routine_before_after() -> Image.Image:
    return slide_before_after(
        before_lines=["Hair on pillow & comb", "Visible scalp patchiness", "No growth support"],
        after_lines=["Routine you can stick to", "Actives on scalp daily", "Supports growth phase*"],
        after_image=ASSETS["shampoo_lifestyle"],
        headline="The difference a routine makes",
        sub="Shampoo + Oil (+ Serum if severe)",
    )


def slide_oil_hero() -> Image.Image:
    f = base_frame()
    d = ImageDraw.Draw(f)
    d.text((W // 2, 175), "Rosemary Hair Oil", font=font(48, True), fill=GREEN, anchor="mm")
    d.text((W // 2, 235), "₹399 · 200ml · Bestseller", font=font(28), fill=GREEN, anchor="mm")
    paste_in(f, ASSETS["oil_product"], (100, 280, W - 100, 1020), mode="contain")
    paste_in(f, ASSETS["oil_ingredients"], (140, 1040, W - 140, 1280), mode="contain")
    draw_cta(f, ["Massage 3×/week · leave overnight"], "Shop miskahealth.in")
    return f


def slide_routine_steps() -> Image.Image:
    f = base_frame()
    d = ImageDraw.Draw(f)
    d.text((W // 2, 175), "Your 3-step routine", font=font(46, True), fill=GREEN, anchor="mm")
    draw_three_products(f, 250, 620)
    steps = [
        "① Shampoo — treatment wash",
        "② Oil — scalp massage nights",
        "③ Serum — targeted if severe fall",
    ]
    y = 920
    for s in steps:
        d.rounded_rectangle((70, y, W - 70, y + 72), radius=16, fill=WHITE, outline=GREEN, width=2)
        d.text((W // 2, y + 36), s, font=font(28), fill=GREEN, anchor="mm")
        y += 88
    draw_cta(f, ["Made in India · Bangalore"], "miskahealth.in")
    return f


def build_frames(slides: list[tuple]) -> list[np.ndarray]:
    frames: list[np.ndarray] = []
    built = [fn() for fn, _ in slides]
    durations = [dur for _, dur in slides]

    for i, img in enumerate(built):
        hold = int(durations[i] * FPS)
        next_img = built[i + 1] if i + 1 < len(built) else None
        cross = int(0.45 * FPS) if next_img else 0

        is_ba = "before_after" in slides[i][0].__name__

        for f in range(hold):
            frame = img
            if next_img and f >= hold - cross:
                t = (f - (hold - cross)) / max(cross, 1)
                frame = fade_blend(img, next_img, t)
            elif is_ba and f > hold * 0.35:
                # Pulse highlight on AFTER side
                t = (f - hold * 0.35) / (hold * 0.65)
                overlay = Image.new("RGB", (W, H), (255, 255, 255))
                frame = Image.blend(img, overlay, 0.06 * np.sin(t * np.pi))
            frames.append(np.array(frame))
    return frames


def mux_audio(video_path: Path, music_path: Path) -> None:
    if not music_path.exists():
        print(f"No music at {music_path}, skipping audio mux")
        return
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    tmp = video_path.with_suffix(".tmp.mp4")
    subprocess.run(
        [
            ffmpeg,
            "-y",
            "-i",
            str(video_path),
            "-i",
            str(music_path),
            "-filter_complex",
            "[1:a]volume=0.32,afade=t=in:st=0:d=1.2,afade=t=out:st=12:d=2[a]",
            "-map",
            "0:v",
            "-map",
            "[a]",
            "-c:v",
            "copy",
            "-c:a",
            "aac",
            "-b:a",
            "192k",
            "-shortest",
            "-movflags",
            "+faststart",
            str(tmp),
        ],
        check=True,
        capture_output=True,
    )
    tmp.replace(video_path)


def render_video(slides: list, out_name: str, music: bool = True) -> None:
    frames = build_frames(slides)
    path = OUT / out_name
    silent = path.with_suffix(".silent.mp4")
    iio.imwrite(
        silent,
        np.stack(frames),
        fps=FPS,
        codec="libx264",
        pixelformat="yuv420p",
        output_params=["-movflags", "+faststart"],
    )
    silent.replace(path)
    if music and AUDIO.exists():
        mux_audio(path, AUDIO)
    print(f"Wrote {path} ({len(frames) / FPS:.1f}s)")


def ensure_music() -> None:
    if AUDIO.exists() and AUDIO.stat().st_size > 10_000:
        return
    url = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
    print(f"Downloading background music → {AUDIO}")
    subprocess.run(["curl", "-sL", "-o", str(AUDIO), url], check=True)


def main() -> None:
    ensure_music()
    render_video(
        [
            (slide_combo_products, 3.0),
            (slide_combo_oil_ingredients, 3.5),
            (slide_combo_before_after, 4.0),
            (slide_combo_offer, 3.5),
        ],
        "miska-combo99-offer-9x16.mp4",
    )
    render_video(
        [
            (slide_problem, 2.5),
            (slide_shampoo_ingredients, 3.5),
            (slide_routine_before_after, 4.0),
            (slide_oil_hero, 3.5),
            (slide_routine_steps, 3.5),
        ],
        "miska-hairfall-routine-9x16.mp4",
    )


if __name__ == "__main__":
    main()
