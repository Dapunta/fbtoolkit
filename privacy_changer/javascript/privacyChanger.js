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

// Back To Menu

function backToMainMenu() {
    const currentUrl = window.location.origin;
    if (currentUrl.includes('https')) {window.location.href = currentUrl + "/fbtoolkit";}
    else {window.location.href = currentUrl;}
}

// Fetch Post

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

const form = document.getElementById('form-section');

const convertPrivacy = (tipe) => {
    const base = {
        'all': 'all',
        'public': 'EVERYONE',
        'friend': 'ALL_FRIENDS',
        'private': 'SELF',
        'EVERYONE': 'Public',
        'ALL_FRIENDS': 'Friend',
        'SELF': 'Private',
    };
    return base[tipe];
};

form.addEventListener('submit', function(event) {
    event.preventDefault();
    const fromSelect = document.getElementById('privacy-from').value;
    const toSelect = document.getElementById('privacy-to').value;
    fetchPost(fromSelect, toSelect);
});

async function fetchPost(from, to) {
    const sectionPost = document.getElementById('post-section');
    const cookie = encodeURIComponent(getCookie('cookie'));
    const token = JSON.parse(localStorage.getItem('data'))['token_eaag'];
    const url = `https://dapuntaxd.pythonanywhere.com/facebook-api/post?cookie=${cookie}&token=${token}`;
    const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
    const list_post = await response.json();
    for (const item of list_post.data) {
        
        let new_privacy;
        if (item.privacy == convertPrivacy(to)) {
            new_privacy = convertPrivacy(item.privacy);
        }
        else {
            const success = await changePrivacy(cookie, item.id, convertPrivacy(to));
            if (success) new_privacy = to.charAt(0).toUpperCase() + to.slice(1);
            else new_privacy = convertPrivacy(item.privacy);
        }

        const itemPost = document.createElement('div');
        itemPost.classList.add('post-item-container');
        itemPost.innerHTML = `
            <span class="caption">${item.caption}</span>
            <div class="status-post-privacy" onclick="redirectURL('${item.id}')"><span>${new_privacy}</span></div>`;
        sectionPost.appendChild(itemPost);
    }
}

async function changePrivacy(cookie, post_id, privacy) {
    const url = `https://dapuntaxd.pythonanywhere.com/facebook-api/privacy?cookie=${cookie}&post=${post_id}&privacy=${privacy}`;
    const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
    const data = await response.json();
    return (data.status == 'success') ? true : false;
}

function redirectURL(id) {
    const url = `https://mbasic.facebook.com/${id}`;
    window.open(url, '_blank');
}