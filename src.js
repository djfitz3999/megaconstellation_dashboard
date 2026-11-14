/* To debug in Chrome, hit F12 or Ctrl+Shift+J to see the console output in browser */

let constellationCounts = null;
let earthRadius = 120;
let satSize     = 2;
let configs = [
    {
        name: "Starlink",
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
                visualRadius: 122
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
        color: 0xff5c5c,
        shells: [
            {
                name: "Guowang_Nominal_86inc",
                percent: 30,
                altitudeKm: 1168,
                inclinationDeg: 86.5,
                planes: 16,
                visualRadius: 145
            },
            {
                name: "Guowang_Nominal_50inc",
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
        color: 0x5cff9d,
        shells: [
            {
                name: "OneWeb_Nominal",
                percent: 100,
                altitudeKm: 1200,
                inclinationDeg: 87.9,
                planes: 24,
                visualRadius: 147
            }
        ]
    },
];

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

const earthGeometry = new THREE.SphereGeometry(earthRadius, earthRadius, earthRadius)

const earthMaterial = new THREE.MeshPhongMaterial({
    map: earthDay,
    emissiveMap: earthNight,
    emissive: new THREE.Color(0xffffff),
    emissiveIntensity: 0.6
})

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

// Sunlight
const sunLight = new THREE.DirectionalLight(0xffffff, 1.2)
sunLight.position.set(200,100,100)

scene.add(sunLight)

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

    // ---------------------------------
    // 2. ITERATE THROUGH CONSTELLATIONS
    // ---------------------------------

    configs.forEach(config => {

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

            orbitGroup.add(shellGroup);

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

                const raan =
                    (2 * Math.PI * p) / activePlaneCount;

                raanGroup.rotation.y = raan;

                // Inclination group: tilts the orbital plane
                const inclinationGroup = new THREE.Group();

                inclinationGroup.rotation.x = inclination;

                // ---------------------------------
                // 7. GENERATE SATELLITE POSITIONS
                // ---------------------------------

                const positions = [];

                for (let s = 0; s < satellitesInPlane; s++) {

                    const angle =
                        (2 * Math.PI * s) / satellitesInPlane;

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

animate();
loadData().catch(error => {
    console.error("Error loading satellite data:", error);
});
