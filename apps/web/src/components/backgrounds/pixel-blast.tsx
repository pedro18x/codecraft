'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import * as THREE from 'three'
import { cn } from '@/lib/cn'

const MAX_CLICKS = 10
const MAX_PIXEL_RATIO = 2

const SHAPE_MAP = {
  square: 0,
  circle: 1,
  triangle: 2,
  diamond: 3,
} as const

type PixelBlastVariant = keyof typeof SHAPE_MAP

interface PixelBlastProps {
  variant?: PixelBlastVariant
  pixelSize?: number
  color?: string
  patternScale?: number
  patternDensity?: number
  pixelSizeJitter?: number
  enableRipples?: boolean
  rippleSpeed?: number
  rippleThickness?: number
  rippleIntensityScale?: number
  speed?: number
  transparent?: boolean
  edgeFade?: number
  antialias?: boolean
  className?: string
  style?: CSSProperties
}

interface PixelBlastUniforms {
  uColor: THREE.IUniform<THREE.Color>
  uResolution: THREE.IUniform<THREE.Vector2>
  uTime: THREE.IUniform<number>
  uPixelSize: THREE.IUniform<number>
  uScale: THREE.IUniform<number>
  uDensity: THREE.IUniform<number>
  uPixelJitter: THREE.IUniform<number>
  uEnableRipples: THREE.IUniform<number>
  uRippleSpeed: THREE.IUniform<number>
  uRippleThickness: THREE.IUniform<number>
  uRippleIntensity: THREE.IUniform<number>
  uEdgeFade: THREE.IUniform<number>
  uShapeType: THREE.IUniform<number>
  uClickPos: THREE.IUniform<THREE.Vector2[]>
  uClickTimes: THREE.IUniform<Float32Array>
}

interface PixelBlastInstance {
  camera: THREE.OrthographicCamera
  geometry: THREE.PlaneGeometry
  material: THREE.ShaderMaterial
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>
  rafId: number
  renderer: THREE.WebGLRenderer
  resizeObserver: ResizeObserver
  scene: THREE.Scene
  uniforms: PixelBlastUniforms
  updateSize: () => void
}

const VERTEX_SHADER = `
void main() {
  gl_Position = vec4(position, 1.0);
}
`

