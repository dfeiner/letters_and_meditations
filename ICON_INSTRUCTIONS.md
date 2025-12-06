# Icon Generation Instructions

The extension requires three icon sizes: 16x16, 48x48, and 128x128 pixels.

## Option 1: Use an Online SVG to PNG Converter

1. Open `icon.svg` in your browser
2. Use an online converter like:
   - https://svgtopng.com/
   - https://cloudconvert.com/svg-to-png
   - https://convertio.co/svg-png/

3. Convert to three sizes:
   - icon16.png (16x16)
   - icon48.png (48x48)
   - icon128.png (128x128)

## Option 2: Use ImageMagick (Command Line)

If you have ImageMagick installed:

```bash
convert icon.svg -resize 16x16 icon16.png
convert icon.svg -resize 48x48 icon48.png
convert icon.svg -resize 128x128 icon128.png
```

## Option 3: Use Inkscape (Command Line)

If you have Inkscape installed:

```bash
inkscape icon.svg -w 16 -h 16 -o icon16.png
inkscape icon.svg -w 48 -h 48 -o icon48.png
inkscape icon.svg -w 128 -h 128 -o icon128.png
```

## Option 4: Use Chrome/Browser

1. Open `icon-generator.html` in Chrome
2. Right-click each icon and save as PNG:
   - Save as icon16.png
   - Save as icon48.png
   - Save as icon128.png

## Temporary Workaround

If you want to test the extension immediately without proper icons, you can:
1. Create simple colored squares as temporary icons
2. Or comment out the "icons" sections in manifest.json temporarily
