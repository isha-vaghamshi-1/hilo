import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, ArrowDown } from "lucide-react";
import Card from "./Card";

const Arena = ({
    currentCard,
    nextCard,
    isRevealing,
    isMoving,
    shouldFlip,
    gameState,
    odds,
    handleGuess,
}) => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const cardWidth = isMobile ? 140 : 240;
    const cardHeight = isMobile ? 200 : 340;

    return (
        <div className="relative flex flex-col items-center justify-center flex-1 h-full px-4">
            <div className="flex justify-center gap-6 md:gap-16 mb-10 md:mb-14">
                {/* Current Card */}
                <div className="flex flex-col items-center gap-3 md:gap-6">
                    <Card
                        card={currentCard}
                        isMoving={isMoving}
                        shouldFlip={shouldFlip}
                        isNext={false}
                    />
                    <span className="text-[10px] md:text-sm font-black tracking-[2px] md:tracking-[4px] text-slate-400 uppercase">
                        CURRENT
                    </span>
                </div>

                {/* Next Card */}
                <div className="flex flex-col items-center gap-3 md:gap-6">
                    <AnimatePresence mode="wait">
                        {nextCard ? (
                            <Card
                                card={nextCard}
                                isMoving={isMoving}
                                isNext={true}
                                gameState={gameState}
                            />
                        ) : (
                            <div
                                style={{ width: cardWidth, height: cardHeight }}
                                className="flex flex-col items-center justify-center bg-white/40 border-2 md:border-4 border-dashed border-slate-300 rounded-[24px] md:rounded-[32px]"
                            >
                                {isRevealing ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 1,
                                                ease: "linear",
                                            }}
                                            className="w-8 h-8 md:w-16 md:h-16 border-4 md:border-8 border-slate-300 border-t-primary rounded-full"
                                        />
                                        <span className="mt-2 md:mt-4 text-slate-400 font-bold animate-pulse text-[8px] md:text-xs tracking-widest uppercase">
                                            REVEALING...
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-5xl md:text-[7.5rem] font-black text-slate-300">
                                        ?
                                    </span>
                                )}
                            </div>
                        )}
                    </AnimatePresence>
                    <span className="text-[10px] md:text-sm font-black tracking-[2px] md:tracking-[4px] text-slate-400 uppercase">
                        NEXT
                    </span>
                </div>
            </div>

            {/* Interaction Buttons */}
            <div className="w-full flex justify-center gap-4 md:gap-10">
                <button
                    onClick={() => handleGuess("higher")}
                    disabled={
                        gameState !== "live" || !!nextCard || isRevealing || isMoving
                    }
                    className="group flex-1 max-w-[200px] md:max-w-[280px] p-4 md:p-6 bg-white rounded-[20px] md:rounded-[28px] shadow-md md:shadow-lg border-2 md:border-4 border-primary hover:-translate-y-1 md:hover:-translate-y-2 hover:shadow-xl transition-all disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
                >
                    <div className="flex items-center justify-center gap-3 md:gap-5">
                        <ArrowUp size={24} className="text-slate-800 md:w-8 md:h-8" />
                        <div className="flex flex-col items-start text-left">
                            <span className="text-sm md:text-xl font-black text-slate-800">
                                HIGHER
                            </span>
                            <span className="text-[10px] md:text-sm font-bold text-slate-500">
                                {odds.higher}% ({odds.hMult}x)
                            </span>
                        </div>
                    </div>
                </button>

                <button
                    onClick={() => handleGuess("lower")}
                    disabled={
                        gameState !== "live" || !!nextCard || isRevealing || isMoving
                    }
                    className="group flex-1 max-w-[200px] md:max-w-[280px] p-4 md:p-6 bg-white rounded-[20px] md:rounded-[28px] shadow-md md:shadow-lg border-2 md:border-4 border-danger hover:-translate-y-1 md:hover:-translate-y-2 hover:shadow-xl transition-all disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
                >
                    <div className="flex items-center justify-center gap-3 md:gap-5">
                        <ArrowDown size={24} className="text-slate-800 md:w-8 md:h-8" />
                        <div className="flex flex-col items-start text-left">
                            <span className="text-sm md:text-xl font-black text-slate-800">
                                LOWER
                            </span>
                            <span className="text-[10px] md:text-sm font-bold text-slate-500">
                                {odds.lower}% ({odds.lMult}x)
                            </span>
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default Arena;
