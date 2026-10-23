from PIL import Image, ImageDraw, ImageFilter
import os
OUT = r"public/icons"
os.makedirs(OUT, exist_ok=True)
S = 1024
img = Image.new("RGBA", (S, S))
px = img.load()
c1 = (34, 211, 238); c2 = (99, 102, 241)
for y in range(S):
    for x in range(S):
        t = (x + y) / (2 * (S - 1))
        edge = min(x, y, S - 1 - x, S - 1 - y) / (S * 0.5)
        dark = 0.76 + 0.24 * min(1.0, edge * 2.0)
        px[x, y] = (int((c1[0]*(1-t)+c2[0]*t)*dark), int((c1[1]*(1-t)+c2[1]*t)*dark), int((c1[2]*(1-t)+c2[2]*t)*dark), 255)

mark = Image.new("RGBA", (S, S), (0,0,0,0))
d = ImageDraw.Draw(mark)
w = 96
pts = [(0.34*S, 0.35*S), (0.5*S, 0.66*S), (0.66*S, 0.35*S)]
d.line(pts, fill=(255,255,255,255), width=w, joint="curve")
for p in pts:
    d.ellipse((p[0]-w/2, p[1]-w/2, p[0]+w/2, p[1]+w/2), fill=(255,255,255,255))
shadow = mark.filter(ImageFilter.GaussianBlur(12))
sh = Image.new("RGBA", (S,S), (0,0,0,0)); sh.alpha_composite(shadow, (0,8))
sh.putalpha(sh.getchannel("A").point(lambda v: int(v*0.25)))
img.alpha_composite(sh)
img.alpha_composite(mark)
img.resize((512,512), Image.LANCZOS).save(os.path.join(OUT, "maskable-512.png"), "PNG", optimize=True)
img.save(os.path.join(OUT, "maskable-1024.png"), "PNG", optimize=True)

# Adaptive icon source assets for Capacitor
assets = "assets"
os.makedirs(assets, exist_ok=True)
# foreground: transparent V with safe-zone padding
fg = Image.new("RGBA", (S,S), (0,0,0,0))
fg.alpha_composite(mark)
fg.save(os.path.join(assets, "icon-foreground.png"), "PNG", optimize=True)
# background gradient
bg = Image.new("RGBA", (S,S), (0,0,0,255)); bg.paste(img, (0,0)); bg.save(os.path.join(assets, "icon-background.png"), "PNG", optimize=True)
# full icon for legacy
img.resize((1024,1024), Image.LANCZOS).save(os.path.join(assets, "icon-only.png"), "PNG", optimize=True)
print("done")
