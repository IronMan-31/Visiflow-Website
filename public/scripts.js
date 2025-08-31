// Import GSAP and ScrollTrigger
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;

// Import Three.js
const THREE = window.THREE;

// GSAP Registration
gsap.registerPlugin(ScrollTrigger);

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initHero();
  initHeader();
  initPortfolio();
  initBlog();
  initFooter();
  initThreeJS();
});

// Hero Section Initialization
function initHero() {
  const heroTitle = document.querySelector(".hero-title");

  if (!heroTitle) return;
  const heroSubtitle = document.querySelector(".hero-subtitle");
  const heroButton = document.querySelector(".hero-button");

  // Split title into individual words for animation
  const words = heroTitle.querySelectorAll(".hero-word");

  // Create timeline for hero animations
  const tl = gsap.timeline();

  // Animate title words with stagger
  words.forEach((word, index) => {
    const span = word.querySelector("span") || word;
    gsap.set(span, { y: 100, opacity: 0 });

    tl.to(
      span,
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
      },
      index * 0.1
    );
  });

  // Animate subtitle
  tl.to(
    heroSubtitle,
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out",
    },
    "-=0.6"
  );

  // Animate button
  tl.to(
    heroButton,
    {
      scale: 1,
      opacity: 1,
      duration: 0.8,
      ease: "elastic.out(1, 0.5)",
    },
    "-=0.5"
  );

  // Add hover effects
  heroButton.addEventListener("mouseenter", () => {
    gsap.to(heroButton, { scale: 1.05, duration: 0.3 });
  });

  heroButton.addEventListener("mouseleave", () => {
    gsap.to(heroButton, { scale: 1, duration: 0.3 });
  });

  // Smooth scroll to portfolio on button click
  heroButton.addEventListener("click", () => {
    document.querySelector("#portfolio").scrollIntoView({
      behavior: "smooth",
    });
  });
}

// Header Animation
function initHeader() {
  const header = document.querySelector(".header");

  // Animate header in after delay
  gsap.to(header, {
    y: 0,
    opacity: 1,
    duration: 1,
    ease: "power3.out",
    delay: 2,
  });

  // Add hover effects to CTA button
  const ctaButton = document.querySelector(".cta-button");
  ctaButton.addEventListener("mouseenter", () => {
    gsap.to(ctaButton, { scale: 1.05, duration: 0.3 });
  });

  ctaButton.addEventListener("mouseleave", () => {
    gsap.to(ctaButton, { scale: 1, duration: 0.3 });
  });
}

// Portfolio Section Animation
function initPortfolio() {
  const projectCards = document.querySelectorAll(".project-card");

  // Animate project cards on scroll
  projectCards.forEach((card, index) => {
    gsap.to(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
      y: 0,
      opacity: 1,
      duration: 0.5,
      delay: index * 0.1,
      ease: "power3.out",
    });
  });

  // Add hover effects for project cards
  projectCards.forEach((card) => {
    const img = card.querySelector("img");
    const overlay = card.querySelector(".project-overlay");
    const info = card.querySelector(".project-info");

    card.addEventListener("mouseenter", () => {
      gsap.to(img, { scale: 1.1, duration: 0.5 });
      gsap.to(overlay, { opacity: 1, duration: 0.5 });
      gsap.to(info, { y: 0, opacity: 1, duration: 0.5 });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(img, { scale: 1, duration: 0.5 });
      gsap.to(overlay, { opacity: 0, duration: 0.5 });
      gsap.to(info, { y: 16, opacity: 0, duration: 0.5 });
    });
  });
}

// Blog Section Animation
function initBlog() {
  const blogTitle = document.querySelector(".blog-title");
  const blogPosts = document.querySelectorAll(".blog-post");

  // Animate blog title
  gsap.to(blogTitle, {
    scrollTrigger: {
      trigger: blogTitle,
      start: "top 80%",
    },
    y: 0,
    opacity: 1,
    duration: 1,
    ease: "power3.out",
  });

  // Animate blog posts
  gsap.to(blogPosts, {
    scrollTrigger: {
      trigger: ".blog-grid",
      start: "top 80%",
    },
    y: 0,
    opacity: 1,
    stagger: 0.2,
    duration: 0.8,
    ease: "power3.out",
  });

  // Add hover effects to read more links
  const readMoreLinks = document.querySelectorAll(".blog-read-more");
  readMoreLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      gsap.to(link, { x: 4, duration: 0.3 });
    });

    link.addEventListener("mouseleave", () => {
      gsap.to(link, { x: 0, duration: 0.3 });
    });
  });
}

// Footer Animation
function initFooter() {
  const footerCta = document.querySelector(".footer-cta");

  // Add hover effect to footer CTA
  footerCta.addEventListener("mouseenter", () => {
    gsap.to(footerCta, { scale: 1.05, duration: 0.3 });
  });

  footerCta.addEventListener("mouseleave", () => {
    gsap.to(footerCta, { scale: 1, duration: 0.3 });
  });
}

// Three.js Scene Setup
function initThreeJS() {
  // Hero Canvas Scene
  const heroCanvas = document.getElementById("hero-canvas");
  if (heroCanvas) {
    // setupAdvancedHeroScene(heroCanvas);
  }

  // Footer Canvas Scene
  const footerCanvas = document.getElementById("footer-canvas");
  if (footerCanvas) {
    // setupAdvancedFooterScene(footerCanvas);
  }
}

