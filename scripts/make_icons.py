from PIL import Image, ImageDraw, ImageFilter
import os, math

OUT = r"public/icons"
os.makedirs(OUT, exist_ok=True)
S = 2048

# Diagonal cyan -> indigo gradient
img = Image.new("RGB", (S, S), "#0f172a")
px = img.load()
c1 = (34, 211, 238)
c2 = (99, 102, 241)
c3 = (15, 23, 42)
for y in range(S):
    for x in range(S):
        t = (x + y) / (2 * (S - 1))
        # blend cyan to indigo, then slightly darken the corners
        r = int(c1[0] * (1 - t) + c2[0] * t)
        g = int(c1[1] * (1 - t) + c2[1] * t)
        b = int(c1[2] * (1 - t) + c2[2] * t)
        edge = min(x, y, S - 1 - x, S - 1 - y) / (S * 0.5)
        dark = 0.76 + 0.24 * min(1.0, edge * 2.0)
        px[x, y] = (int(r * dark), int(g * dark), int(b * dark))

# Soft radial highlight behind the mark
glow = Image.new("L", (S, S), 0)
gd = ImageDraw.Draw(glow)
gd.ellipse((S*0.22, S*0.10, S*0.78, S*0.66), fill=40)
glow = glow.filter(ImageFilter.GaussianBlur(220))
white = Image.new("RGB", (S, S), "white")
img = Image.composite(white, img, glow.point(lambda v: int(v * 0.35)))

# V mark with rounded joints and caps
mark = Image.new("RGBA", (S, S), (0, 0, 0, 0))
d = ImageDraw.Draw(mark)
w = 190
pts = [(520, 640), (1024, 1450), (1528, 640)]
d.line(pts, fill=(255, 255, 255, 255), width=w, joint="curve")
for p in pts:
    d.ellipse((p[0]-w//2, p[1]-w//2, p[0]+w//2, p[1]+w//2), fill=(255, 255, 255, 255))

# Slight shadow for depth
shadow = mark.filter(ImageFilter.GaussianBlur(26))
shadow.putalpha(shadow.getchannel("A").point(lambda v: int(v * 0.30)))
sh = Image.new("RGBA", (S, S), (0, 0, 0, 0))
sh.alpha_composite(shadow, (0, 18))
sh.alpha_composite(mark)
img = img.convert("RGBA")
img.alpha_composite(sh)

# Trim a tiny border and round for non-maskable previews
def save(size, name, rad=0):
    im = img.resize((size, size), Image.LANCZOS)
    if rad:
        mask = Image.new("L", (size, size), 0)
        ImageDraw.Draw(mask).rounded_rectangle((0, 0, size-1, size-1), radius=rad, fill=255)
        im.putalpha(mask)
    im.save(os.path.join(OUT, name), "PNG", optimize=True)

save(1024, "icon-1024.png", 220)
save(512, "icon-512.png", 110)
save(192, "icon-192.png", 42)
save(180, "apple-touch-icon.png", 40)
save(32, "favicon-32.png", 7)
save(512, "maskable-512.png", 0)
# Cropped maskable-safe version (more padding, square background)
safe = Image.new("RGBA", (S, S), (34, 211, 238, 255))
# rebuild gradient for bg
bg = Image.new("RGBA", (S, S))
bp = bg.load()
for y in range(S):
    for x in range(S):
        t = (x + y) / (2 * (S - 1))
        edge = min(x, y, S - 1 - x, S - 1 - y) / (S * 0.5)
        dark = 0.76 + 0.24 * min(1.0, edge * 2.0)
        bp[x, y] = (int((c1[0]*(1-t)+c2[0]*t)*dark), int((c1[1]*(1-t)+c2[1]*t)*dark), int((c1[2]*(1-t)+c2[2]*t)*dark), 255)
# scale V content to safe 80%
inner = img.resize((int(S*0.78), int(S*0.78)), Image.LANCZOS)
bg.alpha_composite(inner, (int(S*0.11), int(S*0.11)))
bg.resize((512, 512), Image.LANCZOS).save(os.path.join(OUT, "maskable-512.png"), "PNG", optimize=True)

print("generated", sorted(os.listdir(OUT)))
