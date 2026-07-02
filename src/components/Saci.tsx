import { motion } from "framer-motion";

export type SaciMood = "calm" | "attentive" | "celebrating";

interface SaciProps {
  size?: number;
  mood?: SaciMood;
}

export function Saci({ size = 160, mood = "calm" }: SaciProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 120"
      animate={mood === "celebrating" ? { y: [0, -12, 0], scale: [1, 1.05, 1] } : { y: [0, -4, 0] }}
      transition={{
        duration: mood === "celebrating" ? 0.6 : 1.2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* Corpo sólido marrom */}
      <path d="M40 62 Q35 78 50 80 Q65 78 60 62 Z" fill="oklch(0.42 0.07 50)" />

      {/* Shortinho Vermelho */}
      <path d="M38 74 L62 74 Q60 86 50 86 Q40 86 38 74 Z" fill="oklch(0.60 0.22 25)" />

      {/* Perna única */}
      <path
        d="M47 84 L47 106 Q47 112 53 112 L54 112 Q59 112 59 106 L55 84 Z"
        fill="oklch(0.38 0.06 50)"
      />
      <ellipse cx="54" cy="110" rx="6.5" ry="3" fill="oklch(0.30 0.05 50)" />

      {/* BRAÇO ESQUERDO (Adicionado!) */}
      <path
        d="M42 66 Q30 66 26 71"
        stroke="oklch(0.42 0.07 50)"
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* BRAÇO DIREITO e Cachimbo */}
      <path
        d="M58 66 Q70 66 74 71"
        stroke="oklch(0.42 0.07 50)"
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M73 71 L77 71 Q79 71 79 68 L81 64"
        stroke="oklch(0.45 0.08 45)"
        strokeWidth="2"
        fill="none"
      />
      <rect x="77" y="60" width="5" height="5" rx="1" fill="oklch(0.5 0.1 50)" />

      {/* Cabeça Redondinha */}
      <circle cx="50" cy="42" r="20" fill="oklch(0.42 0.07 50)" />
      <circle cx="35" cy="49" r="4" fill="oklch(0.72 0.16 25 / 0.4)" />
      <circle cx="65" cy="49" r="4" fill="oklch(0.72 0.16 25 / 0.4)" />

      {/* Olhos de Boneco */}
      <circle cx="39" cy="41" r="4.5" fill="oklch(0.15 0.02 50)" />
      <circle cx="37.5" cy="39.5" r="1.5" fill="white" />
      <circle cx="61" cy="41" r="4.5" fill="oklch(0.15 0.02 50)" />
      <circle cx="59.5" cy="39.5" r="1.5" fill="white" />

      {/* Boquinha */}
      <path
        d="M45 53 Q50 58 55 53"
        fill="none"
        stroke="oklch(0.20 0.03 40)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Gorro Vermelho */}
      <path
        d="M32 35 Q50 39 68 35 Q73 18 58 12 Q42 4 36 16 Q27 25 32 35 Z"
        fill="oklch(0.60 0.22 25)"
      />
    </motion.svg>
  );
}
