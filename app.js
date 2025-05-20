let scene;
let camera;
let renderer;
let isDragging = false;
let previousPosition = { x: 0, y: 0 };
let earthmesh, cloudmesh, starmesh;

function main() {
    const canvas = document.getElementById('c');
    renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 2;

    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    renderer.autoClear = false;
    renderer.setClearColor(0x000000, 0.0);

    // Earth
    const earthgeometry = new THREE.SphereGeometry(0.6, 32, 32);
    const earthmaterial = new THREE.MeshPhongMaterial({
        roughness: 1,
        metalness: 0,
        map: new THREE.TextureLoader().load('texture/earthmap1k.jpg'),
        bumpMap: new THREE.TextureLoader().load('texture/earthbump.jpg'),
        bumpScale: 0.3,
    });
    earthmesh = new THREE.Mesh(earthgeometry, earthmaterial);
    scene.add(earthmesh);

    // Cloud
    const cloudgeometry = new THREE.SphereGeometry(0.63, 32, 32);
    const cloudmaterial = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('texture/earthCloud.png'),
        transparent: true
    });
    cloudmesh = new THREE.Mesh(cloudgeometry, cloudmaterial);
    scene.add(cloudmesh);

    // Stars
    const stargeometry = new THREE.SphereGeometry(80, 64, 64);
    const starmaterial = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('texture/galaxy.png'),
        side: THREE.BackSide
    });
    starmesh = new THREE.Mesh(stargeometry, starmaterial);
    scene.add(starmesh);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.2));
    const pointLight = new THREE.PointLight(0xffffff, 0.9);
    pointLight.position.set(5, 3, 5);
    scene.add(pointLight);

    // Mouse events
    canvas.addEventListener('mousedown', e => {
        isDragging = true;
        previousPosition = { x: e.clientX, y: e.clientY };
    });

    canvas.addEventListener('mouseup', () => {
        isDragging = false;
    });

    canvas.addEventListener('mousemove', e => {
        if (!isDragging) return;
        rotateFromInput(e.clientX, e.clientY);
    });

    // Touch events
    canvas.addEventListener('touchstart', e => {
        isDragging = true;
        if (e.touches.length === 1) {
            previousPosition = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
        }
    }, { passive: false });

    canvas.addEventListener('touchend', () => {
        isDragging = false;
    });

    canvas.addEventListener('touchmove', e => {
        if (!isDragging || e.touches.length !== 1) return;
        e.preventDefault(); // prevent scrolling
        rotateFromInput(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: false });

    animate();
}

function rotateFromInput(currentX, currentY) {
    const deltaMove = {
        x: currentX - previousPosition.x,
        y: currentY - previousPosition.y
    };

    const rotationSpeed = 0.005;
    earthmesh.rotation.y += deltaMove.x * rotationSpeed;
    earthmesh.rotation.x += deltaMove.y * rotationSpeed;

    cloudmesh.rotation.y += deltaMove.x * rotationSpeed;
    cloudmesh.rotation.x += deltaMove.y * rotationSpeed;

    previousPosition = { x: currentX, y: currentY };
}

function animate() {
    requestAnimationFrame(animate);

    if (!isDragging) {
        earthmesh.rotation.y -= 0.0015;
        cloudmesh.rotation.y += 0.0015;
        starmesh.rotation.y += 0.0005;
    }

    renderer.render(scene, camera);
}

window.onload = main;
