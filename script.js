const INAIRE_DATE = new Date('2018-10-28T00:00:00');

const seriesData = [
    {
        name: "Breaking Bad",
        image: "breaking_bad_poster",
        // 8 days * 24h = 192h ?? No, filming days are usually 12h work days but let's assume raw time passed?
        // The prompt says "filming time".
        // Source says "8 days to film". A shooting day is typically 12-14 hours.
        // Let's estimate conservatively at 12 hours * 8 days = 96 hours of active filming time?
        // Or should we count calendar days?
        // "Total duration passed" vs "Active filming duration"
        // If 8 days pass in the calendar for 1 episode:
        // Then we subtract "8 days" from the "Total Duration" counter?
        // That makes sense. "In the time passed since 2018, you could have filmed X episodes".
        // So we divide Total Time Passed by Time To Film One Episode.
        // Breaking Bad: 8 days.
        daysPerEpisode: 8,
        color: "#599351"
    },
    {
        name: "Game of Thrones",
        image: "got_poster",
        // 14 days
        daysPerEpisode: 14,
        color: "#cdcdcd"
    },
    {
        name: "Stranger Things",
        image: "stranger_things_poster",
        // 11 days
        daysPerEpisode: 11,
        color: "#E71D36"
    }
];

function updateTimer() {
    const now = new Date();
    let diff = now - INAIRE_DATE;

    // Time calculations
    const msInHour = 1000 * 60 * 60;
    const msInDay = msInHour * 24;
    const msInMonth = msInDay * 30.44; // Approx
    const msInYear = msInDay * 365.25;

    const years = Math.floor(diff / msInYear);
    diff %= msInYear;

    const months = Math.floor(diff / msInMonth);
    diff %= msInMonth;

    const days = Math.floor(diff / msInDay);
    diff %= msInDay;

    const hours = Math.floor(diff / msInHour);

    document.getElementById('years').innerText = years;
    document.getElementById('months').innerText = months;
    document.getElementById('days').innerText = days;
    document.getElementById('hours').innerText = hours;

    // Update Series calculations
    // We use the TOTAL milliseconds difference to be precise about "amount of time available"
    const totalDaysPassed = (now - INAIRE_DATE) / msInDay;
    const totalHoursPassed = (now - INAIRE_DATE) / msInHour;

    const grid = document.getElementById('series-grid');
    if (grid.children.length === 0) {
        renderSeries(totalDaysPassed, totalHoursPassed);
    }
}

function renderSeries(totalDays, totalHours) {
    const grid = document.getElementById('series-grid');

    seriesData.forEach(serie => {
        let episodeCount = 0;
        let timePerEpLabel = "";

        if (serie.daysPerEpisode) {
            episodeCount = Math.floor(totalDays / serie.daysPerEpisode);
            timePerEpLabel = `~${serie.daysPerEpisode} días de rodaje por cap.`;
        } else if (serie.hoursPerEpisode) {
            episodeCount = Math.floor(totalHours / serie.hoursPerEpisode);
            timePerEpLabel = `~${serie.hoursPerEpisode} horas de rodaje por cap.`;
        }

        const card = document.createElement('div');
        card.className = 'series-card';
        card.innerHTML = `
            <div class="card-image-container">
                <img src="${serie.name.toLowerCase().replace(/ /g, '_')}.png" alt="${serie.name}" class="card-image">
                <div class="card-overlay">
                    <h3 class="series-name">${serie.name}</h3>
                    <div class="episode-count-container">
                        <span class="episode-number">${episodeCount.toLocaleString()}</span>
                        <span class="episode-label">episodios</span>
                    </div>
                     <p class="filming-info">${timePerEpLabel}</p>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Update every minute (no need for second precision for this scale, but maybe for effect?)
// For "Hours", minute updates are fine.
updateTimer();
setInterval(updateTimer, 60000);
