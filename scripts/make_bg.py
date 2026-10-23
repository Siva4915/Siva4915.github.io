from PIL import Image
import os
S=1024
bg=Image.new("RGBA",(S,S))
px=bg.load()
c1=(34,211,238); c2=(99,102,241)
for y in range(S):
    for x in range(S):
        t=(x+y)/(2*(S-1))
        edge=min(x,y,S-1-x,S-1-y)/(S*0.5)
        dark=0.76+0.24*min(1.0,edge*2.0)
        px[x,y]=(int((c1[0]*(1-t)+c2[0]*t)*dark),int((c1[1]*(1-t)+c2[1]*t)*dark),int((c1[2]*(1-t)+c2[2]*t)*dark),255)
bg.save('assets/icon-background.png','PNG',optimize=True)
print('background regenerated')
