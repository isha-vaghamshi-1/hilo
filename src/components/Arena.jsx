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
    return (
        <div className="relative flex flex-col items-center justify-center flex-1 h-full px-4">
            <div className="grid grid-cols-2 gap-16 mb-14">
                {/* Current Card */}
                <div className="flex flex-col items-center gap-6">
                    <Card
                        card={currentCard}
                        isMoving={isMoving}
                        shouldFlip={shouldFlip}
                        isNext={false}
                    />
                    <span className="text-sm font-black tracking-[4px] text-slate-400 uppercase">
                        CURRENT
                    </span>
                </div>

                {/* Next Card */}
                <div className="flex flex-col items-center gap-6">
                    <AnimatePresence mode="wait">
                        {nextCard ? (
                            <Card
                                card={nextCard}
                                isMoving={isMoving}
                                isNext={true}
                                gameState={gameState}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center w-[240px] h-[340px] bg-white/40 border-4 border-dashed border-slate-300 rounded-[32px]">
                                {isRevealing ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 1,
                                                ease: "linear",
                                            }}
                                            className="w-16 h-16 border-8 border-slate-300 border-t-primary rounded-full"
                                        />
                                        <span className="mt-4 text-slate-400 font-bold animate-pulse text-xs tracking-widest uppercase">
                                            REVEALING...
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-[7.5rem] font-black text-slate-300">
                                        ?
                                    </span>
                                )}
                            </div>
                        )}
                    </AnimatePresence>
                    <span className="text-sm font-black tracking-[4px] text-slate-400 uppercase">
                        NEXT
                    </span>
                </div>
            </div>

            {/* Interaction Buttons */}
            <div className="w-full flex justify-center gap-10">
                <button
                    onClick={() => handleGuess("higher")}
                    disabled={
                        gameState !== "live" || !!nextCard || isRevealing || isMoving
                    }
                    className="group flex-1 max-w-[280px] p-6 bg-white rounded-[28px] shadow-lg border-4 border-primary hover:-translate-y-2 hover:shadow-2xl transition-all disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
                >
                    <div className="flex items-center justify-center gap-5">
                        <ArrowUp size={32} className="text-slate-800" />
                        <div className="flex flex-col items-start">
                            <span className="text-xl font-black text-slate-800">HIGHER</span>
                            <span className="text-sm font-bold text-slate-500">
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
                    className="group flex-1 max-w-[280px] p-6 bg-white rounded-[28px] shadow-lg border-4 border-danger hover:-translate-y-2 hover:shadow-2xl transition-all disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
                >
                    <div className="flex items-center justify-center gap-5">
                        <ArrowDown size={32} className="text-slate-800" />
                        <div className="flex flex-col items-start">
                            <span className="text-xl font-black text-slate-800">LOWER</span>
                            <span className="text-sm font-bold text-slate-500">
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
