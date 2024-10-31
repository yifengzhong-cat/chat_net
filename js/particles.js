let scene, camera, renderer, particles;

function initParticles() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('particle-canvas'),
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 创建彩色粒子
    const geometry = new THREE.BufferGeometry();
    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount * 3; i += 3) {
        // 位置
        positions[i] = Math.random() * 2000 - 1000;
        positions[i + 1] = Math.random() * 2000 - 1000;
        positions[i + 2] = Math.random() * 2000 - 1000;

        // 颜色
        colors[i] = Math.random();
        colors[i + 1] = Math.random();
        colors[i + 2] = Math.random();

        // 大小
        sizes[i / 3] = Math.random() * 5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
        size: 4,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.z = 1000;

    // 添加鼠标交互
    document.addEventListener('mousemove', onMouseMove);

    animate();
}

let mouseX = 0;
let mouseY = 0;

function onMouseMove(event) {
    mouseX = (event.clientX - window.innerWidth / 2) * 0.5;
    mouseY = (event.clientY - window.innerHeight / 2) * 0.5;
}

function animate() {
    requestAnimationFrame(animate);

    // 粒子动画
    particles.rotation.x += 0.0005;
    particles.rotation.y += 0.0005;

    // 根据鼠标位置调整粒子位置
    particles.rotation.x += (mouseY * 0.00001);
    particles.rotation.y += (mouseX * 0.00001);

    // 颜色动画
    const colors = particles.geometry.attributes.color.array;
    for (let i = 0; i < colors.length; i += 3) {
        colors[i] = Math.sin(Date.now() * 0.001 + i) * 0.5 + 0.5;
        colors[i + 1] = Math.sin(Date.now() * 0.002 + i) * 0.5 + 0.5;
        colors[i + 2] = Math.sin(Date.now() * 0.003 + i) * 0.5 + 0.5;
    }
    particles.geometry.attributes.color.needsUpdate = true;

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}); 