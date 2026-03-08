async function loadData() {

    // const response = await fetch("data/satellite_counts.json");
    const response = await fetch("https://raw.githubusercontent.com/djfitz3999/megaconstellation_dashboard/data/data/satellite_counts.json?cache=" + Date.now())

    const data = await response.json();

    animateCounter("starlink-count",
        data.constellations.Starlink.total_in_orbit);

    animateCounter("kuiper-count",
        data.constellations.Kuiper.total_in_orbit);

    animateCounter("qianfan-count",
        data.constellations.Qianfan.total_in_orbit);

    document.getElementById("updated").innerText =
        "Last updated: " + data.last_updated_utc;

}

function animateCounter(id, target) {

    let element = document.getElementById(id);

    let current = 0;

    let increment = Math.ceil(target / 120);

    let interval = setInterval(() => {

        current += increment;

        if (current >= target) {

            current = target;

            clearInterval(interval);

        }

        element.innerText = current.toLocaleString();

    }, 20);

}

document.getElementById("update-btn").onclick = function() {

    alert("Run your Python update script to refresh the data.");

}

loadData();