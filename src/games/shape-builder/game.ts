export type ShapeType = "circle" | "square" | "triangle" | "rectangle" | "diamond";

export interface TemplateShape {
  type: ShapeType;
  color: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Template {
  shapes: TemplateShape[];
}

export interface ShapeBuilderStrings {
  scorePrefix: string;
  gameOverScore: string;
  gameOverTitle: string;
  gamePlayAgain: string;
  gameRestart: string;
  gameTargetReached: string;
  paletteLabel: string;
  roundLabel: string;
  shapeNames: Record<ShapeType, string>;
}

export interface ShapeBuilderConfig {
  canvas: HTMLCanvasElement;
  boardEl: HTMLElement;
  paletteEl: HTMLElement;
  scoreEl: HTMLElement;
  gameOverEl: HTMLElement;
  finalScoreEl: HTMLElement;
  gameOverTitleEl: HTMLElement;
  playAgainBtn: HTMLButtonElement;
  hintEl: HTMLElement;
  strings: ShapeBuilderStrings;
  goalScore: number;
  maxShapesPerRound: number;
  initialMuted: boolean;
  onMutedChange: (muted: boolean) => void;
  onGameOver: (score: number) => void;
  onScoreChange?: (score: number) => void;
}

export interface ShapeBuilderApi {
  getMuted: () => boolean;
  setMuted: (m: boolean) => void;
  restart: () => void;
}

export const PALETTE_ITEMS: { type: ShapeType; label: string }[] = [
  { type: "circle", label: "⬤" },
  { type: "square", label: "■" },
  { type: "triangle", label: "▲" },
  { type: "rectangle", label: "▬" },
  { type: "diamond", label: "◆" },
];

export interface PlacementResult {
  matched: boolean;
  placedShape: TemplateShape | null;
  unplaced: TemplateShape[];
  roundComplete: boolean;
}

export function evaluatePlacement(
  shapeType: ShapeType,
  tapX: number,
  tapY: number,
  unplaced: TemplateShape[],
  threshold: number
): PlacementResult {
  let bestIdx = -1;
  let bestDist = Infinity;

  for (let i = 0; i < unplaced.length; i++) {
    const s = unplaced[i];
    if (s.type !== shapeType) continue;
    const dx = tapX - s.x;
    const dy = tapY - s.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < bestDist) {
      bestDist = dist;
      bestIdx = i;
    }
  }

  if (bestIdx === -1 || bestDist > threshold) {
    return { matched: false, placedShape: null, unplaced, roundComplete: false };
  }

  const placed = unplaced[bestIdx];
  const remaining = unplaced.filter((_, i) => i !== bestIdx);
  return {
    matched: true,
    placedShape: placed,
    unplaced: remaining,
    roundComplete: remaining.length === 0,
  };
}

export function calculateStars(score: number, goalScore: number): number {
  if (score >= Math.round(goalScore * 1.4)) return 3;
  if (score >= goalScore) return 2;
  if (score >= Math.round(goalScore * 0.6)) return 1;
  return 0;
}

