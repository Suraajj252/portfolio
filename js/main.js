/**
 * main.js
 * ----------------------------------------------------------------
 * Console runtime. Structured in four parts:
 *   1. Render layer      — reads the hash maps in data.js -> DOM
 *   2. Motion layer       — preloader, hero drop, reveals, cursor trail
 *   3. Telemetry layer    — scroll progress rail + active-section nav
 *   4. Chart layer        — Chart.js radar if available, else CSS bars
 *
 * GSAP / ScrollTrigger / Chart.js are optional. If ./lib/*.js hasn't
 * been supplied yet, every effect below degrades to a pure CSS/JS
 * equivalent so the console still runs immediately.
 * ----------------------------------------------------------------
 */

document.getElementById("year").textContent = new Date().getFullYear();

const HAS_GSAP = typeof window.gsap !== "undefined";
const HAS_SCROLLTRIGGER = HAS_GSAP && typeof window.ScrollTrigger !== "undefined";
const HAS_CHARTJS = typeof window.Chart !== "undefined";

if (HAS_SCROLLTRIGGER) gsap.registerPlugin(ScrollTrigger);

/* =========================================================================
 * 1. RENDER LAYER
 * ========================================================================= */

function renderSkills() {
  const grid = document.getElementById("skills-grid");
  const frag = document.createDocumentFragment();

  Object.values(SKILL_MAP).forEach((track) => {
    const card = document.createElement("div");
    card.className = "skill-card panel reveal";
    card.dataset.level = track.level;
    card.innerHTML = `
      <div class="skill-card__head">
        <span class="skill-card__label">${track.label}</span>
        <span class="skill-card__unit">${track.unit}</span>
      </div>
      <div class="skill-card__value" data-counter="0">0%</div>
      <div class="skill-bar-track"><div class="skill-bar-fill" data-fill></div></div>
      <div class="skill-card__items">
        ${track.items.map((i) => `<span class="skill-chip">${i}</span>`).join("")}
      </div>
    `;
    frag.appendChild(card);
  });
  grid.appendChild(frag);
}

function renderTimeline() {
  const log = document.getElementById("track-log");
  const entries = Object.values(TIMELINE_MAP).sort((a, b) => a.order - b.order);
  const frag = document.createDocumentFragment();

  entries.forEach((entry) => {
    const el = document.createElement("article");
    el.className = "track-entry panel reveal";
    el.innerHTML = `
      <div class="track-entry__head">
        <span class="track-entry__org">${entry.org}</span>
        <span class="track-entry__period">${entry.period}</span>
      </div>
      <div class="track-entry__role">${entry.role}</div>
      <ul>${entry.points.map((p) => `<li>${p}</li>`).join("")}</ul>
      <div class="track-entry__lat">Lateral focus — ${entry.lat}</div>
    `;
    frag.appendChild(el);
  });
  log.appendChild(frag);
}

function renderProjects() {
  const panel = document.getElementById("project-panel");
  panel.innerHTML = ""; // Clear out static default text
  const frag = document.createDocumentFragment();
  const projects = Object.values(PROJECT_MAP);

  projects.forEach((p, idx) => {
    const container = document.createElement("div");
    container.className = "project-item reveal";
    container.style.marginBottom = "4rem";

    container.innerHTML = `
      <div class="project-panel__head">
        <div>
          <div class="project-panel__name">${p.name}</div>
          <div class="project-panel__tag">${p.tag}</div>
        </div>
        <div class="project-panel__period">${p.period}</div>
      </div>
      <p class="project-panel__desc">${p.description}</p>
      <div class="microservice-graph">
        ${p.microservices.map((m) => `<span class="node">${m}</span>`).join("")}
      </div>
      <div class="stack-list">
        ${p.stack.map((s) => `<span class="stack-chip">${s}</span>`).join("")}
      </div>
      <ul class="points">${p.points.map((pt) => `<li>${pt}</li>`).join("")}</ul>
      ${idx < projects.length - 1 ? '<hr style="border: 0; border-top: 1px dashed rgba(0, 210, 255, 0.15); margin-top: 3.5rem;">' : ''}
    `;
    frag.appendChild(container);
  });

  panel.appendChild(frag);
}

function renderCerts() {
  const grid = document.getElementById("cert-grid");
  const frag = document.createDocumentFragment();
  Object.values(CERT_MAP).forEach((c) => {
    const el = document.createElement("div");
    el.className = "cert-card panel reveal";
    el.innerHTML = `
      <div class="cert-card__code">${c.code}</div>
      <div class="cert-card__name">${c.name}</div>
      <div class="cert-card__issuer">${c.issuer}</div>
    `;
    frag.appendChild(el);
  });
  grid.appendChild(frag);

  const edu = document.getElementById("edu-panel");
  edu.innerHTML = `
    <div class="edu-line">
      <span><strong>${EDUCATION.degree}</strong> — ${EDUCATION.school}</span>
      <span>EDUCATION</span>
    </div>
  `;
}

renderSkills();
renderTimeline();
renderProjects();
renderCerts();

/* =========================================================================
 * 2. MOTION LAYER
 * ========================================================================= */

/* --- Preloader: starting grid lights --- */
function runPreloader() {
  const lights = Array.from(document.querySelectorAll(".grid-light"));
  const preloader = document.getElementById("preloader");
  const hero = document.getElementById("hero");
  let i = 0;

  const step = () => {
    if (i < lights.length) {
      lights[i].classList.add("lit");
      i += 1;
      setTimeout(step, 260);
    } else {
      setTimeout(() => {
        preloader.classList.add("flash");
        setTimeout(() => {
          preloader.classList.add("is-done");
          hero.classList.add("hero-in");
        }, 280);
      }, 350);
    }
  };
  setTimeout(step, 300);
}
runPreloader();

