addEventListener("load", () => {

const eventNav = document.getElementById("navbar");
const target = document.getElementById("targetMenu");
console.log(target);

/*
 pour l'explication : 
 on recherche l'objet DOM qui contient notre ul (eventNav), on défini deux états :
 état 1 : il est invisible et intangible, donc on va lui remplacer sa classe .hide par un .show
 etat 2 : il est visible et tangigle, on va donc remplacer sa classe .show par .hide
*/
target.addEventListener("click", () => {

    if(eventNav.classList.contains("hide"))
    {
        eventNav.classList.add("show"); 
        eventNav.classList.remove("hide");
    
    }
    else if(eventNav.classList.contains("show"))
    {
        eventNav.classList.add("hide"); 
        eventNav.classList.remove("show"); 
    }
});
});