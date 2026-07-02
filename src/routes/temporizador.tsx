import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Saci } from "@/components/Saci";
import { Whirlwind } from "@/components/Whirlwind";
import { useTimer } from "@/store/timer";

const TOTAL_WHIRLWINDS = 42;

export const Route = createFileRoute("/temporizador")({
  component: TimerPage,
});

function TimerPage() {
  const navigate = useNavigate();
  const { duration, startTime, isFinished, hydrate } = useTimer();

  const [isPaused, setIsPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const lastTick = useRef(Date.now());
  const isLeaving = useRef(false); // <--- Bloqueio total de reinicialização

  // 1. Só hidrata se o usuário NÃO estiver tentando sair da página
  useEffect(() => {
    if (isLeaving.current) return;
    if (!startTime || !duration) hydrate();
  }, [hydrate, startTime, duration]);

  // 2. Cronômetro acumulador
  useEffect(() => {
    if (!startTime || isFinished || isPaused || isLeaving.current) return;

    lastTick.current = Date.now();

    const interval = setInterval(() => {
      if (isLeaving.current) return;
      const currentNow = Date.now();
      const delta = currentNow - lastTick.current;

      setElapsed((prev) => Math.min(duration, prev + delta));
      lastTick.current = currentNow;
    }, 100);

    return () => clearInterval(interval);
  }, [isPaused, startTime, duration, isFinished]);

  // 3. FUNÇÃO VOLTAR CORRIGIDA: Sai da página primeiro e limpa o estado depois
  const handleBack = async () => {
    isLeaving.current = true; // Trava qualquer nova contagem no mesmo segundo
    setIsPaused(true); // Para o relógio visual instantaneamente

    // Navega para a página inicial primeiro
    await navigate({ to: "/" });

    // Limpa o Zustand apenas depois que o usuário já saiu da tela
    useTimer.setState({ startTime: null, duration: 0, isFinished: false });
  };

  const progress = duration > 0 ? Math.min(1, elapsed / duration) : 0;
  const currentIndex = Math.min(TOTAL_WHIRLWINDS - 1, Math.floor(progress * TOTAL_WHIRLWINDS));

  return (
    <main className="min-h-screen bg-sky-100 p-6">
      <div className="flex justify-between mb-8 z-50 relative">
        <button
          onClick={handleBack}
          className="px-6 py-2 bg-white rounded-full font-bold shadow-md hover:bg-gray-200 transition"
        >
          ← Voltar
        </button>
        {!isFinished && (
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="px-6 py-2 bg-emerald-600 text-white rounded-full font-bold shadow-md"
          >
            {isPaused ? "▶ Continuar" : "⏸ Pausar"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-7 gap-4">
        {Array.from({ length: TOTAL_WHIRLWINDS }).map((_, i) => (
          <div key={i} className="flex justify-center items-center">
            {i === TOTAL_WHIRLWINDS - 1 ? (
              <div className={i < currentIndex ? "opacity-30" : ""}>
                <svg width="60" height="60" viewBox="0 0 100 100">
                  <path d="M 20 85 C 20 40, 50 10, 80 85 C 50 70, 50 70, 20 85 Z" fill="#E63946" />
                  <ellipse cx="50" cy="85" rx="35" ry="8" fill="#E63946" />
                </svg>
              </div>
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
