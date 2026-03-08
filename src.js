async function loadData() {

    // const response = await fetch("data/satellite_counts.json");
    const response = await fetch("https://raw.githubusercontent.com/djfitz3999/megaconstellation_dashboard/data/data/satellite_counts.json?cache=" + Date.now());

    const data = await response.json();

    animateCounter("starlink-count",
        data.constellations.Starlink.total_in_orbit);

    animateCounter("kuiper-count",
        data.constellations.Kuiper.total_in_orbit);

    animateCounter("qianfan-count",
        data.constellations.Qianfan.total_in_orbit);

    animateCounter("guowang-count",
        data.constellations.Guowang.total_in_orbit);

    document.getElementById("lastUpdate").textContent =
       formatEasternTime(data.last_updated_utc);

    updateTimers(data.last_updated_utc);

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

    // Math conversions
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    document.getElementById('nextUpdate').textContent = `${days}d ${hours}h ${mins}m`;
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

function updateData() {

  window.open(
    "https://github.com/djfitz3999/megaconstellation_dashboard/actions/workflows/update_counts.yml",
    "_blank"
  );

}

document.getElementById('update-btn').onclick = updateData;

loadData();


// Three.js Starfield
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

const starGeometry = new THREE.BufferGeometry()
const starCount = 2000

const positions = []

for (let i = 0; i < starCount; i++) {

  positions.push(
    (Math.random() - 0.5) * 1000,
    (Math.random() - 0.5) * 1000,
    (Math.random() - 0.5) * 1000
  )
}

starGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(positions, 3)
)

const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 1
})

const stars = new THREE.Points(starGeometry, starMaterial)

scene.add(stars)

camera.position.z = 5

function animate() {

  requestAnimationFrame(animate)

  stars.rotation.y += 0.0005
  stars.rotation.x += 0.0002

  renderer.render(scene, camera)

}

animate()