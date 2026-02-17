import React from "react";
import { motion } from "framer-motion";

const ProgressBar = ({ streak, multiplier }) => {
    return (
        <div className="flex flex-col gap-2 md:gap-3 mx-auto w-full max-w-[90%] md:max-w-[600px] px-4 md:px-8 z-50 mb-6 md:mb-10">
            <div className="flex justify-between text-[10px] md:text-xs font-black text-slate-400 tracking-widest uppercase">
                <span>Game Progress</span>
                <div className="flex items-center gap-2">
                    <span className="text-primary">{streak} Streak</span>
                    <span className="text-slate-300">|</span>
                    <span>x{multiplier.toFixed(2)}</span>
                </div>
            </div>
            <div className="h-2 md:h-4 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(streak * 10, 100)}%` }} // Visual feedback for streak
                />
            </div>
        </div>
    );
};

export default ProgressBar;
