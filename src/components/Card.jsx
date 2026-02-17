import React from "react";
import { motion } from "framer-motion";

const Card = ({ card, isMoving, shouldFlip, isNext, gameState }) => {
    if (!card) return null;

    const initial = isNext
        ? { rotateY: -90, opacity: 0 }
        : shouldFlip
            ? { rotateY: 90, opacity: 0 }
            : false;

    const animate = isNext
        ? {
            rotateY: 0,
            opacity: 1,
            x: isMoving ? -304 : 0, // 240px card + 64px (gap-16/4rem) gap
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
            className={`relative w-[240px] h-[340px] p-8 flex flex-col justify-between bg-gradient-to-br from-white to-slate-50 rounded-[32px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] border border-white overflow-hidden ${card.isRed ? "text-rose-500" : "text-slate-800"}`}
        >
            <div className="flex flex-col text-[2.75rem] font-black leading-none uppercase">
                {card.rank}
                <span className="text-[2rem] mt-1">{card.suit}</span>
            </div>
            <div className="self-center text-[9.5rem] drop-shadow-sm leading-none">
                {card.suit}
            </div>
            {isNext && gameState === "burst" && (
                <div className="absolute inset-0 flex items-center justify-center bg-rose-500/20 backdrop-blur-[2px] z-10 text-[3.5rem] font-black tracking-[10px] text-white/90 shadow-inner uppercase">
                    BUST!
                </div>
            )}
        </motion.div>
    );
};

export default Card;
