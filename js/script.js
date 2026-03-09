/**
 * Biosphère — Visualisation des projets de biocontrôle
 * Accessibilité : skip link, gestion du focus, annonces live, données en tableau
 */

const startButtonInitial = document.querySelector('.section-initial .start-button');
const backArrow = document.querySelector('.section-projects .back-arrow');
const sectionInitial = document.querySelector('.section-initial');
const sectionProjects = document.querySelector('.section-projects');
const projectItems = document.querySelectorAll('.projects-list .project-item');
const chartSection = document.getElementById('chart-section');
const chartWrapper = chartSection?.querySelector('.chart-wrapper');
const chartTitle = document.getElementById('project-title');
const chartAnnouncer = document.getElementById('chart-announcer');
const chartNavLabel = document.getElementById('chart-nav-label');
const chartDataContent = document.getElementById('chart-data-content');
const leftNavBtn = chartSection?.querySelector('.chart-nav.left-button');
const rightNavBtn = chartSection?.querySelector('.chart-nav.right-button');
const mainContent = document.getElementById('main-content');

let currentCharts = [];
let currentChartIndex = 0;
let currentProjectName = '';
let currentProjectData = null;
let lastFocusedProject = null;

const chartTypes = ['bar', 'doughnut', 'pie'];
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const chartData = {
    "4SYSLEG": {
        "Famille méthode": {"Micro-organismes": 20, "Substances naturelles": 19, "Macro-organismes": 16, "Médiateurs chimiques": 6, "Autres méthodes": 2, "Plantes de service": 2},
        "Type de traitement": {"Insecticides": 34, "Fongicides": 22, "Molluscicides": 5, "Favorise les auxilaires": 2, "Acaricides": 2},
        "Satisfaction": {"Bon": 33, "Aucun avis émis": 19, "Mitigé": 13}
    },
    "BioREco": {
        "Famille méthode": {"Substances naturelles": 12, "Micro-organismes": 6, "Médiateurs chimiques": 6, "Macro-organismes": 6, "Plantes de service": 6},
        "Type de traitement": {"Insecticides": 36},
        "Satisfaction": {"Bon": 24, "Mitigé": 6, "Aucun avis émis": 6}
    },
    "BREIZILEG": {
        "Famille méthode": {"Substances naturelles": 1, "Micro-organismes": 1},
        "Type de traitement": {"Fongicides": 1, "Insecticides": 1},
        "Satisfaction": {"Aucun avis émis": 1, "Bon": 1}
    },
    "CanécoH": {
        "Famille méthode": {"Plantes de service": 1},
        "Type de traitement": {"Nématicides": 1},
        "Satisfaction": {"Aucun avis émis": 1}
    },
    "CAP ReD": {
        "Famille méthode": {"Substances naturelles": 9, "Autres méthodes": 7, "Médiateurs chimiques": 5},
        "Type de traitement": {"Insecticides": 14, "Fongicides": 5, "Favorise les auxilaires": 1, "Acaricides": 1},
        "Satisfaction": {"Bon": 16, "Aucun avis émis": 3, "Insatisfaisant": 1, "Mitigé": 1}
    }
};

function getProjectNameFromItem(item) {
    return item.getAttribute('data-project') || item.querySelector('.project-item__name')?.textContent?.trim() || item.textContent.trim();
}

function announceLive(element, text) {
    if (!element) return;
    element.textContent = '';
    element.setAttribute('aria-live', 'polite');
    requestAnimationFrame(() => {
        element.textContent = text;
    });
}

function buildAccessibleTable(data, title) {
    const labels = Object.keys(data);
    const values = Object.values(data);
    let html = '<table><caption class="sr-only">' + escapeHtml(title) + '</caption><thead><tr><th scope="col">Catégorie</th><th scope="col">Effectif</th></tr></thead><tbody>';
    labels.forEach((label, i) => {
        html += '<tr><td>' + escapeHtml(label) + '</td><td>' + values[i] + '</td></tr>';
    });
    html += '</tbody></table>';
    return html;
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function createChart(container, data, chartType, title) {
    if (!container) return null;
    container.innerHTML = '';
    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const duration = prefersReducedMotion() ? 0 : 1200;
    const chart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: Object.keys(data),
            datasets: [{
                label: title,
                data: Object.values(data),
                backgroundColor: [
                    'rgba(45, 212, 160, 0.7)',
                    'rgba(124, 58, 237, 0.7)',
                    'rgba(251, 191, 36, 0.7)',
                    'rgba(34, 211, 238, 0.7)',
                    'rgba(248, 113, 113, 0.7)',
                    'rgba(167, 139, 250, 0.7)'
                ],
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: duration },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: { size: 13, family: "'DM Sans', sans-serif" },
                        color: 'rgba(232, 237, 234, 0.9)',
                        padding: 12
                    }
                },
                title: {
                    display: true,
                    text: title,
                    font: { size: 16, family: "'Fraunces', serif" },
                    color: 'rgba(232, 237, 234, 0.95)'
                }
            },
            scales: chartType === 'bar' ? {
                y: { ticks: { color: 'rgba(232, 237, 234, 0.7)' } },
                x: { ticks: { color: 'rgba(232, 237, 234, 0.7)' } }
            } : {}
        }
    });
    return chart;
}

