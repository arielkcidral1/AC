(() => {

gsap.registerPlugin(ScrollTrigger);

/* =====================================================
   ✏️  EDITE AQUI: seus preços, contato e textos
   ===================================================== */
const CONFIG = {
  whatsapp: '5547999845075',            // DDI + DDD + número, só dígitos
  // Os 3 planos têm o MESMO conteúdo: muda apenas o nível visual.
  common: ['Site de até 5 seções', 'Responsivo (celular e computador)', 'Botão de WhatsApp e formulário', 'Entrega em até 10 dias úteis'],
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
    ['Página extra', 'R$ 80'],
    ['Hospedagem', 'taxa adicional', 'valor varia dependendo do site'],
    ['Domínio personalizado', 'taxa adicional', 'valor varia dependendo do site'],
    ['Banco de dados', 'taxa adicional', 'valor varia dependendo do site'],
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
  uTime: { value: 0 }, uDisp: { value: 0 }, uMix: { value: 0 },
  uMouse: { value: new THREE.Vector2() },
  uA: { value: new THREE.Color(0x4cc9ff) }, uB: { value: new THREE.Color(0x2f5bff) },
};
// enxame de blocos: começa como uma esfera que oscila, se desconstrói ao rolar e vira uma cobrinha que desce pela página
const CUBES = 2800;
const cubeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.8, roughness: 0.28, emissive: 0x0b2c40, emissiveIntensity: 0.9 });
const swarm = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), cubeMat, CUBES);
swarm.frustumCulled = false;
scene.add(swarm);
const cdat = [], col = new THREE.Color();
for (let i = 0; i < CUBES; i++) {
  // ponto na casca da esfera (espiral de Fibonacci)
  const y = 1 - 2 * (i + 0.5) / CUBES, rr = Math.sqrt(1 - y * y), th = Math.PI * (1 + Math.sqrt(5)) * i, shell = 0.82 + Math.random() * 0.22;
  const dir = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
  cdat.push({
    sx: Math.cos(th) * rr * shell, sy: y * shell, sz: Math.sin(th) * rr * shell,
    u: Math.pow(Math.random(), 1.15), o: dir.clone().multiplyScalar(Math.pow(Math.random(), 0.6)), dir,
    s: 0.09 + Math.random() * 0.13, ph: Math.random() * 6.28, sp: (Math.random() - 0.5) * 3, ax: Math.random() * 3, ay: Math.random() * 3,
  });
  col.setHSL(0.55 + Math.random() * 0.06, 0.2 + Math.random() * 0.4, 0.62 + Math.random() * 0.33);
  swarm.setColorAt(i, col);
}
const blob = new THREE.Object3D();
scene.add(new THREE.AmbientLight(0x8fb0e0, 1.8));
const keyLight = new THREE.DirectionalLight(0xeaf7ff, 3.8); keyLight.position.set(3, 4, 5); scene.add(keyLight);
const coreLight = new THREE.PointLight(0x4cc9ff, 8, 12); scene.add(coreLight);
const dummy = new THREE.Object3D();
const SNAKE_LEN = 7;
let turnS = 0, leanS = 0, headX = -1.6, headY = -0.3;
const clamp01 = x => Math.min(1, Math.max(0, x));
const smooth = x => x * x * (3 - 2 * x);
function updateSwarm(t) {
  const m = innerWidth < 800, vh = innerHeight;
  // 0 = esfera inteira; 1 = tudo virou cobra
  const k = clamp01((scrollY - 0.06 * vh) / (0.8 * vh));
  // cabeça da cobra desce conforme a página desce e serpenteia para os lados
  const edge = 1 - clamp01((scrollY - 1.0 * vh) / (1.6 * vh)); // na transição da bola, começa mais encostada na lateral esquerda e vai soltando
  const halfW = 8 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect, A = Math.max(0.7, halfW * 0.45); // alcance lateral: mais perto do meio, longe das bordas
  // ciclo em degraus: desce na diagonal até a borda, desce pouquíssimo na vertical parada na borda, e recomeça na diagonal para o outro lado
  const n = Math.max(0, scroll.p * 10 / Math.PI), seg = Math.floor(n), f = n - seg, dir = seg % 2 === 0 ? 1 : -1;
  // nunca anda só na vertical: mesmo perto da borda o movimento continua com um pouco de deslocamento lateral, freando devagar
  const xp = 0.88 * smooth(clamp01(f / 0.9)) + 0.12 * f;
  const D = m ? 0.6 : 0.85;                          // quanto desce em cada trecho
  const drop = 0.9 * smooth(clamp01(f / 0.9)) + 0.1 * f; // quase toda a descida acontece na diagonal
  const hx0 = dir * A * (2 * xp - 1) - edge * 0.1 * A + Math.sin(t * 0.25) * 0.25;
  const hxT = hx0 < 0 ? hx0 * 0.65 : hx0; // o lado esquerdo tem alcance menor
  const hyT = (m ? -0.2 : -0.3) - D * (seg + drop) + Math.sin(t * 0.8) * 0.2;
  headX += (hxT - headX) * 0.045; headY += (hyT - headY) * 0.045;
  // inclinação do corpo: a ponta de trás (cima) balança para o lado oposto ao do movimento e já vira um pouco antes da cabeça inverter (efeito de chicote, bem suave)
  turnS += (-dir * Math.sin(Math.PI * clamp01(f / 0.85 + 0.08)) - turnS) * 0.07;
  leanS = turnS * (m ? 0.2 : 0.35); const lean = leanS;
  const deep = 1 + 0.8 * clamp01(scrollY / (4 * vh)); // quanto mais desce a página, mais inclinadas ficam as pontas
  const ry = t * 0.2 + mouse.x * 0.4, cr = Math.cos(ry), sr = Math.sin(ry);
  const sc = hero.scale.x * (1 - 0.45 * clamp01((scroll.p - 0.75) / 0.15)), cx = hero.position.x + clamp01((scroll.p - 0.75) / 0.15) * (m ? 0.5 : 2.6), cy = hero.position.y, cz = hero.position.z;
  coreLight.position.set(cx, cy, cz + 1.2);
  for (let i = 0; i < CUBES; i++) {
    const c = cdat[i];
    // --- esfera oscilando levemente
    const pulse = 1.65 * (1 + 0.06 * Math.sin(t * 1.3 + c.ph) + 0.035 * Math.sin(t * 0.7 + c.ph * 3) + 0.03 * Math.sin(t * 0.9 + c.sy * 3));
    const px = c.sx * pulse, py = c.sy * pulse, pz = c.sz * pulse;
    const wx = px * cr + pz * sr + Math.sin(t * 1.8 + c.ph) * 0.05, wz = -px * sr + pz * cr + Math.cos(t * 1.5 + c.ph) * 0.05;
    const sphX = cx + wx * sc, sphY = cy + (py + Math.sin(t * 1.6 + c.ph * 2) * 0.05) * sc, sphZ = cz + wz * sc;
    // --- cobrinha
    const tau = c.u * SNAKE_LEN, amp = 0.25 + 0.3 * Math.sqrt(c.u);
    const r = (1 - c.u * 0.7) * 0.75;
    const bx = headX - lean * 0.9 * deep * Math.pow(1 - c.u, 3) + tau * lean * (0.6 + 0.4 * deep) + Math.sin(tau * 0.95 - t * 2.2) * amp + c.o.x * r + Math.sin(t * 1.6 + c.ph) * 0.06;
    const by = headY + tau * (0.95 - Math.min(Math.abs(lean), 0.9) * 0.25) + c.o.y * r + Math.cos(t * 1.3 + c.ph) * 0.06;
    const bz = 0 + Math.sin(tau * 0.7 + t * 1.2) * 0.25 + c.o.z * r; // profundidade constante: a cobra aponta para baixo, sem virar para o usuário nem para o fundo
    // --- transição: cada bloco se solta em um momento (cabeça primeiro) e "explode" um pouco no caminho
    const kb = clamp01(k * 1.75 - c.u * 0.75), e = smooth(kb), burst = Math.sin(kb * Math.PI) * 1.7;
    // --- no final da página os blocos voltam a formar a esfera
    const ek = clamp01((scroll.p - 0.86) / 0.1 * 1.7 - (1 - c.u) * 0.7), ee = smooth(ek), eb = Math.sin(ek * Math.PI) * 1.2;
    const fx = sphX + (bx - sphX) * e + c.dir.x * burst, fy = sphY + (by - sphY) * e + c.dir.y * burst, fz = sphZ + (bz - sphZ) * e + c.dir.z * burst;
    dummy.position.set(fx + (sphX - fx) * ee + c.dir.x * eb, fy + (sphY - fy) * ee + c.dir.y * eb, fz + (sphZ - fz) * ee + c.dir.z * eb);
    dummy.rotation.set(c.ax + t * c.sp * 0.5, c.ay + t * c.sp * 0.4, 0);
    const snakeS = c.s * (1.15 - c.u * 0.4), sphS = c.s * sc;
    dummy.scale.setScalar((sphS + (snakeS - sphS) * e * (1 - ee)) * (1 + Math.sin(t * 2 + c.ph) * 0.15));
    dummy.updateMatrix();
    swarm.setMatrixAt(i, dummy.matrix);
  }
  swarm.instanceMatrix.needsUpdate = true;
}
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
  updateSwarm(t);
  uniforms.uDisp.value = 0;

  blob.rotation.y = t * 0.1 + scroll.p * 3;
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
      <div class="card__demos"><span class="mono">Exemplos deste nível</span>${p.demos.map(([n, u]) => `<a class="demo" href="${u}"><b>${n}</b><i>↗</i></a>`).join('')}</div>
    </article>`).join('');
  const slug = t => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  $('#showcase').innerHTML = CONFIG.plans.flatMap(p => p.demos.map(([n, u]) => ({ n, u, plan: p.name, title: p.title }))).map(d => `
    <a class="demo-card demo-card--${slug(d.plan)} rv" href="${d.u}">
      <div class="demo-card__bar"><i></i><i></i><i></i></div>
      <div class="demo-card__shot">
        <img src="${d.u.replace('demos/', 'demos/thumb/').replace('.html', '.jpg')}" alt="Prévia do site ${d.n}" loading="lazy">
        <span class="demo-card__plan"><small>Plano</small>${d.plan}</span>
        <span class="demo-card__open mono">Abrir exemplo (${d.plan}) ↗</span>
      </div>
      <div class="demo-card__info"><b>${d.n}</b><span class="demo-card__level mono">${d.title}</span></div>
    </a>`).join('');
  $('#addons').innerHTML = CONFIG.addons.map(([a, b, n]) => `<li class="rv"><span>${a}</span><span>${b}${n ? `<small>(${n})</small>` : ""}</span></li>`).join('');
  updatePrices(true);
  initTilt();
}
const shown = {};
function updatePrices(first) {
  CONFIG.plans.forEach((p, i) => {
    const target = p.price;
    const el = $(`[data-price="${i}"]`);
    const o = { v: shown[i] ?? 0 };
    gsap.to(o, { v: target, duration: first ? 0.01 : 0.9, ease: 'power3.out', onUpdate: () => { el.textContent = brl(Math.round(o.v)); shown[i] = o.v; } });
    $(`[data-sub="${i}"]`).textContent = '';
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
renderCards();

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
      /* sem pin (a página não para): começa com 3 cards + metade do 4º, opacos, e o scroll normal puxa tudo para o lugar */
      const endX = () => Math.max(0, (innerWidth - track.scrollWidth) / 2);
      const startX = () => { const cs = getComputedStyle(track), w = $('.step').offsetWidth, g = parseFloat(cs.columnGap || 32); return innerWidth - w / 2 - 3 * (w + g) - parseFloat(cs.paddingLeft); };
      const st = { trigger: '.process', start: 'top 85%', end: 'top 10%', scrub: 0.8, invalidateOnRefresh: true };
      gsap.fromTo(track, { x: startX }, { x: endX, ease: 'none', scrollTrigger: st });
      gsap.fromTo('.step', { opacity: 0.35 }, { opacity: 1, ease: 'none', scrollTrigger: st });
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
const LOAD_MSGS = ['iniciando', 'desenhando o layout', 'compilando pixels', 'afinando as animações', 'polindo os detalhes', 'pronto'];
const loadStart = performance.now();
const loadNum = $('#loaderNum'), loadBar = $('#loaderBar'), loadMsg = $('#loaderMsg'), loadClock = $('#loaderClock');
const loadTick = gsap.ticker.add(() => {
  if (!loadClock) return;
  const s = (performance.now() - loadStart) / 1000;
  loadClock.textContent = [Math.floor(s / 60), Math.floor(s % 60), Math.floor((s % 1) * 100)].map(v => String(v).padStart(2, '0')).join(':');
});
const finishLoader = () => { gsap.ticker.remove(loadTick); $('#loader')?.remove(); };
gsap.to(state, {
  n: 100, duration: reduce ? 0.2 : 2.6, ease: 'power2.inOut',
  onUpdate: () => {
    loadNum.textContent = Math.round(state.n);
    loadBar.style.strokeDashoffset = 100 - state.n;
    loadMsg.textContent = LOAD_MSGS[Math.min(LOAD_MSGS.length - 1, Math.floor(state.n / (100 / LOAD_MSGS.length)))];
  },
  onComplete: () => {
    const start = () => { try { intro(); } catch (e) { console.error(e); document.body.classList.remove('loading'); } };
    gsap.timeline({ onComplete: finishLoader })
      .to('#loaderCore, .loader__corner, .loader__ticks, .loader__grid', { opacity: 0, scale: 1.06, duration: 0.45, ease: 'power2.in' })
      .to('.loader__half--t', { yPercent: -101, duration: 1.1, ease: 'expo.inOut', onStart: start }, '>-0.05')
      .to('.loader__half--b', { yPercent: 101, duration: 1.1, ease: 'expo.inOut' }, '<');
  },
});
// rede de segurança: nunca deixa o preloader preso
setTimeout(() => { if ($('#loader')) { document.body.classList.remove('loading'); finishLoader(); } }, 7000);

})();
