from PIL import Image, ImageDraw, ImageFilter
import os
os.makedirs("assets", exist_ok=True)
S=2732
bg=Image.new("RGBA",(S,S),(15,15,15,255))
# subtle radial glow
glow=Image.new("RGBA",(S,S),(0,0,0,0))
gd=ImageDraw.Draw(glow)
gd.ellipse((S*0.20,S*0.14,S*0.80,S*0.74), fill=(34,211,238,36))
glow=glow.filter(ImageFilter.GaussianBlur(250))
bg.alpha_composite(glow)
mark=Image.open("assets/icon-foreground.png").convert("RGBA")
m=mark.resize((760,760), Image.LANCZOS)
bg.alpha_composite(m, ((S-760)//2, (S-760)//2 - 40))
bg.save("assets/splash.png","PNG",optimize=True)
bg.save("assets/splash-dark.png","PNG",optimize=True)
print("splash generated")
