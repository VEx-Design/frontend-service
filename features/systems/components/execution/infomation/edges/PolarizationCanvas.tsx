// "use client";
// import { Canvas } from "@react-three/fiber";
// import { OrbitControls } from "@react-three/drei";
// import { useFrame } from "@react-three/fiber";
// import { useRef, useState } from "react";
// import * as THREE from "three";

// const PolarizationWave = ({
//   Ex,
//   Ey,
//   phase,
// }: {
//   Ex: number;
//   Ey: number;
//   phase: number;
// }) => {
//   // Correct ref type for THREE.Line
//   const pointsRef =
//     useRef<THREE.Line<THREE.BufferGeometry, THREE.LineBasicMaterial>>(null);
//   let time = 0;

//   useFrame(() => {
//     if (!pointsRef.current) return;
//     const points = pointsRef.current.geometry.attributes.position
//       .array as Float32Array;

//     for (let i = 0; i < points.length / 3; i++) {
//       const x = i * 0.2 - 5;
//       const y = Ex * Math.sin(x + time);
//       const z = Ey * Math.sin(x + time + phase);
//       points[i * 3] = x;
//       points[i * 3 + 1] = y;
//       points[i * 3 + 2] = z;
//     }

//     pointsRef.current.geometry.attributes.position.needsUpdate = true;
//     time += 0.05;
//   });

//   const geometry = new THREE.BufferGeometry();
//   const vertices = new Float32Array(50 * 3);
//   geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

//   return (
//     // This is the correct usage for Three.js Line component
//     <line ref={pointsRef} geometry={geometry}>
//       <lineBasicMaterial attach="material" color="blue" linewidth={2} />
//     </line>
//   );
// };

// const PolarizationScene = () => {
//   const [Ex, setEx] = useState(1);
//   const [Ey, setEy] = useState(1);
//   const [phase, setPhase] = useState(0);

//   return (
//     <div className="flex flex-col items-center">
//       <Canvas camera={{ position: [0, 0, 10] }}>
//         <OrbitControls />
//         <ambientLight />
//         <PolarizationWave Ex={Ex} Ey={Ey} phase={phase} />
//       </Canvas>

//       <div className="mt-4 flex flex-col gap-2">
//         <label>Ex Amplitude: {Ex.toFixed(2)}</label>
//         <input
//           type="range"
//           min="0"
//           max="5"
//           step="0.1"
//           value={Ex}
//           onChange={(e) => setEx(Number(e.target.value))}
//         />

//         <label>Ey Amplitude: {Ey.toFixed(2)}</label>
//         <input
//           type="range"
//           min="0"
//           max="5"
//           step="0.1"
//           value={Ey}
//           onChange={(e) => setEy(Number(e.target.value))}
//         />

//         <label>Phase Difference: {phase.toFixed(2)} rad</label>
//         <input
//           type="range"
//           min="0"
//           max="6.28"
//           step="0.1"
//           value={phase}
//           onChange={(e) => setPhase(Number(e.target.value))}
//         />
//       </div>
//     </div>
//   );
// };

// export default PolarizationScene;
