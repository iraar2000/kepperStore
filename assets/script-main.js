import * as api from "./script-api.js";
import * as dropdown from './script-dropdown.js';
import * as search from './script-searchbar.js';
import * as homeLayout from './script-homelayout.js';
import * as prodListingLayout from './script-productListingLayout.js';
import * as prodDetailsLayout from './script-productDetails.js';
import * as shoppingCart from "./script-shopCart.js";

search.insertCollection(collectionList);

const pathName = window.location.pathname;
const cartMngr = new shoppingCart.cartManager();
const cartData = await cartMngr.loadCart();

// updating the cart status as the screen logs
shoppingCart.updatingMenuCartStatus(cartData);

// main components function handler
searchEventHandler();
dropDownButtonEventHandler();
socialMediaBtnHandler();

// page navigation condition handler
if (pathName == "/") homeLayoutHandler();
else if (pathName == "/pages/cart") shoppingCartLayoutHandler();
else if (pathName.includes("/pages/products")) productListingLayoutHandler();
else if (pathName.includes("/pages/product-details")) productDetailsLayoutHandler();

// product listing layout control function
async function productListingLayoutHandler() {
    const params = new URLSearchParams(window.location.search);
    const handle = params.get('collection').toLowerCase().replace(" & ", "-");

    const spinningContainer = document.querySelector('.loading-container');

    if (handle != "all" && handle != "search") {
        // here we get the product by collection card clicking
        const coll = await api.getCollectionByHandel(handle);
        const subCollectionData = await Promise.all(coll.subcollections.map(subCollHandle => api.getCollectionByHandel(subCollHandle)));
        const productData = await Promise.all(coll.products.map(prodHandle => api.getProductByHandle(prodHandle)));
        prodListingLayout.main(productData, subCollectionData, icons, handle);
    } else if (handle == "all") {
        //here we get all the products listed in the store
        const subCollectionData = await api.fetchSubCategories();
        const productsHandle = await api.fetchProducts(100);
        const productData = await Promise.all(productsHandle.map(prodHandle => api.getProductByHandle(prodHandle)));
        prodListingLayout.main(productData, subCollectionData, icons, "all");
    }
}

// product details layout section
async function productDetailsLayoutHandler() {
    const params = new URLSearchParams(window.location.search);
    const productHandle = params.get("handle");

    const product = await api.getProductByHandle(productHandle);
    const reviews = []; //await fetchData(url, 'reviews.json');
    const users = []; //await fetchData(url, 'users.json');
    await prodDetailsLayout.main(product, icons, reviews, users);
    const cartMan = new shoppingCart.cartManager();

    // managing controll button clicks for add to cart and check out

    const addToCartBtn = document.querySelector('.addtocart-btn');
    const chkOutBtn = document.querySelector('.buywith-btn');
    const productDetails = document.querySelector('.main-container .productDetails-container');

    // the add to cart button click
    addToCartBtn?.addEventListener('click', event => {
        event.stopPropagation();
        const prodData = {
            'variantid': productDetails.dataset.variantid,
            'handle': productDetails.dataset.producthandle,
            'quantity': parseInt(productDetails.dataset.productquantity)
        };
        cartMan.addToCart(prodData);
    })

    // the checkout button click
    chkOutBtn?.addEventListener('click', event => {
        event.stopPropagation();
    })
}

// shopping cart layout section and handling the events
async function shoppingCartLayoutHandler() {
    shoppingCart.main(cartData);

    // handle removal of the product from cart 
    const deleteBtns = document.querySelectorAll('.controller-container i.delete')
    deleteBtns.forEach(deleteBtn => {
        deleteBtn.addEventListener('click', async (event) => {
            event.stopPropagation();
            const content = deleteBtn.closest('.content');
            const contentContainer = content.closest('.content-container');

            await cartMngr.removeFromCart(content.dataset.variantid)
            contentContainer.removeChild(content); // removing the item from cart
        })
    })

}

// this function handles the homelayout of the home page and the product listing in the home page
async function homeLayoutHandler() {
    await homeLayout.productMainCollectionInitializer(collectionList);
    homeLayout.main(collectionList, icons);
}

// search collection fetching and insertion to the collection content
async function searchEventHandler() {
    // handle the search event when user clicks on search button
    const searchbar = document.querySelector('.searchbar');
    const searchButton = searchbar.querySelector('.search-button');
    searchButton.addEventListener('click', async () => {
        const productName = searchbar.querySelector('.searchbar-input input').value;
        const collection = searchbar.querySelector('.dropdown p').textContent;
        window.location.href = "/pages/products?type=search&product=" + productName + "&collection=" + collection;
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