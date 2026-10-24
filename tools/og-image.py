"""Draws the link-preview cards of the site at 1200 by 630: `public/og-image.png`, and one per library at
`public/og/<name>.png`.

The card of the site carries the logo (`public/logo.png`, exported from `public/logo.svg`), the name and the
promise of Tiny Blocks over a faint grid of dots, in the faces of the site. The card of a library carries
the logo and the name of its package instead. The libraries are the ones the catalog of the site lists, so
adding one to the catalog asks for running it again. Run it through `make og-image`, which supplies Pillow
in a container.
"""

import re
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


def libraries() -> list[str]:
    """The name of every library the catalog of the site lists, in its order."""
    catalog = (ROOT / 'src' / 'content' / 'catalog.ts').read_text()
    return re.findall(r"\{ name: '([\w-]+)', area:", catalog)


def blank() -> tuple[Image.Image, ImageDraw.ImageDraw]:
    """A card with the studs and the logo, ready to be written on."""
    card = Image.new('RGBA', (WIDTH, HEIGHT), PAGE)
    studs(card)
    logo = Image.open(ROOT / 'public' / 'logo.png').convert('RGBA').resize((170, 170), Image.LANCZOS)
    card.alpha_composite(logo, (64, 80))
    return card, ImageDraw.Draw(card)


def fitted(text: str, family: str, weight: int, size: int, width: int) -> ImageFont.FreeTypeFont:
    """The face at the given size, or smaller until the text fits the given width."""
    face = font(family, weight, size)
    while face.getlength(text) > width:
        size -= 4
        face = font(family, weight, size)
    return face


def site(output: Path) -> None:
    card, draw = blank()
    draw.text((80, 280), 'Tiny Blocks', font=font('bricolage-grotesque', 700, 120), fill=INK)
    draw.text((84, 430), 'Small, focused PHP libraries.', font=font('ibm-plex-sans', 400, 40), fill=MUTED)
    draw.text((84, 520), 'tiny-blocks.github.io', font=font('jetbrains-mono', 500, 28), fill=ACCENT)
    card.convert('RGB').save(output, optimize=True)


def library(name: str, output: Path) -> None:
    card, draw = blank()
    draw.text((84, 290), 'tiny-blocks/', font=font('jetbrains-mono', 500, 40), fill=MUTED)
    draw.text((80, 340), name, font=fitted(name, 'bricolage-grotesque', 700, 120, WIDTH - 160), fill=INK)
    draw.text((84, 520), f'tiny-blocks.github.io/{name}/', font=font('jetbrains-mono', 500, 28), fill=ACCENT)
    card.convert('RGB').save(output, optimize=True)


def main() -> None:
    site(ROOT / 'public' / 'og-image.png')
    cards = ROOT / 'public' / 'og'
    cards.mkdir(exist_ok=True)
    for name in libraries():
        library(name, cards / f'{name}.png')


if __name__ == '__main__':
    main()
