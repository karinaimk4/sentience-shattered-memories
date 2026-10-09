# Nagazora terrain v1

Generated with the built-in image_gen tool. Final: terrain-atlas-alpha-v1.png (1536 x 1024 RGBA). Alpha verified at background points (0,0) and (390,350): 0. Original concept preserved as terrain-concept-v1.png.

## Atlas order (left to right, top to bottom)

1. Reinforced concrete jump block
2. Breakable cracked block
3. Supply crate
4. Three-step staircase
5. Floating stone ledge
6. Moving industrial platform
7. Low road barricade
8. Overhead beam / slide hazard
9. Left bank of pit (open edge on right)
10. Right bank of pit (open edge on left)
11. Deep pit interior
12. Crystal ground hazard

The sheet is artwork, not an automatic collision map. Crop tight sprite rectangles and define landing surfaces separately before gameplay integration. Row 3 cliff artwork extends above the nominal row boundary: do not blindly divide the sheet into equal cells. Gap width must be selected from jump physics, not from the width of the illustration. Existing game assets and code were not replaced.

## Generation prompt

Use case: stylized-concept
Asset type: production-oriented pixel-art terrain and obstacle sprite atlas for the 2D side-scrolling chibi action platformer Sentience: Shattered Memories.
Primary request: draw a beautiful coherent Nagazora ruined-city platformer asset sheet with EXACTLY 12 isolated terrain objects, arranged in a regular 4 columns by 3 rows layout. Landscape 1536x1024 canvas. Each object entirely inside its own equal cell with generous clear padding; no objects touching or overlapping adjacent cells. Transparent RGBA background, actual alpha, NOT a painted checkerboard.
Style: crisp hand-placed-looking 16-bit pixel art with chunky readable pixel clusters, near-black navy outlines, restrained 4-tone material shading, sharp stair-stepped edges. Cute slightly chunky scale suitable for tiny chibi HoS with blue hair and black/gold outfit. Ruined concrete, slate blue metal, dusty lavender stone, modest violet crystal corruption. Gold/cream highlights on safe flat landing surfaces, orange warning accents on hazards. Strict side-scrolling elevation view, flat horizontal collision tops; NO isometric view, NO perspective cube tops. High visual clarity at small gameplay size.
Cell contents, reading left to right:
ROW 1: 1 solid square reinforced concrete jump block with clearly flat light top; 2 square cracked breakable masonry block with flat top; 3 square dark metal supply crate with gold corners and a simple diamond relief, no text; 4 short three-step stone staircase ascending to the right, each step top horizontal.
ROW 2: 1 wide floating stone ledge with flat safe top and jagged underside, small trailing vines; 2 wide industrial moving platform with flat cyan-edged top and small underside mechanism; 3 low striped road barricade to jump over, chunky black/orange readable silhouette; 4 suspended low overhead metal beam to slide beneath, downward small violet crystal tips, no vertical supports.
ROW 3: 1 left bank of a deep broken-road pit: flat safe roadway on left, exposed broken vertical cliff edge on RIGHT, rocky cross section hanging down with a few cables; 2 right bank of same pit: broken cliff edge on LEFT and flat safe roadway extending right, matching elevation/material; 3 deep pit interior cutaway section, narrow dark indigo vertical chasm with fragmented purple crystal facets at the bottom, open dark center and no surface across its top; 4 ground hazard cluster of five short sharp violet crystals on a small rubble base.
Pit banks must be clearly separated modular pieces for variable-width gaps, no ground bridge across the hole.
No characters, no UI, no labels or numbers, no caption, no watermark, no backdrop scenery, no ground outside the individual objects, no soft blur, no antialiasing, no gradients or glossy 3D. All 12 objects visibly distinct and complete.

## Alpha extraction prompt

Use case: background-extraction.
Edit the provided 12-object pixel-art terrain atlas. Remove ALL of the cloudy dark gray/purple backdrop between and around the sprites and output a genuine TRANSPARENT RGBA PNG with alpha=0 outside the objects. No checkerboard drawn into the picture, no solid background, no haze.
Preserve all 12 sprites exactly as drawn: their exact positions, size, pixel edges, colors, highlights, flat landing surfaces, outlines, detail, and 4-column by 3-row layout on the same 1536x1024 canvas. Preserve the dark interior of the pit object in row 3 column 3, as that is part of that sprite; remove the background OUTSIDE its outline. Keep crystal glow tightly inside sprite silhouettes, no broad glow on background. Do not redraw or rearrange any object. Transparent space between every object. No text, no new objects.

