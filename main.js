(() => {

gsap.registerPlugin(ScrollTrigger);

/* =====================================================
   ✏️  EDITE AQUI: seus preços, contato e textos
   ===================================================== */
const CONFIG = {
  whatsapp: '5500000000000',            // DDI + DDD + número, só dígitos
  pixDiscount: 0,                       // 0 = sem desconto (esconde o seletor). Ex.: 0.10 = 10% à vista
  installments: 6,
  // Os 3 planos têm o MESMO conteúdo: muda apenas o nível visual.
  common: ['Site de até 5 seções', 'Responsivo (celular e computador)', 'Botão de WhatsApp e formulário', 'SEO básico + HTTPS', 'Domínio e publicação inclusos', 'Entrega em até 7 dias'],
  plans: [
    {
      name: 'Básico', title: 'Visual Essencial',
      desc: 'Limpo, direto e profissional. Ideal para quem precisa estar no Google sem complicação.',
      price: 500,
      visual: 'Layout clássico e objetivo, sem animações',
      demos: [['Barbearia Navalha', 'demos/basico-1.html'], ['Doce Manhã Confeitaria', 'demos/basico-2.html']],
    },
    {
      name: 'Intermediário', title: 'Visual Dinâmico', hot: true, badge: 'Mais escolhido',
      desc: 'Movimento na medida certa para o seu site parecer moderno e passar mais confiança.',
      price: 900,
      visual: 'Animações suaves, efeitos ao rolar e ao passar o mouse',
      demos: [['Pulse Academia', 'demos/intermediario-1.html'], ['Clínica Sorriso', 'demos/intermediario-2.html']],
    },
    {
      name: 'Avançado', title: 'Visual Imersivo',
      desc: 'O site que ninguém esquece: efeitos 3D e animações de scroll que impressionam.',
      price: 1400,
      visual: 'Objetos 3D, animações de scroll e efeitos imersivos',
      demos: [['Aurora Café', 'demos/avancado-1.html'], ['Vértice Arquitetura', 'demos/avancado-2.html']],
    },
  ],
  addons: [
    ['Manutenção mensal', 'R$ 79/mês'],
    ['Identidade visual / logo', 'R$ 150'],
    ['Redação dos textos (copy)', 'R$ 120'],
    ['Página extra', 'R$ 80'],
    ['SEO avançado', 'R$ 200'],
    ['Hospedagem (a preço de custo)', 'consulte'],
  ],
};
/* ===================================================== */

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = matchMedia('(hover: none)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const brl = n => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

document.body.classList.add('loading');
$('#year').textContent = new Date().getFullYear();
$('#ctaBtn').href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent('Olá! Vi sua tabela de preços e quero um orçamento.')}`;

/* ---------- smooth scroll ---------- */
const lenis = new Lenis({ lerp: 0.09, smoothWheel: !reduce });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(t => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
$$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  const id = a.getAttribute('href');
  if (id.length > 1 && $(id)) { e.preventDefault(); lenis.scrollTo(id, { offset: 0, duration: 1.6 }); }
}));

gsap.to('#progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

/* ---------- 3D scene ---------- */
const canvas = $('#bg');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camera.position.z = 8;

const noise = `
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 nn=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=nn.x;p1*=nn.y;p2*=nn.z;p3*=nn.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const uniforms = {
  uTime: { value: 0 }, uDisp: { value: 0.35 }, uMix: { value: 0 },
  uMouse: { value: new THREE.Vector2() },
  uA: { value: new THREE.Color(0x4cc9ff) }, uB: { value: new THREE.Color(0x2f5bff) },
};
const blobMat = new THREE.ShaderMaterial({
  uniforms,
  vertexShader: `
    uniform float uTime,uDisp; uniform vec2 uMouse;
    varying vec3 vN; varying vec3 vP; varying float vD;
    ${noise}
    void main(){
      float n=snoise(normal*1.4+vec3(uTime*.35,uTime*.2,uMouse.x*.6));
      float d=n*uDisp;
      vec3 p=position+normal*d;
      vD=d; vN=normalize(normalMatrix*normal); vP=(modelViewMatrix*vec4(p,1.)).xyz;
      gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
    }`,
  fragmentShader: `
    uniform float uMix,uTime; uniform vec3 uA,uB;
    varying vec3 vN; varying vec3 vP; varying float vD;
    void main(){
      vec3 V=normalize(-vP);
      float f=pow(1.-max(dot(normalize(vN),V),0.),2.2);
      vec3 lime=uA; vec3 vio=uB;
      vec3 a=mix(vio,lime,uMix);
      vec3 b=mix(lime,vio,uMix);
      vec3 col=mix(vec3(.03,.03,.06),a,smoothstep(-.3,.35,vD)*.55);
      col+=b*f*1.4;
      col+=.08*sin(vD*30.+uTime);
      gl_FragColor=vec4(col,1.);
    }`,
});
const blobGeo = new THREE.IcosahedronGeometry(1.7, 48);
const blob = new THREE.Mesh(blobGeo, blobMat);
const wire = new THREE.Mesh(
  new THREE.IcosahedronGeometry(2.25, 2),
  new THREE.MeshBasicMaterial({ color: 0x4cc9ff, wireframe: true, transparent: true, opacity: 0.16 })
);
const ring = new THREE.Mesh(
  new THREE.TorusGeometry(2.9, 0.012, 8, 220),
  new THREE.MeshBasicMaterial({ color: 0xe8f1ff, transparent: true, opacity: 0.5 })
);
ring.rotation.x = 1.2;
const ring2 = ring.clone(); ring2.scale.setScalar(1.25); ring2.rotation.set(0.4, 0.8, 0);
ring2.material = new THREE.MeshBasicMaterial({ color: 0x2f5bff, transparent: true, opacity: 0.6 });

const hero = new THREE.Group();
hero.add(blob, wire, ring, ring2);
scene.add(hero);

// particles
const N = 1400;
const pos = new Float32Array(N * 3);
for (let i = 0; i < N; i++) {
  pos[i * 3] = (Math.random() - 0.5) * 34;
  pos[i * 3 + 1] = (Math.random() - 0.5) * 34;
  pos[i * 3 + 2] = (Math.random() - 0.5) * 24 - 4;
}
const pg = new THREE.BufferGeometry();
pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
const points = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xe8f1ff, size: 0.035, transparent: true, opacity: 0.6, depthWrite: false }));
scene.add(points);

