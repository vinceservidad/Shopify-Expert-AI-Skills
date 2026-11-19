# Requires Pillow (pip install pillow). Usage: python scripts/render_plugin_icon.py .claude-plugin/icon.png
"""ShopifySkills plugin icon: MKT family style (dark tile, glow waves, metallic mark), VA green accent.

Mark: a price tag with a check cut out of it. Drawn at 4x and downsampled for clean edges.
"""
import math
import sys

from PIL import Image, ImageChops, ImageDraw, ImageFilter

OUT = sys.argv[1]
SIZE = 1024
SS = 4
W = SIZE * SS


def lerp(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(len(a)))


def radial(size, center, radius, inner, outer):
    img = Image.new("RGB", (size, size))
    px = img.load()
    cx, cy = center
    step = 4
    for y in range(0, size, step):
        for x in range(0, size, step):
            d = min(1.0, math.hypot(x - cx, y - cy) / radius)
            c = lerp(inner, outer, d ** 1.4)
            for yy in range(y, min(y + step, size)):
                for xx in range(x, min(x + step, size)):
                    px[xx, yy] = c
    return img


def linear(size, top, bottom, angle_deg=0):
    grad = Image.new("RGB", (1, 256))
    for i in range(256):
        grad.putpixel((0, i), lerp(top, bottom, i / 255))
    grad = grad.resize((size * 2, size * 2))
    grad = grad.rotate(angle_deg, resample=Image.BICUBIC)
    off = size // 2
    return grad.crop((off, off, off + size, off + size))


# 1. Tile: rounded square, near-black green with a soft top-left glow.
tile_mask = Image.new("L", (W, W), 0)
ImageDraw.Draw(tile_mask).rounded_rectangle((0, 0, W - 1, W - 1), radius=int(W * 0.225), fill=255)
bg = radial(W // 4, (W // 4 * 0.32, W // 4 * 0.28), W // 4 * 1.05, (14, 46, 33), (2, 8, 6)).resize((W, W), Image.BICUBIC)

# 2. Glow waves (MKT family motif), in VA green.
waves = Image.new("RGB", (W, W), (0, 0, 0))
wd = ImageDraw.Draw(waves)
for i, (amp, phase, y0, width, color) in enumerate([
    (0.050, 0.0, 0.20, 0.010, (124, 201, 160)),
    (0.040, 1.7, 0.30, 0.006, (64, 160, 110)),
    (0.060, 3.1, 0.80, 0.010, (124, 201, 160)),
    (0.045, 4.4, 0.90, 0.006, (64, 160, 110)),
]):
    pts = []
    for s in range(0, 101):
        x = s / 100 * W
        y = (y0 + amp * math.sin(s / 100 * math.pi * 2 + phase)) * W
        pts.append((x, y))
    wd.line(pts, fill=color, width=int(W * width), joint="curve")
glow = waves.filter(ImageFilter.GaussianBlur(W * 0.018))
sharp = waves.filter(ImageFilter.GaussianBlur(W * 0.002))
bg = ImageChops.add(bg, glow)
bg = ImageChops.add(bg, ImageChops.multiply(sharp, Image.new("RGB", (W, W), (150, 150, 150))))

# 3. Price tag shape: one polygon (pointed left end), corners rounded by blur + threshold.
tag = Image.new("L", (W, W), 0)
td = ImageDraw.Draw(tag)
cx, cy = W * 0.515, W * 0.50
bw, bh = W * 0.44, W * 0.36       # body width/height
left = cx - bw / 2
point = W * 0.17
td.polygon([(left, cy - bh / 2), (cx + bw / 2, cy - bh / 2), (cx + bw / 2, cy + bh / 2),
            (left, cy + bh / 2), (left - point, cy)], fill=255)
tag = tag.filter(ImageFilter.GaussianBlur(W * 0.022)).point(lambda v: 255 if v > 150 else 0)

# Hole near the point.
hole_r = W * 0.034
hx, hy = left - W * 0.01, cy
ImageDraw.Draw(tag).ellipse((hx - hole_r, hy - hole_r, hx + hole_r, hy + hole_r), fill=0)

# Check mark cut out of the body.
check = Image.new("L", (W, W), 0)
cd = ImageDraw.Draw(check)
stroke = int(W * 0.062)
p1 = (cx - W * 0.075, cy + W * 0.005)
p2 = (cx + W * 0.020, cy + W * 0.090)
p3 = (cx + W * 0.165, cy - W * 0.090)
cd.line([p1, p2, p3], fill=255, width=stroke, joint="curve")
for p in (p1, p3):
    cd.ellipse((p[0] - stroke / 2, p[1] - stroke / 2, p[0] + stroke / 2, p[1] + stroke / 2), fill=255)
tag = ImageChops.subtract(tag, check)

ANGLE = -18
tag = tag.rotate(ANGLE, resample=Image.BICUBIC, center=(cx, cy))

# Metallic fill (MKT family) with a cool green tint, plus subtle edge highlight.
metal = linear(W, (246, 250, 248), (150, 176, 166), angle_deg=-25)
shine = Image.new("L", (W, W), 0)
ImageDraw.Draw(shine).ellipse((W * 0.20, W * 0.10, W * 1.10, W * 0.55), fill=70)
shine = shine.filter(ImageFilter.GaussianBlur(W * 0.06))
metal = ImageChops.add(metal, Image.merge("RGB", (shine, shine, shine)))

# Drop shadow and green rim glow under the tag.
shadow = tag.filter(ImageFilter.GaussianBlur(W * 0.025))
shadow_layer = Image.new("RGB", (W, W), (0, 0, 0))
bg = Image.composite(shadow_layer, bg, shadow.point(lambda v: int(v * 0.65)).transform(
    (W, W), Image.AFFINE, (1, 0, -W * 0.0, 0, 1, -W * 0.018)))
rim = tag.filter(ImageFilter.MaxFilter(int(W * 0.006) | 1)).filter(ImageFilter.GaussianBlur(W * 0.012))
bg = ImageChops.add(bg, Image.merge("RGB", (
    rim.point(lambda v: v * 30 // 255), rim.point(lambda v: v * 120 // 255), rim.point(lambda v: v * 80 // 255))))

art = Image.composite(metal, bg, tag)

# Inner hairline on the tile edge for definition.
edge = Image.new("L", (W, W), 0)
ImageDraw.Draw(edge).rounded_rectangle((W * 0.004, W * 0.004, W * 0.996, W * 0.996), radius=int(W * 0.222),
                                       outline=60, width=int(W * 0.004))
art = ImageChops.add(art, Image.merge("RGB", (edge, edge, edge)))

out = Image.new("RGBA", (W, W), (0, 0, 0, 0))
out.paste(art, (0, 0), tile_mask)
out = out.resize((SIZE, SIZE), Image.LANCZOS)
out.save(OUT, "PNG", optimize=True)
print(OUT, out.size)
