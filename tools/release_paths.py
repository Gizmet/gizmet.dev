"""Paths kept out of the public static release."""

EXCLUDED_ROUTES = ('demos', 'portal', 'visual-work/digital')

EXCLUDED_ASSET_PATTERNS = (
    'assets/ember.webp',
    'assets/otherwhere.webp',
    'assets/still.webp',
    'assets/street-study.webp',
    'assets/portraits/michael-james-studio*',
    'assets/responsive/assets/portraits/michael-james-studio*',
    'assets/responsive/manifest.json',
    'assets/productions/murder-in-the-valleys.jpg',
    'assets/photography/forgotten-ground/page-18.jpg',
    'assets/photography/forgotten-ground/page-19.jpg',
    'assets/photography/forgotten-ground/page-38.jpg',
    'assets/photography/forgotten-ground/page-39.jpg',
    'assets/photography/forgotten-ground/book-pages/*.jpg',
    'assets/photography/forgotten-ground/forgotten-ground-print-2022.pdf',
    'assets/motion/home-thread.mp4',
    'assets/motion/home-thread-poster.jpg',
    'assets/motion/home-thread-manifest.json',
)


def excluded_assets(site):
    return sorted({path for pattern in EXCLUDED_ASSET_PATTERNS for path in site.glob(pattern)})
