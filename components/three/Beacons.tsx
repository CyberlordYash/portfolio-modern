"use client";
import { useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* Signal beacons — distant transmission towers with blinking tips — and the
   low-latency energy corridor of light gates near the end of the journey. */

const TOWERS: [number, number, number][] = [
  [-260, 0, -40], [300, 0, -90], [-330, 0, -200], [280, 0, -260],
  [-240, 0, -380], [260, 0, -430], [-120, 0, 120], [140, 0, 90],
];

const TIP_VERT = /* glsl */ `
  attribute float aPhase;
  uniform float uTime;
  varying float vBlink;
  void main() {
    /* sharp asynchronous blink */
    float b = sin(uTime * 1.4 + aPhase * 12.0);
    vBlink = smoothstep(0.86, 0.99, b);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = (3.0 + vBlink * 9.0) * (240.0 / max(-mv.z, 1.0));
    gl_Position = projectionMatrix * mv;
  }
`;

const TIP_FRAG = /* glsl */ `
  varying float vBlink;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.04, d) * (0.25 + vBlink * 1.4);
    gl_FragColor = vec4(vec3(0.55, 0.85, 1.0), a);
  }
`;

function Towers() {
  const { towers, tips } = useMemo(() => {
    /* tower shafts as one merged set of thin boxes via InstancedMesh */
    const mesh = new THREE.InstancedMesh(
      new THREE.BoxGeometry(1.6, 1, 1.6),
      new THREE.MeshBasicMaterial({ color: "#10283f", transparent: true, opacity: 0.9 }),
      TOWERS.length,
    );
    const m = new THREE.Matrix4();
    const heights: number[] = [];
    TOWERS.forEach((t, i) => {
      const h = 60 + (i % 4) * 22;
      heights.push(h);
      m.makeScale(1, h, 1);
      m.setPosition(t[0], h / 2, t[2]);
      mesh.setMatrixAt(i, m);
    });
    mesh.instanceMatrix.needsUpdate = true;

    /* blinking tips */
    const pos = new Float32Array(TOWERS.length * 3);
    const phase = new Float32Array(TOWERS.length);
    TOWERS.forEach((t, i) => {
      pos.set([t[0], heights[i] + 2, t[2]], i * 3);
      phase[i] = Math.random();
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
    const mat = new THREE.ShaderMaterial({
      vertexShader: TIP_VERT,
      fragmentShader: TIP_FRAG,
      uniforms: { uTime: { value: 0 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return { towers: mesh, tips: new THREE.Points(geo, mat) };
  }, []);

  useEffect(() => () => {
    towers.geometry.dispose();
    (towers.material as THREE.Material).dispose();
    tips.geometry.dispose();
    (tips.material as THREE.Material).dispose();
  }, [towers, tips]);

  useFrame((state) => {
    ((tips.material as THREE.ShaderMaterial).uniforms.uTime.value) = state.clock.elapsedTime;
  });

  return (
    <group>
      <primitive object={towers} />
      <primitive object={tips} />
    </group>
  );
}

/* paired light pillars forming a gate tunnel — the low-latency corridor */
function Corridor() {
  const gates = useMemo(() => {
    const out: { pos: [number, number, number]; phase: number }[] = [];
    for (let i = 0; i < 9; i++) {
      const z = -310 - i * 16;
      out.push({ pos: [-17, 11, z], phase: i * 0.3 });
      out.push({ pos: [17, 11, z], phase: i * 0.3 + 0.1 });
    }
    return out;
  }, []);

  const mats = useMemo(
    () =>
      gates.map(
        () =>
          new THREE.MeshBasicMaterial({
            color: new THREE.Color("#3aa6e8"),
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          }),
      ),
    [gates],
  );

  useEffect(() => () => mats.forEach((m) => m.dispose()), [mats]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    mats.forEach((m, i) => {
      /* a wave of light travels through the gates toward the core */
      const w = Math.sin(t * 2.2 - gates[i].phase * 4.0) * 0.5 + 0.5;
      m.opacity = 0.18 + w * 0.6;
    });
  });

  return (
    <group>
      {gates.map((g, i) => (
        <mesh key={i} position={g.pos} material={mats[i]}>
          <boxGeometry args={[0.9, 22, 0.9]} />
        </mesh>
      ))}
    </group>
  );
}

export default function Beacons() {
  return (
    <group>
      <Towers />
      <Corridor />
    </group>
  );
}
