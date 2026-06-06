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
    await fetch('/api/transaktion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            datum: nu.toISOString(),
            belopp: belopp,
            vecka: getVeckonummer()
        })
    });
}

async function hamtaTransaktioner() {
    const response = await fetch('/api/transaktioner');
    return await response.json();
}