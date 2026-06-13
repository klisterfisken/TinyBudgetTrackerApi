document.addEventListener('DOMContentLoaded', () => {
    let historikvecka = getVeckonummer();
    let allaTransaktioner = [];
    let tidigasteVecka = 0;
    let touchStartX = 0;

    async function oppnaHistorik() {
        allaTransaktioner = await hamtaTransaktioner();
        historikvecka = getVeckonummer();
        tidigasteVecka = allaTransaktioner.length > 0
            ? Math.min(...allaTransaktioner.map(t => t.vecka))
            : getVeckonummer();
        renderHistorik();
        document.getElementById('historik-overlay').classList.add('aktiv');
    }

    function stangHistorik() {
        document.getElementById('historik-overlay').classList.remove('aktiv');
    }

    function animeraModal(riktning) {
        const modal = document.getElementById('historik-modal');
        const klass = riktning === 'hoger' ? 'slide-left' : 'slide-right';
        modal.classList.remove('slide-right', 'slide-left');
        void modal.offsetWidth;
        modal.classList.add(klass);
    }

    function renderHistorik() {
        const veckansTransaktioner = allaTransaktioner.filter(t => t.vecka === historikvecka);
        const nuvarandeVecka = getVeckonummer();

        const modal = document.getElementById('historik-modal');
        if (historikvecka < nuvarandeVecka) {
            modal.classList.add('historisk');
        } else {
            modal.classList.remove('historisk');
        }

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

        document.getElementById('historik-bankat').textContent = '0,00 SEK';
        document.getElementById('historik-totalt-bankat').textContent = '0,00 SEK';

        document.getElementById('historik-pil-vanster').style.visibility = historikvecka > tidigasteVecka ? 'visible' : 'hidden';
        document.getElementById('historik-pil-hoger').style.visibility = historikvecka < nuvarandeVecka ? 'visible' : 'hidden';
    }

    document.getElementById('historik-knapp').addEventListener('click', oppnaHistorik);

    document.getElementById('historik-overlay').addEventListener('click', (e) => {
        if (e.target === document.getElementById('historik-overlay')) stangHistorik();
    });

    document.getElementById('historik-pil-vanster').addEventListener('click', () => {
        if (historikvecka > tidigasteVecka) {
            historikvecka--;
            animeraModal('hoger');
            renderHistorik();
        }
    });

    document.getElementById('historik-pil-hoger').addEventListener('click', () => {
        if (historikvecka < getVeckonummer()) {
            historikvecka++;
            animeraModal('vanster');
            renderHistorik();
        }
    });

    document.getElementById('historik-modal').addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });

    document.getElementById('historik-modal').addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) < 50) return;

        if (diff > 0 && historikvecka < getVeckonummer()) {
            historikvecka++;
            animeraModal('vanster');
            renderHistorik();
        } else if (diff < 0 && historikvecka > tidigasteVecka) {
            historikvecka--;
            animeraModal('hoger');
            renderHistorik();
        }
    });
});