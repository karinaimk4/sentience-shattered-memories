from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "assets" / "taixuan"
OUT = SRC / "combat-clean"
OUT.mkdir(parents=True, exist_ok=True)


def alpha_crop(im: Image.Image, padding: int = 8) -> Image.Image:
    alpha = im.getchannel("A")
    bbox = alpha.getbbox()
    if not bbox:
        return im
    x0, y0, x1, y1 = bbox
    x0 = max(0, x0 - padding)
    y0 = max(0, y0 - padding)
    x1 = min(im.width, x1 + padding)
    y1 = min(im.height, y1 + padding)
    return im.crop((x0, y0, x1, y1))


def keep_component_at(im: Image.Image, seed_x: int, seed_y: int) -> Image.Image:
    """Keep the connected painted figure around a seed, dropping neighbour spill."""
    alpha = im.getchannel("A")
    binary = alpha.point(lambda value: 255 if value > 18 else 0)
    radius = max(im.width, im.height)
    seed = None
    for distance in range(radius):
        for x, y in (
            (seed_x + distance, seed_y), (seed_x - distance, seed_y),
            (seed_x, seed_y + distance), (seed_x, seed_y - distance),
        ):
            if 0 <= x < im.width and 0 <= y < im.height and binary.getpixel((x, y)):
                seed = (x, y)
                break
        if seed:
            break
    if not seed:
        return im
    ImageDraw.floodfill(binary, seed, 128, thresh=0)
    component = binary.point(lambda value: 255 if value == 128 else 0)
    clean = im.copy()
    clean.putalpha(Image.composite(alpha, Image.new("L", im.size, 0), component))
    return clean


# This approved lineup was authored as seven equal-width slots. Keep its original
# pixels and full height; the rejected combat sheet was incorrectly sliced into
# four equal rows even though its poses crossed row boundaries.
lineup = Image.open(SRC / "seven-swords-lineup.png").convert("RGBA")
edges = [round(i * lineup.width / 7) for i in range(8)]
seven = []
for i in range(7):
    cell = lineup.crop((edges[i], 0, edges[i + 1], lineup.height))
    cell = keep_component_at(cell, cell.width // 2, int(cell.height * .55))
    cell = alpha_crop(cell, 2)
    path = OUT / f"seven-sword-{i + 1}.png"
    cell.save(path)
    seven.append(cell)

# These two crops are the approved Hua concepts in the lower half of the board.
# The generous boxes include every strand, sleeve, foot and aura shard.
concept = Image.open(SRC / "boss-concepts.png").convert("RGBA")
hua_rects = [(70, 445, 780, 1024), (740, 340, 1536, 1024)]
hua_seeds = [(350, 390), (420, 430)]
hua = []
for i, (rect, seed) in enumerate(zip(hua_rects, hua_seeds), 1):
    sprite = concept.crop(rect)
    sprite = keep_component_at(sprite, *seed)
    sprite = alpha_crop(sprite, 4)
    path = OUT / f"phantom-hua-phase-{i}.png"
    sprite.save(path)
    hua.append(sprite)

# QA contact sheet: checkerboard background makes accidental clipping obvious.
thumbs = seven + hua
sizes = [(230, 250)] * 7 + [(330, 300)] * 2
canvas = Image.new("RGB", (1610, 610), (34, 42, 53))
draw = ImageDraw.Draw(canvas)
for y in range(0, canvas.height, 20):
    for x in range(0, canvas.width, 20):
        if (x // 20 + y // 20) % 2:
            draw.rectangle((x, y, x + 19, y + 19), fill=(44, 54, 68))
x = 0
for i, (im, box) in enumerate(zip(thumbs[:7], sizes[:7]), 1):
    copy = im.copy()
    copy.thumbnail(box, Image.Resampling.LANCZOS)
    canvas.paste(copy, (x + (230 - copy.width) // 2, 18 + 250 - copy.height), copy)
    draw.text((x + 8, 276), str(i), fill=(230, 236, 240))
    x += 230
x = 120
for i, im in enumerate(hua, 1):
    copy = im.copy()
    copy.thumbnail((580, 270), Image.Resampling.LANCZOS)
    px = x + (650 - copy.width) // 2
    canvas.paste(copy, (px, 325 + 270 - copy.height), copy)
    draw.text((x + 8, 580), f"Hua phase {i}", fill=(230, 236, 240))
    x += 720
canvas.save(ROOT / "qa" / "combat-clean-contact-sheet.png")
print("Extracted", len(seven) + len(hua), "approved sprites")
