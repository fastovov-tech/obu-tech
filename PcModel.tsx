"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import { Environment, Html, Float, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useSceneStore, HotspotId } from "@/lib/store";

const HOTSPOT_POSITIONS: Record<Exclude<HotspotId, null>, [number, number, number]> = {
  cooler: [0.15, 0.85, 0.8],
  gpu: [0.55, -0.5, 0.4],
  ssd: [-0.3, 0.9, 0.38],
};

function CaseFrame() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1.6, 3.2, 1.4]} />
        <meshStandardMaterial color="#150c30" metalness={0.65} roughness={0.3} />
      </mesh>
      <mesh position={[0.81, 0, 0]}>
        <planeGeometry args={[1.4, 3.1]} />
        <MeshTransmissionMaterial
          transmission={1}
          roughness={0.05}
          thickness={0.2}
          ior={1.3}
          chromaticAberration={0.03}
          backside
          color="#1a0f38"
        />
      </mesh>
    </group>
  );
}

function Fan({ position, glow }: { position: [number, number, number]; glow: string }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * 2.2;
  });
  return (
    <group position={position}>
      <mesh>
        <torusGeometry args={[0.28, 0.03, 16, 32]} />
        <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={1.7} toneMapped={false} />
      </mesh>
      <group ref={ref}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <mesh key={i} rotation={[0, 0, (Math.PI / 3) * i]} position={[0.14, 0, 0]}>
            <boxGeometry args={[0.2, 0.05, 0.02]} />
            <meshStandardMaterial color="#241a44" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Gpu() {
  return (
    <group position={[0.15, -0.5, 0.15]}>
      <mesh>
        <boxGeometry args={[1.1, 0.32, 0.55]} />
        <meshStandardMaterial color="#1c1235" metalness={0.75} roughness={0.25} />
      </mesh>
      <mesh position={[-0.25, 0, 0.29]}>
        <cylinderGeometry args={[0.13, 0.13, 0.05, 24]} rotation-x={Math.PI / 2} />
        <meshStandardMaterial color="#D946EF" emissive="#D946EF" emissiveIntensity={1.3} toneMapped={false} />
      </mesh>
      <mesh position={[0.25, 0, 0.29]}>
        <cylinderGeometry args={[0.13, 0.13, 0.05, 24]} rotation-x={Math.PI / 2} />
        <meshStandardMaterial color="#8B5CF6" emissive="#8B5CF6" emissiveIntensity={1.3} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Motherboard() {
  return (
    <mesh position={[0.05, 0.1, -0.35]}>
      <boxGeometry args={[1.35, 2.6, 0.05]} />
      <meshStandardMaterial color="#1a0f38" metalness={0.4} roughness={0.55} emissive="#3b0764" emissiveIntensity={0.15} />
    </mesh>
  );
}

function Ssd() {
  return (
    <mesh position={[-0.3, 0.9, 0.2]}>
      <boxGeometry args={[0.5, 0.12, 0.35]} />
      <meshStandardMaterial color="#160b2e" emissive="#A855F7" emissiveIntensity={0.35} />
    </mesh>
  );
}

/** Ambient neon dust particles drifting around the case */
function Particles() {
  const ref = useRef<THREE.Points>(null);
  const count = 220;

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [
      new THREE.Color("#8B5CF6"),
      new THREE.Color("#D946EF"),
      new THREE.Color("#6366F1"),
    ];
    for (let i = 0; i < count; i++) {
      const r = 1.8 + Math.random() * 1.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
      positions[i * 3 + 2] = r * Math.cos(phi);
      const c = palette[i % palette.length];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.04;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.028} vertexColors transparent opacity={0.75} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function Hotspot({
  id,
  position,
  color,
}: {
  id: Exclude<HotspotId, null>;
  position: [number, number, number];
  color: string;
}) {
  const setActive = useSceneStore((s) => s.setActiveHotspot);
  const active = useSceneStore((s) => s.activeHotspot);
  const [hovered, setHovered] = useState(false);
  const isActive = active === id;

  return (
    <group position={position}>
      <mesh
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          setActive(isActive ? null : id);
        }}
      >
        <sphereGeometry args={[0.09, 24, 24]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh scale={hovered || isActive ? 1.9 : 1.2}>
        <sphereGeometry args={[0.09, 24, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.28} toneMapped={false} />
      </mesh>
      {isActive && (
        <Html distanceFactor={6} position={[0.15, 0.1, 0]}>
          <div className="pointer-events-none w-48 rounded-xl border border-violet/30 bg-base-900/90 p-3 text-xs text-white shadow-glass backdrop-blur-md">
            <p className="font-display text-violet-soft">{titleFor(id)}</p>
          </div>
        </Html>
      )}
    </group>
  );
}

function titleFor(id: Exclude<HotspotId, null>) {
  switch (id) {
    case "cooler":
      return "Чищення і термопаста";
    case "gpu":
      return "Модернізація ПК";
    case "ssd":
      return "Windows та дані";
  }
}

function CameraRig() {
  const { camera } = useThree();
  const activeHotspot = useSceneStore((s) => s.activeHotspot);
  const defaultPos = useRef(new THREE.Vector3(2.4, 0.6, 3.4));
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    if (activeHotspot) {
      const [x, y, z] = HOTSPOT_POSITIONS[activeHotspot];
      targetPos.current.set(x * 1.6 + 0.6, y * 0.5 + 0.3, z * 1.6 + 1.4);
      targetLook.current.set(x, y, z);
    } else {
      targetPos.current.copy(defaultPos.current);
      targetLook.current.set(0, 0, 0);
    }
    camera.position.lerp(targetPos.current, 0.06);
    camera.lookAt(targetLook.current);
  });

  return null;
}

function PcRig() {
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const activeHotspot = useSceneStore((s) => s.activeHotspot);

  useFrame((state) => {
    pointer.current.x = THREE.MathUtils.lerp(pointer.current.x, state.pointer.x * 0.4, 0.04);
    pointer.current.y = THREE.MathUtils.lerp(pointer.current.y, state.pointer.y * 0.2, 0.04);
    if (group.current && !activeHotspot) {
      group.current.rotation.y = 0.5 + pointer.current.x;
      group.current.rotation.x = -pointer.current.y;
    }
  });

  return (
    <Float speed={1.4} rotationIntensity={0} floatIntensity={0.6}>
      <group ref={group} scale={0.85}>
        <CaseFrame />
        <Motherboard />
        <Ssd />
        <Gpu />
        <Fan position={[0.15, 0.85, 0.71]} glow="#8B5CF6" />
        <Fan position={[0.15, -1.1, 0.71]} glow="#D946EF" />

        <Hotspot id="cooler" position={HOTSPOT_POSITIONS.cooler} color="#8B5CF6" />
        <Hotspot id="gpu" position={HOTSPOT_POSITIONS.gpu} color="#D946EF" />
        <Hotspot id="ssd" position={HOTSPOT_POSITIONS.ssd} color="#A855F7" />
      </group>
    </Float>
  );
}

function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3 text-sm text-slate-300">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet border-t-transparent" />
        <span className="font-mono">Завантаження 3D-моделі OBU TECH...</span>
      </div>
    </Html>
  );
}

export default function PcModel() {
  const dpr = useMemo<[number, number]>(() => [1, 1.8], []);
  return (
    <Canvas dpr={dpr} camera={{ position: [2.4, 0.6, 3.4], fov: 40 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.3} />
      <pointLight position={[3, 3, 3]} intensity={1.3} color="#A855F7" />
      <pointLight position={[-3, -2, 2]} intensity={1.1} color="#D946EF" />
      <pointLight position={[0, 0, 2]} intensity={0.6} color="#6366F1" />
      <Suspense fallback={<Loader />}>
        <PcRig />
        <Particles />
        <Environment preset="night" />
      </Suspense>
      <CameraRig />
    </Canvas>
  );
}