// floating cubes
const cubes = new THREE.Group();
const solids = [new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.OctahedronGeometry(0.4), new THREE.TorusKnotGeometry(0.28, 0.09, 64, 8), new THREE.DodecahedronGeometry(0.38), new THREE.ConeGeometry(0.32, 0.7, 5), new THREE.TorusGeometry(0.32, 0.1, 8, 20)];
for (let i = 0; i < 14; i++) {
  const m = new THREE.Mesh(solids[i % solids.length], new THREE.MeshBasicMaterial({ color: i % 2 ? 0x4cc9ff : 0x2f5bff, wireframe: true, transparent: true, opacity: 0.55 }));
  const a = (i / 14) * Math.PI * 2;
  m.position.set(Math.cos(a) * 5.5, (Math.random() - 0.5) * 6, Math.sin(a) * 3 - 2);
  m.scale.setScalar(0.5 + Math.random() * 1.2);
  m.userData = { s: 0.2 + Math.random() * 0.5, o: Math.random() * 6 };
  cubes.add(m);
}
scene.add(cubes);

// particle sculpture: morphs between shapes as you scroll
const SN = 3200;
const shapes = [[], [], [], [], []];
const R = 2.9;
for (let i = 0; i < SN; i++) {
  const u = i / SN, a = Math.acos(1 - 2 * u), b = Math.PI * (1 + Math.sqrt(5)) * i;
  shapes[0].push(R * Math.sin(a) * Math.cos(b), R * Math.cos(a), R * Math.sin(a) * Math.sin(b));           // esfera
  const t = u * Math.PI * 2 * 3, k = 2.2 + Math.cos(t * 2 / 3) * 0.9;                                          // nó toroidal
  shapes[1].push(k * Math.cos(t) * 0.85, k * Math.sin(t) * 0.85, Math.sin(t * 2 / 3) * 2.2);
  const f = Math.floor(Math.random() * 6), s1 = (Math.random() - 0.5) * 2 * R * 0.8, s2 = (Math.random() - 0.5) * 2 * R * 0.8, sg = f % 2 ? 1 : -1, h = R * 0.8 * sg; // cubo
  shapes[2].push(...(f < 2 ? [h, s1, s2] : f < 4 ? [s1, h, s2] : [s1, s2, h]));
  const th = u * Math.PI * 14, hy = (u - 0.5) * 7, side = i % 2 ? 1 : -1;                                     // hélice dupla
  shapes[3].push(Math.cos(th + (side > 0 ? Math.PI : 0)) * 1.8, hy, Math.sin(th + (side > 0 ? Math.PI : 0)) * 1.8);
  const rr = 2.2 + Math.random() * 1.3, tt = Math.random() * Math.PI * 2;                                       // disco/galáxia
  shapes[4].push(Math.cos(tt) * rr * 1.2, (Math.random() - 0.5) * 0.25, Math.sin(tt) * rr * 1.2);
}
const sPos = new Float32Array(shapes[0]);
const sGeo = new THREE.BufferGeometry();
sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
const sculpt = new THREE.Points(sGeo, new THREE.PointsMaterial({ color: 0x4cc9ff, size: 0.045, transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending }));
hero.add(sculpt);
let sIdx = 0, sMorph = 1;
function morphTo(i) { if (i === sIdx) return; const from = Float32Array.from(sPos); const to = shapes[i]; sIdx = i; const o = { v: 0 };
  gsap.to(o, { v: 1, duration: 1.8, ease: 'expo.inOut', overwrite: 'auto', onUpdate: () => { for (let k = 0; k < sPos.length; k++) sPos[k] = from[k] + (to[k] - from[k]) * o.v; sGeo.attributes.position.needsUpdate = true; } }); }


