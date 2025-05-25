'use strict'

const catalog = document.getElementById("catalog")

const isCart = window.location.pathname.endsWith('cart.html')

fetch("./data/product.json").then( uploadProducts)

function uploadProducts(data) {
    
    data.json().then( getProducts ) 
}

function getProducts(products) {
    for (let phoneName in products){
        const phoneData = products[phoneName]
        console.log(phoneName,phoneData)
    }
}





const cartProductCounter = document.getElementById("cart-product-counter")

let order={}
let storageData = localStorage.getItem('order')
if (storageData) {
    order = JSON.parse(storageData)
    let count = 0
    for(let productName in order) {
        count += order[productName]
    }
    cartProductCounter.innerText = count
}



function uploadProducts(data) {
    data.json().then( getProducts )
}   

function getProducts(data) {
    for(let phoneName in data) {
        if (isCart === true) {
            if (phoneName in order) {
                const phoneData = data[phoneName]
                const phoneCard = getProductCard(phoneName, phoneData)
                catalog.append(phoneCard)
            }
        } else {   
            const phoneData = data[phoneName]
            const phoneCard = getProductCard(phoneName, phoneData)
            catalog.append(phoneCard)
        }
    }

    if(isCart === true) {
        recalculateOrderSum()
    }
}
function getProductCard(phoneName, phoneData) {
    const phoneCard = document.createElement('div')
    phoneCard.className = "phone-card" 

    //Название товара
    const cardTitle = document.createElement('h4')
    cardTitle.innerText = phoneName
    phoneCard.append(cardTitle)//добавляем в контейнер

    //Изображения
    const cardImagesSlider = getImagesSlider(phoneData.images)
    phoneCard.append(cardImagesSlider)

    //Описания
    const descriptionDiv = getDescriptionDiv(phoneData)
    phoneCard.append(descriptionDiv)

    return phoneCard
}

function getImagesSlider(imagesList) {
    //Создаем контейнер слайдов
    const imagesSlider = document.createElement('div')
    imagesSlider.className = 'slider-wrapper'

    //Добавляем изображения в контейнер
    for(let i = 0; i < imagesList.length; i++) {
        const image = new Image()
        image.src = './data/images/' + imagesList[i]
        if (i === 0) {
            image.className = 'slide-image visible'
        } else {
            image.className='slide-image'
        }        
        imagesSlider.append(image)
    }

    //Создаем кнопки переключения изображений 
    if (imagesList.length > 1) {
        const arrowForward = new Image()
        arrowForward.src='./data/images/kindpng_796579.svg'
        arrowForward.className = "arrow forward"
        arrowForward.onclick = () => showForwardImage(imagesSlider)
        imagesSlider.append(arrowForward)

        const arrowBack = new Image()
        arrowBack.src="./data/images/mobile_button-12-512.svg"
        arrowBack.className = "arrow back"
        arrowBack.onclick = () => showBackImage(imagesSlider)
        imagesSlider.append(arrowBack)
    }

    return imagesSlider
}
function showBackImage(slider) {
    console.log(1)
    const images = slider.querySelectorAll('.slide-image')
    let index = 0
    while (index < images.length) {
        if(images[index].classList.contains('visible')) {
            images[index].classList.remove('visible')
            if (index > 0) {
                images[index - 1].classList.add('visible')
            } else {
                images[images.length -1].classList.add('visible')
            }
            index = images.length
        }

        index++
    }
}

function showForwardImage(slider) {
    const images = slider.querySelectorAll('.slide-image')
    let index = 0
    while (index < images.length) {
        if(images[index].classList.contains('visible')) {
            images[index].classList.remove('visible')
            if (index === images.length -1) {
                images[0].classList.add('visible')
            } else {
                images[index + 1].classList.add('visible')
            }
            index = images.length
        }

        index++
    }
}
function getDescriptionDiv(phoneData) {
    const desc = document.createElement('div');
    desc.className = 'description';

    const os = document.createElement('p');
    os.innerText = 'OS: ' + phoneData.OS;
    desc.appendChild(os);

    const ram = document.createElement('p');
    ram.innerText = 'RAM: ' + phoneData.RAM + ' GB';
    desc.appendChild(ram);

    const rom = document.createElement('p');
    rom.innerText = 'ROM: ' + phoneData.ROM + ' GB';
    desc.appendChild(rom);

    const camera = document.createElement('p');
    camera.innerText = 'Camera: ' + phoneData.camera + ' MP';
    desc.appendChild(camera);

    const battery = document.createElement('p');
    battery.innerText = 'Battery: ' + phoneData.battery + ' mAh';
    desc.appendChild(battery);

    const sim = document.createElement('p');
    sim.innerText = 'SIM slots: ' + phoneData.simSlots;
    desc.appendChild(sim);

    return desc;
}
function updateLocalStorage() {
    const storageData = JSON.stringify(order)
    localStorage.setItem('order',storageData)
}
function updateCartCounter(value) {
    const count = +cartProductCounter.innerText
    cartProductCounter.innerText = count + value
}
function orderAdd(productKey) {
    if (productKey in order) {
        order[productKey]++
    } else {
        order[productKey] = 1
    }
    updateLocalStorage()
    updateCartCounter(1)
    return order[productKey]
}
function orderRemove(productKey) {
    if(productKey in order === false) {
        return 0
    }

    order[productKey]--
    updateCartCounter(-1)
    const count = order[productKey]
    if (count === o) {
        delete order[productKey]
    }

    updateLocalStorage()
    return count
}
function recalculateOrderSum() {
    let sum = 0
    const   phones = catalog.querySelectorAll(".phone-card")
    phones.forEach(phone => {
        const countSpan= phone.querySelector(".order-counter")
        const count = +countSpan.innerText

        const priceDiv = phone.querySelector(".price")
        const priceSpan = priceDiv.querySelector("span")
        const price = +priceSpan.innerText

        if(price > 0 && count > 0) {
            sum += price * count
        }
    })

    const orderTotalSum = document.getElementById("order-total-sum")
    orderTotalSum.innerText = sum + ' $'
        
}

function updateCartCounter(value) {
    if  (isCart === true) {
        return
    }

    const count = +cartProductCounter.innerText
    cartProductCounter.innerText = count + value
}
function updateProductOrderDiv(firstButton, removeButton, counterSpan, counter, addButton){
    counterSpan.innerText = counter

    if (counter > 0) {
        firstButton.style.display = 'none'
        removeButton.style.display = 'inline'
        counterSpan.style.display = 'inline'
        addButton.style.display = 'inline'
    } else {
        firstButton.style.display = 'inline'
        removeButton.style.display = 'none'
        counterSpan.style.display = 'none'
        addButton.style.display = 'none'  
    }

    if (isCart === true) {
        recalculateOrderSum()
    }
}

if (isCart === false) {
    const searchInput = document.getElementById("search")
    let searchButton = document.getElementById("search-button")
    searchButton.onclick = () => checkSearchInput(searchInput.value.trim())  
}   
function checkSearchInput(searchValue) {
    const phones = catalog.querySelectorAll(".phone-card");

    if (searchValue === '') {
        phones.forEach(phone => phone.style.display = 'block');
        return;
    }   

    const searchText = searchValue.toLowerCase();
    phones.forEach(phone => {
        const phoneText = phone.textContent.toLowerCase();
        phone.style.display = phoneText.includes(searchText) ? 'block' : 'none';
    });
}
const themeToggle = document.getElementById('theme-toggle');

if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
    themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
});
