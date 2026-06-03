// ===== NAVIGATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Navigation entre calculateurs
    const navBtns = document.querySelectorAll('.nav-btn');
    const calcPanels = document.querySelectorAll('.calc-panel');
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');

    navBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const target = this.getAttribute('data-calc');

            // Mise à jour boutons
            navBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Mise à jour panneaux
            calcPanels.forEach(p => p.classList.remove('active'));
            const panel = document.getElementById('calc-' + target);
            if (panel) panel.classList.add('active');

            // Fermer sidebar sur mobile
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }
        });
    });

    // Menu toggle mobile
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('open');
    });

    // Fermer sidebar si clic en dehors
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && e.target !== menuToggle) {
                sidebar.classList.remove('open');
            }
        }
    });

    // Recherche
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        navBtns.forEach(btn => {
            const text = btn.textContent.toLowerCase();
            if (text.includes(query)) {
                btn.style.display = 'block';
            } else {
                btn.style.display = 'none';
            }
        });
    });
});

// ===== FONCTIONS DE CALCUL =====

function showResult(elementId, message, type = 'info') {
    const box = document.getElementById(elementId);
    box.textContent = message;
    box.className = 'result-box show ' + type;
}

// ---------- IMC ----------
function calculerIMC() {
    const poids = parseFloat(document.getElementById('imc-poids').value);
    const tailleCm = parseFloat(document.getElementById('imc-taille').value);

    if (!poids || !tailleCm || poids <= 0 || tailleCm <= 0) {
        showResult('imc-result', '⚠️ Veuillez entrer des valeurs valides.', 'warning');
        document.getElementById('imc-poids-ideal').className = 'result-box';
        return;
    }

    const tailleM = tailleCm / 100;
    const imc = poids / (tailleM * tailleM);
    const imcArrondi = imc.toFixed(1);

    let classification = '';
    let type = 'info';
    if (imc < 18.5) { classification = 'Maigreur (dénutrition)'; type = 'warning'; }
    else if (imc < 25) { classification = 'Poids normal'; type = 'normal'; }
    else if (imc < 30) { classification = 'Surpoids'; type = 'warning'; }
    else if (imc < 35) { classification = 'Obésité de classe I (modérée)'; type = 'danger'; }
    else if (imc < 40) { classification = 'Obésité de classe II (sévère)'; type = 'danger'; }
    else { classification = 'Obésité de classe III (morbide)'; type = 'danger'; }

    showResult('imc-result', `IMC = ${imcArrondi} kg/m² — ${classification}`, type);

    // Poids idéal (Formule de Lorentz)
    const tailleCmVal = tailleCm;
    const poidsIdealH = Math.round(tailleCmVal - 100 - (tailleCmVal - 150) / 4);
    const poidsIdealF = Math.round(tailleCmVal - 100 - (tailleCmVal - 150) / 2.5);

    document.getElementById('imc-poids-ideal').className = 'result-box secondary show info';
    document.getElementById('imc-poids-ideal').textContent =
        `📐 Poids idéal estimé (Lorentz) : Homme ≈ ${poidsIdealH} kg | Femme ≈ ${poidsIdealF} kg`;
}

// ---------- BSA (Surface Corporelle) ----------
function calculerBSA() {
    const poids = parseFloat(document.getElementById('bsa-poids').value);
    const taille = parseFloat(document.getElementById('bsa-taille').value);

    if (!poids || !taille || poids <= 0 || taille <= 0) {
        showResult('bsa-result', '⚠️ Veuillez entrer des valeurs valides.', 'warning');
        return;
    }

    const bsa = Math.sqrt((taille * poids) / 3600);
    showResult('bsa-result', `Surface Corporelle (Mosteller) = ${bsa.toFixed(3)} m²`, 'info');
}

