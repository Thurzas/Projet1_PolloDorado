const orange = '#ffbf01ff';
const cyan = '#26BBE2';
window.addEventListener('load', () => {
    const manager = new SketchyManager();

    document.querySelectorAll('.SketchyTitle').forEach(title => {
        if(title!== null || title !== undefined) {
            manager.addElement(title);
        }
    });

    window.addEventListener('resize', () => manager.redrawAll());
});

class SketchyStrategy {
    constructor(element) {
        this.element = element;
    }

    // Méthode abstraite à implémenter pour chaque stratégie
    draw() {
        throw new Error('La méthode "draw" doit être implémentée');
    }

    // Méthode utilitaire pour récupérer ou créer un SVG
    createOrGetSVG() {
        let svg = this.element.querySelector(':scope > svg');
        if (!svg) {
            svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            // Empêche les interactions utilisateur
            svg.style.pointerEvents = 'none'; 
            this.element.appendChild(svg);

            // Positionnement relatif requis pour l'élément parent
            if (getComputedStyle(this.element).position === 'static') {
                this.element.style.position = 'relative';
            }
        }
        return svg;
    }
}

// --- Factory pour déterminer la stratégie ---
class SketchyStrategyFactory {
    static createStrategy(element) {
        console.log(element);
        if(element.classList.contains('SketchyTitle'))
        {
            if(element.classList.contains('cyan'))
            {
                return new SketchyTitle(element, './assets/fonts/Orbitron-VariableFont_wght.ttf', 'black', cyan);
            }
            else if(element.classList.contains('orange'))
            {
                return new SketchyTitle(element, './assets/fonts/Orbitron-VariableFont_wght.ttf', 'black', orange);
            }
            else
            {
                return new SketchyTitle(element, './assets/fonts/Orbitron-VariableFont_wght.ttf', 'black', 'white');
            }            
        }

        if(element.classList.contains('SketchyLabel'))
        {
            if(element.classList.contains('inversed'))
            {
                return new SketchyLabel(element, 'black', 'white');
            }
            else
            {
                return new SketchyLabel(element, 'white', 'black');                
            }
        }
        return new DefaultSketchy(element);
    }
}
// --- Gestionnaire central ---
class SketchyManager {
    constructor() {
        this.strategies = [];
    }

    // Ajoute une stratégie et applique le dessin
    addElement(element) {
        const strategy = SketchyStrategyFactory.createStrategy(element);
        this.strategies.push(strategy);
        strategy.draw();
    }

    // Redessine tous les éléments
    redrawAll() {
        this.strategies.forEach(strategy => strategy.draw());
    }
}
// --- Stratégie pour les labels ---
class LabelSketch extends SketchyStrategy {
    constructor(element, color, background) {
        super(element);
        this.color=color;
        this.background = background;
    }
    draw() {
        const input = document.getElementById(this.element.htmlFor);
        if (!input) return; // Si aucun input associé, rien à faire

        const svg = this.createOrGetSVG();
        const rc = rough.svg(svg);

        // Ajuste le SVG pour englober l'input associé
        svg.setAttribute('width', input.offsetWidth + 20);
        svg.setAttribute('height', input.offsetHeight + 20);
        svg.style.position = 'absolute';
        svg.style.top = `${input.offsetTop - 10}px`;
        svg.style.left = `${input.offsetLeft - 10}px`;

        // Vide le contenu précédent
        svg.innerHTML = '';

        // Dessine une bordure esquissée autour de l'input
        const sketchyRect = rc.rectangle(
            10, 10, input.offsetWidth, input.offsetHeight,
            { roughness: 2.5, bowing: 1.5, stroke: this.color, strokeWidth: 2 }
        );
        svg.appendChild(sketchyRect);
    }
}


