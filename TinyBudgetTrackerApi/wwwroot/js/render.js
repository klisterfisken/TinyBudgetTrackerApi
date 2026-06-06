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