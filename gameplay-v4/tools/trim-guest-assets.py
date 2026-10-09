from pathlib import Path
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
GUESTS = ROOT / "assets" / "event-demo" / "guests"
NAMES = [
    "arc-office-woman-3d-v2",
    "schicksal-technician-3d-v2",
    "stfreya-student-3d-v2",
    "taixuan-granny-3d-v2",
    "arc-queue-man-3d-v2",
]


for name in NAMES:
    source = GUESTS / f"{name}.png"
    target = GUESTS / f"{name}-trim.png"
    image = Image.open(source).convert("RGBA")
    alpha = image.getchannel("A")
    box = alpha.getbbox()
    if box is None:
        raise RuntimeError(f"No visible pixels in {source}")
    padding = max(12, round(max(box[2] - box[0], box[3] - box[1]) * 0.035))
    left = max(0, box[0] - padding)
    top = max(0, box[1] - padding)
    right = min(image.width, box[2] + padding)
    bottom = min(image.height, box[3] + padding)
    image.crop((left, top, right, bottom)).save(target, optimize=True)
    print(f"{target.name}: {right-left}x{bottom-top}")
