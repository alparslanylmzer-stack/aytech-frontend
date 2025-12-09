const API_BASE = "https://aytech-backend.onrender.com"; 
// ← backend Render linkin burada olacak

// MARKA / MODEL / YIL LİSTESİ
const brands = {
  "Audi":["A1","A3","A4","A5","A6","A7","A8","Q2","Q3","Q5","Q7","Q8","TT","R8"],
  "BMW":["1 Series","2 Series","3 Series","4 Series","5 Series","6 Series","7 Series","X1","X2","X3","X4","X5","X6","X7","i3","i4"],
  "Mercedes-Benz":["A-Class","B-Class","C-Class","E-Class","S-Class","CLA","CLS","GLA","GLB","GLC","GLE","GLS","G-Class","Vito","Sprinter"],
  "Volkswagen":["Polo","Golf","Passat","Jetta","Tiguan","Touareg","Transporter","Caddy","Crafter","Amarok"],
  "Renault":["Clio","Megane","Talisman","Fluence","Symbol","Kangoo","Trafic","Master","Captur","Kadjar","Scenic"],
  "Fiat":["Egea","Linea","Punto","Bravo","Tipo","Doblo","Fiorino","Scudo","Panda","500"],
  "Ford":["Fiesta","Focus","Mondeo","Kuga","Puma","Ecosport","Courier","Connect","Transit","Ranger"],
  "Opel":["Corsa","Astra","Insignia","Mokka","Grandland","Crossland","Zafira","Vectra"],
  "Peugeot":["206","207","208","301","307","308","508","2008","3008","5008","Partner","Rifter"],
  "Citroen":["C3","C4","C5","C-Elysee","Berlingo","Jumpy","Jumper"],
  "Hyundai":["i10","i20","i30","Elantra","Accent","Tucson","Santa Fe","Kona","Bayon"],
  "Kia":["Rio","Ceed","Cerato","Picanto","Sportage","Sorento","Niro"],
  "Toyota":["Yaris","Corolla","Avensis","CHR","RAV4","Hilux","Auris"],
  "Honda":["Civic","Accord","Jazz","City","CRV","HRV"],
  "Volvo":["S40","S60","S80","S90","V40","V60","V90","XC40","XC60","XC90"],
  "Skoda":["Fabia","Scala","Octavia","Superb","Karoq","Kodiaq","Kamiq"],
  "Seat":["Ibiza","Leon","Toledo","Arona","Ateca","Tarraco"],
  "Nissan":["Micra","Juke","Qashqai","X-Trail","Navara","Note","Leaf"],
  "Mazda":["Mazda2","Mazda3","Mazda6","CX-3","CX-5","CX-30"],
  "Mitsubishi":["Colt","Lancer","ASX","Eclipse Cross","Outlander","Pajero"],
  "Suzuki":["Swift","Vitara","Baleno","SX4"],
  "Jeep":["Renegade","Compass","Cherokee","Grand Cherokee","Wrangler"],
  "Dacia":["Sandero","Logan","Duster","Dokker","Lodgy"],
  "Mini":["Cooper","Clubman","Countryman"],
  "Alfa Romeo":["Giulietta","Giulia","Stelvio"],
  "Porsche":["911","Cayenne","Macan","Panamera","Taycan"],
  "Tesla":["Model 3","Model S","Model X","Model Y"],
  "Other":["Other Model"]
};

// UI kurulumu
const brandEl = document.getElementById("brand");
const modelEl = document.getElementById("model");
const yearEl = document.getElementById("year");
const codeEl = document.getElementById("code");
const result = document.getElementById("result");

// MARKA LİSTELE
function init() {
    brandEl.innerHTML = '<option value="">Seç</option>';
    Object.keys(brands).forEach(b => {
        brandEl.innerHTML += `<option>${b}</option>`;
    });
}
init();

// MODEL
brandEl.onchange = () => {
    modelEl.innerHTML = "";
    const list = brands[brandEl.value] || [];
    list.forEach(m => modelEl.innerHTML += `<option>${m}</option>`);
};

// YIL
modelEl.onchange = () => {
    yearEl.innerHTML = "";
    for (let y = 2025; y >= 2000; y--) {
        yearEl.innerHTML += `<option>${y}</option>`;
    }
};

// ===== BACKEND İSTEKLERİ =====
async function ask(type) {
    const body = {
        brand: brandEl.value,
        model: modelEl.value,
        year: yearEl.value,
        code: codeEl.value,
        type
    };

    const r = await fetch(API_BASE + "/ask", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(body)
    });

    const data = await r.json();
    result.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
}

function getExplain(){ ask("desc"); }
function getFix(){ ask("fix"); }
function getVideo(){ ask("video"); }
