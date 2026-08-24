(() => {
  const field = document.querySelector(".concept-field");
  const canvas = field?.querySelector(".concept-field-canvas");
  if (!field || !canvas) return;

  const context = canvas.getContext("2d");
  if (!context) return;

  const nodes = [
    ["latent-field", .72, .18, "questions ideas"],
    ["hyperobject", .9, .12, "questions library"],
    ["language", .63, .39, "ideas library"],
    ["projection", .84, .34, "questions ideas"],
    ["transformation", .75, .53, "ideas work"],
    ["interpretation", .93, .49, "questions library"],
    ["shared-environment", .58, .64, "work now"],
    ["structure", .82, .68, "work ideas now"],
    ["convergence", .68, .81, "questions work"],
    ["divergence", .91, .77, "questions now"],
    ["variation", .55, .89, "work now"],
    ["selection", .78, .91, "work library"],
    ["context", .44, .75, "ideas now"],
    ["inquiry", .94, .91, "questions ideas library"],
  ].map((item, index) => ({
    id: item[0],
    x: item[1],
    y: item[2],
    lenses: item[3].split(" "),
    index,
    px: 0,
    py: 0,
    vx: 0,
    vy: 0,
    activity: 0,
  }));

  const connections = [
    [0, 1], [0, 2], [0, 3], [2, 3], [2, 4], [2, 6], [4, 5],
    [5, 12], [6, 7], [7, 8], [7, 9], [8, 11], [9, 10],
    [10, 11], [11, 12], [12, 13], [13, 9],
  ];
  const particles = Array.from({ length: 76 }, (_, index) => {
    const random = (offset) => {
      const value = Math.sin((index + 1) * (91.19 + offset)) * 43758.5453;
      return value - Math.floor(value);
    };
    return {
      x: random(0),
      y: random(7),
      depth: .18 + random(17) * .82,
      phase: random(29) * Math.PI * 2,
    };
  });
  const blobs = [
    { x: .68, y: .24, size: .34, color: [25, 86, 102], speed: .00011 },
    { x: .88, y: .52, size: .42, color: [124, 54, 64], speed: .00008 },
    { x: .58, y: .78, size: .38, color: [40, 75, 112], speed: .000095 },
    { x: .94, y: .84, size: .3, color: [160, 73, 48], speed: .00013 },
  ];
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let width = 1;
  let height = 1;
  let lens = "";
  let pointer = null;
  let frame = 0;
  let visible = true;
  let firstLayout = true;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  function targetFor(node) {
    const marginX = Math.min(90, width * .08);
    const marginY = Math.min(72, height * .08);
    let x = marginX + node.x * (width - marginX * 2);
    let y = marginY + node.y * (height - marginY * 2);

    if (lens) {
      if (node.lenses.includes(lens)) {
        x += (width * .73 - x) * .18;
        y += (height * .51 - y) * .18;
      } else {
        x += (x - width * .73) * .1;
        y += (y - height * .51) * .1;
      }
    }

    return {
      x: clamp(x, marginX, width - marginX),
      y: clamp(y, marginY, height - marginY),
    };
  }

  function update() {
    nodes.forEach((node) => {
      const target = targetFor(node);
      if (firstLayout || reducedMotion.matches) {
        node.px = target.x;
        node.py = target.y;
        node.vx = 0;
        node.vy = 0;
        return;
      }

      node.vx += (target.x - node.px) * .0018;
      node.vy += (target.y - node.py) * .0018;

      if (pointer) {
        const dx = node.px - pointer.x;
        const dy = node.py - pointer.y;
        const distance = Math.max(1, Math.hypot(dx, dy));
        if (distance < 150) {
          const force = (150 - distance) / 150;
          node.vx += dx / distance * force * .055;
          node.vy += dy / distance * force * .055;
        }
      }

      node.vx *= .91;
      node.vy *= .91;
      node.px += node.vx;
      node.py += node.vy;
    });
    firstLayout = false;
  }

  function highlighted(node) {
    return Boolean(lens && node.lenses.includes(lens));
  }

  function draw(time = 0) {
    const motionTime = reducedMotion.matches ? 0 : time;
    const pointerX = pointer ? (pointer.x / width - .5) : 0;
    const pointerY = pointer ? (pointer.y / height - .5) : 0;
    const centerX = width * (.75 + pointerX * .025);
    const centerY = height * (.5 + pointerY * .025);
    context.clearRect(0, 0, width, height);
    const background = context.createRadialGradient(
      centerX, centerY, 12,
      centerX, centerY, Math.max(width, height) * .72,
    );
    background.addColorStop(0, "rgba(23,49,58,.18)");
    background.addColorStop(.48, "rgba(11,25,37,.1)");
    background.addColorStop(1, "rgba(5,8,17,0)");
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);

    context.save();
    context.globalCompositeOperation = "screen";
    blobs.forEach((blob, index) => {
      const driftX = Math.sin(motionTime * blob.speed + index * 1.7) * width * .055;
      const driftY = Math.cos(motionTime * blob.speed * .8 + index * 2.1) * height * .07;
      const x = width * blob.x + driftX + pointerX * width * (index % 2 ? -.025 : .04);
      const y = height * blob.y + driftY + pointerY * height * (index % 2 ? .035 : -.025);
      const radius = Math.max(width, height) * blob.size;
      const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
      const color = blob.color.join(",");
      gradient.addColorStop(0, "rgba(" + color + ",.2)");
      gradient.addColorStop(.42, "rgba(" + color + ",.09)");
      gradient.addColorStop(1, "rgba(" + color + ",0)");
      context.fillStyle = gradient;
      context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    });
    context.restore();

    particles.forEach((particle) => {
      const drift = reducedMotion.matches ? 0 : motionTime * .000004 * particle.depth;
      const x = ((particle.x + drift) % 1) * width - pointerX * 22 * particle.depth;
      const y = particle.y * height - pointerY * 18 * particle.depth +
        Math.sin(motionTime * .00022 + particle.phase) * 5 * particle.depth;
      context.globalAlpha = .08 + particle.depth * .28;
      context.fillStyle = particle.depth > .72 ? "#fff8ea" : "#9ec0c3";
      context.beginPath();
      context.arc(x, y, .35 + particle.depth * 1.15, 0, Math.PI * 2);
      context.fill();
    });
    context.globalAlpha = 1;
    update();

    connections.forEach(([fromIndex, toIndex]) => {
      const from = nodes[fromIndex];
      const to = nodes[toIndex];
      const emphasis = highlighted(from) && highlighted(to);
      context.beginPath();
      context.moveTo(from.px, from.py);
      context.lineTo(to.px, to.py);
      context.strokeStyle = emphasis
        ? "rgba(233,105,67,.38)"
        : "rgba(255,248,234,.035)";
      context.lineWidth = emphasis ? 1.1 : .65;
      context.stroke();
    });

    nodes.forEach((node) => {
      const emphasis = highlighted(node);
      const phase = Math.sin((node.index + 1) * 91.19) * 43758.5453;
      const pulse = reducedMotion.matches ? 0 : Math.sin(time * .001 + phase) * .65;
      const radius = Math.max(1.4, 2 + node.activity * 3.2 + (emphasis ? 2 : 0) + pulse);

      if (node.activity > .08 || emphasis) {
        const glow = context.createRadialGradient(node.px, node.py, 0, node.px, node.py, 48);
        glow.addColorStop(0, emphasis ? "rgba(233,105,67,.24)" : "rgba(255,178,118,.12)");
        glow.addColorStop(1, "rgba(233,105,67,0)");
        context.fillStyle = glow;
        context.beginPath();
        context.arc(node.px, node.py, 48, 0, Math.PI * 2);
        context.fill();
      }

      context.fillStyle = emphasis ? "#ff9b70" : "rgba(255,248,234,.46)";
      context.beginPath();
      context.arc(node.px, node.py, radius, 0, Math.PI * 2);
      context.fill();
    });
  }

  function setLens(nextLens) {
    lens = nextLens || "";
    if (reducedMotion.matches) draw();
  }

  function resize() {
    const bounds = field.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, bounds.width);
    height = Math.max(1, bounds.height);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    firstLayout = true;
    draw(performance.now());
  }

  function animate(time) {
    if (visible) draw(time);
    frame = requestAnimationFrame(animate);
  }

  field.addEventListener("pointermove", (event) => {
    const bounds = field.getBoundingClientRect();
    pointer = {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    };
    const shiftX = ((pointer.x / width) - .5) * -8;
    const shiftY = ((pointer.y / height) - .5) * -6;
    field.style.setProperty("--image-shift-x", shiftX + "px");
    field.style.setProperty("--image-shift-y", shiftY + "px");
  }, { passive: true });

  field.addEventListener("pointerleave", () => {
    pointer = null;
    field.style.setProperty("--image-shift-x", "0px");
    field.style.setProperty("--image-shift-y", "0px");
    setLens("");
  });

  field.querySelectorAll("[data-lens]").forEach((link) => {
    link.addEventListener("pointerenter", () => setLens(link.dataset.lens));
    link.addEventListener("focus", () => setLens(link.dataset.lens));
    link.addEventListener("blur", () => setLens(""));
  });

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  }, { threshold: .01 }).observe(field);

  const sectionObserver = new IntersectionObserver((entries) => {
    const current = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (current && ["questions", "work", "ideas", "library", "now"].includes(current.target.id)) {
      setLens(current.target.id);
    }
  }, { threshold: [.25, .5] });
  document.querySelectorAll("main > section").forEach((section) => sectionObserver.observe(section));

  fetch(field.dataset.presenceUrl)
    .then((response) => {
      if (!response.ok) throw new Error("Presence snapshot unavailable");
      return response.json();
    })
    .then((snapshot) => {
      snapshot.signals?.forEach((signal) => {
        signal.concepts?.forEach((id) => {
          const node = byId.get(id);
          if (node) node.activity = Math.min(1, node.activity + signal.intensity * .45);
        });
      });
      if (reducedMotion.matches) draw();
    })
    .catch(() => field.classList.add("presence-unavailable"));

  window.addEventListener("resize", resize, { passive: true });
  reducedMotion.addEventListener("change", () => {
    cancelAnimationFrame(frame);
    firstLayout = true;
    resize();
    if (!reducedMotion.matches) frame = requestAnimationFrame(animate);
  });

  resize();
  if (!reducedMotion.matches) frame = requestAnimationFrame(animate);
})();