// Advanced Hero Three.js Scene with fluid simulation
function setupAdvancedHeroScene(canvas) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Create advanced particle system with custom shader
  const particleCount = 50000;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  // Initialize particles in a torus knot formation
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    const t = (i / particleCount) * Math.PI * 2 * 10;
    const radius = 2 + Math.sin(t * 3) * 0.5;

    positions[i3] = radius * Math.cos(t) + (Math.random() - 0.5) * 0.5;
    positions[i3 + 1] = Math.sin(t * 2) * 0.8 + (Math.random() - 0.5) * 0.5;
    positions[i3 + 2] = radius * Math.sin(t) + (Math.random() - 0.5) * 0.5;

    // Color gradient based on position
    const hue =
      (Math.atan2(positions[i3 + 2], positions[i3]) + Math.PI) / (Math.PI * 2);
    const color1 = new THREE.Color().setHSL(hue * 0.3 + 0.6, 0.8, 0.6);
    colors[i3] = color1.r;
    colors[i3 + 1] = color1.g;
    colors[i3 + 2] = color1.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  // Custom shader material for particles
  const particleMaterial = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vColor;
      uniform float uTime;
      uniform float uSize;

      void main() {
          vColor = color;   
          vec3 pos = position;
          
          // Add wave motion
          pos.y += sin(uTime * 2.0 + pos.x * 0.5) * 0.1;
          pos.x += cos(uTime * 1.5 + pos.z * 0.3) * 0.05;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = uSize * (300.0 / -mvPosition.z);
      }
  `,
    fragmentShader: `
      varying vec3 vColor;
      
      void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
          gl_FragColor = vec4(vColor, alpha * 0.8);
      }
  `,
    uniforms: {
      uTime: { value: 0 },
      uSize: { value: 2.0 },
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  const particles = new THREE.Points(geometry, particleMaterial);
  scene.add(particles);

  // Add ambient lighting
  const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
  scene.add(ambientLight);

  camera.position.z = 5;

  let time = 0;

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    time += 0.01;

    // Update shader uniforms
    particleMaterial.uniforms.uTime.value = time;

    // Rotate particle system
    particles.rotation.y += 0.002;
    particles.rotation.x += 0.001;

    renderer.render(scene, camera);
  }

  animate();

  // Handle resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// Advanced Footer Scene with glow effects
function setupAdvancedFooterScene(canvas) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Create glow plane with custom shader
  const glowGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
  const glowMaterial = new THREE.ShaderMaterial({
    vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
    fragmentShader: `
            varying vec2 vUv;
            uniform float uTime;
            uniform vec3 uColor1;
            uniform vec3 uColor2;

            float random(vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
            }

            float noise(vec2 st) {
                vec2 i = floor(st);
                vec2 f = fract(st);
                float a = random(i);
                float b = random(i + vec2(1.0, 0.0));
                float c = random(i + vec2(0.0, 1.0));
                float d = random(i + vec2(1.0, 1.0));
                vec2 u = f*f*(3.0-2.0*f);
                return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
            }

            void main() {
                vec2 uv = vUv;
                float t = uTime * 0.1;
                
                float n = noise(uv * 4.0 + t);
                float n2 = noise(uv * 2.0 - t * 0.5);
                
                float intensity = pow(0.02 / distance(uv, vec2(0.5)), 1.2);
                
                vec3 color = mix(uColor1, uColor2, n);
                color = mix(color, uColor1, n2);
                
                float glow = pow(abs(0.5 - uv.y) * 1.5, 2.0);
                
                gl_FragColor = vec4(color * glow * intensity, 0.6);
            }
        `,
    uniforms: {
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color(0x6a0dad) }, // Purple
      uColor2: { value: new THREE.Color(0x0000ff) }, // Blue
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
  });

  const glowPlane = new THREE.Mesh(glowGeometry, glowMaterial);
  glowPlane.rotation.x = -Math.PI / 2;
  glowPlane.position.y = -2;
  scene.add(glowPlane);

  // Add floating orbs with glow
  const orbGeometry = new THREE.SphereGeometry(0.3, 16, 16);
  const orbs = [];

  for (let i = 0; i < 8; i++) {
    const orbMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(i * 0.1 + 0.6, 0.8, 0.6),
      transparent: true,
      opacity: 0.4,
    });

    const orb = new THREE.Mesh(orbGeometry, orbMaterial);
    orb.position.set(
      (Math.random() - 0.5) * 15,
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 8
    );

    // Store initial position and animation parameters
    orb.userData = {
      initialY: orb.position.y,
      speed: 0.5 + Math.random() * 0.5,
      amplitude: 1 + Math.random() * 2,
    };

    scene.add(orb);
    orbs.push(orb);
  }

  camera.position.z = 8;
  camera.position.y = 2;

  let time = 0;

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    time += 0.01;

    // Update glow shader
    glowMaterial.uniforms.uTime.value = time;

    // Animate orbs
    orbs.forEach((orb, index) => {
      const userData = orb.userData;
      orb.position.y =
        userData.initialY +
        Math.sin(time * userData.speed + index) * userData.amplitude;
      orb.rotation.x += 0.01;
      orb.rotation.y += 0.015;

      // Pulse opacity
      orb.material.opacity = 0.3 + Math.sin(time * 2 + index) * 0.2;
    });

    // Rotate glow plane
    glowPlane.rotation.z += 0.002;

    renderer.render(scene, camera);
  }

  animate();

  // Handle resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});
