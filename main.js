(() => {
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- data ---------- */
const LAYERS = [
 ['L1: Uncensored Core','LAYER 01 // COGNITIVE CORE','Uncensored Base Cognitive Foundation','Raw unfiltered local model inference running natively on an RTX 4070 GPU workstation. Completely sovereign execution free from vendor-imposed guardrail distortion or arbitrary refusal degradation.',['Local 9B Quantized','RTX 4070 12GB']],
 ['L2: Dynamic Tone','LAYER 02 // PERSONA ENGINE','Context-Adaptive Tone Modulation','A persona engine that shifts register, verbosity and risk posture per task, operator and channel without losing identity continuity.',['Persona Router','Prompt Compiler']],
 ['L3: Voice Synthesis','LAYER 03 // VOICE','Low-Latency Local Voice Synthesis','Streaming text-to-speech and speech recognition running fully offline for real-time spoken interaction with the agent swarm.',['Streaming TTS','Whisper Local']],
 ['L4: Autonomous Loop','LAYER 04 // EXECUTION','Perpetual Autonomous Execution Loop','A 15-minute cycle loop that plans, acts, verifies and logs without human prompting, with watchdogs restarting any stalled agent.',['15m Cycle','Watchdog']],
 ['L5: 4-Tier Memory','LAYER 05 // MEMORY','4-Tier Redundant Persistent Memory','Working, episodic, semantic and archival memory tiers with cross-replication so the system keeps its identity across restarts.',['SQLite','Vector Index','Replicas']],
 ['L6: Proactive 6Brain','LAYER 06 // INITIATIVE','Proactive Six-Brain Orchestrator','Six specialised reasoning shards that surface opportunities and risks before they are asked about, then debate and vote on actions.',['6 Shards','Voting']],
 ['L7: Self-Evolution','LAYER 07 // REFLECTION','Continuous Reflection & Self-Evolution','After every cycle the system critiques its own traces, rewrites tool definitions and promotes patches that pass verification.',['Reflection Loop','Auto-Patching']]];
const SYS = [
 ['Autonomous AI','#SYS-01','Multi-LLM Parliament Architecture','Cognitive assembly model comprising 6 AI personality shards engaging in structured debate, cross-verification, and voting protocols to synthesize balanced decisions.',['Multi-Agent','Consensus']],
 ['Quant & Markets','Machine Learning','AIT Kronos — ML Time Series Forecaster','Production-grade time-series forecasting service with FastAPI backend and React/TypeScript dashboard. Complete machine learning pipeline from raw stream ingestion to checkpointing.',['FastAPI','PyTorch']],
 ['Core Engineering','Deep Learning','DLFM — Dynamical Latent Field Model','Experimental PyTorch CUDA neural architecture modeling complex dynamical physical and mathematical systems in a 1024-dimensional latent field via discrete integration pipelines.',['PyTorch CUDA','Latent Dynamics']],
 ['Core Engineering','GPU Systems','GPU-Accelerated Cryptographic Search','Massively parallel CUDA search over large key spaces on RTX 4070 silicon. Containerised and benchmarked for production-scale throughput.',['CUDA C++','secp256k1']],
 ['Quant & Markets','Financial Architecture','Hedge Fund Structure & Institutional Design','End-to-end fund architecture design applying systems engineering to quantitative finance: LP/GP governance, 2/20 fee watermarking, KYC/AML compliance, and risk routing.',['LP/GP Architecture','Risk Modeling']],
 ['Autonomous AI','AI Philosophy','Axiom of Truth Cognitive Framework','Epistemological cognitive foundation designed to anchor AI agents against hallucination and sycophancy. Enforces strict factual truth verification before token generation.',['Epistemology','Verification']]];
const CATS = ['All', 'Autonomous AI', 'Quant & Markets', 'Core Engineering'];
const esc = s => s.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const toast = m => { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 2200); };

/* ---------- nav ---------- */
const burger = $('#burger'), menu = $('#menu');
burger.onclick = () => { const o = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', o); };
$$('#menu a').forEach(a => a.addEventListener('click', () => { menu.classList.remove('open'); burger.setAttribute('aria-expanded', false); }));
const links = $$('#menu > a'), secs = links.map(a => $(a.getAttribute('href')));
const spy = () => { let cur = -1; secs.forEach((s, i) => { if (s.getBoundingClientRect().top < innerHeight * .4) cur = i; }); links.forEach((a, i) => a.classList.toggle('on', i === cur)); };

/* ---------- layer inspector ---------- */
const tabs = $('#layerTabs'), body = $('#layerBody');
LAYERS.forEach((l, i) => { const b = document.createElement('button'); b.textContent = l[0]; b.setAttribute('role', 'tab'); b.onclick = () => showLayer(i); tabs.append(b); });
function showLayer(i) {
  $$('button', tabs).forEach((b, j) => b.setAttribute('aria-selected', i === j));
  const l = LAYERS[i];
  body.innerHTML = `<span class="eyebrow mono">${l[1]}</span><h5>${l[2]}</h5><p>${l[3]}</p><div class="tags mono">${l[4].map(t => `<i>${t}</i>`).join('')}</div>`;
  body.style.animation = 'none'; body.offsetHeight; body.style.animation = '';
}
showLayer(0);

/* ---------- systems matrix ---------- */
const fil = $('#filters'), grid = $('#matrixGrid');
function renderMatrix(cat) {
  const list = SYS.filter(s => cat === 'All' || s[0] === cat);
  $$('button', fil).forEach(b => b.setAttribute('aria-pressed', b.dataset.c === cat));
  grid.innerHTML = list.map(s => `<article class="card"><div class="top mono"><span class="chip">${esc(s[1].startsWith('#') ? s[0] : s[1])}</span><span>${s[1].startsWith('#') ? s[1] : '↗'}</span></div><h3>${s[2]}</h3><p>${s[3]}</p><div class="tags mono">${s[4].map(t => `<i>${t}</i>`).join('')}</div></article>`).join('');
}
CATS.forEach(c => { const b = document.createElement('button'); b.dataset.c = c; b.textContent = c === 'All' ? `All Systems (${SYS.length})` : c; b.onclick = () => renderMatrix(c); fil.append(b); });
renderMatrix('All');

/* ---------- counters & scroll pill ---------- */
const cnt = $('[data-count]'); let n = 0, target = +cnt.dataset.count;
const tick = () => { n = Math.min(target, n + Math.ceil(target / 40)); cnt.textContent = n; if (n < target) requestAnimationFrame(tick); }; tick();
const lc = $('#layersCount');
addEventListener('scroll', () => {
  const p = scrollY / Math.max(1, document.body.scrollHeight - innerHeight);
  lc.textContent = `${Math.round(p * 252)} / 252 layers`; spy();
}, { passive: true }); spy();

/* ---------- guided tour button ---------- */
let touring = false, tourId; const tourBtn = $('#tour'), order = ['#top', '#about', '#flagships', '#matrix', '#contact']; let ti = 0;
tourBtn.onclick = () => {
  touring = !touring; tourBtn.classList.toggle('off', !touring); tourBtn.textContent = touring ? 'Touring' : 'Paused';
  clearInterval(tourId);
  if (touring) tourId = setInterval(() => { ti = (ti + 1) % order.length; $(order[ti]).scrollIntoView({ behavior: 'smooth' }); }, 4000);
};

/* ---------- portrait tilt ---------- */
const por = $('.portrait');
addEventListener('mousemove', e => { if (reduce || innerWidth < 980) return; const x = (e.clientX / innerWidth - .5) * 8, y = (e.clientY / innerHeight - .5) * -8; por.style.transform = `perspective(700px) rotateY(${x}deg) rotateX(${y}deg)`; });

/* ---------- contact: copy + dispatch modal ---------- */
$('#copyMail').onclick = async () => {
  try { await navigator.clipboard.writeText('founder@saai.pro'); } catch (e) { const t = document.createElement('textarea'); t.value = 'founder@saai.pro'; document.body.append(t); t.select(); document.execCommand('copy'); t.remove(); }
  toast('Email copied to clipboard');
};
const modal = $('#modal'), form = $('#dispatchForm'), err = $('#formErr');
const open = () => { modal.hidden = false; err.textContent = ''; setTimeout(() => form.name.focus(), 50); };
const close = () => { modal.hidden = true; };
$$('[data-open-dispatch]').forEach(b => b.onclick = () => { menu.classList.remove('open'); open(); });
$('#closeModal').onclick = close; modal.onclick = e => { if (e.target === modal) close(); };
addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
form.onsubmit = async e => {
  e.preventDefault(); err.textContent = '';
  const data = Object.fromEntries(new FormData(form)); const btn = $('#sendBtn'); btn.disabled = true; btn.textContent = 'Sending…';
  try {
    const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (r.status === 404 || r.status === 405) throw new TypeError('no backend');
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || 'Could not send. Try again.');
    form.reset(); close(); toast('Dispatch sent');
  } catch (ex) {
    if (ex instanceof TypeError) { // no backend reachable (file:// or static hosting): fall back to email client
      location.href = `mailto:founder@saai.pro?subject=${encodeURIComponent('Dispatch from ' + data.name)}&body=${encodeURIComponent(data.message + '\n\n' + data.email)}`; close();
    } else err.textContent = ex.message;
  }
  btn.disabled = false; btn.textContent = 'Send dispatch';
};


/* ---------- fit PORTFOLIO headline to its container (any font, any width) ---------- */
const h1 = $('.outline'), h1s = $('.outline span');
const fit = () => { h1.style.fontSize = '100px'; const w = h1s.offsetWidth || 1; h1.style.fontSize = Math.min(250, Math.floor(100 * h1.clientWidth / w)) + 'px'; };
fit(); addEventListener('resize', fit); if (document.fonts) document.fonts.ready.then(fit);

/* ---------- cursor swarm ---------- */
if (!reduce) {
  const cv = $('#swarm'), cx = cv.getContext('2d'); let W, H; const dpr = Math.min(devicePixelRatio || 1, 2);
  const size = () => { W = cv.width = innerWidth * dpr; H = cv.height = innerHeight * dpr; }; size(); addEventListener('resize', size);
  const cols = ['#ff8a6b', '#8aa4ff', '#4fd1c5', '#ffd166', '#c792ea', '#ff6b9d'];
  const m = { x: innerWidth / 2, y: innerHeight / 2 };
  addEventListener('pointermove', e => { m.x = e.clientX; m.y = e.clientY; m.t = performance.now(); });
  const A = Array.from({ length: 14 }, (_, i) => ({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, k: .015 + Math.random() * .05, c: cols[i % cols.length], r: 30 + Math.random() * 90, a: Math.random() * 6.28, rot: 0 }));
  (function loop(t) {
    cx.clearRect(0, 0, W, H);
    A.forEach(p => {
      const idle = !m.t || t - m.t > 2500; p.a += .01 + p.k * .2;
      const tx = (idle ? innerWidth / 2 + Math.cos(p.a) * innerWidth * .3 : m.x) + Math.cos(p.a) * p.r, ty = (idle ? innerHeight / 2 + Math.sin(p.a) * innerHeight * .25 : m.y) + Math.sin(p.a) * p.r;
      const dx = tx - p.x, dy = ty - p.y; p.x += dx * p.k; p.y += dy * p.k; p.rot = Math.atan2(dy, dx) + Math.PI / 2;
      cx.save(); cx.scale(dpr, dpr); cx.translate(p.x, p.y); cx.rotate(p.rot); cx.fillStyle = p.c; cx.globalAlpha = .85;
      cx.beginPath(); cx.moveTo(0, -8); cx.lineTo(6, 8); cx.lineTo(0, 4); cx.lineTo(-6, 8); cx.closePath(); cx.fill(); cx.restore();
    });
    requestAnimationFrame(loop);
  })(0);
}
})();