const TEMPLATES: Template[] = [
  {
    shapes: [
      { type: "circle", color: "#ffe082", x: 0.5, y: 0.42, w: 0.3, h: 0.3 },
      { type: "circle", color: "#333", x: 0.42, y: 0.36, w: 0.05, h: 0.05 },
      { type: "circle", color: "#333", x: 0.58, y: 0.36, w: 0.05, h: 0.05 },
      { type: "triangle", color: "#e57373", x: 0.5, y: 0.56, w: 0.08, h: 0.07 },
      { type: "circle", color: "#ef9a9a", x: 0.5, y: 0.47, w: 0.04, h: 0.04 },
      { type: "circle", color: "#ffab91", x: 0.31, y: 0.56, w: 0.07, h: 0.07 },
      { type: "circle", color: "#ffab91", x: 0.69, y: 0.56, w: 0.07, h: 0.07 },
    ],
  },
  {
    shapes: [
      { type: "square", color: "#a1887f", x: 0.5, y: 0.55, w: 0.3, h: 0.28 },
      { type: "triangle", color: "#ef5350", x: 0.5, y: 0.2, w: 0.36, h: 0.2 },
      { type: "rectangle", color: "#6d4c41", x: 0.5, y: 0.55, w: 0.08, h: 0.18 },
      { type: "circle", color: "#fff176", x: 0.4, y: 0.5, w: 0.06, h: 0.06 },
      { type: "circle", color: "#fff176", x: 0.6, y: 0.5, w: 0.06, h: 0.06 },
      { type: "square", color: "#795548", x: 0.5, y: 0.66, w: 0.1, h: 0.1 },
    ],
  },
  {
    shapes: [
      { type: "circle", color: "#f48fb1", x: 0.5, y: 0.22, w: 0.12, h: 0.12 },
      { type: "circle", color: "#f48fb1", x: 0.64, y: 0.3, w: 0.12, h: 0.12 },
      { type: "circle", color: "#f48fb1", x: 0.64, y: 0.44, w: 0.12, h: 0.12 },
      { type: "circle", color: "#f48fb1", x: 0.5, y: 0.52, w: 0.12, h: 0.12 },
      { type: "circle", color: "#f48fb1", x: 0.36, y: 0.44, w: 0.12, h: 0.12 },
      { type: "circle", color: "#f48fb1", x: 0.36, y: 0.3, w: 0.12, h: 0.12 },
      { type: "circle", color: "#fff176", x: 0.5, y: 0.37, w: 0.1, h: 0.1 },
      { type: "rectangle", color: "#66bb6a", x: 0.5, y: 0.72, w: 0.03, h: 0.3 },
    ],
  },
  {
    shapes: [
      { type: "rectangle", color: "#8d6e63", x: 0.48, y: 0.65, w: 0.08, h: 0.22 },
      { type: "triangle", color: "#4caf50", x: 0.48, y: 0.28, w: 0.36, h: 0.22 },
      { type: "triangle", color: "#388e3c", x: 0.48, y: 0.48, w: 0.28, h: 0.16 },
      { type: "circle", color: "#ef5350", x: 0.41, y: 0.42, w: 0.06, h: 0.06 },
      { type: "circle", color: "#ef5350", x: 0.55, y: 0.38, w: 0.06, h: 0.06 },
    ],
  },
  {
    shapes: [
      { type: "rectangle", color: "#e0e0e0", x: 0.5, y: 0.55, w: 0.18, h: 0.32 },
      { type: "triangle", color: "#ef5350", x: 0.5, y: 0.16, w: 0.26, h: 0.18 },
      { type: "triangle", color: "#ff9800", x: 0.5, y: 0.82, w: 0.14, h: 0.12 },
      { type: "circle", color: "#42a5f5", x: 0.5, y: 0.48, w: 0.07, h: 0.07 },
      { type: "circle", color: "#42a5f5", x: 0.5, y: 0.62, w: 0.06, h: 0.06 },
      { type: "square", color: "#ef5350", x: 0.5, y: 0.28, w: 0.04, h: 0.04 },
    ],
  },
  {
    shapes: [
      { type: "circle", color: "#ce93d8", x: 0.3, y: 0.45, w: 0.14, h: 0.14 },
      { type: "circle", color: "#ce93d8", x: 0.5, y: 0.34, w: 0.14, h: 0.14 },
      { type: "circle", color: "#ce93d8", x: 0.7, y: 0.45, w: 0.14, h: 0.14 },
      { type: "circle", color: "#ce93d8", x: 0.4, y: 0.6, w: 0.14, h: 0.14 },
      { type: "circle", color: "#ce93d8", x: 0.6, y: 0.6, w: 0.14, h: 0.14 },
      { type: "diamond", color: "#ffd54f", x: 0.5, y: 0.5, w: 0.1, h: 0.1 },
    ],
  },
  {
    shapes: [
      { type: "square", color: "#fff9c4", x: 0.5, y: 0.45, w: 0.36, h: 0.36 },
      { type: "triangle", color: "#ff8a65", x: 0.5, y: 0.74, w: 0.2, h: 0.14 },
      { type: "circle", color: "#81c784", x: 0.35, y: 0.3, w: 0.1, h: 0.1 },
      { type: "circle", color: "#81c784", x: 0.65, y: 0.3, w: 0.1, h: 0.1 },
      { type: "circle", color: "#81c784", x: 0.5, y: 0.2, w: 0.1, h: 0.1 },
      { type: "diamond", color: "#ef5350", x: 0.5, y: 0.45, w: 0.06, h: 0.06 },
    ],
  },
  {
    shapes: [
      { type: "rectangle", color: "#90a4ae", x: 0.5, y: 0.55, w: 0.3, h: 0.38 },
      { type: "triangle", color: "#7986cb", x: 0.5, y: 0.1, w: 0.3, h: 0.18 },
      { type: "square", color: "#4fc3f7", x: 0.5, y: 0.42, w: 0.1, h: 0.1 },
      { type: "square", color: "#4fc3f7", x: 0.5, y: 0.64, w: 0.09, h: 0.09 },
      { type: "diamond", color: "#ffca28", x: 0.2, y: 0.3, w: 0.07, h: 0.07 },
      { type: "diamond", color: "#ffca28", x: 0.8, y: 0.3, w: 0.07, h: 0.07 },
      { type: "circle", color: "#ef5350", x: 0.5, y: 0.84, w: 0.05, h: 0.05 },
    ],
  },
  {
    shapes: [
      { type: "circle", color: "#ffcc80", x: 0.5, y: 0.4, w: 0.38, h: 0.38 },
      { type: "triangle", color: "#a5d6a7", x: 0.5, y: 0.06, w: 0.22, h: 0.14 },
      { type: "square", color: "#ef9a9a", x: 0.5, y: 0.68, w: 0.24, h: 0.24 },
      { type: "diamond", color: "#90caf9", x: 0.5, y: 0.5, w: 0.1, h: 0.1 },
      { type: "circle", color: "#333", x: 0.38, y: 0.34, w: 0.06, h: 0.06 },
      { type: "circle", color: "#333", x: 0.62, y: 0.34, w: 0.06, h: 0.06 },
      { type: "circle", color: "#f48fb1", x: 0.44, y: 0.65, w: 0.05, h: 0.05 },
      { type: "circle", color: "#f48fb1", x: 0.56, y: 0.65, w: 0.05, h: 0.05 },
    ],
  },
  {
    shapes: [
      { type: "diamond", color: "#fff176", x: 0.5, y: 0.35, w: 0.2, h: 0.2 },
      { type: "diamond", color: "#fff176", x: 0.44, y: 0.43, w: 0.1, h: 0.1 },
      { type: "diamond", color: "#fff176", x: 0.56, y: 0.43, w: 0.1, h: 0.1 },
      { type: "diamond", color: "#fff176", x: 0.38, y: 0.5, w: 0.08, h: 0.08 },
      { type: "diamond", color: "#fff176", x: 0.62, y: 0.5, w: 0.08, h: 0.08 },
      { type: "diamond", color: "#fff176", x: 0.34, y: 0.57, w: 0.06, h: 0.06 },
      { type: "diamond", color: "#fff176", x: 0.66, y: 0.57, w: 0.06, h: 0.06 },
      { type: "diamond", color: "#fff176", x: 0.5, y: 0.6, w: 0.06, h: 0.06 },
      { type: "diamond", color: "#f44336", x: 0.5, y: 0.18, w: 0.06, h: 0.06 },
    ],
  },
];

