#!/usr/bin/env python3
"""Check the prepared local release without contacting external services."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import xml.etree.ElementTree as ET
from release_paths import EXCLUDED_ROUTES, excluded_assets

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / 'dist'
class Page(HTMLParser):
    def __init__(self, source):
        super().__init__(); self.links=[]; self.ids=set(); self.meta={}; self.canonical=None; self.images=[]
        self.feed(source)
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if a.get('id'): self.ids.add(a['id'])
        if tag=='meta': self.meta[a.get('name',a.get('property',''))]=a.get('content','')
        if tag=='link' and a.get('rel')=='canonical': self.canonical=a.get('href')
        if tag=='img': self.images.append(a)
        for key in ('src','href','poster','data-manifest'):
            if a.get(key): self.links.append(a[key])
        if a.get('srcset'):
            self.links.extend(v.strip().split()[0] for v in a['srcset'].split(','))

def main():
    errors=[]; files=list(SITE.rglob('*.html')); pages={p:Page(p.read_text()) for p in files}
    if len(files)!=15: errors.append(f'Expected 15 public HTML pages; got {len(files)}')
    for path,page in pages.items():
        for key in ('description','og:title','og:description','og:image','og:url'):
            if not page.meta.get(key): errors.append(f'{path}: missing {key}')
        if not page.canonical: errors.append(f'{path}: missing canonical')
        if '—' in path.read_text(): errors.append(f'{path}: em dash')
        for img in page.images:
            if img.get('src') and ('alt' not in img or not img.get('width') or not img.get('height')):
                errors.append(f'{path}: image missing alt/dimensions: {img.get("src")}')
        for link in page.links:
            u=urlsplit(link)
            if u.scheme or u.netloc: continue
            target=(SITE/u.path.lstrip('/')) if u.path.startswith('/') else path.parent/u.path
            if not u.path: target=path
            if target.is_dir(): target=target/'index.html'
            target=target.resolve()
            if not target.exists(): errors.append(f'{path}: missing {link}')
            elif u.fragment and target.suffix=='.html':
                other=pages.get(target) or Page(target.read_text())
                if unquote(u.fragment) not in other.ids: errors.append(f'{path}: missing anchor {link}')
    for excluded in (*EXCLUDED_ROUTES,'GIZMET-INBOX'):
        if (SITE/excluded).exists(): errors.append(f'Excluded path present: {excluded}')
    for path in excluded_assets(SITE):
        errors.append(f'Excluded preview asset present: {path.relative_to(SITE)}')
    urls=[n.text for n in ET.parse(SITE/'sitemap.xml').findall('.//{*}loc')]
    if len(urls)!=15: errors.append('Sitemap must have 15 routes')
    df=(SITE/'research/docuforge/index.html').read_text().lower()
    for term in ('five mile','screenshots','client material','df-process','cleared example'):
        if term in df: errors.append(f'DocuForge contains removed material: {term}')
    if errors: raise SystemExit('\n'.join(errors))
    print(f'PASS: {len(files)} public pages, metadata, local targets, image attributes, confidentiality guards and release exclusions.')
if __name__=='__main__': main()