const FRAGMENT_SHADER = `
precision highp float;

uniform vec3  uColor;
uniform vec2  uResolution;
uniform float uTime;
uniform float uPixelSize;
uniform float uScale;
uniform float uDensity;
uniform float uPixelJitter;
uniform int   uEnableRipples;
uniform float uRippleSpeed;
uniform float uRippleThickness;
uniform float uRippleIntensity;
uniform float uEdgeFade;

uniform int   uShapeType;
const int SHAPE_SQUARE   = 0;
const int SHAPE_CIRCLE   = 1;
const int SHAPE_TRIANGLE = 2;
const int SHAPE_DIAMOND  = 3;

const int MAX_CLICKS = 10;

uniform vec2  uClickPos  [MAX_CLICKS];
uniform float uClickTimes[MAX_CLICKS];

out vec4 fragColor;

float Bayer2(vec2 a) {
  a = floor(a);
  return fract(a.x / 2. + a.y * a.y * .75);
}
#define Bayer4(a) (Bayer2(.5*(a))*0.25 + Bayer2(a))
#define Bayer8(a) (Bayer4(.5*(a))*0.25 + Bayer2(a))

#define FBM_OCTAVES     5
#define FBM_LACUNARITY  1.25
#define FBM_GAIN        1.0

float hash11(float n){ return fract(sin(n)*43758.5453); }

float vnoise(vec3 p){
  vec3 ip = floor(p);
  vec3 fp = fract(p);
  float n000 = hash11(dot(ip + vec3(0.0,0.0,0.0), vec3(1.0,57.0,113.0)));
  float n100 = hash11(dot(ip + vec3(1.0,0.0,0.0), vec3(1.0,57.0,113.0)));
  float n010 = hash11(dot(ip + vec3(0.0,1.0,0.0), vec3(1.0,57.0,113.0)));
  float n110 = hash11(dot(ip + vec3(1.0,1.0,0.0), vec3(1.0,57.0,113.0)));
  float n001 = hash11(dot(ip + vec3(0.0,0.0,1.0), vec3(1.0,57.0,113.0)));
  float n101 = hash11(dot(ip + vec3(1.0,0.0,1.0), vec3(1.0,57.0,113.0)));
  float n011 = hash11(dot(ip + vec3(0.0,1.0,1.0), vec3(1.0,57.0,113.0)));
  float n111 = hash11(dot(ip + vec3(1.0,1.0,1.0), vec3(1.0,57.0,113.0)));
  vec3 w = fp*fp*fp*(fp*(fp*6.0-15.0)+10.0);
  float x00 = mix(n000, n100, w.x);
  float x10 = mix(n010, n110, w.x);
  float x01 = mix(n001, n101, w.x);
  float x11 = mix(n011, n111, w.x);
  float y0  = mix(x00, x10, w.y);
  float y1  = mix(x01, x11, w.y);
  return mix(y0, y1, w.z) * 2.0 - 1.0;
}

float fbm2(vec2 uv, float t){
  vec3 p = vec3(uv * uScale, t);
  float amp = 1.0;
  float freq = 1.0;
  float sum = 1.0;
  for (int i = 0; i < FBM_OCTAVES; ++i){
    sum  += amp * vnoise(p * freq);
    freq *= FBM_LACUNARITY;
    amp  *= FBM_GAIN;
  }
  return sum * 0.5 + 0.5;
}

float maskCircle(vec2 p, float cov){
  float r = sqrt(cov) * .25;
  float d = length(p - 0.5) - r;
  float aa = 0.5 * fwidth(d);
  return cov * (1.0 - smoothstep(-aa, aa, d * 2.0));
}

float maskTriangle(vec2 p, vec2 id, float cov){
  bool flip = mod(id.x + id.y, 2.0) > 0.5;
  if (flip) p.x = 1.0 - p.x;
  float r = sqrt(cov);
  float d  = p.y - r*(1.0 - p.x);
  float aa = fwidth(d);
  return cov * clamp(0.5 - d/aa, 0.0, 1.0);
}

float maskDiamond(vec2 p, float cov){
  float r = sqrt(cov) * 0.564;
  return step(abs(p.x - 0.49) + abs(p.y - 0.49), r);
}

void main(){
  float pixelSize = uPixelSize;
  vec2 fragCoord = gl_FragCoord.xy - uResolution * .5;
  float aspectRatio = uResolution.x / uResolution.y;

  vec2 pixelId = floor(fragCoord / pixelSize);
  vec2 pixelUV = fract(fragCoord / pixelSize);

  float cellPixelSize = 8.0 * pixelSize;
  vec2 cellId = floor(fragCoord / cellPixelSize);
  vec2 cellCoord = cellId * cellPixelSize;
  vec2 uv = cellCoord / uResolution * vec2(aspectRatio, 1.0);

  float base = fbm2(uv, uTime * 0.05);
  base = base * 0.5 - 0.65;

  float feed = base + (uDensity - 0.5) * 0.3;

  if (uEnableRipples == 1) {
    for (int i = 0; i < MAX_CLICKS; ++i){
      vec2 pos = uClickPos[i];
      if (pos.x < 0.0) continue;

      float t = max(uTime - uClickTimes[i], 0.0);
      vec2 clickUv = ((pos - uResolution * .5 - cellPixelSize * .5) / uResolution) * vec2(aspectRatio, 1.0);
      float rippleRadius = distance(uv, clickUv);
      float waveRadius = uRippleSpeed * t;
      float ring = exp(-pow((rippleRadius - waveRadius) / uRippleThickness, 2.0));
      float attenuation = exp(-t) * exp(-10.0 * rippleRadius);
      feed = max(feed, ring * attenuation * uRippleIntensity);
    }
  }

  float bayer = Bayer8(fragCoord / uPixelSize) - 0.5;
  float bw = step(0.5, feed + bayer);

  float h = fract(sin(dot(floor(fragCoord / uPixelSize), vec2(127.1, 311.7))) * 43758.5453);
  float jitterScale = 1.0 + (h - 0.5) * uPixelJitter;
  float coverage = bw * jitterScale;

  float maskValue;
  if      (uShapeType == SHAPE_CIRCLE)   maskValue = maskCircle(pixelUV, coverage);
  else if (uShapeType == SHAPE_TRIANGLE) maskValue = maskTriangle(pixelUV, pixelId, coverage);
  else if (uShapeType == SHAPE_DIAMOND)  maskValue = maskDiamond(pixelUV, coverage);
  else                                   maskValue = coverage;

  if (uEdgeFade > 0.0) {
    vec2 norm = gl_FragCoord.xy / uResolution;
    float edge = min(min(norm.x, norm.y), min(1.0 - norm.x, 1.0 - norm.y));
    float fade = smoothstep(0.0, uEdgeFade, edge);
    maskValue *= fade;
  }

  vec3 srgbColor = mix(
    uColor * 12.92,
    1.055 * pow(uColor, vec3(1.0 / 2.4)) - 0.055,
    step(0.0031308, uColor)
  );

  fragColor = vec4(srgbColor, maskValue);
}
`

