"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* The control center at the end of the journey — a bright core wrapped in
   slowly counter-rotating rings with a vertical light beam. */

export default function CoreStation() {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ring3 = useRef<THREE.Mesh>(null);
  const core = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (ring1.current) ring1.current.rotation.z += delta * 0.18;
    if (ring2.current) ring2.current.rotation.x += delta * 0.12;
    if (ring3.current) { ring3.current.rotation.y += delta * 0.08; ring3.current.rotation.z -= delta * 0.05; }
    if (core.current) core.current.scale.setScalar(1 + Math.sin(t * 1.6) * 0.07);
  });

  return (
    <group position={[0, 12, -525]}>
      <mesh ref={core}>
        <icosahedronGeometry args={[4.2, 2]} />
        <meshBasicMaterial color="#cfe0ff" />
      </mesh>

      <mesh ref={ring1} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[10, 0.18, 8, 96]} />
        <meshBasicMaterial color="#4f8bff" transparent opacity={0.8} />
      </mesh>
      <mesh ref={ring2} rotation={[0, Math.PI / 3, Math.PI / 5]}>
        <torusGeometry args={[15, 0.14, 8, 96]} />
        <meshBasicMaterial color="#2f5fd4" transparent opacity={0.55} />
      </mesh>
      <mesh ref={ring3} rotation={[Math.PI / 3, 0, Math.PI / 2.5]}>
        <torusGeometry args={[21, 0.1, 8, 96]} />
        <meshBasicMaterial color="#1e4a8f" transparent opacity={0.4} />
      </mesh>

      {/* vertical light beam */}
      <mesh position={[0, 60, 0]}>
        <cylinderGeometry args={[0.7, 2.4, 120, 12, 1, true]} />
        <meshBasicMaterial
          color="#4f8bff"
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
