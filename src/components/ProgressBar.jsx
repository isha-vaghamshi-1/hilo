import React from "react";
import { motion } from "framer-motion";

const ProgressBar = ({ streak, multiplier }) => {
    return (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-[600px] px-8 flex flex-col gap-3">
            <div className="flex justify-between text-xs font-black text-slate-400 tracking-widest uppercase">
                <span>Game Progress</span>
                <div className="flex items-center gap-2">
                    <span className="text-primary">{streak} Streak</span>
                    <span className="text-slate-300">|</span>
                    <span>x{multiplier.toFixed(2)}</span>
                </div>
            </div>
            <div className="h-4 bg-slate-200 rounded-full overflow-hidden shadow-inner">
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
