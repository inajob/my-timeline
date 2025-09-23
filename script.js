document.addEventListener("DOMContentLoaded", () => {
    const timeline = document.getElementById("timeline");
    const startYear = 1985;
    const endYear = 2025;

    for (let year = endYear; year >= startYear; year--) {
        const yearDiv = document.createElement("div");
        yearDiv.className = "year";
        
        const yearLabel = document.createElement("div");
        yearLabel.className = "year-label";
        yearLabel.dataset.year = year;
        yearLabel.textContent = year;

        const jibuContainer = document.createElement("div");
        jibuContainer.className = "events-container jibu-container";

        const otherContainer = document.createElement("div");
        otherContainer.className = "events-container other-container";

        yearDiv.appendChild(jibuContainer);
        yearDiv.appendChild(yearLabel);
        yearDiv.appendChild(otherContainer);

        timeline.appendChild(yearDiv);
    }

    fetch("my.xml")
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(data, "application/xml");
            const events = xml.getElementsByTagName("event");

            Array.from(events).forEach((event, i) => {
                const start = event.getAttribute("start");
                const title = event.getAttribute("title").trim();
                const category = event.getAttribute("category").trim();
                if (!title) return;

                const categoryColors = {
                    "自分": "#FDFFB6", // light yellow
                    "アニメ": "#A0C4FF", // light blue
                    "ゲーム": "#CAFFBF", // light green
                    "漫画": "#BDB2FF", // light purple
                    "IT": "#FFADAD",   // light red
                    "時事": "#FFD6A5",   // light orange
                    "映画": "#9BF6FF",   // light cyan
                    "雑誌": "#FFC6FF", // light magenta
                };

                const year = new Date(start).getFullYear();

                const yearDiv = timeline.querySelector(`.year-label[data-year='${year}']`)?.parentElement;

                if (!yearDiv) {
                    console.error("Could not find year element for:", year, title);
                    return;
                }

                const eventDiv = document.createElement("div");
                eventDiv.className = "event";
                
                let container;
                if (category === '自分') {
                    container = yearDiv.querySelector('.jibu-container');
                } else {
                    container = yearDiv.querySelector('.other-container');
                }

                if (categoryColors[category]) {
                    eventDiv.style.backgroundColor = categoryColors[category];
                }

                const eventTitle = document.createElement("div");
                eventTitle.className = "event-title";
                eventTitle.textContent = title;

                eventDiv.appendChild(eventTitle);

                container.appendChild(eventDiv);
            });
        });
});
