import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Saci } from "@/components/Saci";
import { readPersistedTimer, useTimer } from "@/store/timer";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const OPTIONS = [
  { label: "1 minuto", minutes: 1 },
  { label: "2 minutos", minutes: 2 },
  { label: "5 minutos", minutes: 5 },
  { label: "10 minutos", minutes: 10 },
];

function HomePage() {
  const navigate = useNavigate();
  const start = useTimer((s) => s.start);
  const hydrate = useTimer((s) => s.hydrate);

  useEffect(() => {
    const found = readPersistedTimer();
    if (!found) return;
    const elapsed = Date.now() - found.startTime;
    if (elapsed < found.duration) {
      hydrate();
      navigate({ to: "/temporizador" });
    }
  }, [hydrate, navigate]);

  const choose = (minutes: number) => {
    start(minutes * 60 * 1000);
    navigate({ to: "/temporizador" });
  };

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-50 flex flex-col justify-between">
      {/* Detalhes de iluminação natural do cenário */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-white/40 to-transparent blur-md" />

      {/* Conteúdo Principal (Céu / Centro) */}
      <div className="relative mx-auto flex flex-1 w-full max-w-3xl flex-col items-center justify-center gap-8 px-6 pt-12 pb-6 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-5xl font-bold text-emerald-950 sm:text-6xl drop-shadow-sm">
            Saci <span className="text-emerald-700">e os Redemoinhos</span>
          </h1>
          <p className="mt-2 text-xl text-emerald-900/70 font-medium">
            Escolha quanto tempo falta.
          </p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 14 }}
          className="my-2"
        >
          <Saci size={180} mood="calm" />
        </motion.div>
      </div>

      {/* Chão Verdinho da Floresta */}
      <div className="w-full bg-gradient-to-b from-emerald-600 to-emerald-800 rounded-t-[3.5rem] px-6 py-10 shadow-inner z-10 border-t-4 border-emerald-500/30">
        <div className="mx-auto max-w-2xl flex flex-col items-stretch gap-4 sm:flex-row sm:justify-center">
          {OPTIONS.map((opt) => (
            <Button
              key={opt.minutes}
              onClick={() => choose(opt.minutes)}
              className="h-20 flex-1 rounded-3xl px-8 text-2xl font-display font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 bg-amber-500 text-stone-900 hover:bg-amber-400 border-b-4 border-amber-700"
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>
    </main>
  );
}