function displaySingleChart(projectName, data, chartIndex) {
    if (!chartSection || !chartWrapper) return;

    currentCharts.forEach(chart => chart.destroy());
    currentCharts = [];
    currentProjectName = projectName;
    currentProjectData = data;

    const chartKeys = Object.keys(data);
    const key = chartKeys[chartIndex];
    const dataForChart = data[key];
    const total = chartKeys.length;

    chartTitle.textContent = projectName;

    const chart = createChart(chartWrapper, dataForChart, chartTypes[chartIndex % chartTypes.length], key);
    currentCharts.push(chart);

    if (chartDataContent) {
        chartDataContent.innerHTML = buildAccessibleTable(dataForChart, key + ' — ' + projectName);
    }

    const labelText = (chartIndex + 1) + ' / ' + total + ' : ' + key;
    if (chartNavLabel) chartNavLabel.textContent = (chartIndex + 1) + ' / ' + total;
    announceLive(chartAnnouncer, 'Graphique ' + (chartIndex + 1) + ' sur ' + total + '. ' + key + '.');

    if (leftNavBtn) {
        leftNavBtn.onclick = () => changeChart(-1);
        leftNavBtn.setAttribute('aria-label', 'Graphique précédent : ' + (chartIndex === 0 ? chartKeys[total - 1] : chartKeys[chartIndex - 1]));
    }
    if (rightNavBtn) {
        rightNavBtn.onclick = () => changeChart(1);
        rightNavBtn.setAttribute('aria-label', 'Graphique suivant : ' + (chartIndex === total - 1 ? chartKeys[0] : chartKeys[chartIndex + 1]));
    }

    chartSection.removeAttribute('hidden');
    chartSection.style.display = 'flex';
    chartSection.setAttribute('aria-hidden', 'false');

    requestAnimationFrame(() => {
        if (leftNavBtn) leftNavBtn.focus();
    });
}

function changeChart(direction) {
    if (!currentProjectData) return;
    const chartKeys = Object.keys(currentProjectData);
    currentChartIndex = (currentChartIndex + direction + chartKeys.length) % chartKeys.length;
    displaySingleChart(currentProjectName, currentProjectData, currentChartIndex);
}

function switchSection(hideSection, showSection) {
    hideSection.classList.add('hidden');
    setTimeout(() => {
        hideSection.style.display = 'none';
        showSection.style.display = 'flex';
        showSection.classList.remove('hidden');
    }, prefersReducedMotion() ? 0 : 400);
}

function closeCharts() {
    if (chartSection) {
        chartSection.setAttribute('hidden', '');
        chartSection.style.display = 'none';
        chartSection.setAttribute('aria-hidden', 'true');
    }
    chartWrapper.innerHTML = '';
    currentCharts.forEach(chart => chart.destroy());
    currentCharts = [];
    currentProjectData = null;
    if (chartTitle) chartTitle.textContent = 'Biosphère';
    if (chartDataContent) chartDataContent.innerHTML = '';
    if (lastFocusedProject && typeof lastFocusedProject.focus === 'function') {
        lastFocusedProject.focus();
    }
}

if (document.querySelector('.skip-link')) {
    document.querySelector('.skip-link').addEventListener('click', (e) => {
        e.preventDefault();
        if (mainContent) mainContent.focus();
    });
}

if (startButtonInitial) {
    startButtonInitial.addEventListener('click', () => {
        if (sectionProjects) {
            switchSection(sectionInitial, sectionProjects);
            projectItems.forEach((item) => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            });
            if (mainContent) mainContent.focus();
        }
    });
}

if (backArrow) {
    backArrow.addEventListener('click', () => {
        switchSection(sectionProjects, sectionInitial);
        projectItems.forEach((item) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
        });
        closeCharts();
        if (startButtonInitial) startButtonInitial.focus();
    });
}

function handleProjectSelect(item) {
    const projectName = getProjectNameFromItem(item);
    const data = chartData[projectName];
    lastFocusedProject = item;
    if (data) {
        currentChartIndex = 0;
        displaySingleChart(projectName, data, 0);
    } else if (chartSection) {
        chartSection.removeAttribute('hidden');
        chartSection.style.display = 'flex';
        if (chartDataContent) chartDataContent.innerHTML = '<p>Aucune donnée disponible pour ce projet.</p>';
        announceLive(chartAnnouncer, 'Aucune donnée disponible pour ce projet.');
    }
}

projectItems.forEach((item) => {
    item.addEventListener('click', () => handleProjectSelect(item));
    item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleProjectSelect(item);
        }
    });
});
