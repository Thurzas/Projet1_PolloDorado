
window.addEventListener('load', function() {
    const menus = document.querySelector("main").children;

    const ongletItems = document.querySelector(".navMenus").children[0].children;
    const onglet = document.querySelector(".navMenus").children[0];
    const main = document.querySelector("main");
    let items = [];
    for(let i =0;i<ongletItems.length;i++) 
    {
        let item ={
            onglet:ongletItems[i],
            menu:menus[i]
        }
        items.push(item);
    }

    // Ajouter les événements click pour chaque onglet
    for (let i = 0; i < items.length; i++) {
        items[i].onglet.addEventListener("click", () => {
        // Déplacer le menu correspondant en haut de la liste dans <main>
        main.insertBefore(items[i].menu, main.firstChild);
        });
    }
});