// ---------- PAM ----------
function calculerPAM() {
    const pas = parseFloat(document.getElementById('pam-pas').value);
    const pad = parseFloat(document.getElementById('pam-pad').value);

    if (!pas || !pad || pas <= 0 || pad <= 0) {
        showResult('pam-result', '⚠️ Veuillez entrer des valeurs valides.', 'warning');
        return;
    }

    const pam = Math.round((pas + 2 * pad) / 3);
    let interpretation = '';
    let type = 'info';

    if (pam < 65) { interpretation = ' — PAM basse : risque d\'hypoperfusion'; type = 'danger'; }
    else if (pam > 100) { interpretation = ' — PAM élevée'; type = 'warning'; }
    else { interpretation = ' — PAM dans les limites normales'; type = 'normal'; }

    showResult('pam-result', `PAM = ${pam} mmHg${interpretation}`, type);
}

// ---------- ICT ----------
function calculerICT() {
    const card = parseFloat(document.getElementById('ict-card').value);
    const thor = parseFloat(document.getElementById('ict-thor').value);

    if (!card || !thor || card <= 0 || thor <= 0) {
        showResult('ict-result', '⚠️ Veuillez entrer des valeurs valides.', 'warning');
        return;
    }

    const ict = (card / thor).toFixed(2);
    let interpretation = '';
    let type = 'info';

    if (ict > 0.5) { interpretation = ' — Cardiomégalie (ICT > 0.5)'; type = 'danger'; }
    else { interpretation = ' — ICT normal (≤ 0.5)'; type = 'normal'; }

    showResult('ict-result', `ICT = ${ict}${interpretation}`, type);
}

// ---------- Glasgow ----------
function calculerGlasgow() {
    const yeux = parseInt(document.getElementById('gcs-yeux').value);
    const verbale = parseInt(document.getElementById('gcs-verbale').value);
    const motrice = parseInt(document.getElementById('gcs-motrice').value);

    if (isNaN(yeux) || isNaN(verbale) || isNaN(motrice)) {
        showResult('glasgow-result', '⚠️ Veuillez sélectionner les 3 composantes.', 'warning');
        return;
    }

    const total = yeux + verbale + motrice;
    let interpretation = '';
    let type = 'info';

    if (total >= 13) { interpretation = ' — Léger (13-15)'; type = 'normal'; }
    else if (total >= 9) { interpretation = ' — Modéré (9-12)'; type = 'warning'; }
    else { interpretation = ' — Sévère (3-8) : INDICATION À L\'INTUBATION'; type = 'danger'; }

    showResult('glasgow-result', `GCS = ${total}/15 (Y${yeux} V${verbale} M${motrice})${interpretation}`, type);
}

// ---------- NIHSS ----------
function calculerNIHSS() {
    const conscience = parseInt(document.getElementById('nihss-conscience').value) || 0;
    const face = parseInt(document.getElementById('nihss-face').value) || 0;
    const bras = parseInt(document.getElementById('nihss-bras').value) || 0;
    const langage = parseInt(document.getElementById('nihss-langage').value) || 0;

    const total = conscience + face + bras + langage;
    let interpretation = '';
    let type = 'info';

    if (total === 0) { interpretation = ' — Absence de symptômes'; type = 'normal'; }
    else if (total <= 4) { interpretation = ' — AVC mineur'; type = 'warning'; }
    else if (total <= 15) { interpretation = ' — AVC modéré'; type = 'warning'; }
    else { interpretation = ' — AVC sévère'; type = 'danger'; }

    showResult('nihss-result', `NIHSS simplifié ≈ ${total}${interpretation}`, type);
}

// ---------- Doses Pédiatriques ----------
function autoRemplirDose() {
    const select = document.getElementById('dose-medicament');
    const doseMgKg = document.getElementById('dose-mgkg');

    const doses = {
        'paracetamol': 15,
        'ibuprofene': 10,
        'amoxicilline': 25,
        'ceftriaxone': 50,
        'salbutamol': 0.1,
        'adrenaline': 0.01
    };

    if (select.value && doses[select.value]) {
        doseMgKg.value = doses[select.value];
    }
}

function calculerDosePed() {
    const poids = parseFloat(document.getElementById('dose-poids').value);
    const mgKg = parseFloat(document.getElementById('dose-mgkg').value);
    const concentration = parseFloat(document.getElementById('dose-concentration').value);

    if (!poids || !mgKg || !concentration || poids <= 0 || mgKg <= 0 || concentration <= 0) {
        showResult('dose-result', '⚠️ Veuillez remplir tous les champs avec des valeurs > 0.', 'warning');
        return;
    }

    const doseTotale = poids * mgKg;
    const volume = doseTotale / concentration;

    showResult('dose-result',
        `💉 Dose totale : ${doseTotale.toFixed(1)} mg — Volume à administrer : ${volume.toFixed(2)} mL`,
        'info');
}

