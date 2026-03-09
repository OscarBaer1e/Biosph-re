/**
 * Biosphère - Visualisation des projets de biocontrôle
 * Gestion des sections, projets et graphiques Chart.js
 */

const startButtonInitial = document.querySelector('.section-initial .start-button');
const backArrow = document.querySelector('.section-projects .back-arrow');
const sectionInitial = document.querySelector('.section-initial');
const sectionProjects = document.querySelector('.section-projects');
const projectItems = document.querySelectorAll('.projects-list .project-item');
const chartContainer = document.querySelector('.chart-container-bottom');
const chartTitle = document.getElementById('project-title');

let currentCharts = [];
let currentChartIndex = 0;

const chartTypes = ['bar', 'doughnut', 'pie'];

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

function createChart(container, projectName, data, chartType, title) {
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const chart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: Object.keys(data),
            datasets: [{
                label: title,
                data: Object.values(data),
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)'
                ],
                borderColor: 'rgba(255, 255, 255, 0.9)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: { size: 14, family: "'Poppins', sans-serif", weight: 'bold' },
                        color: 'rgba(0,0,0,0.7)'
                    }
                },
                title: {
                    display: true,
                    text: title,
                    font: { size: 18, family: "'Poppins', sans-serif", weight: 'bold' },
                    color: '#333'
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeOutQuad'
            },
            elements: {
                bar: {
                    backgroundColor: (context) => {
                        const value = context.dataset.data[context.dataIndex];
                        return value > 20 ? 'rgba(75, 192, 192, 0.8)' : 'rgba(255, 99, 132, 0.8)';
                    },
                    borderWidth: 2,
                    borderRadius: 8,
                    hoverBackgroundColor: 'rgba(255, 206, 86, 1)',
                    hoverBorderColor: 'rgba(255, 159, 64, 1)'
                }
            }
        }
    });

    return chart;
}

function displaySingleChart(projectName, data, chartIndex) {
    if (!chartContainer) return;
    if (chartTitle) chartTitle.textContent = projectName;

    chartContainer.innerHTML = '';
    currentCharts.forEach(chart => chart.destroy());
    currentCharts = [];

    const chartKeys = Object.keys(data);
    const key = chartKeys[chartIndex];
    const dataForChart = data[key];

    const chartWrapper = document.createElement('div');
    chartWrapper.classList.add('chart-wrapper');
    chartContainer.appendChild(chartWrapper);

    const chart = createChart(chartWrapper, projectName, dataForChart, chartTypes[chartIndex % chartTypes.length], key);
    currentCharts.push(chart);

    const leftButton = document.createElement('button');
    leftButton.type = 'button';
    leftButton.classList.add('chart-nav', 'left-button');
    leftButton.setAttribute('aria-label', 'Graphique précédent');
    leftButton.innerHTML = '<i class="fa-solid fa-chevron-left" aria-hidden="true"></i>';
    leftButton.onclick = () => changeChart(-1, projectName, data);

    const rightButton = document.createElement('button');
    rightButton.type = 'button';
    rightButton.classList.add('chart-nav', 'right-button');
    rightButton.setAttribute('aria-label', 'Graphique suivant');
    rightButton.innerHTML = '<i class="fa-solid fa-chevron-right" aria-hidden="true"></i>';
    rightButton.onclick = () => changeChart(1, projectName, data);

    chartContainer.appendChild(leftButton);
    chartContainer.appendChild(rightButton);

    chartContainer.style.display = 'flex';
}

function switchSection(hideSection, showSection) {
    hideSection.classList.add('hidden');
    setTimeout(() => {
        hideSection.style.display = 'none';
        showSection.style.display = 'flex';
        showSection.classList.remove('hidden');
    }, 800);
}

function changeChart(direction, projectName, data) {
    const chartKeys = Object.keys(data);
    currentChartIndex = (currentChartIndex + direction + chartKeys.length) % chartKeys.length;
    displaySingleChart(projectName, data, currentChartIndex);
}

if (startButtonInitial) {
    startButtonInitial.addEventListener('click', () => {
        if (sectionProjects) {
            switchSection(sectionInitial, sectionProjects);
            projectItems.forEach((item) => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            });
        }
    });
}

if (backArrow) {
    backArrow.addEventListener('click', () => {
        currentCharts.forEach(chart => chart.destroy());
        currentCharts = [];
        if (chartContainer) {
            chartContainer.innerHTML = '';
            chartContainer.style.display = 'none';
        }
        switchSection(sectionProjects, sectionInitial);
        projectItems.forEach((item) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
        });
        if (chartTitle) chartTitle.textContent = 'Biosphère';
    });
}

function handleProjectSelect(item) {
    const projectName = item.textContent.trim();
    const data = chartData[projectName];
    if (data) {
        currentChartIndex = 0;
        displaySingleChart(projectName, data, currentChartIndex);
    } else if (chartContainer) {
        chartContainer.innerHTML = '<p>Aucune donnée disponible pour ce projet.</p>';
        chartContainer.style.display = 'flex';
    }
}

projectItems.forEach(item => {
    item.addEventListener('click', () => handleProjectSelect(item));
    item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleProjectSelect(item);
        }
    });
});
