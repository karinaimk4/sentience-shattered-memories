# Gian 2 Heliopolis — Prompt và asset đã dùng

## Asset trong game

- Final: `assets/event-v3/lv2/heliopolis-room-v2.png` — 640 × 416 px.
- Generated source: `assets/event-v3/lv2/generated-source/heliopolis-room-source-v2.png`.
- Bản đầu có hàng rào tiền cảnh: `assets/event-v3/lv2/heliopolis-room-v1.png`.

Ảnh được tạo bằng built-in ImageGen, dùng map Nagazora hiện có làm chuẩn mật độ pixel và ảnh quán ăn Honkai do người dùng cung cấp làm chuẩn bố cục.

## Prompt tạo nền

```text
Use case: stylized-concept
Asset type: production game environment background for a 640x416 HTML5 Canvas restaurant management minigame
Primary request: Create a new indoor Heliopolis / Arc City restaurant extension map, clearly more premium and exciting than the outdoor starter stall.
Scene/backdrop: futuristic East Asian restaurant interior at night, large upper-wall windows showing a neon cyan and magenta city skyline, dark teal stone-and-metal floor with subtle wet-looking reflections, warm amber wood trim and lantern accents, clean kitchen preparation zone along the upper-left wall, service/pass and dishwashing zone along the upper-right wall, open central dining floor, reception and entrance zone at bottom center.
Style/medium: polished hand-painted 2D pixel art, cute clean readable game environment, crisp edges, rich but not muddy.
Composition/framing: exact wide 640:416 ratio; fixed high-angle 2.5D game camera; large unobstructed central floor; no isometric diamond grid.
Constraints: environment/background only; no people, characters, dining tables, stools, text, UI, logos, or watermark.
```

## Prompt sửa tiền cảnh

```text
Remove only the entire foreground railing/wall, fountain strips, lantern posts, and entrance mat across the bottom quarter. Replace that foreground construction with the same dark teal stone tile floor continuing naturally all the way to the bottom edge, leaving a wide clear entrance opening centered at the bottom. Preserve the kitchen, sink, windows, skyline, plants, side walls, lighting, camera angle, pixel-art rendering, floor grid, and reflections.
```
