#!/usr/bin/env python3
"""Génère les pages HTML du site (en-tête, pied de page et <head> communs) à partir de outils/src/*.main.html.
Usage : python3 outils/build.py   (depuis la racine du dépôt)"""
import os, sys, html

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'outils', 'src')
BASE = 'https://webaunet.github.io/ABELIA-PAYSAGES/'
NAME = 'Abelia Paysages'

# (fichier, libellé menu, title, description, fragment)
PAGES = [
 ('index.html', 'Accueil', 'Abelia Paysages | Paysagiste à Briis-sous-Forges (91) depuis 1990',
  'Abelia Paysages, paysagiste à Briis-sous-Forges (91) depuis 1990 : création de jardin, maçonnerie paysagère, entretien, élagage et abattage en Essonne, Hauts-de-Seine et Yvelines.', 'index'),
 ('prestations.html', 'Prestations', 'Prestations | Abelia Paysages, paysagiste en Essonne (91)',
  'Création de jardin, maçonnerie paysagère, dallage, clôture, arrosage, entretien, plantation, taille douce, élagage et abattage : les prestations d’Abelia Paysages à Briis-sous-Forges.', 'prestations'),
 ('realisations.html', 'Réalisations', 'Réalisations | Abelia Paysages, jardins en Essonne, Hauts-de-Seine et Yvelines',
  'Galerie des interventions d’Abelia Paysages : création, plantation, entretien, élagage. Paysagiste basé à Briis-sous-Forges (91).', 'realisations'),
 ('zone-intervention.html', 'Zone d’intervention', 'Zone d’intervention | Abelia Paysages, Essonne, Hauts-de-Seine, Yvelines',
  'Abelia Paysages, basé à Briis-sous-Forges, se déplace dans l’Essonne (91), les Hauts-de-Seine (92) et les Yvelines (78).', 'zone-intervention'),
 ('contact.html', 'Contact', 'Contact et devis gratuit | Abelia Paysages, Briis-sous-Forges (91)',
  'Contactez Abelia Paysages, paysagiste à Briis-sous-Forges (91) : téléphone 06 07 56 00 91, e-mail ou formulaire de demande de devis gratuit.', 'contact'),
 ('mentions-legales.html', None, 'Mentions légales | Abelia Paysages, Briis-sous-Forges (91)',
  'Mentions légales du site d’Abelia Paysages, paysagiste à Briis-sous-Forges (91) : éditeur, SIREN, contact et données personnelles.', 'mentions-legales'),
]
MENU = [(f, l) for f, l, *_ in PAGES if l]

def read(name):
    with open(os.path.join(SRC, name), encoding='utf-8') as fh:
        return fh.read().strip()

def header(cur):
    items = []
    for f, l in MENU:
        attr = ' aria-current="page"' if f == cur else ''
        items.append('<a href="%s"%s>%s</a>' % (f, attr, l))
    return '''<header class="hdr">
  <div class="wrap hdr__in">
    <a class="logo" href="%s" aria-label="Abelia Paysages, accueil"><b>Abelia</b><span>paysages</span><i aria-hidden="true"></i></a>
    <nav class="nav" id="nav" aria-label="Navigation principale">
      %s
    </nav>
    <a class="btn btn--rose btn--sm hdr__cta" href="tel:+33607560091" aria-label="Appeler Abelia Paysages au 06 07 56 00 91">
      <svg class="ico" aria-hidden="true"><use href="#i-phone"/></svg><span class="cta-num">06 07 56 00 91</span><span class="cta-lbl">Appeler</span>
    </a>
    <button class="burger" id="burger" type="button" aria-expanded="false" aria-controls="nav" aria-label="Ouvrir le menu"><span></span></button>
  </div>
</header>''' % (BASE, '\n      '.join(items))

def footer(cur):
    links = ''.join('<a href="%s"%s>%s</a>' % (f, ' aria-current="page"' if f == cur else '', l) for f, l in MENU)
    legal = '<a href="mentions-legales.html"%s>Mentions légales</a>' % (' aria-current="page"' if cur == 'mentions-legales.html' else '')
    return '''<footer class="ftr on-dark">
  <div class="wrap ftr__in">
    <a class="logo" href="%s" aria-label="Abelia Paysages, accueil"><b>Abelia</b><span>paysages</span><i aria-hidden="true"></i></a>
    <nav class="ftr__links" aria-label="Liens du pied de page">%s%s</nav>
    <p class="ftr__meta"><span class="m-hide">06 07 56 00 91</span><span>abelia-paysage@hotmail.fr</span><span>Briis-sous-Forges (91)</span><span class="m-hide">SIREN 353 581 879</span></p>
  </div>
</footer>''' % (BASE, links, legal)

def build():
    sprite = read('sprite.html')
    for f, l, title, desc, frag in PAGES:
        main = read(frag + '.main.html')
        out = '''<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>%s</title>
<meta name="description" content="%s">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&amp;family=Figtree:wght@400;500;600;700&amp;display=swap">
<link rel="stylesheet" href="style.css">
</head>
<body>
%s

%s

%s

%s

<div class="toast" id="toast" role="status" aria-live="polite"></div>
<script src="script.js" defer></script>
</body>
</html>
''' % (html.escape(title, quote=False), html.escape(desc), sprite, header(f), main, footer(f))
        with open(os.path.join(ROOT, f), 'w', encoding='utf-8') as fh:
            fh.write(out)
        print('écrit', f, len(out))

if __name__ == '__main__':
    build()