const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
addEventListener('pointermove', e => {
  mouse.tx = (e.clientX / innerWidth) * 2 - 1;
  mouse.ty = -((e.clientY / innerHeight) * 2 - 1);
});

function resize() {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
addEventListener('resize', resize);
resize();

const clock = new THREE.Clock();
const scroll = { p: 0, v: 0 };
lenis.on('scroll', e => { scroll.p = e.progress; scroll.v = e.velocity; });

renderer.setAnimationLoop(() => {
  const t = clock.getElapsedTime();
  uniforms.uTime.value = t;
  mouse.x += (mouse.tx - mouse.x) * 0.05;
  mouse.y += (mouse.ty - mouse.y) * 0.05;
  uniforms.uMouse.value.set(mouse.x, mouse.y);
  uniforms.uDisp.value = 0.3 + Math.min(Math.abs(scroll.v) * 0.04, 0.5);

  blob.rotation.y = t * 0.12 + scroll.p * 8;
  blob.rotation.x = t * 0.07 + mouse.y * 0.3;
  wire.rotation.y = -t * 0.08 - scroll.p * 4;
  wire.rotation.z = t * 0.05;
  ring.rotation.z = t * 0.2;
  ring2.rotation.y = t * 0.15;
  hero.rotation.y += (mouse.x * 0.35 - hero.rotation.y) * 0.04;
  hero.rotation.x += (-mouse.y * 0.2 - hero.rotation.x) * 0.04;

  points.rotation.y = t * 0.012 + scroll.p * 1.5;
  points.position.y = scroll.p * 6;
  cubes.children.forEach(c => {
    c.rotation.x += 0.004 * c.userData.s * 4;
    c.rotation.y += 0.006 * c.userData.s * 4;
    c.position.y += Math.sin(t * c.userData.s + c.userData.o) * 0.002;
  });
  cubes.rotation.y = t * 0.03 + scroll.p * 3;
  sculpt.rotation.y = t * 0.1; sculpt.rotation.x = Math.sin(t * 0.2) * 0.2;
  const si = Math.min(4, Math.floor(scroll.p * 5.2)); morphTo(si);
  renderer.render(scene, camera);
});

/* scroll-driven camera path: object travels through the page */
const isMobile = () => innerWidth < 800;
function sceneTimeline() {
  const m = isMobile();
  hero.position.set(m ? 0 : 2.6, m ? 1.6 : 0, 0);
  hero.scale.setScalar(m ? 0.62 : 1);
  const tl = gsap.timeline({ scrollTrigger: { trigger: 'main', start: 'top top', end: 'bottom bottom', scrub: 1.2 } });
  tl.to(hero.position, { x: m ? 0 : -3.2, y: m ? 2 : 0.2, z: -1, duration: 1 }, 0)        // manifesto
    .to(uniforms.uMix, { value: 1, duration: 1 }, 0)
    .to(hero.position, { x: m ? 0 : 3.4, y: m ? 3 : 0.6, z: -3, duration: 1 })          // processo
    .to(hero.scale, { x: m ? 0.5 : 0.8, y: m ? 0.5 : 0.8, z: m ? 0.5 : 0.8, duration: 1 }, '<')
    .to(hero.position, { x: 0, y: 0, z: -9, duration: 1.4 })                             // preços (fundo)
    .to(hero.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 1.4 }, '<')
    .to(uniforms.uMix, { value: 0, duration: 1.4 }, '<')
    .to(hero.position, { x: 0, y: 0, z: 1.5, duration: 1.4 })                            // CTA (volta grande)
    .to(hero.scale, { x: m ? 0.9 : 1.6, y: m ? 0.9 : 1.6, z: m ? 0.9 : 1.6, duration: 1.4 }, '<');
  return tl;
}
let sceneTl = sceneTimeline();
let lastMobile = isMobile();
addEventListener('resize', () => {
  if (lastMobile !== isMobile()) { lastMobile = isMobile(); sceneTl.scrollTrigger.kill(); sceneTl.kill(); sceneTl = sceneTimeline(); }
});