function createUniforms({
  color,
  edgeFade,
  enableRipples,
  patternDensity,
  patternScale,
  pixelSize,
  pixelSizeJitter,
  rippleIntensityScale,
  rippleSpeed,
  rippleThickness,
  variant,
}: Required<
  Pick<
    PixelBlastProps,
    | 'color'
    | 'edgeFade'
    | 'enableRipples'
    | 'patternDensity'
    | 'patternScale'
    | 'pixelSize'
    | 'pixelSizeJitter'
    | 'rippleIntensityScale'
    | 'rippleSpeed'
    | 'rippleThickness'
    | 'variant'
  >
>): PixelBlastUniforms & Record<string, THREE.IUniform> {
  return {
    uColor: { value: new THREE.Color(color) },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uTime: { value: 0 },
    uPixelSize: { value: pixelSize },
    uScale: { value: patternScale },
    uDensity: { value: patternDensity },
    uPixelJitter: { value: pixelSizeJitter },
    uEnableRipples: { value: enableRipples ? 1 : 0 },
    uRippleSpeed: { value: rippleSpeed },
    uRippleThickness: { value: rippleThickness },
    uRippleIntensity: { value: rippleIntensityScale },
    uEdgeFade: { value: edgeFade },
    uShapeType: { value: SHAPE_MAP[variant] },
    uClickPos: {
      value: Array.from({ length: MAX_CLICKS }, () => new THREE.Vector2(-1, -1)),
    },
    uClickTimes: { value: new Float32Array(MAX_CLICKS) },
  }
}

function randomTimeOffset() {
  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    const values = new Uint32Array(1)
    window.crypto.getRandomValues(values)
    return values[0] / 0xffffffff
  }

  return Math.random()
}

