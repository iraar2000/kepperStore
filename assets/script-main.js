import * as dropdown from './script-dropdown.js';
import * as search from './script-searchbar.js';
import * as homeLayout from './script-homelayout.js';

const collectionsData = getCollectionsJson();
search.insertCategory(collectionsData);

// main components function handler
searchEventHandler();
dropDownButtonEventHandler();
socialMediaBtnHandler();

// homelayout control function
homeLayout.productMainCategoryEventHandler();
homeLayout.productMainCategoryInitializer(collectionsData);
homeLayout.popularCategoryDisplayer(collectionsData);
homeLayout.groupDisplayer("Phones & Tablets", collectionsData);

// search category fetching and insertion to the category content
async function searchEventHandler() {
    // handle the search event when user clicks on search button
    const searchbar = document.querySelector('.searchbar');
    const searchButton = searchbar.querySelector('.search-button');
    searchButton.addEventListener('click', async () => {
        const productName = searchbar.querySelector('.searchbar-input input').value;
        const category = searchbar.querySelector('.dropdown p').textContent;
        window.location.href = "/pages/products?type=search&product=" + productName + "&category=" + category;
    })
}

// dropdown setting handling
function dropDownButtonEventHandler() {
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdown.dropdownHandler(dropdowns);
    document.addEventListener('click', () => {
        dropdown.dropdownDiactivatorOnoutsideClick(dropdowns);
    })
}

// the social media button handling function
function socialMediaBtnHandler() {
    const socialBtns = document.querySelectorAll('.socialmedia-btn');
    socialBtns.forEach(socialBtn => {
        socialBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            const name = socialBtn.dataset.name;
            if (name.toLowerCase() == 'whatsapp') window.location.href = 'https://wa.me/' + accounts[name];
            else if (name.toLowerCase() == 'facebook') window.location.href = 'https://www.facebook.com/' + accounts[name];
            else if (name.toLowerCase() == 'instagram') window.location.href = 'https://www.intagram.com/' + accounts[name];
            else if (name.toLowerCase() == 'youtube') window.location.href = 'https://www.youtube.com/@' + accounts[name];
        })
    })
}