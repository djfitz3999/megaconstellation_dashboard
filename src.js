/* To debug in Chrome, hit F12 or Ctrl+Shift+J to see the console output in browser */

let constellationCounts = null;
let earthRadius = 120;
let satSize     = 2;
let configs = [
    {
        name: "Starlink",
        leg_name: "SpaceX Starlink",
        color: 0x4da6ff,
        shells: [
            {
                name: "Starlink_G1_Group1",
                planes: 72,
                altitudeKm: 550,
                inclinationDeg: 53,
                percent: 8,
                visualRadius: 125
            },
            {
                name: "Starlink_G1_Group2",
                planes: 36,
                altitudeKm: 572,
                inclinationDeg: 70,
                percent: 7,
                visualRadius: 127
            },
            {
                name: "Starlink_G1_Group3",
                planes: 6,
                altitudeKm: 560,
                inclinationDeg: 97.6,
                percent: 5,
                visualRadius: 126
            },
            {
                name: "Starlink_G1_Group4",
                planes: 72,
                altitudeKm: 547,
                inclinationDeg: 53,
                percent: 15,
                visualRadius: 124
            },
            {
                name: "Starlink_G2A_Group6",
                planes: 56,
                altitudeKm: 483,
                inclinationDeg: 43,
                percent: 35,
                visualRadius: 121
            },
            {
                name: "Starlink_G2A_Group7",
                planes: 72,
                altitudeKm: 475,
                inclinationDeg: 53,
                percent: 30,
                visualRadius: 120
            }
        ]
    },
    {
        name: "AmazonLeo",
        leg_name: "Amazon Leo",
        color: 0xffb347,
        shells: [
            {
                name: "Kuiper_KP1-C",
                percent: 100,
                altitudeKm: 629.5,
                inclinationDeg: 51.9,
                planes: 24,
                visualRadius: 126
            }
        ]
    },
    {
        name: "Guowang",
        leg_name: "Guowang (国网)",
        color: 0xff5c5c,
        shells: [
            {
                name: "Guowang_Shell1",
                percent: 30,
                altitudeKm: 1168,
                inclinationDeg: 86.5,
                planes: 16,
                visualRadius: 145
            },
            {
                name: "Guowang_Shell2",
                percent: 70,
                altitudeKm: 1149,
                inclinationDeg: 50,
                planes: 16,
                visualRadius: 145
            }
        ]
    },
    {
        name: "Qianfan",
        leg_name: "Qianfan (千帆)",
        color: 0xff00ff,
        shells: [
            {
                name: "Qianfan_Q1",
                percent: 100,
                altitudeKm: 1069,
                inclinationDeg: 89,
                planes: 16,
                visualRadius: 140
            }
        ]
    },
    {
        name: "OneWeb",
        leg_name: "Eutelsat OneWeb",
        color: 0x5cff9d,
        shells: [
            {
                name: "OneWeb",
                percent: 100,
                altitudeKm: 1200,
                inclinationDeg: 87.9,
                planes: 24,
                visualRadius: 147
            }
        ]
    },
        {
        name: "Starshield",
        leg_name: "SpaceX Starshield",
        color: 0xb38cff,
        shells: [
            {
                name: "Starshield_Nominal",
                percent: 100,
                altitudeKm: 578,
                inclinationDeg: 70,
                planes: 16,
                visualRadius: 128
            }
        ]
    },
    {
        name: "PWSA",
        leg_name: "PWSA (USA)",
        color: 0x00d4c7,
        shells: [
            {
                name: "PWSA_Checkmate_and_Wildfire",
                percent: 95,
                altitudeKm: 948,
                inclinationDeg: 81,
                planes: 4,
                visualRadius: 135
            },            
            {
                name: "PWSA_Shell4",
                percent: 5,
                altitudeKm: 998,
                inclinationDeg: 40,
                planes: 1,
                visualRadius: 137
            }
        ]
    },
    {
        name: "Jilin",
        leg_name: "Jilin-1 (吉林一号)",
        color: 0xffd700,
        shells: [
            {
                name: "Jilin_Shell1",
                percent: 100,
                altitudeKm: 540,
                inclinationDeg: 97.5,
                planes: 5,
                visualRadius: 123
            }
        ]
    },
    {
        name: "Spire",
        leg_name: "Spire Global",
        color: 0x9b7653,
        shells: [
            {
                name: "Spire_Shell2",
                percent: 97,
                altitudeKm: 500,
                inclinationDeg: 97.5,
                planes: 6,
                visualRadius: 122
            },
            {
                name: "Spire_Shell3",
                percent: 3,
                altitudeKm: 500,
                inclinationDeg: 83,
                planes: 1,
                visualRadius: 122
            }
        ]
    },
    {
        name: "Planet",
        leg_name: "Planet Labs",
        color: 0x9acd32,
        shells: [
            {
                name: "Planet_SuperDove",
                percent: 100,
                altitudeKm: 500,
                inclinationDeg: 97.4,
                planes: 1,
                visualRadius: 122
            }
        ]
    },
    {
        name: "Iridium",
        leg_name: "Iridium",
        color: 0x4b70d8,
        shells: [
            {
                name: "Iridium",
                percent: 100,
                altitudeKm: 777.5,
                inclinationDeg: 86.4,
                planes: 6,
                visualRadius: 132
            }
        ]
    },
    {
        name: "Globalstar",
        leg_name: "Globalstar",
        color: 0xff7f50,
        shells: [
            {
                name: "Globalstar",
                percent: 100,
                altitudeKm: 1414,
                inclinationDeg: 52,
                planes: 8,
                visualRadius: 152
            }
        ]
    },
    {
        name: "Orbcomm",
        leg_name: "Orbcomm",
        color: 0xc0c0c0,
        // Orbcomm information taken from https://www.mdpi.com/2673-4591/88/1/39 Table 1
        // Cross-referenced against Space-Track.org SATCAT
        shells: [
            {
                name: "Orbcomm_OG1_A",
                percent: 14, // 8/58 
                altitudeKm: 735,
                inclinationDeg: 45,
                planes: 1,
                visualRadius: 129,
                raanOffset: 0
            },
            {
                name: "Orbcomm_OG1_B",
                percent: 14, // 8/58 
                altitudeKm: 760,
                inclinationDeg: 45,
                planes: 1,
                visualRadius: 130,
                raanOffset: 90
            },
            {
                name: "Orbcomm_OG1_C",
                percent: 14, // 8/58 
                altitudeKm: 760,
                inclinationDeg: 45,
                planes: 1,
                visualRadius: 130,
                raanOffset: 180
            },
            {
                name: "Orbcomm_OG1_D",
                percent: 12, // 7/58 
                altitudeKm: 760,
                inclinationDeg: 45,
                planes: 1,
                visualRadius: 130,
                raanOffset: 270
            },
            {
                name: "Orbcomm_OG1_F",
                percent: 3, // 2/58 
                altitudeKm: 575,
                inclinationDeg: 70,
                planes: 1,
                visualRadius: 127
            },
            {
                name: "Orbcomm_OG1_F",
                percent: 3, // 2/58 
                altitudeKm: 770,
                inclinationDeg: 110,
                planes: 1,
                visualRadius: 130.5
            },
            {
                name: "Orbcomm_OG1_QL",
                percent: 10, // 6/58
                altitudeKm: 620,
                inclinationDeg: 48,
                planes: 1,
                visualRadius: 125.5,
                raanOffset: 60
            },
            {
                name: "Orbcomm_OG2_K",
                percent: 10, // 6/58
                altitudeKm: 700,
                inclinationDeg: 47,
                planes: 1,
                visualRadius: 127,
                raanOffset: 60
            },
            {
                name: "Orbcomm_OG2_L",
                percent: 20, // 11/58
                altitudeKm: 700,
                inclinationDeg: 47,
                planes: 3,
                visualRadius: 127,
                raanOffset: 120
            }
        ]
    },
    {
        name: "Strela1M",
        leg_name: "Strela-1M (Стрела-1М)",
        color: 0xd16ba5,
        shells: [
            {
                name: "Strela1M",
                percent: 100,
                altitudeKm: 1400,
                inclinationDeg: 74,
                planes: 18,
                visualRadius: 151.5
            }
        ]
    },
    {
        name: "Strela3",
        leg_name: "Strela-3 (Стрела-3)",
        color: 0x7f8c8d,
        shells: [
            {
                name: "Strela3",
                percent: 100,
                altitudeKm: 1400,
                inclinationDeg: 82.6,
                planes: 18,
                visualRadius: 151.5
            }
        ]
    }
];

