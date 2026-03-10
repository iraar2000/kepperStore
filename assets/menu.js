// handling the clicking
const menu_items = document.querySelectorAll(".menu-item-container");
let activeMenu = menu_items[0];
menu_items.forEach(menu => {
    menu.addEventListener("click", ()=>{
        activeMenu = menu;
    })
    
    activeMenu.classList.toggle("active");
    if(menu != activeMenu) activeMenu.classList.remove("active");
})
console.log(menu_items.length);