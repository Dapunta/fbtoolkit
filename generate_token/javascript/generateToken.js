listToken = [
    {
        name    : 'Token EAAU',
        domain  : 'graph.facebook.com',
        url     : '',
        onclick : ''},
    {
        name    : 'Token EAAG',
        domain  : 'business.facebook.com',
        url     : '',
        onclick : ''},
    {
        name    : 'Token EAAB',
        domain  : 'adsmanager.facebook.com',
        url     : '',
        onclick : ''},
    {
        name    : 'Token EAAD',
        domain  : 'facebook.com/events_manager2',
        url     : '',
        onclick : ''},
    {
        name    : 'Token EAAC',
        domain  : 'facebook.com/brand_safety',
        url     : '',
        onclick : ''},
    {
        name    : 'Token EAAF',
        domain  : 'facebook.com/test-and-learn',
        url     : '',
        onclick : ''},
    {
        name    : 'Token EABB',
        domain  : 'facebook.com/ads',
        url     : '',
        onclick : ''},
    {
        name    : 'Token EAAT',
        domain  : 'portal.facebook.com',
        url     : '',
        onclick : ''}
]

function showMenuToken() {
    const container = document.getElementById('button-container');
    listToken.forEach((element, index) => {
        setTimeout(() => {
            const newEl = document.createElement('div');
            newEl.classList.add('item-button');
            const position = (index % 2 == 0) ? 'genap' : 'ganjil';
            const image = (index % 2 == 0) ? 'meta.png' : 'facebook.png';
            newEl.innerHTML = `
                <div class="inside-item-button">
                    <div class="sector-text-button ${position}">
                        <h1>${element.name}</h1>
                        <span>${element.domain}</span>
                        <button class="fetch-button ${position}">Fetch</button>
                    </div>
                    <div class="sector-gambar-button ${position}">
                        <img src="../assets/${image}"></img>
                    </div>
                </div>`
            container.appendChild(newEl);
        }, index*200);
    });
}

showMenuToken();