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

async function loggaTransaktion(belopp) {
    const nu = new Date();
    const lokalTid = new Date(nu.getTime() - nu.getTimezoneOffset() * 60000).toISOString().slice(0, 19);
    await fetch('/api/transaktion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            datum: lokalTid,
            belopp: belopp,
            vecka: getVeckonummer()
        })
    });
}

async function hamtaTransaktioner() {
    const response = await fetch('/api/transaktioner');
    return await response.json();
}