// =============================
// Visualization Controls
// =============================

// Track visibility of every configured orbital shell
const orbitVisibility = {};
configs.forEach(config => {

    orbitVisibility[config.name] = {};

    config.shells.forEach(shell => {
        orbitVisibility[config.name][shell.name] = true;
    });

});

function renderOrbitControls() {
    const container = document.getElementById("orbit-controls-content");
    if (!container) return;

    let html = `
        <div class="orbit-control-actions">
            <button data-orbit-action="show">SELECT ALL</button>
            <button data-orbit-action="hide">DESELECT ALL</button>
        </div>
    `;

    configs.forEach(config => {
        const shells = config.shells || [];
        const shellCount = shells.length;

        if (shellCount === 0) return;

        const colorHex = `#${config.color.toString(16).padStart(6, "0")}`;

        const enabledCount = shells.filter(shell =>
            orbitVisibility[config.name]?.[shell.name] !== false
        ).length;

        const allEnabled = enabledCount === shellCount;

        // All constellations start collapsed.
        const constellationOpen = "";

        html += `
            <div class="constellation-control">
                <div class="constellation-heading">

                    <details
                        class="constellation-details"
                        ${constellationOpen}
                    >
                        <summary>
                            <span class="constellation-name">
                                <span
                                    class="constellation-color"
                                    style="background:${colorHex}"
                                ></span>
                                <span>${config.leg_name}</span>
                                <span class="shell-count">(${shellCount})</span>
                            </span>
                        </summary>
        `;

        if (shellCount === 1) {
            const shell = shells[0];

            html += `
                        <div class="orbital-specs">
                            ${shell.altitudeKm} km ·
                            ${shell.inclinationDeg}° ·
                            ${shell.planes} planes
                        </div>
            `;
        } else {
            html += `<div class="shell-controls">`;

            shells.forEach(shell => {
                const shellVisible =
                    orbitVisibility[config.name]?.[shell.name] !== false;

                html += `
                    <div class="shell-heading">
                        <details class="shell-details" open>
                            <summary>
                                <span class="shell-name">${shell.name}</span>
                            </summary>

                            <div class="orbital-specs">
                                ${shell.altitudeKm} km ·
                                ${shell.inclinationDeg}° ·
                                ${shell.planes} planes
                            </div>
                        </details>

                        <input
                            type="checkbox"
                            class="shell-toggle"
                            data-shell-constellation="${config.name}"
                            data-shell-name="${shell.name}"
                            ${shellVisible ? "checked" : ""}
                        >
                    </div>
                `;
            });

            html += `</div>`;
        }

        html += `
                    </details>

                    <input
                        type="checkbox"
                        class="constellation-toggle"
                        data-constellation-toggle="${config.name}"
                        ${allEnabled ? "checked" : ""}
                    >

                </div>
            </div>
        `;
    });

    container.innerHTML = html;

    // Update parent and child checkbox states to match orbitVisibility.
    function syncCheckboxes() {
        configs.forEach(config => {
            const shells = config.shells || [];

            const enabledCount = shells.filter(shell =>
                orbitVisibility[config.name]?.[shell.name] !== false
            ).length;

            const allEnabled = enabledCount === shells.length;
            const someEnabled =
                enabledCount > 0 && enabledCount < shells.length;

            // Update the parent constellation checkbox.
            const parentCheckbox = [
                ...container.querySelectorAll("[data-constellation-toggle]")
            ].find(checkbox =>
                checkbox.dataset.constellationToggle === config.name
            );

            if (parentCheckbox) {
                parentCheckbox.checked = allEnabled;
                parentCheckbox.indeterminate = someEnabled;
            }

            // Update each individual shell checkbox.
            container.querySelectorAll("[data-shell-constellation]").forEach(
                checkbox => {
                    if (checkbox.dataset.shellConstellation !== config.name) {
                        return;
                    }

                    checkbox.checked =
                        orbitVisibility[config.name]?.[
                            checkbox.dataset.shellName
                        ] !== false;
                }
            );
        });
    }

    // Handle individual shell and parent constellation checkboxes.
    container.onchange = event => {
        const checkbox = event.target;

        // Parent constellation checkbox:
        // Toggle every shell belonging to this constellation.
        if (checkbox.matches("[data-constellation-toggle]")) {
            const constellationName = checkbox.dataset.constellationToggle;
            const config = configs.find(c => c.name === constellationName);

            if (!config) return;

            config.shells.forEach(shell => {
                setShellVisibility(
                    constellationName,
                    shell.name,
                    checkbox.checked
                );
            });

            syncCheckboxes();
            return;
        }

        // Individual shell checkbox:
        // Toggle only the selected shell.
        if (checkbox.matches("[data-shell-constellation]")) {
            setShellVisibility(
                checkbox.dataset.shellConstellation,
                checkbox.dataset.shellName,
                checkbox.checked
            );

            syncCheckboxes();
        }
    };

    // Handle SHOW ALL and HIDE ALL.
    container.onclick = event => {
        const button = event.target.closest("[data-orbit-action]");
        if (!button) return;

        const visible = button.dataset.orbitAction === "show";

        configs.forEach(config => {
            config.shells.forEach(shell => {
                setShellVisibility(
                    config.name,
                    shell.name,
                    visible
                );
            });
        });

        syncCheckboxes();
    };

    // Ensure the initial checkbox states match the visibility state.
    syncCheckboxes();
}

