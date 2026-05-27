#!/usr/bin/env python3
"""9:16 Facebook/Reels ads — MISKA (science-led, competitor-grade pacing)."""

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
OUT.mkdir(parents=True, exist_ok=True)
AUDIO.parent.mkdir(parents=True, exist_ok=True)

W, H = 1088, 1920
FPS = 30
BG = (252, 251, 248)
GREEN = (28, 58, 42)
GREEN_LT = (220, 234, 226)
WHITE = (255, 255, 255)
DARK = (18, 18, 18)
MUTED = (100, 100, 100)
BEFORE_BG = (32, 32, 36)
ACCENT = (180, 70, 65)

FONT_SANS = "/Library/Fonts/Arial.ttf"
FONT_SANS_B = "/Library/Fonts/Arial Bold.ttf"

OIL = {"price": 399, "mrp": 799, "vol": "200 ml"}
SHAMPOO = {"price": 349, "mrp": 699, "vol": "200 ml"}
SERUM = {"price": 899, "mrp": 1299, "vol": "60 ml"}
COMBO_OIL_SHAMPOO = OIL["price"] + SHAMPOO["price"]
COMBO_DISCOUNT = 99

ASSETS = {
    "oil_product": "/products/rosemary-hair-oil/image-1.jpg",
    "oil_ingredients": "/products/rosemary-hair-oil/image-2.jpg",
    "oil_lifestyle": "/products/rosemary-hair-oil/lifestyle/lifestyle-2.jpg",
    "shampoo_product": "/products/rosemary-shampoo/image-1.jpg",
    "shampoo_ingredients": "/products/rosemary-shampoo/image-3.jpg",
    "serum_product": "/products/hair-scalp-serum/image-1.jpg",
}


def rs(amount: int) -> str:
    return f"Rs.{amount}"


def save_pct(price: int, mrp: int) -> int:
    return round((mrp - price) / mrp * 100)


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    path = FONT_SANS_B if bold else FONT_SANS
    if os.path.exists(path):
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            pass
    return ImageFont.load_default()


def load(path: str) -> Image.Image:
    return Image.open(PUBLIC / path.lstrip("/")).convert("RGB")


def cover_crop(img: Image.Image, tw: int, th: int) -> Image.Image:
    scale = max(tw / img.width, th / img.height)
    nw, nh = int(img.width * scale), int(img.height * scale)
    resized = img.resize((nw, nh), Image.Resampling.LANCZOS)
    left, top = (nw - tw) // 2, (nh - th) // 2
    return resized.crop((left, top, left + tw, top + th))