/* ---------- cursor + magnetic ---------- */
if (!isTouch) {
  const cur = $('#cursor');
  const qx = gsap.quickTo(cur, 'x', { duration: 0.25, ease: 'power3' });
  const qy = gsap.quickTo(cur, 'y', { duration: 0.25, ease: 'power3' });
  addEventListener('pointermove', e => { qx(e.clientX); qy(e.clientY); });
  $$('a,button,summary,.card').forEach(el => {
    el.addEventListener('pointerenter', () => cur.classList.add('big'));
    el.addEventListener('pointerleave', () => cur.classList.remove('big'));
  });
  $$('[data-magnet]').forEach(el => {
    const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'elastic.out(1,.5)' });
    const y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'elastic.out(1,.5)' });
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      x((e.clientX - (r.left + r.width / 2)) * 0.3);
      y((e.clientY - (r.top + r.height / 2)) * 0.3);
    });
    el.addEventListener('pointerleave', () => { x(0); y(0); });
  });
}

/* ---------- pricing cards ---------- */
let mode = 'pix';
const cardsEl = $('#cards');
function renderCards() {
  cardsEl.innerHTML = CONFIG.plans.map((p, i) => `
    <article class="card ${p.hot ? 'card--hot' : ''}" data-i="${i}">
      ${p.badge ? `<span class="card__badge">${p.badge}</span>` : ''}
      <span class="card__name">${p.name}</span>
      <h3 class="card__title">${p.title}</h3>
      <p class="card__desc">${p.desc}</p>
      <div class="card__price"><small>${''}</small><b data-price="${i}"></b></div>
      <p class="card__sub" data-sub="${i}"></p>
      <ul><li class="hl">${p.visual}</li>${CONFIG.common.map(f => `<li>${f}</li>`).join('')}</ul>
      <a class="btn" target="_blank" rel="noopener" href="https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent('Olá! Tenho interesse no plano ' + p.title)}"><span>Quero este</span><i>↗</i></a>
      <div class="card__demos"><span class="mono">Exemplos deste nível</span>${p.demos.map(([n, u]) => `<a class="demo" href="${u}" target="_blank" rel="noopener"><b>${n}</b><i>↗</i></a>`).join('')}</div>
    </article>`).join('');
  $('#addons').innerHTML = CONFIG.addons.map(([a, b]) => `<li class="rv"><span>${a}</span><span>${b}</span></li>`).join('');
  updatePrices(true);
  initTilt();
}
const shown = {};
function updatePrices(first) {
  CONFIG.plans.forEach((p, i) => {
    const target = mode === 'pix' ? Math.round(p.price * (1 - CONFIG.pixDiscount)) : p.price;
    const el = $(`[data-price="${i}"]`);
    const o = { v: shown[i] ?? 0 };
    gsap.to(o, { v: target, duration: first ? 0.01 : 0.9, ease: 'power3.out', onUpdate: () => { el.textContent = brl(Math.round(o.v)); shown[i] = o.v; } });
    $(`[data-sub="${i}"]`).textContent = (mode === 'pix' && CONFIG.pixDiscount > 0)
      ? `Pix/à vista · de ${brl(p.price)}`
      : `ou ${CONFIG.installments}x de ${brl(Math.ceil(p.price / CONFIG.installments))}`;
  });
}
function initTilt() {
  if (isTouch || reduce) return;
  $$('.card').forEach(c => {
    const rx = gsap.quickTo(c, 'rotationX', { duration: 0.5, ease: 'power3' });
    const ry = gsap.quickTo(c, 'rotationY', { duration: 0.5, ease: 'power3' });
    c.addEventListener('pointermove', e => {
      const r = c.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      ry((px - 0.5) * 14); rx(-(py - 0.5) * 14);
      c.style.setProperty('--mx', px * 100 + '%'); c.style.setProperty('--my', py * 100 + '%');
    });
    c.addEventListener('pointerleave', () => { rx(0); ry(0); });
  });
}
if (!CONFIG.pixDiscount) $('#toggle').hidden = true;
const toggle = $('#toggle'), tBtns = $$('button', toggle), tKnob = $('i', toggle);
function moveKnob() {
  const b = $('button.on', toggle);
  tKnob.style.left = b.offsetLeft + 'px'; tKnob.style.width = b.offsetWidth + 'px';
}
tBtns.forEach(b => b.addEventListener('click', () => {
  tBtns.forEach(x => x.classList.toggle('on', x === b));
  mode = b.dataset.mode; moveKnob(); updatePrices();
}));
renderCards();
document.fonts.ready.then(moveKnob);
addEventListener('resize', moveKnob);