function setShellVisibility(constellationName, shellName, visible) {

    // Update the saved visibility state
    orbitVisibility[constellationName][shellName] = visible;

    // Find the corresponding Three.js group
    const shellGroup =
        orbitGroup.userData.shellGroups?.[constellationName]?.[shellName];

    // Toggle rendering without rebuilding geometry
    if (shellGroup) {
        shellGroup.visible = visible;
    }
}


function updateConstellationCheckbox(constellationName) {

    const container = document.getElementById(
        "orbit-controls-content"
    );

    const parentCheckbox = container.querySelector(
        `[data-constellation-toggle="${constellationName}"]`
    );

    const shellCheckboxes = Array.from(
        container.querySelectorAll("[data-shell-constellation]")
    ).filter(input =>
        input.dataset.shellConstellation === constellationName
    );

    if (!parentCheckbox || shellCheckboxes.length === 0) return;

    const enabledCount = shellCheckboxes.filter(
        input => input.checked
    ).length;

    parentCheckbox.checked =
        enabledCount === shellCheckboxes.length;

    parentCheckbox.indeterminate =
        enabledCount > 0 &&
        enabledCount < shellCheckboxes.length;
}


function handleOrbitControlChange(event) {

    const target = event.target;

    // ---------------------------------
    // CONSTELLATION CHECKBOX
    // ---------------------------------

    if (target.matches("[data-constellation-toggle]")) {

        const constellationName =
            target.dataset.constellationToggle;

        const visible = target.checked;

        // Enable/disable every shell in this constellation
        configs.find(config =>
            config.name === constellationName
        )?.shells.forEach(shell => {

            setShellVisibility(
                constellationName,
                shell.name,
                visible
            );

            // Keep child checkboxes synchronized
            const childCheckbox = Array.from(
                document.querySelectorAll("[data-shell-constellation]")
            ).find(input =>
                input.dataset.shellConstellation === constellationName &&
                input.dataset.shellName === shell.name
            );

            if (childCheckbox) {
                childCheckbox.checked = visible;
            }
        });

        updateConstellationCheckbox(constellationName);

        return;
    }

    // ---------------------------------
    // INDIVIDUAL SHELL CHECKBOX
    // ---------------------------------

    if (target.matches("[data-shell-constellation]")) {

        const constellationName =
            target.dataset.shellConstellation;

        const shellName =
            target.dataset.shellName;

        setShellVisibility(
            constellationName,
            shellName,
            target.checked
        );

        updateConstellationCheckbox(constellationName);
    }
}


