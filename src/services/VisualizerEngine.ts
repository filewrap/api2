
import * as THREE from 'three';

/**
 * ResonanceVisualizer
 * High-performance WebGL visualizer using Three.js and custom GLSL shaders.
 * Designed to react to audio frequency data from the Unified Audio Engine.
 */
class ResonanceVisualizer {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private material: THREE.ShaderMaterial;
  private mesh: THREE.Mesh;
  private animationFrameId: number | null = null;
  private container: HTMLElement | null = null;

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 1;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    
    // Custom Shader for "Fluid Neon Resonance"
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uAudioIntensity: { value: 0 },
        uResolution: { value: new THREE.Vector2() },
        uColorPrimary: { value: new THREE.Color(0x00f0ff) }, // Streamify Cyan
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uAudioIntensity;
        uniform vec2 uResolution;
        uniform vec3 uColorPrimary;
        varying vec2 vUv;

        // Simplex noise or similar would go here for production
        // Current implementation uses a high-performance sin/cos plasma for fluid motion
        void main() {
          vec2 p = -1.0 + 2.0 * vUv;
          p.x *= uResolution.x / uResolution.y;

          float d = length(p);
          float col = 0.0;
          
          // Fluid motion based on time and audio intensity
          col += 0.5 + 0.5 * sin(10.0 * p.x + uTime + uAudioIntensity * 5.0);
          col += 0.5 + 0.5 * cos(10.0 * p.y - uTime * 0.5);
          col *= 0.2 + (uAudioIntensity * 0.8);

          vec3 finalColor = mix(vec3(0.05, 0.05, 0.08), uColorPrimary, col * 0.5);
          finalColor += uColorPrimary * (0.1 / d) * uAudioIntensity; // Glow core

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.scene.add(this.mesh);
  }

  public init(container: HTMLElement) {
    this.container = container;
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.material.uniforms.uResolution.value.set(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);
    
    this.animate();
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  private handleResize() {
    if (!this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.renderer.setSize(width, height);
    this.material.uniforms.uResolution.value.set(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  private animate() {
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
    this.material.uniforms.uTime.value += 0.01;
    
    // In production, uAudioIntensity would be driven by an AnalyserNode
    // For now, we simulate a subtle pulse
    const simulatedIntensity = 0.5 + Math.sin(this.material.uniforms.uTime.value * 2.0) * 0.1;
    this.material.uniforms.uAudioIntensity.value = simulatedIntensity;

    this.renderer.render(this.scene, this.camera);
  }

  public updateIntensity(intensity: number) {
    this.material.uniforms.uAudioIntensity.value = intensity;
  }

  public dispose() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener('resize', this.handleResize.bind(this));
    this.renderer.dispose();
    this.material.dispose();
  }
}

export const visualizer = new ResonanceVisualizer();
