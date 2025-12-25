document.addEventListener('DOMContentLoaded', function () {
    const chartContainer = document.querySelector('.chart-container');
    chartContainer.innerHTML = ''; // clear previous bars if any

    for (let i = 0; i < 30; i++) {
        const bar = document.createElement('div');
        const height = Math.floor(Math.random() * 80) + 20; // Random height
        const isToday = i === 29;

        bar.className = `w-2 rounded-t-sm transition-all duration-300 ${isToday ? 'bg-indigo-600' : 'bg-indigo-300 dark:bg-indigo-500'
            }`;

        bar.style.height = `${height}%`;
        bar.title = `Day ${i + 1}: ${60 + Math.floor(height / 100 * 40)} WPM`;

        chartContainer.appendChild(bar);
    }
});


document.addEventListener('DOMContentLoaded', function () {
    const heatmapContainer = document.createElement('div');
    heatmapContainer.className = 'flex flex-wrap justify-center';

    // Generate 84 days (12 weeks) of random activity
    for (let i = 0; i < 84; i++) {
        const day = document.createElement('div');
        const activityLevel = Math.floor(Math.random() * 5); // 0-4
        day.className = `heatmap-day bg-gray-${100 + activityLevel * 100} dark:bg-slate-${600 + activityLevel * 100}`;
        heatmapContainer.appendChild(day);
    }

    document.querySelector('.flex.flex-wrap.justify-center').appendChild(heatmapContainer);

    // Add legend
    const legend = document.createElement('div');
    legend.className = 'heatmap-legend';
    legend.innerHTML = `
                                        <span>Less</span>
                                        <div class="flex">
                                            <div class="heatmap-day bg-gray-100 dark:bg-slate-600"></div>
                                            <div class="heatmap-day bg-gray-200 dark:bg-slate-700"></div>
                                            <div class="heatmap-day bg-gray-300 dark:bg-slate-800"></div>
                                            <div class="heatmap-day bg-gray-400 dark:bg-slate-900"></div>
                                            <div class="heatmap-day bg-gray-500 dark:bg-slate-900"></div>
                                        </div>
                                        <span>More</span>
                                    `;
    document.querySelector('.flex.flex-wrap.justify-center').appendChild(legend);
});
