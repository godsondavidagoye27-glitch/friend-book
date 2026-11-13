from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

root = Path('public')
root.mkdir(exist_ok=True)


def create_icon(size: int, name: str, maskable: bool = False) -> None:
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    bg = (249, 115, 22, 255)
    margin = size * 0.12
    radius = int(size * 0.24)
    draw.rounded_rectangle((margin, margin, size - margin, size - margin), radius=radius, fill=bg)

    inner_margin = size * 0.18
    draw.rounded_rectangle(
        (inner_margin, inner_margin, size - inner_margin, size - inner_margin),
        radius=int(size * 0.18),
        fill=(255, 237, 213, 255),
    )

    try:
        font = ImageFont.truetype('arial.ttf', max(52, size // 2))
    except Exception:
        font = ImageFont.load_default()

    text = 'F'
    bbox = draw.textbbox((0, 0), text, font=font)
    w = bbox[2] - bbox[0]
    h = bbox[3] - bbox[1]
    x = (size - w) / 2
    y = (size - h) / 2 - 8
    draw.text((x, y), text, font=font, fill=bg)

    if maskable:
        pad = int(size * 0.08)
        outer = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        outer_draw = ImageDraw.Draw(outer)
        outer_draw.rounded_rectangle(
            (pad, pad, size - pad, size - pad),
            radius=max(12, size // 12),
            fill=(0, 0, 0, 255),
        )
        outer.alpha_composite(img, (0, 0))
        img = outer

    img.save(root / name)


create_icon(192, 'icon-192.png')
create_icon(512, 'icon-512.png')
create_icon(512, 'maskable-512.png', maskable=True)
create_icon(180, 'apple-touch-icon.png')
