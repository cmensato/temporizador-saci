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

// Função atualizada para simular o alarme de um reloginho (4 bips rápidos)
function tocarAlarme() {
  try {
    type NavegadorComAudio = Window &
      typeof globalThis & {
        webkitAudioContext?: typeof window.AudioContext;
      };

    const AudioContextClass =
      window.AudioContext || (window as NavegadorComAudio).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();

    const numeroDeBips = 4; // Quantidade de bips do alarme
    const duracaoBip = 0.12; // Tempo de duração de cada bip (em segundos)
    const intervaloBip = 0.22; // Espaçamento entre o início de cada bip

    for (let i = 0; i < numeroDeBips; i++) {
      // Calcula o momento exato em que cada som deve começar e terminar
      const startTime = ctx.currentTime + i * intervaloBip;
      const stopTime = startTime + duracaoBip;

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Usamos uma frequência de 1000Hz (padrão de bips de relógios digitais como Casio)
      osc.type = "sine";
      osc.frequency.setValueAtTime(1000, startTime);

      // Controla o volume e faz um corte limpo ao final de cada bip
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
  const navigate = useNavigate();
  const { duration, startTime, isFinished, hydrate } = useTimer();

  const [elapsed, setElapsed] = useState<number>(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const lastTick = useRef(Date.now());

  const totalWhirlwinds = Math.max(3, Math.min(60, Math.floor(duration / 10000)));

  useEffect(() => {
    hydrate();
  }, [hydrate, startTime, duration]);

  useEffect(() => {
    if (isFinished) {
      tocarAlarme();
    }
  }, [isFinished]);

  useEffect(() => {
    if (!startTime || isFinished || isPaused || isNavigating) return;

    lastTick.current = Date.now();

    const interval = setInterval(() => {
      const currentNow = Date.now();
      const delta = currentNow - lastTick.current;

      setElapsed((prev) => {
        const nextElapsed = prev + delta;
        if (nextElapsed >= duration) {
          setTimeout(() => {
            if (!isNavigating) useTimer.setState({ isFinished: true });
          }, 0);
          return duration;
        }
        return nextElapsed;
      });
      lastTick.current = currentNow;
    }, 100);

    return () => clearInterval(interval);
  }, [isPaused, startTime, duration, isFinished, isNavigating]);

  const handleBack = async () => {
    if (isNavigating) return;
    setIsNavigating(true);
    setIsPaused(true);
    try {
      await navigate({ to: "/" });
      useTimer.setState({ startTime: null, duration: 0, isFinished: false });
    } catch (error) {
      console.error("Erro ao navegar:", error);
    } finally {
      setIsNavigating(false);
    }
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
          onClick={handleBack}
          disabled={isNavigating}
          className="px-5 py-2 bg-white rounded-full font-bold shadow-sm hover:bg-gray-200 transition disabled:opacity-50 text-sm"
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
            onClick={() => setIsPaused(!isPaused)}
            className="px-5 py-2 bg-emerald-600 text-white rounded-full font-bold shadow-sm text-sm"
          >
            {isPaused ? "▶ Continuar" : "⏸ Pausar"}
          </button>
        ) : (
          <div className="w-[90px]" />
        )}
      </div>

      <div className="grid grid-cols-7 gap-4 auto-rows-max">
        {Array.from({ length: totalWhirlwinds }).map((_, i) => (
          <div key={i} className="flex justify-center items-center">
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
