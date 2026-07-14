This folder is intentionally empty.

The console works fully offline right now with zero external requests —
the preloader, scroll reveals, telemetry counters, and skill chart all run
on plain CSS/JS fallbacks. I couldn't reach the internet from this sandbox
to download the actual library files for you, so drop these three files in
here yourself to upgrade the motion/chart fidelity (GSAP elastic hero drop,
ScrollTrigger parallax, Chart.js radar):

  gsap.min.js          -> https://greensock.com/gsap/  (Standard "No Charge" license, MIT-style for most use)
  ScrollTrigger.min.js  -> same GSAP download, "ScrollTrigger" plugin file
  chart.umd.js          -> https://www.chartjs.org/  (MIT license) — the /dist/chart.umd.js build

Nothing else needs to change. index.html already references:
  ./lib/gsap.min.js
  ./lib/ScrollTrigger.min.js
  ./lib/chart.umd.js

main.js feature-detects window.gsap / window.ScrollTrigger / window.Chart,
so as soon as real files land here, the enhanced GSAP timelines and the
Chart.js radar activate automatically — no code changes needed.