// --- Stratégie pour un titre rough ---
class SketchyTitle extends SketchyStrategy
{
    constructor(element, police, colorIn, colorOut)
    {
        super(element);
        this.police = police;
        this.colorIn = colorIn;
        this.colorOut = colorOut;
        this.text = this.element.textContent;
    }
    draw() {
    
        const svg = this.createOrGetSVG(); // récupère le svg 
        svg.innerHTML = '';
    
        // Taille de l'élément
        const width = this.element.offsetWidth;
        const height = this.element.offsetHeight;
        
        // Définir les dimensions et le style du SVG
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.zIndex = '1'; // Appliquer un z-index pour le placement correct
        this.element.style.color = "transparent"; //on invisibilise le texte pour garder sa taille physique.
        
        // Charge la police de manière asynchrone
        fetch(this.police)
            .then(response => response.arrayBuffer())
            .then(buffer => {
                const phrase = this.text.toUpperCase();
                const font = opentype.parse(buffer);    
    
                let X = 0; // Position de départ en X
                let Y = height * 0.75; // Position de départ en Y
                const letterSpacing = 5; // Espacement des lettres
                let fontSize = parseInt(getComputedStyle(this.element).fontSize, 10); 
                
                // Ajuste la taille pour que le texte s'inscrive dans le conteneur
                const scaleFactor = Math.min(
                    width / (phrase.length * font.unitsPerEm), // Facteur basé sur la largeur
                    height / font.unitsPerEm // Facteur basé sur la hauteur
                );

                let offsetX = fontSize*scaleFactor*0.5; // Décalage en X pour la glyphe intérieure
                let offsetY = fontSize*scaleFactor*0.5; // Décalage en Y pour la glyphe intérieure
                fontSize = scaleFactor * font.unitsPerEm;
    
                if (phrase !== undefined && phrase.length > 0) {
                    for (let i = 0; i < phrase.length; i++) {
                        const glyph = font.charToGlyph(phrase[i]);
                        const metrics = glyph.getMetrics();
                    
                        const scale = fontSize / font.unitsPerEm;
                        const offsetX = metrics.leftSideBearing * scale + scale; // Alignement horizontal
                        const offsetY = (metrics.yMax - metrics.yMin) * scale * 0.075; // Alignement vertical ajusté
                
                        // Génération des chemins SVG
                        const outerGlyph = glyph.getPath(X, Y, fontSize).toSVG();
                        const innerGlyph = glyph.getPath(X + offsetX, Y - offsetY, fontSize * 0.85).toSVG();
                        const strokeWidth = 0.2*fontSize; 
                        if (phrase[i] !== " ") {   
                            const outerPath = outerGlyph.match(/d="([^"]+)"/)[1];
                            const innerPath = innerGlyph.match(/d="([^"]+)"/)[1];
                            const pathOUT = document.createElementNS("http://www.w3.org/2000/svg", "path");
                            pathOUT.setAttribute("d", outerPath);
                            pathOUT.setAttribute("fill", this.colorOut);
                            pathOUT.setAttribute("stroke", this.colorOut);
                            pathOUT.setAttribute("stroke-width", strokeWidth);
                            svg.appendChild(pathOUT);
                    
                            const pathIN = document.createElementNS("http://www.w3.org/2000/svg", "path");
                            pathIN.setAttribute("d", innerPath);
                            pathIN.setAttribute("fill", this.colorIn);
                            pathIN.setAttribute("stroke", this.colorIn);
                            pathIN.setAttribute("stroke-width", strokeWidth*0.5);
                            svg.appendChild(pathIN);
                    
                            // Ajuste la position X pour le prochain glyphe
                            X += (glyph.advanceWidth * scale) + letterSpacing;
                        } else {
                            X += (glyph.advanceWidth * scale) + letterSpacing;
                        }
                    }                    
                }
            })
        .catch(err => {
            console.error('Erreur lors du chargement de la police :', err);
        });
    }
}

// --- Stratégie par défaut (autres éléments) ---
class DefaultSketchy extends SketchyStrategy {
    draw() {
        const svg = this.createOrGetSVG();
        const rc = rough.svg(svg);

        const { offsetWidth, offsetHeight } = this.element;

        // Ajuste le SVG
        svg.setAttribute('width', offsetWidth + 20);
        svg.setAttribute('height', offsetHeight + 20);
        svg.style.position = 'absolute';
        svg.style.top = '-10px';
        svg.style.left = '-10px';

        // Vide le contenu précédent
        svg.innerHTML = '';

        // Dessine une bordure esquissée autour de l'élément
        const sketchyRect = rc.rectangle(
            10, 10, offsetWidth, offsetHeight,
            { roughness: 2.5, bowing: 1.5, stroke: '#333', strokeWidth: 2 }
        );
        svg.appendChild(sketchyRect);
    }
}