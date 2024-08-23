// Configuration du jeu
const largeur = 20;
const hauteur = 10;
const vitesseSnake = 500; // en millisecondes

// Définition des symboles
const symboleSerpent = 'O';
const symboleArrierePlan = '.';

// Définition des directions
const directions = {
  HAUT: 'haut',
  BAS: 'bas',
  GAUCHE: 'gauche',
  DROITE: 'droite',
};

// Initialisation du jeu
const serpent = [
  { x: Math.floor(largeur / 2), y: Math.floor(hauteur / 2) }
];
let direction = directions.DROITE;
let nourriture = genererNourriture();

// Fonction pour générer un emplacement de nourriture aléatoire
function genererNourriture() {
  const x = Math.floor(Math.random() * largeur);
  const y = Math.floor(Math.random() * hauteur);
  return { x, y };
}

// Fonction pour afficher le jeu dans le terminal
function afficher() {
  let tableau = '';
  for (let y = 0; y < hauteur; y++) {
    for (let x = 0; x < largeur; x++) {
      let cellule = symboleArrierePlan;
      // Vérifier si la case est occupée par le serpent
      const estSerpent = serpent.some(segment => segment.x === x && segment.y === y);
      if (estSerpent) {
        cellule = symboleSerpent;
      }
      // Vérifier si la case contient de la nourriture
      if (nourriture.x === x && nourriture.y === y) {
        cellule = '◆';
      }
      tableau += cellule;
    }
    tableau += '\n';
  }
  console.clear();
  console.log(tableau);
}

// Fonction pour mettre à jour la position du serpent
function mettreAJour() {
  // Déplacer la tête du serpent dans la direction actuelle
  const tete = { ...serpent[0] };
  switch (direction) {
    case directions.HAUT:
      tete.y--;
      break;
    case directions.BAS:
      tete.y++;
      break;
    case directions.GAUCHE:
      tete.x--;
      break;
    case directions.DROITE:
      tete.x++;
      break;
  }
  // Ajouter la nouvelle tête du serpent
  serpent.unshift(tete);

  // Vérifier si le serpent a mangé de la nourriture
  if (tete.x === nourriture.x && tete.y === nourriture.y) {
    // Générer une nouvelle position de nourriture
    nourriture = genererNourriture();
  } else {
    // Retirer la dernière partie du serpent
    serpent.pop();
  }

  // Vérifier si le serpent a atteint les limites du tableau
  if (
    tete.x < 0 ||
    tete.x >= largeur ||
    tete.y < 0 ||
    tete.y >= hauteur ||
    serpent.some((segment, index) => index !== 0 && segment.x === tete.x && segment.y === tete.y)
  ) {
    // Le jeu est terminé
    clearInterval(rafraichissement);
    console.log('Tu as perdu, tu es trop nuuuuul !!!');
  }
}

// Fonction pour gérer les entrées de l'utilisateur
function gererEntree(saisie: string) {
  switch (saisie) {
    case 'z':
      if (direction !== directions.BAS) {
        direction = directions.HAUT;
      }
      break;
    case 's':
      if (direction !== directions.HAUT) {
        direction = directions.BAS;
      }
      break;
    case 'q':
      if (direction !== directions.DROITE) {
        direction = directions.GAUCHE;
      }
      break;
    case 'd':
      if (direction !== directions.GAUCHE) {
        direction = directions.DROITE;
      }
      break;
  }
}

// Lancer le jeu
const rafraichissement = setInterval(() => {
  afficher();
  mettreAJour();
}, vitesseSnake);

// Gestion des entrées utilisateur
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding('utf-8');
process.stdin.on('data', (key: string) => {
  if (key === '\u0003') {
    // Ctrl+C pour quitter le jeu
    clearInterval(rafraichissement);
    process.exit();
  }
  gererEntree(key.trim());
});