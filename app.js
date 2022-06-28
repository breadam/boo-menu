(async () => {
    await fetchCSV();
})();

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

async function fetchJSON(){
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
}

function buildItem(name,description,ingredients,selection,normal,large,ice){
    return htmlToElement(`
        <div class="item">
            <div class="name">${name}</div>
            <div class="price">
                <span class="type">${normal || ''}</span>
                <span class="type">${large || ''}</span>
                <span class="type">${ice || ''}</span>
            </div>
        </div>
        `);
}

function buildSection(title){
    return htmlToElement(`
        <div class="section"><h2 class="section-title"> ${title} </h2><div class="items"></div></div>
    `);
}

async function fetchCSV(){
    const map = {};
    const res = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vSV0arG7Tb9-IS00GZrHSzpKEYoeok81mZQbAxIZWbLikf-tABCH4rluVsWEa864OhYpxxsJOtdrX0-/pub?gid=0&single=true&output=csv');
    const csv = await res.text();
    const menu = document.getElementById('menu');

    const rows = csv.split('\r\n');
    
    rows.shift();

    rows.forEach((row) => {

        const arr = row.split(',');
        const sectionName = arr.shift();
        
        if(!map[sectionName]){
            const section = buildSection(sectionName);
            map[sectionName] = section.childNodes[1];
            menu.appendChild(section);
        }

        const sectionMenu = map[sectionName];
        const item = buildItem(...arr);
        sectionMenu.appendChild(item);
    });
}

async function processJSON(){
    const res = await fetch('menu.json');
    const json = await res.json();

    const rows = [];
    
    json.forEach((section) => {

        section.menu.forEach((el) => {

            rows.push([
                section.title,
                el.name,
                el.description|| '',
                el.ingredients ? el.ingredients.join('-'): '',
                el.selection ? el.selection.join('-'): '',
                el.price.normal || '',
                el.price.large || '',
                el.price.ice || ''
            ].join(','));
        });
    });

    console.log(rows.join('\r\n'));
}