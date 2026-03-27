import { motion } from 'framer-motion';

export function Marquee({ children, reverse = false }: { children: React.ReactNode, reverse?: boolean }) {
  return (
    <div className="flex overflow-hidden group select-none py-10">
      <motion.div 
        animate={{ x: reverse ? [ "-100%", "0%" ] : [ "0%", "-100%" ] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="flex shrink-0 items-center justify-around gap-20 min-w-full"
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}
