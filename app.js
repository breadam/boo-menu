(async () => {
    const res = await fetch('menu.json');
    const json = await res.json();

    const menu = document.getElementById('menu');

    json.forEach((section) => {
        
        const items = section.menu.map((el) => {
            return `
                <div class="item">
                    <div class="name">${el.name}</div>
                    <div class="price">
                        <span class="type">${el.price.normal || ''}</span>
                        <span class="type">${el.price.large || ''}</span>
                        <span class="type">${el.price.ice || ''}</span>
                    </div>
                </div>
            `;
        }).join('');

        const html = `
            <div class="section">
                <h2 class="section-title"> ${section.title} </h2>
                <div class="items">
                    ${items}
                </div>
            </div>
        `;

        const el = htmlToElement(html);
        menu.appendChild(el);
    });
})();

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

function createMenu(el){
    return `
        <div>${el.name}</div>
    `;
}