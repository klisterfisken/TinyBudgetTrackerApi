document.addEventListener('DOMContentLoaded', () => {
    let historikvecka = getVeckonummer();
    let allaTransaktioner = [];

    async function oppnaHistorik() {
        allaTransaktioner = await hamtaTransaktioner();
        historikvecka = getVeckonummer();
        renderHistorik();
        document.getElementById('historik-overlay').classList.add('aktiv');
    }

    function stangHistorik() {
        document.getElementById('historik-overlay').classList.remove('aktiv');
    }

    function renderHistorik() {
        const veckansTransaktioner = allaTransaktioner.filter(t => t.vecka === historikvecka);
        const nuvarandeVecka = getVeckonummer();

        document.getElementById('historik-vecka').textContent = `VECKA ${historikvecka}`;

        const lista = document.getElementById('historik-lista');
        lista.innerHTML = '';
        veckansTransaktioner.forEach(t => {
            const li = document.createElement('li');
            const datum = document.createElement('span');
            const belopp = document.createElement('span');
            datum.textContent = t.datum.replace('T', ' ');
            belopp.textContent = `${t.belopp < 0 ? '+' : '-'} ${Math.abs(t.belopp).toFixed(2)} SEK`;
            li.appendChild(datum);
            li.appendChild(belopp);
            lista.appendChild(li);
        });

        document.getElementById('historik-pil-vanster').style.visibility = 'visible';
        document.getElementById('historik-pil-hoger').style.visibility = historikvecka < nuvarandeVecka ? 'visible' : 'hidden';
    }

    document.getElementById('historik-knapp').addEventListener('click', oppnaHistorik);

    document.getElementById('historik-overlay').addEventListener('click', (e) => {
        if (e.target === document.getElementById('historik-overlay')) stangHistorik();
    });

    document.getElementById('historik-pil-vanster').addEventListener('click', () => {
        historikvecka--;
        renderHistorik();
    });

    document.getElementById('historik-pil-hoger').addEventListener('click', () => {
        historikvecka++;
        renderHistorik();
    });
});