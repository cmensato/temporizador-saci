import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Saci } from "@/components/Saci";
import { Whirlwind } from "@/components/Whirlwind";
import { useTimer } from "@/store/timer";

function ChuvaDeGorros() {
  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ top: -100, left: `${Math.random() * 100}%` }}
          animate={{ top: "110%", rotate: [0, 15, -15, 0] }}
          transition={{
            duration: 10 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        >
          <svg width="40" height="40" viewBox="0 0 100 100">
            <path d="M 20 85 C 20 40, 50 10, 80 85 C 50 70, 50 70, 20 85 Z" fill="#E63946" />
            <ellipse cx="50" cy="85" rx="35" ry="8" fill="#E63946" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

export const Route = createFileRoute("/temporizador")({
  component: TimerPage,
});

function formatTime(ms: number): string {
  if (ms <= 0) return "00:00";
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

// --- CONFIGURAÇÃO GLOBAL DE ÁUDIO À PROVA DE BLOQUEIOS ---
type NavegadorComAudio = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof window.AudioContext;
  };

let audioCtxGlobal: AudioContext | null = null;

const getAudioContext = () => {
  if (typeof window === "undefined") return null;

  if (!audioCtxGlobal) {
    const AudioContextClass =
      window.AudioContext || (window as NavegadorComAudio).webkitAudioContext;
    if (AudioContextClass) audioCtxGlobal = new AudioContextClass();
  }

  // Destrava o áudio no momento exato da interação do usuário
  if (audioCtxGlobal && audioCtxGlobal.state === "suspended") {
    audioCtxGlobal.resume();
  }

  return audioCtxGlobal;
};

// Som seco de Caixa de Bateria (acionado no clique do redemoinho)
function tocarCaixa() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Frequências para o estalo da caixa
    osc.type = "square";
    osc.frequency.setValueAtTime(250, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  } catch (err) {
    console.error("Erro ao gerar o som da caixa:", err);
  }
}

// Alarme de reloginho (4 bips rápidos)
function tocarAlarme() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const numeroDeBips = 8;
    const duracaoBip = 0.12;
    const intervaloBip = 0.22;

    for (let i = 0; i < numeroDeBips; i++) {
      const startTime = ctx.currentTime + i * intervaloBip;
      const stopTime = startTime + duracaoBip;

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.type = "sine";
      osc.frequency.setValueAtTime(1000, startTime);

      gainNode.gain.setValueAtTime(0.6, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, stopTime);

      osc.start(startTime);
      osc.stop(stopTime);
    }
  } catch (err) {
    console.error("Erro ao gerar o som de reloginho:", err);
  }
}

function TimerPage() {
  const { duration, startTime, isFinished, hydrate } = useTimer();
  const navigate = useNavigate();

  const [elapsed, setElapsed] = useState<number>(0);
  const [isPaused, setIsPaused] = useState(false);
  const lastTick = useRef(Date.now());

  // Trava o hydrate assim que o usuário decide sair, evitando que o timer
  // "reviva" a partir do localStorage antes da navegação terminar.
  const isLeavingRef = useRef(false);

  const totalWhirlwinds = Math.max(3, Math.min(60, Math.floor(duration / 10000)));

  useEffect(() => {
    if (isLeavingRef.current) return;
    hydrate();
  }, [hydrate, startTime, duration]);

  useEffect(() => {
    if (isFinished) {
      tocarAlarme();
    }
  }, [isFinished]);

  useEffect(() => {
    if (!startTime || isFinished || isPaused) return;

    lastTick.current = Date.now();

    const interval = setInterval(() => {
      const currentNow = Date.now();
      const delta = currentNow - lastTick.current;

      setElapsed((prev) => {
        const nextElapsed = prev + delta;
        if (nextElapsed >= duration) {
          setTimeout(() => {
            useTimer.setState({ isFinished: true });
          }, 0);
          return duration;
        }
        return nextElapsed;
      });
      lastTick.current = currentNow;
    }, 100);

    return () => clearInterval(interval);
  }, [isPaused, startTime, duration, isFinished]);

  // Função Voltar "Tiro Certo"
  const handleBack = () => {
    // 1. Congela o timer imediatamente
    setIsPaused(true);

    // 2. Impede que o efeito de hydrate rode de novo e "reviva" o timer
    //    a partir do localStorage antes da navegação terminar.
    isLeavingRef.current = true;

    // 3. Limpa o estado E o localStorage (reset() chama clearPersisted()
    //    internamente — setState puro não limpava o localStorage, e era
    //    isso que fazia o hydrate() trazer o timer de volta).
    useTimer.getState().reset();

    // 4. Navegação client-side do router, sem recarregar a página.
    //    Isso evita qualquer reinicialização de estado/leitura de
    //    localStorage no meio do caminho.
    navigate({ to: "/" });
  };

  const progress = duration > 0 ? Math.min(1, elapsed / duration) : 0;

  const maxSaciIndex = totalWhirlwinds - 2;
  const currentIndex = isFinished
    ? totalWhirlwinds - 1
    : Math.min(maxSaciIndex, Math.floor(progress * (totalWhirlwinds - 1)));

  const timeRemaining = Math.max(0, duration - elapsed);

  return (
    <main className="min-h-screen bg-sky-100 p-6 flex flex-col relative">
      {isFinished && <ChuvaDeGorros />}

      <div className="flex justify-between items-center mb-8 z-50 relative bg-white/60 backdrop-blur-sm p-3 rounded-2xl shadow-sm">
        <button
          type="button"
          onClick={handleBack}
          className="px-5 py-2 bg-white rounded-full font-bold shadow-sm hover:bg-gray-200 transition text-sm cursor-pointer z-[100] relative"
        >
          ← Voltar
        </button>

        <div className="flex flex-col items-center">
          <span className="text-2xl font-black tracking-wider text-slate-800 font-mono">
            {formatTime(timeRemaining)}
          </span>
          {isFinished && (
            <span className="text-red-500 font-bold text-xs animate-pulse">Fim! 🎉</span>
          )}
        </div>

        {!isFinished ? (
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="px-5 py-2 bg-emerald-600 text-white rounded-full font-bold shadow-sm text-sm cursor-pointer z-[100] relative"
          >
            {isPaused ? "▶ Continuar" : "⏸ Pausar"}
          </button>
        ) : (
          <div className="w-[90px]" />
        )}
      </div>

      <div className="grid grid-cols-7 gap-4 auto-rows-max">
        {Array.from({ length: totalWhirlwinds }).map((_, i) => (
          <div
            key={i}
            className="flex justify-center items-center cursor-pointer hover:scale-110 transition-transform"
            onClick={tocarCaixa}
          >
            {i === totalWhirlwinds - 1 ? (
              isFinished ? (
                <Saci size={70} />
              ) : (
                <div className={i <= currentIndex ? "opacity-30" : ""}>
                  <svg width="60" height="60" viewBox="0 0 100 100">
                    <path
                      d="M 20 85 C 20 40, 50 10, 80 85 C 50 70, 50 70, 20 85 Z"
                      fill="#E63946"
                    />
                    <ellipse cx="50" cy="85" rx="35" ry="8" fill="#E63946" />
                  </svg>
                </div>
              )
            ) : i === currentIndex ? (
              <Saci size={70} />
            ) : (
              <Whirlwind size={60} isCleared={i < currentIndex} isPaused={isPaused} />
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
