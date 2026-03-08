let constellationCounts = null;

// =============================
// DATA LOADING
// =============================

async function loadData() {

    const response = await fetch("https://raw.githubusercontent.com/djfitz3999/megaconstellation_dashboard/data/data/satellite_counts.json?cache=" + Date.now());
    const data = await response.json();

    constellationCounts = {
        Starlink: data.constellations.Starlink.total_in_orbit,
        Kuiper: data.constellations.Kuiper.total_in_orbit,
        Qianfan: data.constellations.Qianfan.total_in_orbit,
        Guowang: data.constellations.Guowang.total_in_orbit
    };

    animateCounter("starlink-count", constellationCounts.Starlink);
    animateCounter("kuiper-count", constellationCounts.Kuiper);
    animateCounter("qianfan-count", constellationCounts.Qianfan);
    animateCounter("guowang-count", constellationCounts.Guowang);

    document.getElementById("lastUpdate").textContent =
        formatEasternTime(data.last_updated_utc);

    updateTimers(data.last_updated_utc);

    buildConstellationOrbits();   // build visualization
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

loadData();

// =============================
// THREE.JS SCENE
// =============================

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("starfield"),
  alpha: true
})

renderer.setSize(window.innerWidth, window.innerHeight)

camera.position.z = 260

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

const earthGeometry = new THREE.SphereGeometry(50, 64, 64)

const earthMaterial = new THREE.MeshPhongMaterial({
    map: earthDay,
    emissiveMap: earthNight,
    emissive: new THREE.Color(0xffffff),
    emissiveIntensity: 0.6
})

const earth = new THREE.Mesh(earthGeometry, earthMaterial)

scene.add(earth)

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
// STARFIELD
// =============================

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
scene.add(stars)

// =============================
// CONSTELLATION ORBITS
// =============================

const orbitGroup = new THREE.Group()
scene.add(orbitGroup)

function buildConstellationOrbits() {

    if (!constellationCounts) return;

    const configs = [
        { name:"Starlink", color:0x4da6ff, radius:90 },
        { name:"Kuiper",   color:0xffb347, radius:105 },
        { name:"Qianfan",  color:0xff5c5c, radius:150 },
        { name:"Guowang",  color:0x5cff9d, radius:180 }
    ];

    configs.forEach(config => {

        const realCount = constellationCounts[config.name] || 0;

        // scale real satellites down to visual points
        const visualCount = Math.max(10, Math.floor(realCount / 100));

        const geometry = new THREE.BufferGeometry();
        const positions = [];

        for (let i = 0; i < visualCount; i++) {

            const angle = Math.random() * Math.PI * 2;
            const inclination = Math.random() * Math.PI
            const node = Math.random() * Math.PI * 2
            const x = Math.cos(angle) * config.radius
            const z = Math.sin(angle) * config.radius
            const y = (Math.random() - 0.5) * 30

            // rotate orbit plane
            const pos = new THREE.Vector3(x,y,z)

            pos.applyAxisAngle(new THREE.Vector3(1,0,0), inclination)
            pos.applyAxisAngle(new THREE.Vector3(0,1,0), node)

            positions.push(pos.x,pos.y,pos.z)
        }

        geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(positions, 3)
        );

        const material = new THREE.PointsMaterial({
            color: config.color,
            size: 2
        });

        const points = new THREE.Points(geometry, material);

        points.userData = {
            speed: 0.0002 + Math.random() * 0.0003
        };

        orbitGroup.add(points);
    });
}

// =============================
// ANIMATION LOOP
// =============================

function animate() {

  requestAnimationFrame(animate)

  earth.rotation.y += 0.0006;
//   atmosphere.rotation.y += 0.0006;
  stars.rotation.y += 0.0004;
  stars.rotation.x += 0.00015;

  orbitGroup.children.forEach(orbit => {
      orbit.rotation.y += orbit.userData.speed
      orbit.rotation.x += orbit.userData.speed * 0.2
  })

  camera.position.x = Math.sin(Date.now() * 0.0001) * 10
  camera.lookAt(scene.position)

  renderer.render(scene, camera)
}

animate()