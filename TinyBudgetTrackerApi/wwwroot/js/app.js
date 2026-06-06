const TOTAL = 1274;
const BUDGET_PER_DAG = 182;
let kvar = TOTAL;
let rullad = 0;

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

function laggTillBelopp(belopp) {
    kvar = Math.min(kvar - belopp, rullad + TOTAL);
    renderMatare(kvar, rullad);
    sparaTillServer(kvar, rullad);
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