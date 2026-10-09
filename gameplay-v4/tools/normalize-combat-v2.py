from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "assets" / "taixuan" / "combat-v2"
CELL = 512
PADDING = 42


def component_mask(alpha: Image.Image, seed_x: int, seed_y: int) -> Image.Image:
    binary = alpha.point(lambda value: 255 if value > 16 else 0)
    seed = None
    for radius in range(360):
        for x, y in (
            (seed_x + radius, seed_y), (seed_x - radius, seed_y),
            (seed_x, seed_y + radius), (seed_x, seed_y - radius),
        ):
            if 0 <= x < binary.width and 0 <= y < binary.height and binary.getpixel((x, y)):
                seed = (x, y)
                break
        if seed:
            break
    if not seed:
        raise RuntimeError(f"No sprite near {(seed_x, seed_y)}")
    ImageDraw.floodfill(binary, seed, 128, thresh=0)
    return binary.point(lambda value: 255 if value == 128 else 0)


def normalize_sheet(path: Path) -> Path:
    source = Image.open(path).convert("RGBA")
    if source.size != (CELL * 3, CELL * 2):
        raise RuntimeError(f"Unexpected sheet size {source.size}: {path.name}")
    alpha = source.getchannel("A")
    packed = Image.new("RGBA", source.size, (0, 0, 0, 0))
    for index in range(6):
        col, row = index % 3, index // 3
        seed_x = col * CELL + CELL // 2
        seed_y = row * CELL + int(CELL * .56)
        mask = component_mask(alpha, seed_x, seed_y)
        bbox = mask.getbbox()
        if not bbox:
            raise RuntimeError(f"Empty frame {index}: {path.name}")
        sprite = source.crop(bbox)
        local_mask = mask.crop(bbox)
        original_alpha = sprite.getchannel("A")
        sprite.putalpha(Image.composite(original_alpha, Image.new("L", sprite.size, 0), local_mask))
        sprite_bbox = sprite.getchannel("A").getbbox()
        sprite = sprite.crop(sprite_bbox)
        max_w, max_h = CELL - PADDING * 2, CELL - PADDING * 2
        scale = min(max_w / sprite.width, max_h / sprite.height, 1.0)
        if scale < 1:
            sprite = sprite.resize((round(sprite.width * scale), round(sprite.height * scale)), Image.Resampling.LANCZOS)
        x = col * CELL + (CELL - sprite.width) // 2
        y = row * CELL + CELL - PADDING - sprite.height
        packed.alpha_composite(sprite, (x, y))
    output = path.with_name(path.stem.replace("-sheet", "-packed") + ".png")
    packed.save(output)
    return output


outputs = [normalize_sheet(path) for path in sorted(SRC.glob("*-sheet.png"))]
print("Normalized", len(outputs), "combat sheets")
for output in outputs:
    print(output.name)
