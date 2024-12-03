
window.addEventListener('load', function() {
    const menus = document.querySelector("main").children;

    const ongletItems = document.querySelector(".navMenus").children[0].children;
    const onglet = document.querySelector(".navMenus").children[0];
    const main = document.querySelector("main");

    for(let i=0;i<ongletItems.length;i++) {
        ongletItems[i].addEventListener('click', function() {
            if(i<menus.length)
            {
                onglet.insertBefore(ongletItems[i],ongletItems[0]);
                main.insertBefore(menus[i],main.children[0]);
            }
        });
    }
});