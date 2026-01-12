
export type DeviceType = 'Android' | 'iOS' | 'PC/Emulator';
export type PlayStyle = 'Aggressive' | 'Passive' | 'Balanced';
export type AimType = 'Default' | 'Precision' | 'Full Control';
export type RefreshRate = 60 | 90 | 120 | 144;
export type DragPattern = 'Straight' | 'J-Curve' | 'Circular' | 'Sharp-V' | 'L-Shape';
export type WeaponCategory = 'All-Rounder' | 'M1887 (Shotgun)' | 'Desert Eagle' | 'SMG Spray' | 'Woodpecker/SVD' | 'AWM/M82B';
export type BroadcastLevel = 'NORMAL' | 'ALERT' | 'CRITICAL';

export interface UserConfig {
  deviceBrand: string;
  deviceModel: string;
  deviceType: DeviceType;
  dpi: number;
  ramAmount: number;
  playStyle: PlayStyle;
  aimType: AimType;
  refreshRate: RefreshRate;
  fireButtonSize: number;
  weaponCategory: WeaponCategory;
  avatarUrl?: string;
  characterTheme?: 'Ghost' | 'Cyber' | 'Samurai' | 'Heavy-Metal';
  dragVelocity?: number;
  overclockEnabled?: boolean;
  hyperOverdrive?: boolean; // 200% Boost flag
  boosters?: {
    regedit: boolean;
    macro: boolean;
    fpsBoost: boolean;
    vSyncFix: boolean;
    touchOptimization: boolean;
    hardwareAcceleration: boolean;
  };
}

export interface SensiSettings {
  general: number;
  redDot: number;
  scope2x: number;
  scope4x: number;
  sniperScope: number;
  freeLook: number;
  fireButtonSize: number;
  graphicSettings: string;
  fpsSetting: string;
  dragPattern: DragPattern;
  weaponMultiplier: number;
  recoilControl: {
    vertical: number;
    horizontal: number;
    stabilization: number;
  };
  metrics: {
    speed: number;
    accuracy: number;
    stability: number;
    headshotRatio: number;
  };
  microAdjustments: {
    cursorSpeed: string;
    touchResponse: string;
    pointerSpeed: string;
    dpiValue: number;
    touchSamplingOverride?: string;
  };
  proTips: string[];
}

export interface GenerateSensiResponse {
  settings: SensiSettings;
  explanation: string;
  accuracyScore: number;
  hardwareSpecs?: {
    samplingRate: string;
    gpuOptimization: string;
    thermalThrottleWarning: boolean;
  };
  audioBase64?: string;
  timestamp?: number;
  source?: string;
  hyperSyncActive?: boolean;
}

export interface UserProfile {
  name: string;
  avatarUrl?: string;
  records: ArchiveRecord[];
  lastActive: number;
}

export interface BenchmarkResult {
  latency: number;
  stability: number;
  rating: 'S' | 'A' | 'B' | 'C';
}

export interface ArchiveRecord {
  id: string;
  timestamp: number;
  config: UserConfig;
  result: GenerateSensiResponse;
  userName?: string;
  likes?: number;
}

export interface MetaTrend {
  title: string;
  impact: 'BUFF' | 'NERF' | 'NEUTRAL';
  description: string;
  sourceUrl: string;
}

export interface ProPreset {
  name: string;
  device: string;
  specialty: string;
  image: string;
  settings: {
    general: number;
    redDot: number;
    scope2x: number;
    scope4x: number;
    sniperScope: number;
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface MapIntel {
  title: string;
  uri: string;
  address?: string;
  rating?: number;
  snippet?: string;
}

export interface WeaponStats {
  id: string;
  name: string;
  damage: number;
  rateOfFire: number;
  range: number;
  recoil: number;
  headshotPotential: number;
}