function handleOrbitControlAction(action) {

    const visible = action === "show-all";

    configs.forEach(config => {

        config.shells.forEach(shell => {

            setShellVisibility(
                config.name,
                shell.name,
                visible
            );

        });

        updateConstellationCheckbox(config.name);
    });

    // Synchronize all checkboxes
    document.querySelectorAll(
        "#orbit-controls-content input[type='checkbox']"
    ).forEach(checkbox => {
        checkbox.checked = visible;
        checkbox.indeterminate = false;
    });
}

// =============================
// PHYSICS CONFIGURATION
// =============================

// Satellite speed scalar
const SATELLITE_SPEED_SCALAR = 10;

// Earth's rotation animation rate (radians/frame)
// Preserves existing animation speed.
const EARTH_ROTATION_RATE = 0.0006;

// Physical constants (km-based units)
const EARTH_RADIUS_KM = 6378.0;
const EARTH_MU = 398600.4418; // km^3/s^2

// Nodal precession
const EARTH_J2 = 1.08263e-3;
const EARTH_EQUATORIAL_RADIUS_KM = 6378.137;

// Physical Earth rotation rate (rad/sec)
const EARTH_ROTATION_RAD_PER_SEC = 7.2921159e-5;

// How much simulated time passes per rendered frame
const SIM_SECONDS_PER_FRAME =
    EARTH_ROTATION_RATE / EARTH_ROTATION_RAD_PER_SEC;

// Calculate circular orbital period
function calculateOrbitalPeriod(altitudeKm) {

    const orbitalRadius = EARTH_RADIUS_KM + altitudeKm;

    const periodSeconds =
        2 * Math.PI *
        Math.sqrt(Math.pow(orbitalRadius, 3) / EARTH_MU);

    return periodSeconds / 3600;
}

// Orbital angular rate in radians per rendered frame
function calculateOrbitalRate(altitudeKm) {

    const periodHours = calculateOrbitalPeriod(altitudeKm);

    const meanMotion =
        (2 * Math.PI) / (periodHours * 3600);

    return meanMotion * SIM_SECONDS_PER_FRAME;
}

function calculateNodalPrecessionRate(altitudeKm, inclinationDeg) {

    const a = EARTH_EQUATORIAL_RADIUS_KM + altitudeKm;
    const inclination = THREE.MathUtils.degToRad(inclinationDeg);

    const meanMotion = Math.sqrt(EARTH_MU / Math.pow(a, 3));

    const nodalRate =
        -1.5 *
        EARTH_J2 *
        meanMotion *
        Math.pow(EARTH_EQUATORIAL_RADIUS_KM / a, 2) *
        Math.cos(inclination);

    // Convert physical radians/second into radians/frame
    return nodalRate * SIM_SECONDS_PER_FRAME;
}

// =============================
// VISUALIZATION LEGEND
// =============================