def contain_fit(img: Image.Image, tw: int, th: int, bg: tuple = BG) -> Image.Image:
    scale = min(tw / img.width, th / img.height)
    nw, nh = int(img.width * scale), int(img.height * scale)
    resized = img.resize((nw, nh), Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", (tw, th), bg)
    canvas.paste(resized, ((tw - nw) // 2, (th - nh) // 2))
    return canvas


def paste_in(frame: Image.Image, path: str, box: tuple, mode: str = "contain") -> None:
    img = load(path)
    x0, y0, x1, y1 = box
    tw, th = x1 - x0, y1 - y0
    fitted = cover_crop(img, tw, th) if mode == "cover" else contain_fit(img, tw, th)
    frame.paste(fitted, (x0, y0))


def center_text(draw: ImageDraw.ImageDraw, y: int, text: str, fnt, fill, canvas_w: int = W) -> None:
    tw = draw.textlength(text, font=fnt)
    draw.text(((canvas_w - tw) / 2, y), text, fill=fill, font=fnt)


def draw_header(frame: Image.Image, tagline: str = "Clinic-formulated · Bangalore") -> None:
    d = ImageDraw.Draw(frame)
    d.rectangle((0, 0, W, 128), fill=GREEN)
    d.text((W // 2, 58), "MISKA", font=font(50, True), fill=WHITE, anchor="mm")
    d.text((W // 2, 102), tagline, font=font(20), fill=(210, 225, 215), anchor="mm")


def slide_frame(body_fn) -> Image.Image:
    f = Image.new("RGB", (W, H), BG)
    draw_header(f)
    body_fn(f)
    return f


def draw_text_pill(draw, xy, text, *, fill, text_fill, font_obj, width, pad_y=18) -> int:
    x, y = xy
    bbox = draw.multiline_textbbox((0, 0), text, font=font_obj, spacing=6, align="center")
    th = bbox[3] - bbox[1]
    ph = th + pad_y * 2
    draw.rounded_rectangle((x, y, x + width, y + ph), radius=14, fill=fill)
    draw.multiline_text(
        (x + width // 2, y + pad_y), text, font=font_obj, fill=text_fill,
        spacing=6, align="center", anchor="ma",
    )
    return y + ph


def draw_price_block(draw, y, price, mrp, volume) -> int:
    pct = save_pct(price, mrp)
    center_text(draw, y, rs(price), font(56, True), GREEN)
    y += 68
    mrp_txt = rs(mrp)
    mrp_w = draw.textlength(mrp_txt, font=font(28))
    cx = W // 2
    draw.text((cx - mrp_w / 2, y), mrp_txt, fill=(160, 160, 160), font=font(28))
    draw.line((cx - mrp_w / 2 - 4, y + 14, cx + mrp_w / 2 + 4, y + 14), fill=(160, 160, 160), width=2)
    y += 40
    badge = f"SAVE {pct}%"
    bw = draw.textlength(badge, font=font(22, True)) + 36
    draw.rounded_rectangle((cx - bw / 2, y, cx + bw / 2, y + 44), radius=22, fill=GREEN)
    draw.text((cx, y + 22), badge, font=font(22, True), fill=WHITE, anchor="mm")
    y += 56
    center_text(draw, y, volume, font(24), MUTED)
    return y + 36


def ken_burns(img: Image.Image, t: float) -> Image.Image:
    z = 1.0 + 0.07 * t
    iw, ih = int(W * z), int(H * z)
    scaled = img.resize((iw, ih), Image.Resampling.LANCZOS)
    left, top = (iw - W) // 2, (ih - H) // 2
    return scaled.crop((left, top, left + W, top + H))


def fade_blend(a: Image.Image, b: Image.Image, t: float) -> Image.Image:
    return Image.blend(a, b, max(0.0, min(1.0, t)))


# ─── Slides ──────────────────────────────────────────────────────────────────


def slide_hook_science() -> Image.Image:
    def body(f):
        d = ImageDraw.Draw(f)
        center_text(d, 158, "Hair fall is a follicle problem.", font(44, True), DARK)
        center_text(d, 218, "Not a cosmetic oil problem.", font(44, True), DARK)
        center_text(d, 290, "Generic rosemary = surface care only.", font(26), MUTED)
        center_text(d, 334, "MISKA = actives at the root.", font(28, True), GREEN)
        items = [
            ("Rosemary", "Scalp circulation"),
            ("Biotin + Caffeine", "Strength · DHT care"),
            ("Redensyl + Procapil", "Growth-phase support"),
            ("Capilia Longa", "Density support"),
        ]
        y = 390
        for name, action in items:
            d.rounded_rectangle((48, y, W - 48, y + 84), radius=12, fill=WHITE, outline=(210, 206, 198), width=2)
            d.text((72, y + 16), name, font=font(28, True), fill=GREEN)
            d.text((72, y + 48), action, font=font(22), fill=MUTED)
            y += 96
        center_text(d, y + 16, "Full transparency on every pack", font(24, True), GREEN)
    return slide_frame(body)


def slide_combo_hook() -> Image.Image:
    f = Image.new("RGB", (W, H), BG)
    draw_header(f)
    d = ImageDraw.Draw(f)
    center_text(d, 168, "Stop buying", font(50, True), DARK)
    center_text(d, 236, "cosmetic hair oils.", font(50, True), DARK)
    center_text(d, 320, "Start a clinical routine", font(38, True), GREEN)
    center_text(d, 376, "that targets the follicle.", font(38, True), GREEN)
    paste_in(f, ASSETS["oil_lifestyle"], (0, 440, W, 980), mode="cover")
    fade = Image.new("RGB", (W, 220), BG)
    f.paste(fade, (0, 880))
    d = ImageDraw.Draw(f)
    center_text(d, 1140, f"From {rs(OIL['price'])} · Made in India", font(28, True), GREEN)
    return f


def slide_combo_ingredients() -> Image.Image:
    def body(f):
        d = ImageDraw.Draw(f)
        center_text(d, 152, "Every active. Named. On pack.", font(40, True), DARK)
        center_text(d, 200, "Science-first — like leading D2C brands.", font(24), MUTED)
        paste_in(f, ASSETS["oil_ingredients"], (48, 240, W - 48, 1100), mode="contain")
        center_text(d, 1140, "Biotin · Caffeine · Castor · Rosemary", font(28, True), GREEN)
    return slide_frame(body)


def slide_three_products_offer() -> Image.Image:
    def body(f):
        d = ImageDraw.Draw(f)
        center_text(d, 152, "Complete hair fall routine", font(44, True), DARK)
        center_text(d, 200, "Oil + Shampoo + Serum", font(26), MUTED)
        gap, col_w = 20, (W - 80 - 40) // 3
        for i, (path, label, p) in enumerate([
            (ASSETS["oil_product"], "Oil", OIL),
            (ASSETS["shampoo_product"], "Shampoo", SHAMPOO),
            (ASSETS["serum_product"], "Serum", SERUM),
        ]):
            x0 = 40 + i * (col_w + gap)
            paste_in(f, path, (x0, 250, x0 + col_w, 780), mode="contain")
            cy = 800
            d.rounded_rectangle((x0, cy, x0 + col_w, cy + 88), radius=12, fill=GREEN)
            d.text((x0 + col_w // 2, cy + 22), label, font=font(20, True), fill=WHITE, anchor="mm")
            d.text((x0 + col_w // 2, cy + 58), rs(p["price"]), font=font(26, True), fill=WHITE, anchor="mm")
        y = 920
        center_text(d, y, f"Combo from {rs(COMBO_OIL_SHAMPOO)}", font(36, True), DARK)
        d.rounded_rectangle((100, y + 50, W - 100, y + 130), radius=20, fill=GREEN)
        d.text((W // 2, y + 90), f"Code COMBO99 · {rs(COMBO_DISCOUNT)} OFF", font=font(32, True), fill=WHITE, anchor="mm")
        center_text(d, y + 160, "COD & Razorpay · miskahealth.in", font(26, True), GREEN)
    return slide_frame(body)


def slide_before_after(before_lines, after_lines, after_image, headline, sub) -> Image.Image:
    def body(f):
        d = ImageDraw.Draw(f)
        margin, inner_w, pill_font, gap, photo_h = 44, W - 88, font(34, True), 12, 360
        center_text(d, 158, headline, font(42, True), DARK)
        center_text(d, 208, sub, font(26), MUTED)
        y = 248
        d.rounded_rectangle((margin, y, margin + inner_w, y + 58), radius=14, fill=ACCENT)
        d.text((W // 2, y + 29), "BEFORE", font=font(36, True), fill=WHITE, anchor="mm")
        y += 68
        for line in before_lines:
            y = draw_text_pill(d, (margin, y), line, fill=(58, 58, 62), text_fill=WHITE, font_obj=pill_font, width=inner_w) + gap
        y += 6
        d.rounded_rectangle((margin, y, margin + inner_w, y + 58), radius=14, fill=GREEN)
        d.text((W // 2, y + 29), "AFTER", font=font(36, True), fill=WHITE, anchor="mm")
        y += 68
        for line in after_lines:
            y = draw_text_pill(d, (margin, y), line, fill=WHITE, text_fill=GREEN, font_obj=pill_font, width=inner_w) + gap
        f.paste(contain_fit(load(after_image), inner_w, photo_h), (margin, y + 4))
        y += photo_h + 16
        center_text(d, y, "8–12 weeks with consistent routine*", font(26, True), GREEN)
        center_text(d, y + 36, "*Results vary · patch test before use", font(20), MUTED)
    return slide_frame(body)


def slide_combo_before_after() -> Image.Image:
    return slide_before_after(
        ["Excessive hair fall", "Thinning & breakage", "Weak roots"],
        ["Less daily hair fall*", "Stronger-looking hair", "Healthier scalp"],
        ASSETS["oil_product"],
        "Real results need a real routine",
        "Before vs after MISKA",
    )


def slide_trust_badges() -> Image.Image:
    def body(f):
        d = ImageDraw.Draw(f)
        center_text(d, 158, "Why customers choose MISKA", font(40, True), DARK)
        y = 250
        for title, sub in [
            ("Clinic-formulated", "Made in Bangalore"),
            ("Sulphate & paraben free", "Treatment-grade care"),
            ("COD + prepaid", "Free shipping on prepaid"),
            ("Proven actives on label", "Not hidden behind fragrance"),
        ]:
            d.rounded_rectangle((56, y, W - 56, y + 96), radius=16, fill=GREEN_LT)
            d.text((80, y + 20), title, font=font(28, True), fill=GREEN)
            d.text((80, y + 54), sub, font=font(22), fill=MUTED)
            y += 112
        center_text(d, y + 20, "miskahealth.in", font(36, True), GREEN)
    return slide_frame(body)


def slide_problem_full() -> Image.Image:
    f = Image.new("RGB", (W, H), DARK)
    draw_header(f)
    d = ImageDraw.Draw(f)
    center_text(d, 200, "Still losing hair?", font(54, True), WHITE)
    center_text(d, 278, "Stress · postpartum · hard water", font(28), (200, 200, 200))
    center_text(d, 390, "Your scalp needs actives —", font(32), (180, 210, 190))
    center_text(d, 444, "not just fragrance.", font(32, True), WHITE)
    center_text(d, 540, "Most brands sell lifestyle.", font(26), (130, 130, 130))
    center_text(d, 588, "MISKA sells follicle science.", font(30, True), (180, 220, 200))
    return f


def slide_shampoo_science() -> Image.Image:
    def body(f):
        d = ImageDraw.Draw(f)
        center_text(d, 152, "Treatment shampoo", font(42, True), DARK)
        center_text(d, 200, "Deposits actives every single wash", font(26), MUTED)
        paste_in(f, ASSETS["shampoo_ingredients"], (48, 240, W - 48, 1080), mode="contain")
        center_text(d, 1120, "Sulphate & paraben free", font(28, True), GREEN)
    return slide_frame(body)


def slide_oil_price() -> Image.Image:
    def body(f):
        d = ImageDraw.Draw(f)
        center_text(d, 152, "Rosemary Hair Oil", font(44, True), DARK)
        center_text(d, 200, "Bestseller · 200 ml", font(26), MUTED)
        paste_in(f, ASSETS["oil_product"], (100, 240, W - 100, 900), mode="contain")
        draw_price_block(d, 920, OIL["price"], OIL["mrp"], OIL["vol"])
        center_text(d, 1120, "Shop · miskahealth.in", font(28, True), GREEN)
    return slide_frame(body)


def slide_routine_before_after() -> Image.Image:
    return slide_before_after(
        ["Hair on pillow & comb", "Scalp feels weak", "No growth support"],
        ["Simple 3-step routine", "Actives daily on scalp", "Supports growth phase*"],
        ASSETS["shampoo_product"],
        "The routine difference",
        "Shampoo + Oil (+ Serum if severe)",
    )


def slide_routine_steps() -> Image.Image:
    def body(f):
        d = ImageDraw.Draw(f)
        center_text(d, 152, "Your 3-step routine", font(44, True), DARK)
        gap, col_w = 20, (W - 80 - 40) // 3
        for i, (path, label, p) in enumerate([
            (ASSETS["shampoo_product"], "Step 1", SHAMPOO),
            (ASSETS["oil_product"], "Step 2", OIL),
            (ASSETS["serum_product"], "Step 3", SERUM),
        ]):
            x0 = 40 + i * (col_w + gap)
            paste_in(f, path, (x0, 220, x0 + col_w, 700), mode="contain")
            d.text((x0 + col_w // 2, 720), label, font=font(22, True), fill=GREEN, anchor="mm")
            d.text((x0 + col_w // 2, 756), rs(p["price"]), font=font(24, True), fill=DARK, anchor="mm")
        steps = [
            "Shampoo — treatment wash",
            "Oil — overnight scalp massage",
            "Serum — if hair fall is severe",
        ]
        y = 800
        for s in steps:
            d.rounded_rectangle((56, y, W - 56, y + 68), radius=14, fill=WHITE, outline=(210, 206, 198), width=2)
            d.text((W // 2, y + 34), s, font=font(26), fill=DARK, anchor="mm")
            y += 80
        d.rounded_rectangle((100, y + 10, W - 100, y + 90), radius=24, fill=GREEN)
        d.text((W // 2, y + 50), "miskahealth.in", font=font(32, True), fill=WHITE, anchor="mm")
    return slide_frame(body)


def build_frames(slides: list[tuple]) -> list[np.ndarray]:
    frames = []
    built = [fn() for fn, _ in slides]
    durations = [dur for _, dur in slides]
    for i, img in enumerate(built):
        hold = int(durations[i] * FPS)
        next_img = built[i + 1] if i + 1 < len(built) else None
        cross = int(0.35 * FPS) if next_img else 0
        for f in range(hold):
            t = f / max(hold - 1, 1)
            frame = ken_burns(img, t) if durations[i] >= 2.5 else img
            if next_img and f >= hold - cross:
                t2 = (f - (hold - cross)) / max(cross, 1)
                frame = fade_blend(frame, ken_burns(next_img, 0), t2)
            frames.append(np.array(frame))
    return frames


def mux_audio(video_path: Path, music_path: Path, duration: float) -> None:
    if not music_path.exists():
        return
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    tmp = video_path.with_suffix(".tmp.mp4")
    fade_out = max(0, duration - 2.5)
    subprocess.run(
        [
            ffmpeg, "-y", "-i", str(video_path), "-i", str(music_path),
            "-filter_complex", f"[1:a]volume=0.28,afade=t=in:st=0:d=1,afade=t=out:st={fade_out}:d=2[a]",
            "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
            "-shortest", "-movflags", "+faststart", str(tmp),
        ],
        check=True, capture_output=True,
    )
    tmp.replace(video_path)


def render_video(slides: list, out_name: str) -> None:
    frames = build_frames(slides)
    path = OUT / out_name
    iio.imwrite(path, np.stack(frames), fps=FPS, codec="libx264", pixelformat="yuv420p",
                output_params=["-movflags", "+faststart"])
    if AUDIO.exists():
        mux_audio(path, AUDIO, len(frames) / FPS)
    print(f"Wrote {path} ({len(frames) / FPS:.1f}s)")


def ensure_music() -> None:
    if AUDIO.exists() and AUDIO.stat().st_size > 10_000:
        return
    subprocess.run(["curl", "-sL", "-o", str(AUDIO),
                    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"], check=True)


def main() -> None:
    ensure_music()
    render_video([
        (slide_combo_hook, 2.8),
        (slide_hook_science, 3.2),
        (slide_combo_ingredients, 3.0),
        (slide_three_products_offer, 3.5),
        (slide_combo_before_after, 4.0),
        (slide_trust_badges, 3.0),
    ], "miska-combo99-offer-9x16.mp4")

    render_video([
        (slide_problem_full, 2.8),
        (slide_shampoo_science, 3.2),
        (slide_oil_price, 3.5),
        (slide_routine_before_after, 4.0),
        (slide_routine_steps, 3.2),
        (slide_trust_badges, 3.0),
    ], "miska-hairfall-routine-9x16.mp4")


if __name__ == "__main__":
    main()
