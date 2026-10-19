"""Draws the link-preview card of the site, `public/og-image.png`, at 1200 by 630.

The card carries the logo (`public/logo.png`, exported from `public/logo.svg`), the name and the promise of
Tiny Blocks over a faint grid of dots, in the faces of the site. Run it through `make og-image`, which
supplies Pillow in a container.
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

WIDTH, HEIGHT = 1200, 630
PAGE, INK, MUTED, ACCENT, STUD = '#f5f6fc', '#161a33', '#4a5072', '#3846a8', (75, 90, 150, 40)
ROOT = Path(__file__).parent.parent
FONTS = ROOT / 'src' / 'assets' / 'fonts'


def font(family: str, weight: int, size: int) -> ImageFont.FreeTypeFont:
    """The variable face of the site of the given family, set to the given weight and size."""
    face = ImageFont.truetype(str(FONTS / f'{family}-latin-variable.woff2'), size)
    face.set_variation_by_axes([weight])
    return face


def studs(card: Image.Image) -> None:
    """Prints the studs of the bricks faintly over the card, fading toward the bottom."""
    layer = Image.new('RGBA', card.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    for y in range(14, HEIGHT, 28):
        alpha = int(STUD[3] * max(0.0, 1 - y / HEIGHT))
        for x in range(14, WIDTH, 28):
            draw.ellipse((x - 2.5, y - 2.5, x + 2.5, y + 2.5), fill=(*STUD[:3], alpha))
    card.alpha_composite(layer)


def main(output: str) -> None:
    card = Image.new('RGBA', (WIDTH, HEIGHT), PAGE)
    studs(card)
    logo = Image.open(ROOT / 'public' / 'logo.png').convert('RGBA').resize((170, 170), Image.LANCZOS)
    card.alpha_composite(logo, (64, 80))
    draw = ImageDraw.Draw(card)
    draw.text((80, 280), 'Tiny Blocks', font=font('bricolage-grotesque', 700, 120), fill=INK)
    draw.text((84, 430), 'Small, focused PHP libraries.', font=font('ibm-plex-sans', 400, 40), fill=MUTED)
    draw.text((84, 520), 'tiny-blocks.github.io', font=font('jetbrains-mono', 500, 28), fill=ACCENT)
    card.convert('RGB').save(output, optimize=True)


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'public/og-image.png')
