import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ArrowLeft, Move, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

interface Gallery3DProps {
  onNavigate: (view: string) => void;
}

export default function Gallery3D({ onNavigate }: Gallery3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const [selectedObject, setSelectedObject] = useState<string | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 8);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(0, 10, 0);
    spotLight.castShadow = true;
    scene.add(spotLight);

    const pointLight1 = new THREE.PointLight(0xffaa00, 0.8);
    pointLight1.position.set(5, 3, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x00aaff, 0.8);
    pointLight2.position.set(-5, 3, -5);
    scene.add(pointLight2);

    const floorGeometry = new THREE.PlaneGeometry(30, 30);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a2a2a,
      roughness: 0.8,
      metalness: 0.2,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0x3a3a3a,
      roughness: 0.9,
    });

    const wallGeometry = new THREE.PlaneGeometry(30, 10);
    const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
    backWall.position.set(0, 5, -15);
    scene.add(backWall);

    const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
    leftWall.position.set(-15, 5, 0);
    leftWall.rotation.y = Math.PI / 2;
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
    rightWall.position.set(15, 5, 0);
    rightWall.rotation.y = -Math.PI / 2;
    scene.add(rightWall);

    const pedestalGeometry = new THREE.CylinderGeometry(1, 1.2, 2, 32);
    const pedestalMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b7355,
      roughness: 0.7,
      metalness: 0.3,
    });

    const positions = [
      { x: -6, z: -8 },
      { x: 0, z: -8 },
      { x: 6, z: -8 },
      { x: -6, z: 0 },
      { x: 6, z: 0 },
    ];

    const artifacts: THREE.Mesh[] = [];

    positions.forEach((pos, index) => {
      const pedestal = new THREE.Mesh(pedestalGeometry, pedestalMaterial);
      pedestal.position.set(pos.x, 1, pos.z);
      pedestal.castShadow = true;
      scene.add(pedestal);

      const artifactGeometry = new THREE.SphereGeometry(0.6, 32, 32);
      const artifactMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(index / 5, 0.7, 0.5),
        roughness: 0.3,
        metalness: 0.7,
        emissive: new THREE.Color().setHSL(index / 5, 0.5, 0.1),
      });

      const artifact = new THREE.Mesh(artifactGeometry, artifactMaterial);
      artifact.position.set(pos.x, 3, pos.z);
      artifact.castShadow = true;
      artifact.userData = { id: `artifact-${index}`, name: `Objet ${index + 1}` };
      artifacts.push(artifact);
      scene.add(artifact);
    });

    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const onMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const onClick = (event: MouseEvent) => {
      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(artifacts);
      if (intersects.length > 0) {
        const object = intersects[0].object;
        setSelectedObject(object.userData.name);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);

    const animate = () => {
      requestAnimationFrame(animate);

      targetRotationY = mouseX * 0.3;
      targetRotationX = mouseY * 0.15;

      camera.position.x += (targetRotationY * 3 - camera.position.x) * 0.05;
      camera.position.y += (2 + targetRotationX * 2 - camera.position.y) * 0.05;
      camera.lookAt(0, 2, 0);

      artifacts.forEach((artifact, index) => {
        artifact.rotation.y += 0.005 + index * 0.001;
        artifact.position.y = 3 + Math.sin(Date.now() * 0.001 + index) * 0.1;
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  const handleZoomIn = () => {
    if (cameraRef.current) {
      cameraRef.current.position.z = Math.max(cameraRef.current.position.z - 1, 3);
    }
  };

  const handleZoomOut = () => {
    if (cameraRef.current) {
      cameraRef.current.position.z = Math.min(cameraRef.current.position.z + 1, 15);
    }
  };

  const handleReset = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 2, 8);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-16 relative">
      <div className="absolute top-20 left-4 z-10 space-y-4">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-lg transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour</span>
        </button>

        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-white">
          <h3 className="font-bold mb-2 flex items-center space-x-2">
            <Move className="w-4 h-4" />
            <span>Contrôles</span>
          </h3>
          <p className="text-sm text-white/80">
            Déplacez votre souris pour explorer la galerie
          </p>
        </div>

        <div className="flex flex-col space-y-2">
          <button
            onClick={handleZoomIn}
            className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-lg transition-all"
            title="Zoom avant"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-lg transition-all"
            title="Zoom arrière"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <button
            onClick={handleReset}
            className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-lg transition-all"
            title="Réinitialiser"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="absolute top-20 right-4 z-10 max-w-xs">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Galerie 3D</h2>
          <p className="text-sm text-white/80 mb-4">
            Explorez les objets de notre collection dans un espace virtuel immersif.
            Cliquez sur un objet pour en savoir plus.
          </p>
          {selectedObject && (
            <div className="mt-4 p-4 bg-amber-600/20 rounded-lg border border-amber-600/50">
              <p className="font-semibold">Sélectionné:</p>
              <p className="text-sm">{selectedObject}</p>
            </div>
          )}
        </div>
      </div>

      <div ref={mountRef} className="w-full h-screen" />
    </div>
  );
}