function renderConstellationLegend() {

    const legend = document.getElementById("constellation-legend");

    if (!legend) {
        console.warn("Constellation legend element not found.");
        return;
    }

    // Build one legend entry for each constellation in configs
    const legendItems = configs.map(config => {

        // Convert the numeric Three.js hex color into a CSS hex string
        const colorHex = `#${config.color.toString(16).padStart(6, "0")}`;
        const legName = config.leg_name || config.name;

        return `
            <div class="legend-item">
                <span
                    class="legend-color"
                    style="background-color: ${colorHex}; color: ${colorHex};"
                ></span>
                <span class="legend-name">${legName}</span>
            </div>
        `;
    }).join("");

    legend.innerHTML = `
        <div class="legend-title">Orbital Visualization</div>

        <div class="legend-caption">
            Physics-based visualization of major mega-constellations distributed  
            across their appropriate orbital shells (i.e., altitude, 
            inclination), assuming uniform RAAN spacing, inferred from real 
            tracking data.  Satellite sizes, altitudes, and speeds are scaled 
            for visual clarity.
        </div>

        <div class="legend-items">
            ${legendItems}
        </div>
    `;
}

// =============================
// DATA LOADING
// =============================

async function loadData() {

    const response = await fetch("data/satellite_counts.json");
    // const response = await fetch("https://raw.githubusercontent.com/djfitz3999/megaconstellation_dashboard/data/data/satellite_counts.json?cache=" + Date.now());
    const data = await response.json();

    constellationCounts = {
        Starlink: data.constellations.Starlink.total_in_orbit,
        AmazonLeo: data.constellations.AmazonLeo.total_in_orbit,
        Qianfan: data.constellations.Qianfan.total_in_orbit,
        Guowang: data.constellations.Guowang.total_in_orbit,
        Starshield: data.constellations.Starshield.total_in_orbit,
        PWSA: data.constellations.PWSA.total_in_orbit,
        Jilin: data.constellations.Jilin.total_in_orbit,
        OneWeb: data.constellations.OneWeb.total_in_orbit,
        Spire: data.constellations.Spire.total_in_orbit,
        Planet: data.constellations.Planet.total_in_orbit,
        Iridium: data.constellations.Iridium.total_in_orbit,
        Globalstar: data.constellations.Globalstar.total_in_orbit,
        Orbcomm: data.constellations.Orbcomm.total_in_orbit,
        Strela1M: data.constellations.Strela1M.total_in_orbit,
        Strela3: data.constellations.Strela3.total_in_orbit
    };

    animateCounter("starlink-count", constellationCounts.Starlink);
    animateCounter("amazonleo-count", constellationCounts.AmazonLeo);
    animateCounter("qianfan-count", constellationCounts.Qianfan);
    animateCounter("guowang-count", constellationCounts.Guowang);
    animateCounter("starshield-count", constellationCounts.Starshield);
    animateCounter("pwsa-count", constellationCounts.PWSA);
    animateCounter("jilin-count", constellationCounts.Jilin);
    animateCounter("oneweb-count", constellationCounts.OneWeb);
    animateCounter("spire-count", constellationCounts.Spire);
    animateCounter("planet-count", constellationCounts.Planet);
    animateCounter("iridium-count", constellationCounts.Iridium);
    animateCounter("globalstar-count", constellationCounts.Globalstar);
    animateCounter("orbcomm-count", constellationCounts.Orbcomm);
    animateCounter("strela1m-count", constellationCounts.Strela1M);
    animateCounter("strela3-count", constellationCounts.Strela3);

    document.getElementById("lastUpdate").textContent =
        formatEasternTime(data.last_updated_utc);

    updateTimers(data.last_updated_utc);

    buildConstellationOrbits();   // build visualization
    // testConstellationOrbits();
}

function formatEasternTime(timestamp) {

  const date = new Date(timestamp)

  return date.toLocaleString("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short"
  })
}

function updateTimers(timestamp) {

    const last = new Date(timestamp);
    const now = new Date();
    const cadenceHours = 24;
    const next = new Date(last.getTime() + cadenceHours * 3600000);

    let diff = next - now;

    if (diff <= 0) {
        document.getElementById('nextUpdate').textContent = "Update due now";
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    document.getElementById('nextUpdate').textContent =
        `${days}d ${hours}h ${mins}m`;
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

// =============================
// UPDATE BUTTON
// =============================

function updateData() {

  window.open(
    "https://github.com/djfitz3999/megaconstellation_dashboard/actions/workflows/update_counts.yml",
    "_blank"
  );
}

const isCreator = window.location.search.includes("admin=true")

if (!isCreator) {
    document.getElementById("update-btn").style.display = "none"
}
else {
    document.getElementById('update-btn').onclick = updateData;
}

// =============================
// STARFIELD SCENE
// =============================

const backgroundScene = new THREE.Scene()

const backgroundCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

const backgroundRenderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("starfield"),
  alpha: true
})

backgroundRenderer.setSize(window.innerWidth, window.innerHeight)

backgroundCamera.position.z = 260

const starGeometry = new THREE.BufferGeometry()
const starCount = 2000

