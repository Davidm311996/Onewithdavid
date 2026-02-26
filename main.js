document.addEventListener('DOMContentLoaded', () => {
  /* =========================================
     1. Custom Trailing Cursor 
  ========================================= */
  const cursorOutline = document.getElementById('cursor-outline');

  // Track mouse coordinates
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  // Track outline coordinates for trailing effect
  let outlineX = window.innerWidth / 2;
  let outlineY = window.innerHeight / 2;

  if (cursorOutline && window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Smooth animation for the outline trailing
    const animateCursor = () => {
      let distX = mouseX - outlineX;
      let distY = mouseY - outlineY;

      outlineX += distX * 0.15;
      outlineY += distY * 0.15;

      cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Hover interactions for the custom cursor
    const interactiveElements = document.querySelectorAll('a, button, .btn, .glass-panel');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorOutline.classList.add('hovering');
      });
      el.addEventListener('mouseleave', () => {
        cursorOutline.classList.remove('hovering');
      });
    });
  }

  /* =========================================
     2. Animated Canvas Background (Floating Bubbles)
  ========================================= */
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    const initCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', initCanvas);
    initCanvas();

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = Math.random() * 40 + 10; // Large bubbly sizes
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        // Techy colors: cyan, pink, purple
        const colors = ['rgba(0, 243, 255, 0.1)', 'rgba(255, 0, 200, 0.1)', 'rgba(157, 0, 255, 0.1)'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off walls
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
      }
    }

    for (let i = 0; i < 30; i++) {
      particles.push(new Particle());
    }

    const animateParticles = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateParticles);
    };
    animateParticles();
  }

  /* =========================================
     3. 3D Card Hover Effects (Tilt)
  ========================================= */
  const cards = document.querySelectorAll('.glass-panel');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element.
      const y = e.clientY - rect.top;  // y position within the element.

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10; // Max tilt 10deg
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });

  /* =========================================
     4. Typewriter 
  ========================================= */
  // Typewriter
  const texts = ["Full-Stack Architect", "Cinematic Light Bender", "Creative Technologist"];
  let count = 0;
  let index = 0;
  let currentText = "";
  let letter = "";
  let isDeleting = false;
  let typeSpeed = 100;

  const typeWriterElement = document.getElementById('typewriter');

  function type() {
    if (!typeWriterElement) return;

    if (count === texts.length) count = 0;
    currentText = texts[count];

    if (isDeleting) {
      letter = currentText.slice(0, --index);
    } else {
      letter = currentText.slice(0, ++index);
    }

    typeWriterElement.textContent = letter;
    typeSpeed = isDeleting ? 40 : 120;

    if (!isDeleting && letter.length === currentText.length) {
      typeSpeed = 2500;
      isDeleting = true;
    } else if (isDeleting && letter.length === 0) {
      isDeleting = false;
      count++;
      typeSpeed = 600;
    }
    setTimeout(type, typeSpeed);
  }
  type();
});
