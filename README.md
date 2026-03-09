# Biosphère

Projet de visualisation des systèmes de biocontrôle (SAE 301-303). Présentation des projets 4SYSLEG, BioREco, BREIZILEG, CanécoH et CAP ReD avec graphiques interactifs.

## Structure du projet

```
BIOspshere/
├── index.html          # Page d’accueil
├── css/
│   └── styles.css      # Styles globaux
├── js/
│   └── script.js       # Logique et graphiques (Chart.js)
├── assets/
│   └── images/         # Logo et visuels (voir README dans le dossier)
├── data/               # Données sources (CSV, voir README)
└── SAE 301-303/       # Ancienne arborescence (HTML, CSS, JS, data.json)
```

## Lancer le projet

Ouvrir `index.html` dans un navigateur (ou servir le dossier avec un serveur local pour éviter les restrictions CORS si besoin).

## Fichiers à ajouter

Dans `assets/images/` :

- **logo.png** — Logo Biosphère
- **univeiffel.png** — Logo Université Gustave Eiffel

Sans ces fichiers, le header et le footer n’afficheront pas les images.

## Technologies

- HTML5, CSS3, JavaScript
- [Chart.js](https://www.chartjs.org/) pour les graphiques
- [Font Awesome](https://fontawesome.com/) pour les icônes
- Police [Poppins](https://fonts.google.com/specimen/Poppins) (Google Fonts)
