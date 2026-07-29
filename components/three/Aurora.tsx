"use client";
import { useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* Aurora world — replaces the topographic contour terrain.

   Three layers, because the camera rig looks ~18° BELOW the horizon for most
   of the flight and a sky-only aurora would sit off-screen:

     1. FIELD    the ground plane itself, ribbons seen from above the way the
                 aurora reads from orbit. This is what fills frame.
     2. CURTAINS vertical sheets standing on the field, flanking the flight
                 corridor, so the descent passes real 3D volumes of light.
     3. SKY      a far band above the horizon. Nearly cropped out during the
                 hero, but the horizon climbs as the camera drops to y=13, so
                 it carries the later sections.

   Everything stays dim on purpose. Floating mono UI text sits directly over
   this layer, and the composer blooms anything above 0.56 luminance — so the
   ribbons are sparse and peak just under half brightness. */

/* Shared value noise. Same hash/fbm the terrain shader used, so the world
   keeps its grain even though the forms changed. */
const NOISE = /* glsl */ `
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = p * 2.04 + 11.3;
      a *= 0.5;
    }
    return v;
  }
`;

/* Oxygen-green core through teal into a nitrogen-violet fringe — the split a
   real aurora shows. Shared by all three layers so they read as one sky. */
const PALETTE = /* glsl */ `
  const vec3 AU_VIOLET = vec3(0.40, 0.22, 0.88);
  const vec3 AU_TEAL   = vec3(0.10, 0.72, 0.66);
  const vec3 AU_GREEN  = vec3(0.26, 0.95, 0.56);
  const vec3 AU_MINT   = vec3(0.60, 1.00, 0.82);
`;

/* ══════════════════════════════════════════
   1. FIELD — aurora seen from above
══════════════════════════════════════════ */

/* Left flat deliberately: the camera drops to y=13 near the footer, so any
   displacement tall enough to read would spear through the flight path. The
   curtains carry the vertical form instead. */
const FIELD_VERT = /* glsl */ `
  varying vec3 vWorld;
  varying vec2 vField;
  #include <fog_pars_vertex>

  void main() {
    /* local xy = ground plane (mesh is rotated -90° on X).
       Higher frequency than you'd expect for a 2600-unit plane: viewed from
       above, a low frequency reads as broad fog rather than ribbons. */
    vField = position.xy * 0.019;

    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorld = wp.xyz;
    vec4 mvPosition = viewMatrix * wp;
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`;

const FIELD_FRAG = /* glsl */ `
  uniform float uTime;
  varying vec3 vWorld;
  varying vec2 vField;
  #include <fog_pars_fragment>
  ${NOISE}
  ${PALETTE}

  /* One aurora sheet. The domain is squashed on y so features stretch
     lengthwise into ribbons, then domain-warped so they meander instead of
     running straight. Ridged noise (1 - |2n-1|) gives the filament crease;
     the exponent sharpens it into a thin bright band with dark space between.

     That exponent is the single most important number here. Low values (5)
     leave the ribbon shoulders wide, and once two sheets overlap the whole
     plane lights up as fog. 13 keeps the creases thin so most of the field
     stays black and the light reads as ribbons. */
  float ribbon(vec2 p, float t, float seed) {
    vec2 q = vec2(p.x * 1.05, p.y * 0.34) + seed;
    q += 1.2 * vec2(
      fbm(q * 0.55 + t * 0.030),
      fbm(q * 0.55 + 9.1 - t * 0.022)
    );
    float n = fbm(q + vec2(0.0, -t * 0.09));
    float r = 1.0 - abs(n * 2.0 - 1.0);
    return pow(clamp(r, 0.0, 1.0), 13.0);
  }

  void main() {
    float t = uTime;
    vec2 p = vField;

    /* a dominant sheet plus a weak second one at another scale and drift —
       the overlap is what stops it reading as one repeating pattern, but it
       stays weak so the two can't sum into a wash */
    float a1 = ribbon(p, t, 0.0);
    float a2 = ribbon(p * 0.68 + vec2(4.3, -1.7), t * 0.74, 3.9) * 0.45;

    /* cross-ribbon striation: real curtains are bundles of filaments. Applied
       as a full multiplier (not a floor) so it can punch gaps right through
       a ribbon instead of only shading it. */
    float fine = 0.35 + 0.65 * fbm(vec2(p.x * 11.0, p.y * 1.8 - t * 0.55));
    float a = (a1 + a2) * fine;

    vec3 col = mix(AU_VIOLET, AU_TEAL, smoothstep(0.02, 0.30, a));
    col = mix(col, AU_GREEN, smoothstep(0.34, 0.85, a));
    /* The sparsity above is what fixes the fog, not darkness — so this keeps
       just enough level for the brightest cores to cross the bloom threshold
       and glow, rather than dimming the ribbons into invisibility. */
    col *= a * 0.24;

    /* faint glow down the flight corridor, kept from the old terrain so the
       path the camera flies still reads as intentional */
    float river = 1.0 - smoothstep(3.0, 26.0, abs(vWorld.x));
    col += river * vec3(0.02, 0.06, 0.09);

    /* substorm — a brightening front sweeping up the field toward the viewer
       every ~26s, lifting only the ribbons it crosses. The offset spans the
       plane's z extent (-1250 … +550). */
    float front = fract(t / 26.0) * 2000.0;
    float pulse = exp(-abs(front - (vWorld.z + 1300.0)) * 0.006);
    col += pulse * a * vec3(0.06, 0.18, 0.26);

    gl_FragColor = vec4(col, 1.0);
    #include <fog_fragment>
  }
`;

/* ══════════════════════════════════════════
   2. CURTAINS — vertical sheets on the field
══════════════════════════════════════════ */

const CURTAIN_VERT = /* glsl */ `
  varying vec2 vUv;
  varying float vDepth;

  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vec4 mvPosition = viewMatrix * wp;
    vDepth = -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

/* Hand-rolled fog instead of three's chunk: that chunk mixes toward fogColor,
   and fogColor here is a non-zero near-black. Under additive blending a
   non-zero floor would paint each curtain's whole quad as a visible dim
   rectangle. Multiplying by (1 - fogFactor) fades to true nothing. */
const CURTAIN_FRAG = /* glsl */ `
  uniform float uTime;
  uniform float uSeed;
  uniform float uGain;
  uniform float uFogDensity;
  varying vec2 vUv;
  varying float vDepth;
  ${NOISE}
  ${PALETTE}

  void main() {
    float t = uTime;

    /* the sheet leans and buckles with height, so it hangs like fabric */
    float bend = (fbm(vec2(vUv.y * 2.1 + uSeed, t * 0.05 + uSeed)) - 0.48) * 0.55;
    float x = vUv.x + bend;

    /* pow 6, not 3: at 3 the sheet is a broad glow that fills frame as the
       camera passes it. Thin filaments with black between them read as a
       curtain and stay out of the UI's way. */
    float rays = pow(clamp(fbm(vec2(x * 4.2 + uSeed * 6.0, t * 0.045)), 0.0, 1.0), 6.0);
    float fine = 0.30 + 0.70 * fbm(vec2(x * 30.0 + uSeed, vUv.y * 1.4 - t * 0.42));

    /* bright at the base, feathering out well before the top edge, and eased
       off both sides — the quad's own borders must never be visible */
    float vfade = smoothstep(0.0, 0.04, vUv.y) * (1.0 - smoothstep(0.14, 0.62, vUv.y));
    float hfade = smoothstep(0.0, 0.14, x) * (1.0 - smoothstep(0.86, 1.0, x));

    float a = rays * fine * vfade * clamp(hfade, 0.0, 1.0);

    vec3 col = mix(AU_TEAL, AU_VIOLET, smoothstep(0.04, 0.55, vUv.y));

    float fogFactor = 1.0 - exp(-uFogDensity * uFogDensity * vDepth * vDepth);
    col *= a * uGain * (1.0 - fogFactor);

    /* alpha stays 1.0 — THREE.AdditiveBlending already multiplies by src
       alpha, so carrying the falloff in both would square it */
    gl_FragColor = vec4(col, 1.0);
  }
`;

/* Flanking the corridor (the camera holds x ≈ -34…26) rather than blocking
   it, so sheets sweep across frame as the flight descends past them.

   Pushed further out to x ≈ ±150 and kept to low gain: at x ≈ ±100 a sheet
   lands right behind the centre of frame, where the headline and cards sit. */
const CURTAINS: {
  x: number;
  z: number;
  w: number;
  h: number;
  rot: number;
  seed: number;
  gain: number;
}[] = [
  { x: -150, z: 20, w: 220, h: 140, rot: 0.22, seed: 0.4, gain: 0.34 },
  { x: 165, z: -70, w: 240, h: 150, rot: -0.26, seed: 1.7, gain: 0.30 },
  { x: -175, z: -175, w: 250, h: 160, rot: 0.16, seed: 3.4, gain: 0.32 },
  { x: 170, z: -280, w: 230, h: 145, rot: -0.18, seed: 5.1, gain: 0.30 },
  { x: -160, z: -400, w: 260, h: 170, rot: 0.2, seed: 6.8, gain: 0.28 },
];

/* ══════════════════════════════════════════
   3. SKY — far band above the horizon
══════════════════════════════════════════ */

const SKY_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const SKY_FRAG = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  ${NOISE}
  ${PALETTE}

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.06;
    vec3 col = vec3(0.0);

    /* three thin ribbons — bright core line + soft glow trailing upward,
       against an otherwise black sky (no broad wash) */
    for (int i = 0; i < 3; i++) {
      float fi = float(i);
      float speed = 0.45 + fi * 0.22;
      float scale = 1.8 + fi * 1.1;

      /* wavy centerline the ribbon follows */
      float w = fbm(vec2(uv.x * scale + t * speed, fi * 13.7 + t * 0.3));
      float center = 0.22 + 0.16 * fi + 0.30 * w;
      float d = uv.y - center;

      /* thin bright core + upward-dissolving tail */
      float core = exp(-abs(d) * 22.0);
      float tail = exp(-max(d, 0.0) * 7.0) * smoothstep(0.0, 0.02, d) * 0.6;

      /* vertical ray striations — high contrast so ribbons look woven */
      float rays = pow(0.5 + 0.5 * noise(vec2(uv.x * (42.0 + fi * 16.0) + t * 3.0, fi * 5.0)), 1.8);

      /* patchiness across the width — curtains come and go, never a full band */
      float patch = smoothstep(0.15, 0.65, fbm(vec2(uv.x * 1.4 - t * (0.4 + fi * 0.15), fi * 29.1)));

      float inten = (core * 1.15 + tail) * (0.35 + 0.65 * rays) * patch * (0.85 - fi * 0.18);

      /* mint core into teal body into a violet dissolve */
      vec3 c = mix(AU_MINT, AU_TEAL, smoothstep(0.0, 0.12, d));
      c = mix(c, AU_VIOLET * 0.42, smoothstep(0.1, 0.45, d));

      col += inten * c;
    }

    /* sparse twinkling stars, upper sky only */
    vec2 sp = uv * vec2(220.0, 80.0);
    vec2 cell = floor(sp);
    float star = step(0.997, hash(cell));
    float tw = 0.5 + 0.5 * sin(uTime * (1.0 + hash(cell + 7.0) * 2.0) + hash(cell * 3.1) * 6.283);
    col += star * tw * vec3(0.62, 0.78, 0.88) * 0.30 * smoothstep(0.35, 0.9, uv.y);

    /* The sky band sits above the horizon, which is near the top of frame for
       most of the flight — so it lands behind the nav and the headline. Held
       well under the field's level so it stays atmosphere, not a subject. */
    col *= 0.5;

    /* fade everything out at the plane's edges so it never shows a seam */
    col *= smoothstep(0.0, 0.08, uv.y) * (1.0 - smoothstep(0.92, 1.0, uv.y));
    col *= smoothstep(0.0, 0.05, uv.x) * (1.0 - smoothstep(0.95, 1.0, uv.x));

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function Aurora({ quality }: { quality: number }) {
  /* ── field ── */
  const fieldMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: FIELD_VERT,
        fragmentShader: FIELD_FRAG,
        uniforms: THREE.UniformsUtils.merge([
          THREE.UniformsLib.fog,
          { uTime: { value: 0 } },
        ]),
        fog: true,
      }),
    [],
  );

  /* No displacement, so the plane only needs enough tessellation to keep
     per-vertex fog depth smooth — far cheaper than the terrain's 300×200.
     Much larger than the old terrain (2600×1900 at z=-350) so the far edge
     stays >800 units out even at the footer, where the camera flattens to
     y=13 and would otherwise see the plane end as a hard line. */
  const fieldGeometry = useMemo(() => {
    const seg = quality > 0 ? 120 : 64;
    return new THREE.PlaneGeometry(2600, 1900, seg, Math.round(seg * 0.73));
  }, [quality]);

  /* ── curtains ── */
  const curtains = useMemo(
    () => (quality > 0 ? CURTAINS : CURTAINS.filter((_, i) => i % 2 === 0)),
    [quality],
  );

  /* One unit quad, scaled per curtain — the sheets differ only by uniforms. */
  const curtainGeometry = useMemo(() => new THREE.PlaneGeometry(1, 1, 1, 1), []);

  const curtainMaterials = useMemo(
    () =>
      curtains.map(
        (c) =>
          new THREE.ShaderMaterial({
            vertexShader: CURTAIN_VERT,
            fragmentShader: CURTAIN_FRAG,
            uniforms: {
              uTime: { value: 0 },
              uSeed: { value: c.seed },
              uGain: { value: c.gain },
              /* thinner than the scene's 0.0040 so sheets survive a little
                 further out — otherwise they vanish before they read */
              uFogDensity: { value: 0.0030 },
            },
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide,
            fog: false,
          }),
      ),
    [curtains],
  );

  /* ── sky ── */
  const skyMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: SKY_VERT,
        fragmentShader: SKY_FRAG,
        uniforms: { uTime: { value: 0 } },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: false,
      }),
    [],
  );

  const skyGeometry = useMemo(() => new THREE.PlaneGeometry(2400, 320), []);

  useEffect(
    () => () => {
      fieldGeometry.dispose();
      fieldMaterial.dispose();
      curtainGeometry.dispose();
      curtainMaterials.forEach((m) => m.dispose());
      skyGeometry.dispose();
      skyMaterial.dispose();
    },
    [
      fieldGeometry,
      fieldMaterial,
      curtainGeometry,
      curtainMaterials,
      skyGeometry,
      skyMaterial,
    ],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    fieldMaterial.uniforms.uTime.value = t;
    skyMaterial.uniforms.uTime.value = t;
    for (const m of curtainMaterials) m.uniforms.uTime.value = t;
  });

  return (
    <>
      <mesh
        geometry={fieldGeometry}
        material={fieldMaterial}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, -350]}
        frustumCulled={false}
      />

      {curtains.map((c, i) => (
        <mesh
          key={c.seed}
          geometry={curtainGeometry}
          material={curtainMaterials[i]}
          /* h/2 puts the base on the field */
          position={[c.x, c.h / 2, c.z]}
          rotation={[0, c.rot, 0]}
          scale={[c.w, c.h, 1]}
        />
      ))}

      <mesh
        geometry={skyGeometry}
        material={skyMaterial}
        position={[0, 150, -640]}
        frustumCulled={false}
      />
    </>
  );
}
