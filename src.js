let constellationCounts = null;
let earthRadius = 120;
let satSize     = 2;
let configs = [
    {
        name: "Starlink",
        color: 0x4da6ff,
        visualRadius: 120,
        altitudeKm: 550,
        inclinationDeg: 53,
        planes: 72
    },
    {
        name: "AmazonLeo",
        color: 0xffb347,
        visualRadius: 126,
        altitudeKm: 629.5,
        inclinationDeg: 51.9,
        planes: 24
    },
    {
        name: "Qianfan",
        color: 0xff5c5c,
        visualRadius: 140,
        altitudeKm: 1069,
        inclinationDeg: 89,
        planes: 16
    },
    {
        name: "Guowang",
        color: 0x5cff9d,
        visualRadius: 145,
        altitudeKm: 1110,
        inclinationDeg: 86.5,
        planes: 16
    }
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
const earthNight = textureLoader.load("./textures/nasa_blue_marble_night.png")

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

// sunlight
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

    if (!constellationCounts) return;

    // Clear existing orbital populations
    while (orbitGroup.children.length > 0) {

        const raanGroup = orbitGroup.children[0];

        raanGroup.traverse(obj => {
            obj.geometry?.dispose();

            if (Array.isArray(obj.material)) {
                obj.material.forEach(m => m.dispose());
            } else {
                obj.material?.dispose();
            }
        });

        orbitGroup.remove(raanGroup);
    }

    configs.forEach(config => {

        const totalSatellites =
            constellationCounts[config.name] || 0;

        if (totalSatellites <= 0) return;

        const planeCount = config.planes;

        const inclination =
            THREE.MathUtils.degToRad(config.inclinationDeg);

        const periodHours =
            calculateOrbitalPeriod(config.altitudeKm);

        const orbitalRate =
            calculateOrbitalRate(config.altitudeKm);

        const nodalRate =
            calculateNodalPrecessionRate(
                config.altitudeKm,
                config.inclinationDeg
            );

        // Distribute satellites evenly among planes
        const baseCount =
            Math.floor(totalSatellites / planeCount);

        const remainder =
            totalSatellites % planeCount;

        for (let p = 0; p < planeCount; p++) {

            const satellitesInPlane =
                baseCount + (p < remainder ? 1 : 0);

            if (satellitesInPlane === 0) continue;

            // ---------------------------------
            // 1. RAAN GROUP
            // ---------------------------------

            const raanGroup = new THREE.Group();

            const raan =
                (2 * Math.PI * p) / planeCount;

            raanGroup.rotation.y = raan;

            // ---------------------------------
            // 2. INCLINATION GROUP
            // ---------------------------------

            const inclinationGroup = new THREE.Group();

            inclinationGroup.rotation.x = inclination;

            // ---------------------------------
            // 3. SATELLITE POSITIONS
            // ---------------------------------

            const positions = [];

            for (let s = 0; s < satellitesInPlane; s++) {

                const angle =
                    (2 * Math.PI * s) / satellitesInPlane;

                // Circular orbit in local XZ plane
                const x =
                    Math.cos(angle) * config.visualRadius;

                const y = 0;

                const z =
                    -Math.sin(angle) * config.visualRadius;

                positions.push(x, y, z);
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

            const satellites =
                new THREE.Points(geometry, material);

            // Build the hierarchy
            inclinationGroup.add(satellites);
            raanGroup.add(inclinationGroup);
            orbitGroup.add(raanGroup);

            // Save animation parameters
            raanGroup.userData = {
                name: config.name,
                orbitalRate,
                nodalRate,
                satellites,
                altitudeKm: config.altitudeKm,
                periodHours
            };
        }

        console.log(
            `${config.name}: ${totalSatellites} satellites, ` +
            `${planeCount} planes, ` +
            `${periodHours.toFixed(2)} hour period`
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
    orbitGroup.children.forEach(raanGroup => {

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