const starPositions = []

for (let i = 0; i < starCount; i++) {

  starPositions.push(
    (Math.random() - 0.5) * 2000,
    (Math.random() - 0.5) * 2000,
    (Math.random() - 0.5) * 2000
  )
}

starGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(starPositions, 3)
)

const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 1
})

const stars = new THREE.Points(starGeometry, starMaterial)
backgroundScene.add(stars)

// =============================
// EARTH SCENE — SEPARATE CANVAS
// =============================

const scene = new THREE.Scene();

const canvasContainer = document.querySelector(".orbit-visualization");
const canvas = document.getElementById("earth-canvas");

if (!canvasContainer || !canvas) {
    throw new Error("Earth visualization container or canvas not found.");
}

const camera = new THREE.PerspectiveCamera(
    50,
    canvasContainer.clientWidth / canvasContainer.clientHeight,
    0.1,
    2000
);

camera.position.z = 500;

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setClearColor(0x000000, 0);

// // =============================
// // EARTH
// // =============================

// const textureLoader = new THREE.TextureLoader()

// const earthTexture = textureLoader.load("textures/nasa_blue_marble.jpg")

// const earthGeometry = new THREE.SphereGeometry(50, 64, 64)

// const earthMaterial = new THREE.MeshPhongMaterial({
//   map: earthTexture
// })

// const earth = new THREE.Mesh(earthGeometry, earthMaterial)

// scene.add(earth)

// =============================
// EARTH WITH CITY LIGHTS
// =============================

const textureLoader = new THREE.TextureLoader()

const earthDay = textureLoader.load("./textures/nasa_blue_marble.jpg")
const earthNight = textureLoader.load("./textures/nasa_blue_marble_night.jpg")
earthDay.colorSpace = THREE.SRGBColorSpace;
earthNight.colorSpace = THREE.SRGBColorSpace;

const earthGeometry = new THREE.SphereGeometry(earthRadius, earthRadius, earthRadius)

