const TOTAL = 1274;
const BUDGET_PER_DAG = 182;
let kvar = TOTAL;
let rullad = 0;

function renderMatare(kvarvarande, rullad = 0) {
    const totalSpenderat = (rullad + TOTAL) - kvarvarande;

    // KVAR I FICKAN
    const extraEl = document.getElementById('dag-rullad');
    if (rullad > 0) {
        if (!extraEl) {
            const div = document.createElement('div');
            div.classList.add('dag');
            div.id = 'dag-rullad';
            div.innerHTML = `
                <div class="dag-rubrik">
                    <span class="dag-namn">KVAR I FICKAN</span>
                    <span class="belopp"></span>
                </div>
                <div class="bar"><div class="fyll"></div></div>
            `;
            document.getElementById('matare').prepend(div);
        }

        const spendRullad = Math.max(Math.min(totalSpenderat, rullad), 0);
        const procentRullad = (spendRullad / rullad) * 100;
        const kvarRullad = rullad - spendRullad;

        const rullFyll = document.getElementById('dag-rullad').querySelector('.fyll');
        const rullBelopp = document.getElementById('dag-rullad').querySelector('.belopp');
        rullFyll.style.width = procentRullad + '%';
        rullBelopp.textContent = kvarRullad > 0 ? kvarRullad.toFixed(2) + ' SEK' : '';
    } else if (extraEl) {
        extraEl.remove();
    }

    // Veckodagar
    const spenderat = Math.max(totalSpenderat - rullad, 0);
    const rulladFull = rullad === 0 || totalSpenderat >= rullad;
    const dagar = document.querySelectorAll('.dag:not(#dag-rullad)');

    let forstaTomd = false;

    dagar.forEach((dag, index) => {
        const dagSpenderat = Math.min(Math.max(spenderat - index * BUDGET_PER_DAG, 0), BUDGET_PER_DAG);
        const procent = (dagSpenderat / BUDGET_PER_DAG) * 100;
        const kvarIDag = BUDGET_PER_DAG - dagSpenderat;

        const fyll = dag.querySelector('.fyll');
        const belopp = dag.querySelector('.belopp');

        fyll.style.width = procent + '%';

        if (dagSpenderat === BUDGET_PER_DAG) {
            belopp.textContent = '';
        } else if (dagSpenderat === 0) {
            if (!forstaTomd && rulladFull && (index === 0 || spenderat >= index * BUDGET_PER_DAG)) {
                belopp.textContent = BUDGET_PER_DAG.toFixed(2) + ' SEK';
                forstaTomd = true;
            } else {
                belopp.textContent = '';
            }
        } else {
            belopp.textContent = kvarIDag.toFixed(2) + ' SEK';
        }
    });

    const kvarEl = document.getElementById('kvar-budget');
    kvarEl.textContent = kvarvarande.toFixed(2) + ' SEK';
    if (kvarvarande < 0) {
        kvarEl.classList.add('over-budget');
    } else {
        kvarEl.classList.remove('over-budget');
    }
}

function laggTillBelopp(belopp) {
    kvar = Math.min(kvar - belopp, rullad + TOTAL);
    renderMatare(kvar, rullad);
    sparaTillServer(kvar, rullad);
}

async function init() {
    const response = await fetch('/api/data');
    const data = await response.json();
    console.log(data)

    const sparadVecka = data.vecka;
    const nuvarandeVecka = getVeckonummer();

    if (sparadVecka !== nuvarandeVecka) {
        rullad = data.kvar - TOTAL;
        if (rullad < 0) rullad = 0;
        await sparaHistorik(data.kvar, sparadVecka);
        kvar = TOTAL + (rullad > 0 ? rullad : 0);
        await sparaTillServer(kvar, rullad > 0 ? rullad : 0);
    } else {
        kvar = data.kvar;
        rullad = data.rullad;
    }

    console.log('renderar med kvar:', kvar, 'rullad:', rullad);
    renderMatare(kvar, rullad);
    document.getElementById('belopp-input').focus();
}

function getVeckonummer() {
    const nu = new Date();
    const dag = new Date(Date.UTC(nu.getFullYear(), nu.getMonth(), nu.getDate()));
    dag.setUTCDate(dag.getUTCDate() + 4 - (dag.getUTCDay() || 7));
    const arStart = new Date(Date.UTC(dag.getUTCFullYear(), 0, 1));
    return Math.ceil((((dag - arStart) / 86400000) + 1) / 7);
}

async function sparaTillServer(kvar, rullad = 0) {
    await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vecka: getVeckonummer(), kvar, rullad })
    });
}

async function sparaHistorik(kvar, vecka) {
    await fetch('/api/historik', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vecka, kvar })
    });
}

document.getElementById('lagg-till').addEventListener('click', () => {
    const input = document.getElementById('belopp-input');
    const belopp = parseFloat(input.value);

    if (isNaN(belopp) || belopp === 0) return;

    laggTillBelopp(belopp);
    input.value = '';
});

document.getElementById('belopp-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('lagg-till').click();
    }
});

init();