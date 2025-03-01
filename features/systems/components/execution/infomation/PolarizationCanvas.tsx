"use client";
import { Canvas } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

const PolarizationWave = ({
  Ex,
  Ey,
  phase,
}: {
  Ex: number;
  Ey: number;
  phase: number;
}) => {
  const pointsRef = useRef<THREE.Line>(null); // Updated type
  const meshRef = useRef<THREE.Mesh>(null); // Updated type
  const timeRef = useRef(0);

  const geometry = useRef(new THREE.BufferGeometry()).current;
  const vertices = new Float32Array(100 * 3);
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

  const meshGeometry = useRef(new THREE.BufferGeometry()).current;
  const meshVertices = new Float32Array(100 * 6);
  meshGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(meshVertices, 3)
  );

  useFrame(() => {
    if (!pointsRef.current || !meshRef.current) return;
    const points = pointsRef.current.geometry.attributes.position
      .array as Float32Array;
    const meshPoints = meshRef.current.geometry.attributes.position
      .array as Float32Array;

    for (let i = 0; i < points.length / 3; i++) {
      const x = i * 0.3 - 15; // Longer X-axis
      const y = Ex * 10 * Math.sin(x + timeRef.current);
      const z = Ey * 10 * Math.sin(x + timeRef.current + phase);

      // Line points
      points[i * 3] = x;
      points[i * 3 + 1] = y;
      points[i * 3 + 2] = z;

      // Fill area between wave and X-axis
      meshPoints[i * 6] = x;
      meshPoints[i * 6 + 1] = y;
      meshPoints[i * 6 + 2] = z;

      meshPoints[i * 6 + 3] = x;
      meshPoints[i * 6 + 4] = 0;
      meshPoints[i * 6 + 5] = 0;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    meshRef.current.geometry.attributes.position.needsUpdate = true;
    timeRef.current += 0.05;
  });

  return (
    <>
      {/* Polarization Wave Line */}
      <primitive
        object={
          new THREE.Line(
            geometry,
            new THREE.LineBasicMaterial({ color: "#17202a", linewidth: 2 })
          )
        }
        ref={pointsRef}
      />

      {/* X-axis Fill */}
      <mesh ref={meshRef} geometry={meshGeometry}>
        <meshBasicMaterial
          attach="material"
          color="blue"
          opacity={0.3}
          transparent
        />
      </mesh>
    </>
  );
};

const XAxis = () => {
  return (
    <line>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          args={[new Float32Array([-20, 0, 0, 20, 0, 0]), 1]}
          count={2}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial attach="material" color="#707b7c" linewidth={2} />
    </line>
  );
};

const PolarizationScene = () => {
  const [Ex] = useState(1);
  const [Ey] = useState(1);
  const [phase] = useState(0);

  return (
    <div className="flex flex-col items-center">
      <Canvas
        camera={{
          position: [30, 15, 30], // Perspective view with depth
          fov: 50, // Adjust field of view for better perspective
        }}
      >
        <ambientLight />
        <XAxis />
        <PolarizationWave Ex={Ex} Ey={Ey} phase={phase} />
      </Canvas>
    </div>
  );
};

export default PolarizationScene;
