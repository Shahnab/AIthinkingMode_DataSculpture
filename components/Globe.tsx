import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  uniform float u_time;
  uniform float u_intensity;

  varying vec3 v_position;
  varying vec3 v_normal;
  varying vec2 v_uv;
  varying float v_displacement;

  // Classic Perlin 3D Noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute( permute( permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  float FBM(vec3 p, int octaves) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < octaves; i++) {
      value += amplitude * snoise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    v_uv = uv;
    v_normal = normal;
    v_position = position;

    float displacement = FBM(position * 2.5 + u_time * 0.1, 4);
    v_displacement = displacement;

    vec3 newPosition = position + normal * displacement * u_intensity;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const fragmentShader = `
  uniform float u_time;
  varying vec3 v_position;
  varying vec3 v_normal;
  varying vec2 v_uv;
  varying float v_displacement;

  // Noise functions (copied from vertex shader)
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute( permute( permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  vec3 color_palette(float t) {
      vec3 a = vec3(0.5, 0.5, 0.5);
      vec3 b = vec3(0.5, 0.5, 0.5);
      vec3 c = vec3(1.0, 1.0, 1.0);
      vec3 d = vec3(0.00, 0.10, 0.20); // brown/blue/tan palette
      return a + b * cos(6.28318 * (c * t + d));
  }

  void main() {
    // Base color from displacement
    float color_noise = (v_displacement + 0.5) * 0.5;
    color_noise = mod(color_noise * 10.0 + u_time * 0.2, 1.0);
    vec3 color = color_palette(color_noise);

    // Simple lighting
    vec3 light_dir = normalize(vec3(1.0, 1.0, 1.0));
    float diffuse = clamp(dot(v_normal, light_dir), 0.0, 1.0) * 0.7 + 0.3;
    vec3 baseColor = color * diffuse;

    // --- Procedural Particle Glow ---
    // High-frequency noise for particle placement
    float particleNoise = snoise(v_position * 30.0 + u_time * 0.2);
    
    // Create a pulsing effect
    float pulse = (sin(u_time * 3.0 + v_position.x * 5.0) + 1.0) * 0.5;

    // Sharpen the noise to create dots and apply pulse
    float particleMask = smoothstep(0.8, 0.85, particleNoise * pulse);
    
    // Additive glow
    vec3 glowColor = vec3(1.0, 1.0, 0.9) * particleMask * 0.6; // Subtle warm white glow
    
    vec3 finalColor = baseColor + glowColor;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const AbstractBlob = () => {
  const groupRef = useRef<THREE.Group>(null!);

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0.0 },
      u_intensity: { value: 0.3 },
    }),
    []
  );

  useFrame((state) => {
    const { clock } = state;
    if (groupRef.current) {
        groupRef.current.rotation.y += 0.001;
        groupRef.current.rotation.x += 0.0005;
        
        const mainMaterial = (groupRef.current.children[0] as THREE.Mesh).material as THREE.ShaderMaterial;
        mainMaterial.uniforms.u_time.value = clock.getElapsedTime();
    }
  });

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(2.8, 64), []);

  return (
    <group ref={groupRef}>
      <mesh geometry={geometry}>
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          wireframe={false}
        />
      </mesh>
    </group>
  );
};


const Globe: React.FC = () => {
    return (
        <div className="absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
                {/* A soft, two-tone ambient light that prevents any part of the object from being totally black. */}
                {/* FIX: The `skyColor` prop is not valid. In react-three-fiber, constructor arguments should be passed via the `args` prop. */}
                <hemisphereLight args={[0xffffff, 0x444444, 1.5]} />
                {/* The main "key" light, providing highlights and defining the shape. */}
                <directionalLight position={[5, 5, 5]} intensity={2.0} />
                 {/* A "fill" light from another angle to soften the shadows cast by the key light. */}
                <directionalLight position={[-5, -5, -2]} intensity={0.8} />
                {/* The colored point lights for artistic effect. */}
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff0000" />
                <pointLight position={[0, 10, -5]} intensity={0.5} color="#0000ff" />
                <React.Suspense fallback={null}>
                  <AbstractBlob />
                </React.Suspense>
            </Canvas>
        </div>
    );
}

export default Globe;