// ---------- Perfusion ----------
function calculerPerfusion() {
    const volume = parseFloat(document.getElementById('perf-volume').value);
    const heures = parseFloat(document.getElementById('perf-heures').value);
    const gouttes = parseInt(document.getElementById('perf-gouttes').value);

    if (!volume || !heures || volume <= 0 || heures <= 0) {
        showResult('perf-result', '⚠️ Veuillez entrer des valeurs valides.', 'warning');
        return;
    }

    const mlH = volume / heures;
    const gouttesMin = Math.round((volume * gouttes) / (heures * 60));

    showResult('perf-result',
        `💧 Débit : ${mlH.toFixed(1)} mL/h — ${gouttesMin} gouttes/min (facteur ${gouttes} gouttes/mL)`,
        'info');
}

// ---------- CURB-65 ----------
function calculerCURB65() {
    let score = 0;
    if (document.getElementById('curb-confusion').checked) score++;
    if (document.getElementById('curb-uree').checked) score++;
    if (document.getElementById('curb-respi').checked) score++;
    if (document.getElementById('curb-tas').checked) score++;
    if (document.getElementById('curb-age').checked) score++;

    let interpretation = '';
    let type = 'info';

    if (score <= 1) { interpretation = 'Mortalité faible (≈ 1.5%) — Traitement ambulatoire possible'; type = 'normal'; }
    else if (score === 2) { interpretation = 'Mortalité intermédiaire (≈ 9%) — Hospitalisation courte recommandée'; type = 'warning'; }
    else { interpretation = 'Mortalité élevée (≈ 15-40%) — Hospitalisation urgente, évaluer soins intensifs'; type = 'danger'; }

    showResult('curb65-result', `Score CURB-65 = ${score}/5 — ${interpretation}`, type);
}

// ---------- Wells TVP ----------
function calculerWells() {
    let score = 0;
    const checkboxes = document.querySelectorAll('#calc-wells .checkbox-group input[type="checkbox"]');

    checkboxes.forEach(cb => {
        if (cb.checked) {
            score += parseInt(cb.value);
        }
    });

    let interpretation = '';
    let type = 'info';

    if (score <= 0) { interpretation = 'Probabilité faible de TVP'; type = 'normal'; }
    else if (score <= 2) { interpretation = 'Probabilité intermédiaire — Poursuivre investigations (D-dimères)'; type = 'warning'; }
    else { interpretation = 'Probabilité élevée — Échographie doppler en urgence'; type = 'danger'; }

    showResult('wells-result', `Score de Wells = ${score} — ${interpretation}`, type);
}

// ---------- qSOFA ----------
function calculerQSOFA() {
    let score = 0;
    if (document.getElementById('qsofa-respi').checked) score++;
    if (document.getElementById('qsofa-tas').checked) score++;
    if (document.getElementById('qsofa-conscience').checked) score++;

    let interpretation = '';
    let type = 'info';

    if (score >= 2) {
        interpretation = 'qSOFA positif (≥ 2) — RISQUE ÉLEVÉ DE SEPSIS : Évaluer dysfonction d\'organes, hémocultures, antibiothérapie';
        type = 'danger';
    } else {
        interpretation = 'qSOFA négatif — Surveillance clinique';
        type = 'normal';
    }

    showResult('qsofa-result', `Score qSOFA = ${score}/3 — ${interpretation}`, type);
}