export function PixelBlast({
  variant = 'square',
  pixelSize = 3,
  color = '#B19EEF',
  patternScale = 2,
  patternDensity = 1,
  pixelSizeJitter = 0,
  enableRipples = true,
  rippleSpeed = 0.3,
  rippleThickness = 0.1,
  rippleIntensityScale = 1,
  speed = 0.5,
  transparent = true,
  edgeFade = 0.5,
  antialias = true,
  className,
  style,
}: PixelBlastProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const instanceRef = useRef<PixelBlastInstance | null>(null)
  const speedRef = useRef(speed)
  const ripplesEnabledRef = useRef(enableRipples)
  const pixelSizeRef = useRef(pixelSize)
  const configRef = useRef({
    color,
    edgeFade,
    enableRipples,
    patternDensity,
    patternScale,
    pixelSize,
    pixelSizeJitter,
    rippleIntensityScale,
    rippleSpeed,
    rippleThickness,
    transparent,
    variant,
  })

  useEffect(() => {
    configRef.current = {
      color,
      edgeFade,
      enableRipples,
      patternDensity,
      patternScale,
      pixelSize,
      pixelSizeJitter,
      rippleIntensityScale,
      rippleSpeed,
      rippleThickness,
      transparent,
      variant,
    }
    pixelSizeRef.current = pixelSize
  }, [
    color,
    edgeFade,
    enableRipples,
    patternDensity,
    patternScale,
    pixelSize,
    pixelSizeJitter,
    rippleIntensityScale,
    rippleSpeed,
    rippleThickness,
    transparent,
    variant,
  ])

  useEffect(() => {
    const container = containerRef.current

    if (!container) {
      return
    }

    const config = configRef.current
    const uniforms = createUniforms(config)

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias,
      powerPreference: 'high-performance',
    })

    renderer.domElement.style.display = 'block'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.pointerEvents = 'none'
    renderer.domElement.style.width = '100%'
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO))

    if (config.transparent) {
      renderer.setClearAlpha(0)
    } else {
      renderer.setClearColor(0x000000, 1)
    }

    container.appendChild(renderer.domElement)

    const material = new THREE.ShaderMaterial({
      depthTest: false,
      depthWrite: false,
      fragmentShader: FRAGMENT_SHADER,
      glslVersion: THREE.GLSL3,
      transparent: true,
      uniforms,
      vertexShader: VERTEX_SHADER,
    })

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const geometry = new THREE.PlaneGeometry(2, 2)
    const mesh = new THREE.Mesh(geometry, material)
    const clock = new THREE.Clock()
    const timeOffset = randomTimeOffset() * 1000

    scene.add(mesh)

    const updateSize = () => {
      const width = container.clientWidth || 1
      const height = container.clientHeight || 1

      renderer.setSize(width, height, false)
      uniforms.uResolution.value.set(renderer.domElement.width, renderer.domElement.height)
      uniforms.uPixelSize.value = pixelSizeRef.current * renderer.getPixelRatio()
    }

    updateSize()

    const resizeObserver = new ResizeObserver(updateSize)
    resizeObserver.observe(container)

    let isDocumentVisible = !document.hidden

    const handleVisibilityChange = () => {
      isDocumentVisible = !document.hidden
    }

    const mapPointerToPixels = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect()

      if (rect.width === 0 || rect.height === 0) {
        return null
      }

      const scaleX = renderer.domElement.width / rect.width
      const scaleY = renderer.domElement.height / rect.height

      return {
        x: (clientX - rect.left) * scaleX,
        y: (rect.height - (clientY - rect.top)) * scaleY,
      }
    }

    let clickIndex = 0

    const handlePointerDown = (event: PointerEvent) => {
      if (!ripplesEnabledRef.current) {
        return
      }

      const point = mapPointerToPixels(event.clientX, event.clientY)

      if (!point) {
        return
      }

      uniforms.uClickPos.value[clickIndex].set(point.x, point.y)
      uniforms.uClickTimes.value[clickIndex] = uniforms.uTime.value
      clickIndex = (clickIndex + 1) % MAX_CLICKS
    }

    const instance: PixelBlastInstance = {
      camera,
      geometry,
      material,
      mesh,
      rafId: 0,
      renderer,
      resizeObserver,
      scene,
      uniforms,
      updateSize,
    }

    const animate = () => {
      if (!isDocumentVisible) {
        instance.rafId = requestAnimationFrame(animate)
        return
      }

      uniforms.uTime.value = timeOffset + clock.getElapsedTime() * speedRef.current
      renderer.render(scene, camera)
      instance.rafId = requestAnimationFrame(animate)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('pointerdown', handlePointerDown, { passive: true })

    instanceRef.current = instance
    instance.rafId = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('pointerdown', handlePointerDown)

      const instance = instanceRef.current

      if (!instance) {
        return
      }

      instance.resizeObserver.disconnect()
      cancelAnimationFrame(instance.rafId)
      instance.geometry.dispose()
      instance.material.dispose()
      instance.renderer.dispose()
      instance.renderer.forceContextLoss()

      if (instance.renderer.domElement.parentElement === container) {
        container.removeChild(instance.renderer.domElement)
      }

      instanceRef.current = null
    }
  }, [antialias])

  useEffect(() => {
    // Keep runtime prop sync isolated from renderer setup so Fast Refresh
    // never changes the dependency-array shape of the init effect above.
    speedRef.current = speed
    ripplesEnabledRef.current = enableRipples

    const instance = instanceRef.current

    if (!instance) {
      return
    }

    instance.uniforms.uShapeType.value = SHAPE_MAP[variant]
    instance.uniforms.uColor.value.set(color)
    instance.uniforms.uScale.value = patternScale
    instance.uniforms.uDensity.value = patternDensity
    instance.uniforms.uPixelJitter.value = pixelSizeJitter
    instance.uniforms.uEnableRipples.value = enableRipples ? 1 : 0
    instance.uniforms.uRippleSpeed.value = rippleSpeed
    instance.uniforms.uRippleThickness.value = rippleThickness
    instance.uniforms.uRippleIntensity.value = rippleIntensityScale
    instance.uniforms.uEdgeFade.value = edgeFade

    if (transparent) {
      instance.renderer.setClearAlpha(0)
    } else {
      instance.renderer.setClearColor(0x000000, 1)
    }

    instance.updateSize()
  }, [
    color,
    edgeFade,
    enableRipples,
    patternDensity,
    patternScale,
    pixelSize,
    pixelSizeJitter,
    rippleIntensityScale,
    rippleSpeed,
    rippleThickness,
    speed,
    transparent,
    variant,
  ])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn('relative size-full overflow-hidden', className)}
      style={style}
    />
  )
}