const earthMaterial = new THREE.ShaderMaterial({

    uniforms: {
        dayMap: { value: earthDay },
        nightMap: { value: earthNight },

        // Direction from the center of Earth toward the Sun
        sunDirection: {
            value: new THREE.Vector3(100, 10, 0).normalize()
        }
    },

    vertexShader: `
        varying vec2 vUv;
        varying vec3 vWorldNormal;

        void main() {

            vUv = uv;

            // Transform the surface normal into world coordinates
            vWorldNormal = normalize(mat3(transpose(inverse(modelMatrix))) * normal);

            gl_Position = projectionMatrix *
                          modelViewMatrix *
                          vec4(position, 1.0);
        }
    `,

    fragmentShader: `
        uniform sampler2D dayMap;
        uniform sampler2D nightMap;
        uniform vec3 sunDirection;

        varying vec2 vUv;
        varying vec3 vWorldNormal;

        void main() {

            // Surface orientation relative to the Sun
            float sunAngle = dot(
                normalize(vWorldNormal),
                normalize(sunDirection)
            );

            // Smooth transition around the day/night boundary
            float dayBlend = smoothstep(-0.10, 0.10, sunAngle);

            // Sample both Earth textures
            vec3 dayColor = texture2D(dayMap, vUv).rgb;
            vec3 nightColor = texture2D(nightMap, vUv).rgb;

            // Illuminate the daytime surface
            float daylight = max(sunAngle, 0.0);
            dayColor *= (0.12 + 1.5 * daylight);

            // Keep city lights visible on the night side
            nightColor *= 1.5;

            // Blend between the two textures
            vec3 finalColor = mix(
                nightColor,
                dayColor,
                dayBlend
            );

            gl_FragColor = vec4(finalColor, 1.0);
        }
    `
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial)
scene.add(earth)

// Adjust renderer and camera to the visualization container
function resizeScene() {

    const width = canvasContainer.clientWidth
    const height = canvasContainer.clientHeight

    if (!width || !height) return

    renderer.setSize(width, height, false)

    camera.aspect = width / height
    camera.updateProjectionMatrix()
}
const resizeObserver = new ResizeObserver(resizeScene)
resizeObserver.observe(canvasContainer)
resizeScene()

// // =============================
// // ATMOSPHERE
// // =============================

// const glowGeometry = new THREE.SphereGeometry(52,64,64)

// const glowMaterial = new THREE.MeshBasicMaterial({
//   color:0x4da6ff,
//   transparent:true,
//   opacity:0.15
// })

// const atmosphere = new THREE.Mesh(glowGeometry, glowMaterial)

// scene.add(atmosphere)

// =============================
// LIGHTING
// =============================

// // Sunlight
// const sunLight = new THREE.DirectionalLight(0xffffff, 1.2)
// sunLight.position.set(100,10,0)
// scene.add(sunLight)

// soft ambient light
const ambient = new THREE.AmbientLight(0x333333)
scene.add(ambient)

// =============================
// CONSTELLATION ORBITS
// =============================

const orbitGroup = new THREE.Group()
scene.add(orbitGroup)

function buildConstellationOrbits() {

    console.log("Building constellation orbits...");
    console.log("Satellite counts:", constellationCounts);
    console.log("Configurations:", configs);

    if (!constellationCounts) {
        console.error("No constellation counts available!");
        return;
    }

    // ---------------------------------
    // 1. CLEAR EXISTING ORBITAL POPULATIONS
    // ---------------------------------

    while (orbitGroup.children.length > 0) {

        const oldGroup = orbitGroup.children[0];

        oldGroup.traverse(obj => {

            obj.geometry?.dispose();

            if (Array.isArray(obj.material)) {
                obj.material.forEach(m => m.dispose());
            } else {
                obj.material?.dispose();
            }
        });

        orbitGroup.remove(oldGroup);
    }

    // Store every orbital plane here for the animation loop
    orbitGroup.userData.animatedPlanes = [];

    // Store shell groups for visibility controls
    orbitGroup.userData.shellGroups = {};   

    // ---------------------------------
    // 2. ITERATE THROUGH CONSTELLATIONS
    // ---------------------------------

    configs.forEach(config => {

        // Initialize shell group entries for this constellation
        orbitGroup.userData.shellGroups[config.name] = {};

        const totalSatellites =
            constellationCounts[config.name] || 0;

        if (totalSatellites <= 0) return;

        // ---------------------------------
        // 3. ALLOCATE SATELLITES TO SHELLS
        // ---------------------------------

        const shells = config.shells;

        if (!Array.isArray(shells) || shells.length === 0) {
            console.error(
                `${config.name}: missing or invalid shells configuration`,
                config
            );
            return;
        }

        const totalPercent = shells.reduce(
            (sum, shell) => sum + shell.percent,
            0
        );

        if (totalPercent <= 0) {
            console.warn(`${config.name}: invalid shell percentages`);
            return;
        }

        if (Math.abs(totalPercent - 100) > 0.01) {
            console.warn(
                `${config.name}: shell percentages sum to ${totalPercent}%, not 100%. Normalizing.`
            );
        }

        // Largest-remainder allocation:
        // guarantees shell counts sum exactly to totalSatellites.

        const allocations = shells.map(shell => {

            const exactCount =
                totalSatellites * shell.percent / totalPercent;

            return {
                shell,
                count: Math.floor(exactCount),
                remainder: exactCount - Math.floor(exactCount)
            };
        });

        let remaining =
            totalSatellites -
            allocations.reduce((sum, item) => sum + item.count, 0);

        const rankedAllocations = [...allocations].sort(
            (a, b) => b.remainder - a.remainder
        );

        for (let i = 0; i < remaining; i++) {
            rankedAllocations[i].count++;
        }

        // ---------------------------------
        // 4. BUILD EACH SHELL
        // ---------------------------------

        allocations.forEach(allocation => {

            const shell = allocation.shell;
            const shellSatellites = allocation.count;

            if (shellSatellites <= 0) return;

            const planeCount = shell.planes;

            if (!Number.isInteger(planeCount) || planeCount < 1) {
                console.warn(
                    `${config.name} ${shell.name}: invalid plane count`
                );
                return;
            }

            const inclination =
                THREE.MathUtils.degToRad(shell.inclinationDeg);

            const orbitalRate =
                calculateOrbitalRate(shell.altitudeKm);

            const nodalRate =
                calculateNodalPrecessionRate(
                    shell.altitudeKm,
                    shell.inclinationDeg
                );

            // ---------------------------------
            // 5. CREATE SHELL GROUP
            // ---------------------------------

            const shellGroup = new THREE.Group();

            // Apply the user's current visibility selection
            shellGroup.visible =
                orbitVisibility[config.name]?.[shell.name] ?? true;

            orbitGroup.add(shellGroup);

            // Save a reference so the UI can toggle this shell
            orbitGroup.userData.shellGroups[config.name][shell.name] = shellGroup;
            /* Conceptual look up functionality for visualization settings:
            orbitGroup.userData.shellGroups = {
                Starlink: {
                    Starlink_G1_Group1: shellGroup1,
                    Starlink_G2A_Group6: shellGroup2
                },
                AmazonLeo: {
                    Kuiper_KP1-C: shellGroup3
                }
            };
            */

            // Avoid empty orbital planes when there are
            // fewer satellites than configured planes.
            const activePlaneCount = Math.min(
                planeCount,
                shellSatellites
            );

            const baseCount = Math.floor(
                shellSatellites / activePlaneCount
            );

            const remainder =
                shellSatellites % activePlaneCount;

            // ---------------------------------
            // 6. BUILD EACH ORBITAL PLANE
            // ---------------------------------

            for (let p = 0; p < activePlaneCount; p++) {

                const satellitesInPlane =
                    baseCount + (p < remainder ? 1 : 0);

                // RAAN group: distributes planes around Earth's Y axis
                const raanGroup = new THREE.Group();

                const raanOffset =
                    THREE.MathUtils.degToRad(shell.raanOffset ?? 0);

                const raan =
                    raanOffset +
                    (2 * Math.PI * p) / activePlaneCount;

                raanGroup.rotation.y = raan;

                // Inclination group: tilts the orbital plane
                const inclinationGroup = new THREE.Group();

                inclinationGroup.rotation.x = inclination;

                // ---------------------------------
                // 7. GENERATE SATELLITE POSITIONS
                // ---------------------------------

                const positions = [];

                // Stagger adjacent orbital planes by a fraction
                // of the in-plane satellite spacing.
                // Defaults to 0.7 if phaseFraction undefined in configs
                // @notes: 0.5 and 1.0 just seem to change periodicity of 
                // polar convergence, but a "prime-ish" value removes
                // visual periodicity
                const phaseFraction = shell.phaseFraction ?? 0.7;

                const satelliteSpacing =
                    (2 * Math.PI) / satellitesInPlane;

                const planePhaseOffset =
                    p * phaseFraction * satelliteSpacing;

                for (let s = 0; s < satellitesInPlane; s++) {

                    const angle =
                        (2 * Math.PI * s) / satellitesInPlane
                        + planePhaseOffset;

                    positions.push(
                        Math.cos(angle) * shell.visualRadius,
                        0,
                        -Math.sin(angle) * shell.visualRadius
                    );
                }

                const geometry = new THREE.BufferGeometry();

                geometry.setAttribute(
                    "position",
                    new THREE.Float32BufferAttribute(positions, 3)
                );

                const material = new THREE.PointsMaterial({
                    color: config.color,
                    size: satSize,
                    sizeAttenuation: true
                });

                const satellites = new THREE.Points(
                    geometry,
                    material
                );

                // ---------------------------------
                // 8. ASSEMBLE THE GROUP HIERARCHY
                // ---------------------------------

                inclinationGroup.add(satellites);
                raanGroup.add(inclinationGroup);
                shellGroup.add(raanGroup);

                // Save the parameters for animation
                raanGroup.userData = {
                    constellation: config.name,
                    shell: shell.name,
                    altitudeKm: shell.altitudeKm,
                    orbitalRate,
                    nodalRate,
                    satellites
                };

                orbitGroup.userData.animatedPlanes.push(
                    raanGroup
                );
            }

            console.log(
                `${config.name} | ${shell.name}: ` +
                `${shellSatellites} satellites, ` +
                `${activePlaneCount}/${planeCount} populated planes, ` +
                `${calculateOrbitalPeriod(shell.altitudeKm).toFixed(2)} hour period`
            );
        });

        console.log(
            `${config.name}: ${totalSatellites} total satellites`
        );
    });
}


const testOrbit = new THREE.Group();
testOrbit.rotation.y = THREE.MathUtils.degToRad(90);
scene.add(testOrbit);
let testSatellites = null;

function testConstellationOrbits() {

    const testInclination = new THREE.Group();
    testInclination.rotation.x =
        THREE.MathUtils.degToRad(52);

    const positions = [];

    for (let s = 0; s < 24; s++) {

        const angle = 2 * Math.PI * s / 24;

        positions.push(
            150 * Math.cos(angle),
            0,
            -150 * Math.sin(angle)
        );
    }

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3)
    );

    const material = new THREE.PointsMaterial({
        color: 0x4da6ff,
        size: 5
    });

    testSatellites = new THREE.Points(
        geometry,
        material
    );

    testInclination.add(testSatellites);
    testOrbit.add(testInclination);
}

// =============================
// ANIMATION LOOP
// =============================

function animate() {

    requestAnimationFrame(animate);

    // Background stars 
    stars.rotation.y += 0.0004;
    stars.rotation.x += 0.00015;
    backgroundRenderer.render(
        backgroundScene,
        backgroundCamera
    );

    // Earth rotates around its north-south axis
    earth.rotation.y += EARTH_ROTATION_RATE;

    // Update every orbital plane
    orbitGroup.userData.animatedPlanes?.forEach(raanGroup => {

        // Satellites orbit within their inclined plane
        raanGroup.userData.satellites.rotation.y +=
            raanGroup.userData.orbitalRate/SATELLITE_SPEED_SCALAR;

        // Entire orbital plane slowly precesses around Earth's Y axis
        raanGroup.rotation.y +=
            raanGroup.userData.nodalRate/SATELLITE_SPEED_SCALAR;
    });

    // Test
    // if (testSatellites) {
    //     testSatellites.rotation.y += 0.001;
    // }

    // Camera
    camera.position.x = Math.sin(Date.now() * 0.0001) * 10;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

renderConstellationLegend();
renderOrbitControls();
animate();
loadData().catch(error => {
    console.error("Error loading satellite data:", error);
});