export function getTemplates(): Template[] {
  return TEMPLATES;
}

function drawShape(
  ctx: CanvasRenderingContext2D,
  s: TemplateShape,
  normalize: (nx: number, ny: number) => { x: number; y: number },
  alpha: number
): void {
  const pos = normalize(s.x, s.y);
  const hw = ((s.w / 2));
  const hh = ((s.h / 2));
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = s.color;

  const cx = pos.x;
  const cy = pos.y;

  switch (s.type) {
    case "circle":
      ctx.beginPath();
      ctx.arc(cx, cy, hw, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "square":
      ctx.fillRect(cx - hw, cy - hh, s.w, s.h);
      break;
    case "triangle":
      ctx.beginPath();
      ctx.moveTo(cx, cy - hh);
      ctx.lineTo(cx - hw, cy + hh);
      ctx.lineTo(cx + hw, cy + hh);
      ctx.closePath();
      ctx.fill();
      break;
    case "rectangle":
      ctx.fillRect(cx - hw, cy - hh, s.w, s.h);
      break;
    case "diamond":
      ctx.beginPath();
      ctx.moveTo(cx, cy - hh);
      ctx.lineTo(cx + hw, cy);
      ctx.lineTo(cx, cy + hh);
      ctx.lineTo(cx - hw, cy);
      ctx.closePath();
      ctx.fill();
      break;
  }

  ctx.restore();
}

function drawShapeOutline(
  ctx: CanvasRenderingContext2D,
  s: TemplateShape,
  normalize: (nx: number, ny: number) => { x: number; y: number }
): void {
  const pos = normalize(s.x, s.y);
  const hw = ((s.w / 2)) + 2;
  const hh = ((s.h / 2)) + 2;
  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.strokeStyle = "#2e7d32";
  ctx.lineWidth = 2;

  const cx = pos.x;
  const cy = pos.y;

  switch (s.type) {
    case "circle":
      ctx.beginPath();
      ctx.arc(cx, cy, hw, 0, Math.PI * 2);
      ctx.stroke();
      break;
    case "square":
      ctx.strokeRect(cx - hw, cy - hh, hw * 2, hh * 2);
      break;
    case "triangle":
      ctx.beginPath();
      ctx.moveTo(cx, cy - hh);
      ctx.lineTo(cx - hw, cy + hh);
      ctx.lineTo(cx + hw, cy + hh);
      ctx.closePath();
      ctx.stroke();
      break;
    case "rectangle":
      ctx.strokeRect(cx - hw, cy - hh, hw * 2, hh * 2);
      break;
    case "diamond":
      ctx.beginPath();
      ctx.moveTo(cx, cy - hh);
      ctx.lineTo(cx + hw, cy);
      ctx.lineTo(cx, cy + hh);
      ctx.lineTo(cx - hw, cy);
      ctx.closePath();
      ctx.stroke();
      break;
  }

  ctx.restore();
}

export function initShapeBuilder(config: ShapeBuilderConfig): ShapeBuilderApi {
  const {
    canvas, boardEl, paletteEl, scoreEl, gameOverEl,
    finalScoreEl, gameOverTitleEl, playAgainBtn, hintEl,
    strings, goalScore, maxShapesPerRound, onGameOver,
  } = config;

  const ctx = canvas.getContext("2d")!;
  let muted = config.initialMuted;
  let score = 0;
  let roundIdx = 0;
  let unplaced: TemplateShape[] = [];
  let placed: TemplateShape[] = [];
  let selectedType: ShapeType = "circle";
  let feedbackText = "";
  let feedbackColor = "";
  let feedbackTimer = 0;
  let gameRunning = true;
  let interactionLocked = false;

  let audioCtx: AudioContext | null = null;
  let masterGain: GainNode | null = null;

  const ensureAudio = (): AudioContext | null => {
    if (typeof window === "undefined") return null;
    if (audioCtx) return audioCtx;
    const AC = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.15;
    masterGain.connect(audioCtx.destination);
    return audioCtx;
  };

  const playTone = (freq: number, duration: number, type: OscillatorType): void => {
    if (muted) return;
    const aCtx = ensureAudio();
    if (!aCtx || !masterGain || aCtx.state !== "running") return;
    const now = aCtx.currentTime;
    const osc = aCtx.createOscillator();
    const env = aCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    env.gain.setValueAtTime(0.0001, now);
    env.gain.exponentialRampToValueAtTime(0.06, now + 0.01);
    env.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(env);
    env.connect(masterGain);
    osc.start(now);
    osc.stop(now + duration + 0.01);
  };

  const playPlaceSound = (): void => {
    playTone(660, 0.08, "sine");
    setTimeout(() => playTone(880, 0.1, "sine"), 60);
  };

  const playWrongSound = (): void => {
    playTone(200, 0.15, "sawtooth");
  };

  const playWinSound = (): void => {
    playTone(523, 0.1, "square");
    setTimeout(() => playTone(659, 0.1, "square"), 100);
    setTimeout(() => playTone(784, 0.1, "square"), 200);
    setTimeout(() => playTone(1047, 0.2, "square"), 300);
  };

  const toCanvas = (nx: number, ny: number): { x: number; y: number } => {
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);
    return { x: nx * w, y: ny * h };
  };

  const getCanvasCoords = (clientX: number, clientY: number): { x: number; y: number } => {
    const rect = canvas.getBoundingClientRect();
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);
    const sx = w / rect.width;
    const sy = h / rect.height;
    return {
      x: (clientX - rect.left) * sx / w,
      y: (clientY - rect.top) * sy / h,
    };
  };

  const resizeCanvas = (): void => {
    const rect = boardEl.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = Math.min(rect.width, 480);
    const h = Math.round(w * 1.0);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const buildPalette = (): void => {
    paletteEl.innerHTML = "";
    PALETTE_ITEMS.forEach((item) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "sb-shape-btn";
      btn.dataset.shape = item.type;
      btn.textContent = item.label;
      btn.addEventListener("click", () => {
        selectedType = item.type;
        paletteEl.querySelectorAll(".sb-shape-btn").forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
      });
      paletteEl.appendChild(btn);
    });
    (paletteEl.firstChild as HTMLElement)?.classList.add("selected");
  };

  const templates = getTemplates();

  const nextRound = (): void => {
    if (roundIdx >= templates.length) {
      if (score >= goalScore) {
        endGame(true);
      } else {
        endGame(false);
      }
      return;
    }

    const template = templates[roundIdx];
    unplaced = template.shapes.slice(0, maxShapesPerRound);
    placed = [];
    feedbackText = "";
    interactionLocked = false;
    roundIdx++;
    hintEl.textContent = `${strings.roundLabel} ${roundIdx}/${templates.length}`;
  };

  const handlePlace = (clientX: number, clientY: number): void => {
    if (!gameRunning || interactionLocked) return;

    const pos = getCanvasCoords(clientX, clientY);
    const threshold = 0.06;

    const result = evaluatePlacement(selectedType, pos.x, pos.y, unplaced, threshold);

    if (result.matched && result.placedShape) {
      placed.push(result.placedShape);
      unplaced = result.unplaced;
      score++;
      if (config.onScoreChange) config.onScoreChange(score);
      scoreEl.textContent = `${strings.scorePrefix}: ${score}`;
      feedbackText = "";
      playPlaceSound();

      if (result.roundComplete) {
        interactionLocked = true;
        setTimeout(() => {
          if (score >= goalScore) {
            endGame(true);
          } else {
            nextRound();
          }
        }, 600);
      }
    } else {
      feedbackText = `✗`;
      feedbackColor = "#e53935";
      feedbackTimer = performance.now();
      playWrongSound();
      boardEl.classList.add("sb-shake");
      setTimeout(() => boardEl.classList.remove("sb-shake"), 400);
    }
  };

  const endGame = (won: boolean): void => {
    gameRunning = false;
    if (won) {
      playWinSound();
      gameOverTitleEl.textContent = `★ ${strings.gameTargetReached}`;
      gameOverEl.dataset.state = "win";
    } else {
      gameOverTitleEl.textContent = strings.gameOverTitle;
      delete gameOverEl.dataset.state;
    }
    finalScoreEl.textContent = `${strings.gameOverScore} ${score}`;
    playAgainBtn.textContent = strings.gamePlayAgain;
    gameOverEl.classList.add("visible");
    onGameOver(score);
  };

  const restart = (): void => {
    score = 0;
    roundIdx = 0;
    gameRunning = true;
    feedbackText = "";
    scoreEl.textContent = `${strings.scorePrefix}: 0`;
    gameOverEl.classList.remove("visible");
    delete gameOverEl.dataset.state;
    nextRound();
  };

  const render = (): void => {
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);

    ctx.clearRect(0, 0, w, h);

    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, "#e3f2fd");
    bg.addColorStop(0.3, "#bbdefb");
    bg.addColorStop(0.6, "#f3e5f5");
    bg.addColorStop(1, "#c8e6c9");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    for (const s of unplaced) {
      drawShape(ctx, s, toCanvas, 0.2);
    }

    for (const s of placed) {
      drawShape(ctx, s, toCanvas, 1.0);
    }

    for (const s of placed) {
      drawShapeOutline(ctx, s, toCanvas);
    }

    if (unplaced.length > 0) {
      ctx.save();
      ctx.fillStyle = "#555";
      ctx.font = "bold 11px 'Press Start 2P', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText(strings.shapeNames[selectedType], w / 2, h - 4);
      ctx.restore();
    }

    if (feedbackText && performance.now() - feedbackTimer < 1000) {
      const alpha = Math.max(0, 1 - (performance.now() - feedbackTimer) / 1000);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = feedbackColor;
      ctx.font = "bold 16px 'Press Start 2P', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(feedbackText, w / 2, h * 0.06);
      ctx.restore();
    }

    requestAnimationFrame(render);
  };

  const handleCanvasClick = (e: MouseEvent | TouchEvent): void => {
    if (!gameRunning) return;
    const aCtx = ensureAudio();
    if (aCtx?.state === "suspended") aCtx.resume().catch(() => undefined);

    let clientX: number, clientY: number;
    if ("touches" in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
      e.preventDefault();
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    handlePlace(clientX, clientY);
  };

  canvas.addEventListener("click", handleCanvasClick);
  canvas.addEventListener("touchstart", handleCanvasClick, { passive: false });
  playAgainBtn.addEventListener("click", () => restart());
  window.addEventListener("resize", resizeCanvas);

  resizeCanvas();
  buildPalette();
  nextRound();
  render();

  return {
    getMuted: () => muted,
    setMuted: (m: boolean) => {
      muted = m;
      config.onMutedChange(m);
    },
    restart,
  };
}