/* --- Cursor telemetry trail: a fading polyline that follows the pointer --- */
(function cursorTrail() {
  const path = document.getElementById("cursor-trail-path");
  const points = [];
  const MAX_POINTS = 14;

  window.addEventListener("pointermove", (e) => {
    points.push({ x: e.clientX, y: e.clientY });
    if (points.length > MAX_POINTS) points.shift();
    const d = points.map((p, idx) => `${idx === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
    path.setAttribute("d", d);
  });

  setInterval(() => {
    if (points.length) {
      points.shift();
      const d = points.map((p, idx) => `${idx === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
      path.setAttribute("d", d);
    }
  }, 90);
})();

/* --- Scroll reveals: IntersectionObserver drives .in-view (CSS-only) --- */
/* NOW WITH EXIT EFFECTS INCLUDED */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
      } else {
        entry.target.classList.remove("in-view");
      }
    });
  },
  { threshold: 0.18 }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

/* --- Skill counters + bar fills, staggered as each card enters view --- */
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const card = entry.target;
      const level = Number(card.dataset.level);
      const fill = card.querySelector("[data-fill]");
      const counter = card.querySelector("[data-counter]");
      if (fill) fill.style.width = `${level}%`;

      if (HAS_GSAP && counter) {
        gsap.to(
          { val: 0 },
          {
            val: level,
            duration: 1.3,
            ease: "power2.out",
            onUpdate: function () {
              counter.textContent = `${Math.round(this.targets()[0].val)}%`;
            },
          }
        );
      } else if (counter) {
        const start = performance.now();
        const duration = 1200;
        const tick = (now) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          counter.textContent = `${Math.round(eased * level)}%`;
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
      skillObserver.unobserve(card);
    });
  },
  { threshold: 0.35 }
);
document.querySelectorAll(".skill-card").forEach((el) => skillObserver.observe(el));

/* --- GSAP-enhanced hero + scroll parallax (only when libs are present) --- */
if (HAS_SCROLLTRIGGER) {
  gsap.utils.toArray(".section").forEach((section) => {
    gsap.fromTo(
      section,
      { backgroundPositionY: "-20px" },
      {
        backgroundPositionY: "20px",
        ease: "none",
        scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true },
      }
    );
  });
}

/* =========================================================================
 * 3. TELEMETRY LAYER — progress rail + active nav link
 * ========================================================================= */
const railFill = document.getElementById("progress-rail__fill");
const navLinks = Array.from(document.querySelectorAll(".hud-nav__links a"));
const sections = Array.from(document.querySelectorAll(".section[id]"));

function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (railFill) railFill.style.height = `${pct}%`;
}

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const link = navLinks.find((a) => a.dataset.nav === entry.target.id);
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach((a) => a.classList.remove("active"));
        link.classList.add("active");
      }
    });
  },
  { threshold: 0.5 }
);
sections.forEach((s) => navObserver.observe(s));

window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

/* =========================================================================
 * 4. CHART LAYER — skill telemetry radar (Chart.js) with CSS-bar fallback
 * ========================================================================= */
function renderSkillChart() {
  const labels = Object.values(SKILL_MAP).map((s) => s.label);
  const values = Object.values(SKILL_MAP).map((s) => s.level);

  if (HAS_CHARTJS) {
    const ctx = document.getElementById("skills-chart").getContext("2d");
    new Chart(ctx, {
      type: "radar",
      data: {
        labels,
        datasets: [
          {
            label: "Proficiency",
            data: values,
            backgroundColor: "rgba(0, 210, 255, 0.15)",
            borderColor: "#00d2ff",
            pointBackgroundColor: "#e50000",
            pointBorderColor: "#e50000",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        animation: { duration: 1400, easing: "easeOutQuart" },
        scales: {
          r: {
            angleLines: { color: "rgba(255,255,255,0.08)" },
            grid: { color: "rgba(255,255,255,0.08)" },
            pointLabels: { color: "#b9b9b9", font: { family: "ui-monospace", size: 10 } },
            ticks: { display: false, backdropColor: "transparent" },
            suggestedMin: 0,
            suggestedMax: 100,
          },
        },
        plugins: { legend: { display: false } },
      },
    });
  } else {
    const canvas = document.getElementById("skills-chart");
    const fallback = document.getElementById("chart-fallback");
    if (canvas) canvas.hidden = true;
    if (fallback) {
      fallback.hidden = false;
      fallback.innerHTML = "";
    }

    labels.forEach((label, idx) => {
      const row = document.createElement("div");
      row.className = "cfb-row";
      row.innerHTML = `
        <span>${label}</span>
        <div class="skill-bar-track"><div class="skill-bar-fill" data-fb-fill></div></div>
        <span data-fb-value>0%</span>
      `;
      if (fallback) fallback.appendChild(row);

      const fill = row.querySelector("[data-fb-fill]");
      const valueEl = row.querySelector("[data-fb-value]");
      const target = values[idx];

      const io = new IntersectionObserver(
        (entries) => {
          if (!entries[0].isIntersecting) return;
          if (fill) fill.style.width = `${target}%`;
          const start = performance.now();
          const tick = (now) => {
            const t = Math.min(1, (now - start) / 1200);
            if (valueEl) valueEl.textContent = `${Math.round(t * target)}%`;
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          io.disconnect();
        },
        { threshold: 0.4 }
      );
      if (fallback) io.observe(fallback);
    });
  }
}
renderSkillChart();