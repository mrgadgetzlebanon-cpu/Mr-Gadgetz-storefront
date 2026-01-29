import * as THREE from "three";
import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import {
  BallCollider,
  Physics,
  RigidBody,
  CylinderCollider,
  RapierRigidBody,
} from "@react-three/rapier";
import RAPIER from "@dimforge/rapier3d-compat";

const imageUrls = [
  "/images/apple.webp",
  "/images/samsung.webp",
  "/images/sony.webp",
  "/images/lenovo.webp",
  "/images/asus.webp",
  "/images/dell.webp",
  "/images/hp.webp",
  "/images/xiaomi.webp",
];

interface BrandAsset {
  texture: THREE.Texture;
  aspectRatio: number;
}

const sphereGeometry = new THREE.SphereGeometry(1, 28, 28);

const sphereMaterial = new THREE.MeshPhysicalMaterial({
  color: "#ffffff",
  metalness: 0.1,
  roughness: 0.3,
  clearcoat: 0.4,
});

const spheres = [...Array(30)].map(() => ({
  scale: [0.7, 1, 0.8, 1, 1][Math.floor(Math.random() * 5)],
  textureIndex: Math.floor(Math.random() * 8),
}));

function loadBrandAssets(): Promise<BrandAsset[]> {
  return Promise.all(
    imageUrls.map((url) => {
      return new Promise<BrandAsset>((resolve) => {
        const img = new Image();
        img.onload = () => {
          const textureLoader = new THREE.TextureLoader();
          const texture = textureLoader.load(url);
          texture.colorSpace = THREE.SRGBColorSpace;
          resolve({
            texture,
            aspectRatio: img.width / img.height,
          });
        };
        img.src = url;
      });
    })
  );
}

function createDecalGeometry(aspectRatio: number): THREE.PlaneGeometry {
  const baseSize = 0.9;
  let width: number;
  let height: number;
  
  if (aspectRatio > 1) {
    width = baseSize;
    height = baseSize / aspectRatio;
  } else {
    width = baseSize * aspectRatio;
    height = baseSize;
  }
  
  return new THREE.PlaneGeometry(width, height);
}

type SphereProps = {
  vec?: THREE.Vector3;
  scale: number;
  r?: typeof THREE.MathUtils.randFloatSpread;
  decalMaterial: THREE.MeshBasicMaterial;
  decalGeometry: THREE.PlaneGeometry;
  isActive: boolean;
};

function SphereGeo({
  vec = new THREE.Vector3(),
  scale,
  r = THREE.MathUtils.randFloatSpread,
  decalMaterial,
  decalGeometry,
  isActive,
}: SphereProps) {
  const api = useRef<RapierRigidBody | null>(null);

  useFrame((_state, delta) => {
    if (!isActive || !api.current) return;
    delta = Math.min(0.1, delta);
    const impulse = vec
      .copy(api.current.translation())
      .normalize()
      .multiply(
        new THREE.Vector3(
          -50 * delta * scale,
          -150 * delta * scale,
          -50 * delta * scale
        )
      );

    api.current.applyImpulse(impulse, true);
  });

  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      position={[r(20), r(20) - 25, r(20) - 10]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />
      <group scale={scale} rotation={[0.3, 1, 1]}>
        <mesh
          castShadow
          receiveShadow
          geometry={sphereGeometry}
          material={sphereMaterial}
        />
        <mesh
          geometry={decalGeometry}
          material={decalMaterial}
          position={[0, 0, 1.01]}
        />
      </group>
    </RigidBody>
  );
}

type PointerProps = {
  vec?: THREE.Vector3;
  isActive: boolean;
};

function Pointer({ vec = new THREE.Vector3(), isActive }: PointerProps) {
  const ref = useRef<RapierRigidBody>(null);

  useFrame(({ pointer, viewport }) => {
    if (!isActive) return;
    const targetVec = vec.lerp(
      new THREE.Vector3(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        0
      ),
      0.2
    );
    ref.current?.setNextKinematicTranslation(targetVec);
  });

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

interface BrandSpheresCanvasProps {
  isActive: boolean;
}

interface BrandData {
  material: THREE.MeshBasicMaterial;
  geometry: THREE.PlaneGeometry;
}

export function BrandSpheresCanvas({ isActive }: BrandSpheresCanvasProps) {
  const [brandData, setBrandData] = useState<BrandData[] | null>(null);
  const [rapierReady, setRapierReady] = useState(false);

  useEffect(() => {
    RAPIER.init().then(() => {
      setRapierReady(true);
    });
  }, []);

  useEffect(() => {
    loadBrandAssets().then((assets) => {
      const data = assets.map((asset) => ({
        material: new THREE.MeshBasicMaterial({
          map: asset.texture,
          transparent: true,
          side: THREE.FrontSide,
        }),
        geometry: createDecalGeometry(asset.aspectRatio),
      }));
      setBrandData(data);
    });
  }, []);

  if (!brandData || !rapierReady) {
    return null;
  }

  return (
    <Canvas
      shadows
      gl={{ alpha: true, stencil: false, depth: false, antialias: false }}
      camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
      onCreated={(state) => (state.gl.toneMappingExposure = 1.5)}
    >
      <ambientLight intensity={1} />
      <spotLight
        position={[20, 20, 25]}
        penumbra={1}
        angle={0.2}
        color="white"
        castShadow
        shadow-mapSize={[512, 512]}
      />
      <directionalLight position={[0, 5, -4]} intensity={2} />
      <Physics gravity={[0, 0, 0]}>
        <Pointer isActive={isActive} />
        {spheres.map((props, i) => (
          <SphereGeo
            key={i}
            {...props}
            decalMaterial={brandData[props.textureIndex].material}
            decalGeometry={brandData[props.textureIndex].geometry}
            isActive={isActive}
          />
        ))}
      </Physics>
      <Environment preset="city" />
      <EffectComposer enableNormalPass={false}>
        <N8AO color="#0f002c" aoRadius={2} intensity={1.15} />
      </EffectComposer>
    </Canvas>
  );
}

export default BrandSpheresCanvas;
