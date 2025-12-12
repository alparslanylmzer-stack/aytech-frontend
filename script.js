const API_BASE = "https://aytech-backend.onrender.com";

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

// UI
const brandEl = document.getElementById("brand");
const modelEl = document.getElementById("model");
const yearEl = document.getElementById("year");
const codeEl = document.getElementById("code");

// ÇIKTI KUTULARI
const explainBox = document.getElementById("explain");
const reasonsBox = document.getElementById("reasons");
const fixBox = document.getElementById("fix");
const mediaBox = document.getElementById("media");

// BAŞLANGIÇ MARKA LİSTESİ
function init() {
    brandEl.innerHTML = "<option value=''>Marka seç</option>";
    Object.keys(brands).forEach(b=> {
        brandEl.innerHTML += `<option>${b}</option>`;
    });
}
init();

// MODEL CHANGE
brandEl.onchange = () => {
    modelEl.innerHTML = "<option value=''>Model seç</option>";
    yearEl.innerHTML = "<option value=''>Yıl seç</option>";

    const list = brands[brandEl.value] || [];
    list.forEach(m => modelEl.innerHTML += `<option>${m}</option>`);

    clearOutputs();
};

// YEAR CHANGE
modelEl.onchange = () => {
    yearEl.innerHTML = "<option value=''>Yıl seç</option>";
    for (let y = 2025; y >= 2000; y--) {
        yearEl.innerHTML += `<option>${y}</option>`;
    }
    clearOutputs();
};

// CLEAR OUTPUTS
function clearOutputs(){
    explainBox.textContent = "—";
    reasonsBox.textContent = "—";
    fixBox.textContent = "—";
    mediaBox.textContent = "—";
}

codeEl.oninput = clearOutputs;

// BACKEND İSTEK
async function ask(type) {
    const body = {
        brand: brandEl.value,
        model: modelEl.value,
        year: yearEl.value,
        code: codeEl.value,
        type
    };

    try {
        const r = await fetch(API_BASE + "/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if (!r.ok) {
            result.innerHTML = `<b>Sunucu hatası:</b> ${r.status} - ${r.statusText}`;
            return;
        }

        const data = await r.json();

        if (type === "desc") {
            explainBox.textContent = data.aciklama || "—";
            reasonsBox.textContent = (data.nedenler || []).join("\n") || "—";
        }

        if (type === "fix") {
            fixBox.textContent = (data.cozum || []).join("\n") || "—";
        }

        if (type === "video") {
            if (!data.videolar || data.videolar.length === 0) {
                mediaBox.textContent = "Bu arıza kodu için video bulunamadı.";
            } else {
                mediaBox.innerHTML = data.videolar.map(v => {
                    const url = v.url ? `<a href="${v.url}" target="_blank">${v.title}</a>` : v.title;
                    return `• ${url}<br><span style="color:#9fbdbb;font-size:13px">Kaynak: ${v.source}</span>`;
                }).join("<br><br>");
            }
        }
    }
    catch (err) {
        result.innerHTML = `<b>Bağlantı hatası:</b> ${err}`;
    }
}

}

// BUTONLAR
function getExplain(){ ask("desc"); }
function getFix(){ ask("fix"); }
function getVideo(){ ask("video"); }

