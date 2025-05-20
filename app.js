let scene;
let camera;
let renderer;
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

let earthmesh, cloudmesh, starmesh;

function main() {
    const canvas = document.getElementById('c');
    renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
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

    // Add mouse events
    canvas.addEventListener('mousedown', e => {
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    canvas.addEventListener('mouseup', () => {
        isDragging = false;
    });

    canvas.addEventListener('mousemove', e => {
        if (!isDragging) return;

        const deltaMove = {
            x: e.clientX - previousMousePosition.x,
            y: e.clientY - previousMousePosition.y
        };

        const rotationSpeed = 0.005;
        earthmesh.rotation.y += deltaMove.x * rotationSpeed;
        earthmesh.rotation.x += deltaMove.y * rotationSpeed;

        cloudmesh.rotation.y += deltaMove.x * rotationSpeed;
        cloudmesh.rotation.x += deltaMove.y * rotationSpeed;

        previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    animate();
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