/* ---------- text splitting ---------- */
$$('.hero__title .split').forEach(s => {
  s.innerHTML = [...s.textContent].map(c => `<span class="ch">${c === ' ' ? '&nbsp;' : c}</span>`).join('');
});
const mText = $('#manifestoText');
mText.innerHTML = mText.textContent.split(' ').map(w => `<span class="w">${w}</span>`).join(' ');

/* ---------- intro ---------- */
function intro() {
  document.body.classList.remove('loading');
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.fromTo('.hero__title .ch', { yPercent: 115, rotate: 8 }, { yPercent: 0, rotate: 0, duration: 1.5, stagger: 0.035 })
    .from('.hero__tag', { opacity: 0, y: 20, duration: 1 }, 0.3)
    .from('.hero__foot > *', { opacity: 0, y: 30, duration: 1.2, stagger: 0.15 }, 0.7)
    .from('.nav > *', { opacity: 0, y: -20, duration: 1, stagger: 0.1 }, 0.5)
    .from(hero.scale, { x: 0.01, y: 0.01, z: 0.01, duration: 2.2, ease: 'elastic.out(1,.6)' }, 0.2);
  setupScroll();
}

/* ---------- scroll animations ---------- */
function setupScroll() {
  if (reduce) { gsap.set('.rv,.w', { opacity: 1, y: 0 }); return; }

  // hero parallax
  gsap.to('.hero__title', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__title .outline', { x: -80, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  // marquee speed on scroll
  const mq = gsap.to('.marquee__track', { xPercent: -50, repeat: -1, duration: 28, ease: 'none' });
  $('.marquee__track').style.animation = 'none';
  ScrollTrigger.create({ onUpdate: s => gsap.to(mq, { timeScale: 1 + Math.abs(s.getVelocity()) / 350 * Math.sign(s.direction || 1), duration: 0.3, overwrite: true }) });

  // manifesto word-by-word
  gsap.to('.w', { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: '#manifestoText', start: 'top 80%', end: 'bottom 45%', scrub: true } });

  // counters
  $$('[data-count]').forEach(el => {
    const o = { v: 0 };
    gsap.to(o, { v: +el.dataset.count, duration: 2, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true }, onUpdate: () => el.textContent = Math.round(o.v) });
  });

  // horizontal process
  ScrollTrigger.matchMedia({
    '(min-width: 801px)': () => {
      const track = $('#processTrack');
      const dist = () => track.scrollWidth - innerWidth + 120;
      gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '.process', start: 'top top', end: () => '+=' + dist(), pin: '.process__pin', scrub: 1, invalidateOnRefresh: true } });
      gsap.utils.toArray('.step').forEach((s, i) => gsap.from(s, { rotateY: 25, y: 60, opacity: 0.3, scrollTrigger: { trigger: '.process', start: 'top top', end: () => '+=' + dist(), scrub: true }, ease: 'none' }));
    },
    '(max-width: 800px)': () => {
      gsap.from('.step', { y: 60, opacity: 0, stagger: 0.15, scrollTrigger: { trigger: '.process__track', start: 'top 85%' } });
    },
  });

  // headings clip reveal
  $$('h2, .cta__title').forEach(h => gsap.from(h, { y: 80, opacity: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 88%' } }));

  // generic reveals
  ScrollTrigger.batch('.rv', { start: 'top 90%', onEnter: els => gsap.to(els, { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: 'expo.out', overwrite: true }) });
  $$('.card').forEach((c, i) => gsap.fromTo(c, { rotateX: -25, y: 100, opacity: 0 }, { rotateX: 0, y: 0, opacity: 1, duration: 1.4, ease: 'expo.out', delay: i * 0.1, scrollTrigger: { trigger: '#cards', start: 'top 85%' } }));

  // faq + label
  $$('.label').forEach(l => gsap.from(l, { x: -30, opacity: 0, duration: 1, scrollTrigger: { trigger: l, start: 'top 92%' } }));
  gsap.from('details', { opacity: 0, y: 30, stagger: 0.1, scrollTrigger: { trigger: '.faq__list', start: 'top 85%' } });
  gsap.from('.btn--big', { scale: 0.7, opacity: 0, duration: 1.2, ease: 'elastic.out(1,.6)', scrollTrigger: { trigger: '.btn--big', start: 'top 92%' } });

  // faixas de texto gigante em direções opostas
  gsap.fromTo('#bigA', { x: '5%' }, { x: '-45%', ease: 'none', scrollTrigger: { trigger: '.bigtext', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.fromTo('#bigB', { x: '-55%' }, { x: '0%', ease: 'none', scrollTrigger: { trigger: '.bigtext', start: 'top bottom', end: 'bottom top', scrub: true } });
  // barra de progresso do processo
  gsap.to('#processBar', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.process', start: 'top top', end: 'bottom bottom', scrub: true } });
  // títulos dos planos entram com skew
  $$('.card__title').forEach(t => gsap.from(t, { skewY: 8, y: 30, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: t, start: 'top 92%' } }));
  ScrollTrigger.refresh();
}



/* ---------- text scramble ---------- */
const GLYPHS = '!<>-_\/[]{}—=+*^?#01';
function scramble(el, dur = 0.7) {
  const txt = el.dataset.orig || (el.dataset.orig = el.textContent);
  const o = { p: 0 };
  gsap.to(o, { p: 1, duration: dur, ease: 'none', overwrite: 'auto', onUpdate: () => {
    el.textContent = [...txt].map((ch, i) => ch === ' ' ? ' ' : i < o.p * txt.length ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]).join('');
  }, onComplete: () => { el.textContent = txt; } });
}
$$('.nav nav a, .pill, .card__name, .step__n').forEach(el => el.addEventListener('pointerenter', () => scramble(el, 0.5)));
$$('.label').forEach(el => ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: () => scramble(el, 1) }));

/* ---------- cursor trail + click burst ---------- */
if (!isTouch && !reduce) {
  const tc = $('#trail'), tx = tc.getContext('2d');
  const fit = () => { tc.width = innerWidth; tc.height = innerHeight; }; fit(); addEventListener('resize', fit);
  const ps = []; let lx = 0, ly = 0;
  const col = () => getComputedStyle(document.documentElement).getPropertyValue(Math.random() < 0.5 ? '--lime' : '--violet').trim();
  addEventListener('pointermove', e => {
    const d = Math.hypot(e.clientX - lx, e.clientY - ly); lx = e.clientX; ly = e.clientY;
    for (let i = 0; i < Math.min(3, 1 + d / 25); i++) ps.push({ x: lx, y: ly, vx: (Math.random() - 0.5) * 1.2, vy: (Math.random() - 0.5) * 1.2, l: 1, s: 2 + Math.random() * 3, c: col() });
  });
  addEventListener('pointerdown', e => {
    for (let i = 0; i < 28; i++) { const a = Math.random() * 6.28, v = 2 + Math.random() * 6; ps.push({ x: e.clientX, y: e.clientY, vx: Math.cos(a) * v, vy: Math.sin(a) * v, l: 1, s: 2 + Math.random() * 4, c: col() }); }
  });
  gsap.ticker.add(() => {
    tx.clearRect(0, 0, tc.width, tc.height);
    for (let i = ps.length - 1; i >= 0; i--) {
      const p = ps[i]; p.x += p.vx; p.y += p.vy; p.vx *= 0.96; p.vy *= 0.96; p.l -= 0.022;
      if (p.l <= 0) { ps.splice(i, 1); continue; }
      tx.globalAlpha = p.l; tx.fillStyle = p.c; tx.beginPath(); tx.arc(p.x, p.y, p.s * p.l, 0, 6.28); tx.fill();
    }
  });
}

/* ---------- loader ---------- */
const state = { n: 0 };
gsap.to(state, {
  n: 100, duration: reduce ? 0.2 : 2.1, ease: 'power2.inOut',
  onUpdate: () => { $('#loaderNum').textContent = Math.round(state.n); $('#loaderBar').style.width = state.n + '%'; },
  onComplete: () => gsap.to('#loader', { yPercent: -100, duration: 1, ease: 'expo.inOut', onStart: () => { try { intro(); } catch (e) { console.error(e); document.body.classList.remove('loading'); } }, onComplete: () => $('#loader').remove() }),
});
// rede de segurança: nunca deixa o preloader preso
setTimeout(() => { const l = $('#loader'); if (l) { document.body.classList.remove('loading'); l.remove(); } }, 7000);

})();
