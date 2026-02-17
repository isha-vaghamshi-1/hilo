import React from "react";
import { Trophy, Star } from "lucide-react";

const StatsSidebar = ({ score, bestScore }) => {
    return (
        <aside className="flex flex-col gap-4 md:gap-6 p-6 md:p-9 bg-white rounded-[24px] md:rounded-[36px] shadow-xl md:shadow-2xl shadow-slate-200/50 border border-white/80 self-center">
            <span className="text-xs font-extrabold tracking-[2px] text-slate-400 uppercase">
                SESSION STATS
            </span>
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-5 p-6 bg-slate-50 rounded-[26px] border border-black/5">
                    <Trophy className="text-primary" size={24} />
                    <div className="flex flex-col gap-1">
                        <span className="text-[0.65rem] font-black tracking-widest text-slate-400 uppercase">
                            SCORE
                        </span>
                        <span className="text-3xl font-black text-slate-800 leading-none">
                            {score}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-5 p-6 bg-slate-50 rounded-[26px] border border-black/5">
                    <Star className="text-amber-400" size={24} />
                    <div className="flex flex-col gap-1">
                        <span className="text-[0.65rem] font-black tracking-widest text-slate-400 uppercase">
                            BEST STREAK
                        </span>
                        <span className="text-3xl font-black text-slate-800 leading-none">
                            {bestScore}
                        </span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default StatsSidebar;
