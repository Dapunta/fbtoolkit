// Check Cookie

const cookie = document.cookie;
if (!cookie.includes('c_user')) {
    const currentUrl = window.location.origin;
    if (currentUrl.includes('https')) {window.location.href = currentUrl + "/fbtoolkit/login";}
    else {window.location.href = currentUrl + "/login";}
}

// Check Data

const data = localStorage.getItem("data");
if (!data) {
    const currentUrl = window.location.origin;
    if (currentUrl.includes('https')) {window.location.href = currentUrl + "/fbtoolkit/login";}
    else {window.location.href = currentUrl + "/login";}
}

listToken = [
    {
        name    : 'Token EAAG',
        domain  : 'business.facebook.com',
        url     : '',
        onclick : 'eaag'},
    {
        name    : 'Token EAAB',
        domain  : 'adsmanager.facebook.com',
        url     : '',
        onclick : 'eaab'},
    {
        name    : 'Token EAAD',
        domain  : 'facebook.com/events_manager2',
        url     : '',
        onclick : 'eaad'},
    {
        name    : 'Token EAAC',
        domain  : 'facebook.com/brand_safety',
        url     : '',
        onclick : 'eaac'},
    {
        name    : 'Token EAAF',
        domain  : 'facebook.com/test-and-learn',
        url     : '',
        onclick : 'eaaf'},
    {
        name    : 'Token EABB',
        domain  : 'facebook.com/ads',
        url     : '',
        onclick : 'eabb'}
]

function backToMainMenu() {
    const currentUrl = window.location.origin;
    if (currentUrl.includes('https')) {window.location.href = currentUrl + "/fbtoolkit";}
    else {window.location.href = currentUrl;}
}

function showMenuToken() {
    const container = document.getElementById('button-container');
    listToken.forEach((element, index) => {
        setTimeout(() => {
            const newEl = document.createElement('div');
            newEl.classList.add('item-button');
            newEl.id = `container-token-${element.onclick}`;
            const position = (index % 2 == 0) ? 'genap' : 'ganjil';
            const image = (index % 2 == 0) ? 'meta.png' : 'facebook.png';
            newEl.innerHTML = `
                <div class="inside-item-button">
                    <div id="sector-text-${element.onclick}" class="sector-text-button ${position}">
                        <h1>${element.name}</h1>
                        <span>${element.domain}</span>
                        <button id="token-${element.onclick}" class="fetch-button color ${position}" onclick="fetchToken('${element.onclick}')">Fetch</button>
                    </div>
                    <div id="logo-${element.onclick}" class="sector-gambar-button ${position}">
                        <img src="../assets/${image}"></img>
                    </div>
                </div>`
            container.appendChild(newEl);
        }, index*200);
    });
}

showMenuToken();

// Fetch Token

function getCookie(name) {
    let cookieArray = document.cookie.split(';');
    let cookieName = name + "=";
    for(let cookie of cookieArray) {
        cookie = cookie.trim();
        if (cookie.indexOf(cookieName) == 0) {
            return decodeURIComponent(cookie.substring(cookieName.length, cookie.length));
        }
    }
    return null;
}

async function fetchToken(type) {
    let data, result;
    const cookie = getCookie('cookie');
    const url = `https://dapuntaxd.pythonanywhere.com/facebook-api/token?type=${type}&cookie=${cookie}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
        data = await response.json();
        if (data.status === 'success') {result = true}
        else {result = false}}
    catch (err) {result = false}
    if (result) {
        const response_token = data.token;
        const gambar = document.getElementById(`logo-${type}`);
        const geser  = (gambar.classList[1] == 'genap') ? 'slide-kiri' : 'slide-kanan';
        const newPos = (gambar.classList[1] == 'genap') ? 'ganjil' : 'genap';
        gambar.classList.add(geser);
        const updateButton = document.getElementById(`sector-text-${type}`);
        updateButton.innerHTML = ``;
        updateButton.classList = ('sector-token-output');
        updateButton.classList.add(newPos);
        updateButton.innerHTML = `
            <span id="text-token-${type}" class="output-token">${response_token}</span>
            <button id="button-token-${type}" class="copy-button ${newPos}" onclick="copyToken('${type}')">
                <span>Copy</span>
                <i class="fa-solid fa-copy"></i>
            </button>`;
    }
    else {
        const updateButton = document.getElementById(`token-${type}`);
        updateButton.innerText = 'Failed';
        updateButton.classList.remove('color');
        updateButton.classList.add('failed');
    }
}

// Copy Token

function copyToken(type) {
    const elementToken = 'text-token-' + type;
    const elementButton = 'button-token-' + type;
    var text = document.getElementById(elementToken);
    if (text) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text.textContent;
        textarea.style.position = "fixed";
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand("copy");
            const newButton = document.getElementById(elementButton);
            newButton.innerHTML = `Copied`
        }
        catch (err) {
            newButton.innerHTML = `Failed`
        }
        document.body.removeChild(textarea);
    }
}