// ---------- Clairance Créatinine ----------
function calculerClairance() {
    const age = parseInt(document.getElementById('clair-age').value);
    const poids = parseFloat(document.getElementById('clair-poids').value);
    const creat = parseFloat(document.getElementById('clair-creat').value);
    const sexe = document.getElementById('clair-sexe').value;

    if (!age || !poids || !creat || age <= 0 || poids <= 0 || creat <= 0) {
        showResult('clair-result', '⚠️ Veuillez entrer des valeurs valides.', 'warning');
        return;
    }

    let clairance = ((140 - age) * poids) / (creat * 0.814);
    if (sexe === 'femme') clairance *= 0.85;

    clairance = Math.round(clairance);

    let stade = '';
    let type = 'info';

    if (clairance >= 90) { stade = 'Stade 1 (normal)'; type = 'normal'; }
    else if (clairance >= 60) { stade = 'Stade 2 (insuffisance rénale légère)'; type = 'warning'; }
    else if (clairance >= 30) { stade = 'Stade 3 (insuffisance rénale modérée)'; type = 'warning'; }
    else if (clairance >= 15) { stade = 'Stade 4 (insuffisance rénale sévère)'; type = 'danger'; }
    else { stade = 'Stade 5 (insuffisance rénale terminale)'; type = 'danger'; }

    showResult('clair-result',
        `Clairance Créatinine (Cockcroft) = ${clairance} mL/min — ${stade}`, type);
}

// ---------- Trou Anionique ----------
function calculerTrouAnionique() {
    const na = parseFloat(document.getElementById('ta-na').value);
    const cl = parseFloat(document.getElementById('ta-cl').value);
    const hco3 = parseFloat(document.getElementById('ta-hco3').value);

    if (isNaN(na) || isNaN(cl) || isNaN(hco3)) {
        showResult('ta-result', '⚠️ Veuillez entrer les 3 valeurs.', 'warning');
        return;
    }

    const ta = na - (cl + hco3);
    let interpretation = '';
    let type = 'info';

    if (ta > 12) { interpretation = ' — Augmenté : acidose métabolique à trou anionique augmenté'; type = 'danger'; }
    else if (ta < 8) { interpretation = ' — Diminué (rare)'; type = 'warning'; }
    else { interpretation = ' — Normal (8-12 mmol/L)'; type = 'normal'; }

    showResult('ta-result', `Trou Anionique = ${ta.toFixed(1)} mmol/L${interpretation}`, type);
}

// ---------- Calcémie Corrigée ----------
function calculerCalcemie() {
    const ca = parseFloat(document.getElementById('calcemie-ca').value);
    const alb = parseFloat(document.getElementById('calcemie-alb').value);

    if (isNaN(ca) || isNaN(alb)) {
        showResult('calcemie-result', '⚠️ Veuillez entrer les 2 valeurs.', 'warning');
        return;
    }

    const caCorrigee = ca + 0.025 * (40 - alb);

    let interpretation = '';
    let type = 'info';

    if (caCorrigee < 2.20) { interpretation = ' — Hypocalcémie corrigée'; type = 'warning'; }
    else if (caCorrigee > 2.60) { interpretation = ' — Hypercalcémie corrigée'; type = 'danger'; }
    else { interpretation = ' — Normocalcémie'; type = 'normal'; }

    showResult('calcemie-result',
        `Calcémie corrigée = ${caCorrigee.toFixed(2)} mmol/L${interpretation}`, type);
}

// ---------- APGAR ----------
function calculerAPGAR() {
    const fc = parseInt(document.getElementById('apgar-fc').value) || 0;
    const respi = parseInt(document.getElementById('apgar-respi').value) || 0;
    const tonus = parseInt(document.getElementById('apgar-tonus').value) || 0;
    const reactivite = parseInt(document.getElementById('apgar-reactivite').value) || 0;
    const coloration = parseInt(document.getElementById('apgar-coloration').value) || 0;

    if (fc > 2 || respi > 2 || tonus > 2 || reactivite > 2 || coloration > 2) {
        showResult('apgar-result', '⚠️ Chaque critère doit être entre 0 et 2.', 'warning');
        return;
    }

    const total = fc + respi + tonus + reactivite + coloration;

    let interpretation = '';
    let type = 'info';

    if (total >= 7) { interpretation = ' — Bonne adaptation (normal)'; type = 'normal'; }
    else if (total >= 4) { interpretation = ' — Détresse modérée : stimulation, ventilation possible'; type = 'warning'; }
    else { interpretation = ' — Détresse sévère : réanimation néonatale immédiate'; type = 'danger'; }

    showResult('apgar-result', `Score d'APGAR = ${total}/10${interpretation}`, type);
}