import { motion } from "framer-motion";

interface WhirlwindProps {
  size?: number;
  spinDuration?: number;
  isCleared?: boolean;
  delay?: number;
  isPaused?: boolean;
}

export function Whirlwind({
  size = 80,
  spinDuration = 1.2,
  isCleared = false,
  delay = 0,
  isPaused = false,
}: WhirlwindProps) {
  // Se estiver pausado, travamos as animações infinitas de rodar
  const currentDuration = isPaused ? 0 : spinDuration;

  return (
    <motion.svg
      width={size}
      height={size * 1.16}
      viewBox="0 0 120 140"
      style={{ overflow: "visible", transformOrigin: "center" }}
      // ScaleX manual aqui bloqueia qualquer sobreposição antiga no cache
      animate={{
        opacity: isCleared ? 0.15 : 1,
        scale: isCleared ? 0.8 : 1,
        scaleX: 1,
        scaleY: 1,
      }}
      transition={{ duration: 0.4 }}
    >
      <motion.g
        animate={isPaused ? { scale: 1, x: 0 } : { scale: [1, 1.05, 1], x: [-1, 1, -1] }}
        transition={{ duration: currentDuration * 1.5, repeat: Infinity, ease: "easeInOut", delay }}
      >
        <g fill="#EBE8E3">
          <circle cx="35" cy="115" r="16" />
          <circle cx="55" cy="122" r="18" />
          <circle cx="85" cy="112" r="19" />
          <circle cx="20" cy="105" r="12" />
          <circle cx="102" cy="115" r="14" />
        </g>
        <g fill="#DFDBD4">
          <circle cx="45" cy="118" r="14" />
          <circle cx="75" cy="116" r="16" />
        </g>
      </motion.g>

      <motion.g
        animate={isPaused ? { rotate: -12 } : { rotate: [-10, -14, -10] }}
        transition={{ duration: currentDuration * 2.5, repeat: Infinity, ease: "easeInOut", delay }}
        style={{ transformOrigin: "60px 70px" }}
      >
        <path d="M 53 100 A 7 3 0 0 0 67 100 L 64 112 A 4 2 0 0 1 56 112 Z" fill="#BCB7AE" />
        <path d="M 45 88 A 15 5 0 0 0 75 88 L 67 100 A 7 3 0 0 1 53 100 Z" fill="#C4BFB6" />
        <path d="M 35 74 A 25 8 0 0 0 85 74 L 75 88 A 15 5 0 0 1 45 88 Z" fill="#CFCAC2" />
        <path d="M 23 56 A 37 11 0 0 0 97 56 L 85 74 A 25 8 0 0 1 35 74 Z" fill="#D5D0C9" />
        <path d="M 10 35 A 50 15 0 0 0 110 35 L 97 56 A 37 11 0 0 1 23 56 Z" fill="#E6E3DD" />

        <ellipse cx="60" cy="35" rx="50" ry="15" fill="#F4F2EE" />
        <ellipse cx="58" cy="37" rx="38" ry="10" fill="#827D75" />
        <ellipse cx="58" cy="38" rx="28" ry="7" fill="#5C5852" />

        <motion.g
          animate={isPaused ? { scale: 1, y: 0 } : { scale: [1, 1.03, 1], y: [-2, 2, -2] }}
          transition={{ duration: currentDuration, repeat: Infinity, ease: "easeInOut", delay }}
        >
          <path d="M -5 45 Q 60 75 125 35 Q 60 65 5 40 Z" fill="#FFFFFF" opacity="0.9" />
          <path d="M 15 75 Q 60 95 105 65 Q 60 85 25 70 Z" fill="#FFFFFF" opacity="0.85" />
          <path d="M 30 95 Q 60 110 90 90 Q 60 105 40 92 Z" fill="#FFFFFF" opacity="0.8" />
        </motion.g>

        <motion.g
          animate={isPaused ? { rotate: 0 } : { rotate: [0, 360] }}
          transition={{ duration: currentDuration * 1.2, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "60px 60px" }}
        >
          <polygon points="15,20 20,18 18,24" fill="#6B665F" />
          <polygon points="105,40 110,42 108,46" fill="#5C5852" />
          <polygon points="25,90 28,85 30,92" fill="#4F4A45" />
          <polygon points="85,85 90,82 88,88" fill="#6B665F" />
          <polygon points="10,60 14,58 12,64" fill="#827D75" />
        </motion.g>
      </motion.g>
    </motion.svg>
  );
}
