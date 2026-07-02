import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Saci } from "@/components/Saci";
import { useTimer } from "@/store/timer";

export const Route = createFileRoute("/fim")({
  component: EndPage,
});

function EndPage() {
  const navigate = useNavigate();
  const reset = useTimer((s) => s.reset);

  useEffect(() => {
    reset();
  }, [reset]);

  const again = () => navigate({ to: "/" });

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-600 flex flex-col justify-between text-center">
      <div className="relative mx-auto flex flex-1 w-full max-w-xl flex-col items-center justify-center gap-6 px-6 pt-16 pb-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 14 }}
        >
          <Saci size={180} mood="celebrating" />
        </motion.div>

        <h1 className="font-display text-4xl font-bold text-emerald-950 sm:text-5xl drop-shadow-sm">
          Hora de guardar os brinquedos
        </h1>
      </div>

      {/* Base integrada ao chão verde da transição */}
      <div className="w-full bg-gradient-to-b from-transparent to-emerald-900/20 px-6 py-12 z-10">
        <div className="mx-auto max-w-md">
          <Button
            onClick={again}
            className="h-20 w-full rounded-3xl text-2xl font-display font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 bg-amber-500 text-stone-900 hover:bg-amber-400 border-b-4 border-amber-700"
          >
            Iniciar Novamente
          </Button>
        </div>
      </div>
    </main>
  );
}
