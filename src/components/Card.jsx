import React from "react";
import { motion } from "framer-motion";

const Card = ({ card, isMoving, shouldFlip, isNext, gameState }) => {
    if (!card) return null;

    // Responsive values (could be moved to a hook if needed)
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const cardWidth = isMobile ? 140 : 240;
    const cardHeight = isMobile ? 200 : 340;
    const gap = isMobile ? 40 : 64; // gap-10 vs gap-16

    const initial = isNext
        ? { rotateY: -90, opacity: 0 }
        : shouldFlip
            ? { rotateY: 90, opacity: 0 }
            : false;

    const animate = isNext
        ? {
            rotateY: 0,
            opacity: 1,
            x: isMoving ? -(cardWidth + gap) : 0,
        }
        : {
            rotateY: 0,
            opacity: isMoving ? 0 : 1,
            x: isMoving ? -100 : 0,
        };

    const transition = isNext
        ? {
            x: { duration: 0.6, ease: "easeInOut" },
            default: { duration: 0.3 },
        }
        : { duration: isMoving ? 0.4 : 0.3 };

    return (
        <motion.div
            key={card.id}
            initial={initial}
            animate={animate}
            transition={transition}
            style={{
                width: cardWidth,
                height: cardHeight,
            }}
            className={`relative p-4 md:p-8 flex flex-col justify-between bg-gradient-to-br from-white to-slate-50 rounded-[24px] md:rounded-[32px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.12)] md:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] border border-white overflow-hidden ${card.isRed ? "text-rose-500" : "text-slate-800"}`}
        >
            <div className="flex flex-col text-2xl md:text-[2.75rem] font-black leading-none uppercase">
                {card.rank}
                <span className="text-xl md:text-[2rem] mt-1">{card.suit}</span>
            </div>
            <div className="self-center text-7xl md:text-[9.5rem] drop-shadow-sm leading-none">
                {card.suit}
            </div>
            {isNext && gameState === "burst" && (
                <div className="absolute inset-0 flex items-center justify-center bg-rose-500/20 backdrop-blur-[2px] z-10 text-3xl md:text-[3.5rem] font-black tracking-[5px] md:tracking-[10px] text-white/90 shadow-inner uppercase text-center p-4">
                    BUST!
                </div>
            )}
        </motion.div>
    );
};

export default Card;
