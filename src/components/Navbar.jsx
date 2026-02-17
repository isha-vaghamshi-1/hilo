import React from "react";
import { Star, Info, Coins } from "lucide-react";

const Navbar = ({ balance, setShowRules }) => {
    return (
        <nav className="z-50 flex items-center justify-between px-4 md:px-12 py-3 md:py-5 bg-white/60 backdrop-blur-md border-b border-black/5">
            <div className="flex items-center gap-2 md:gap-4">
                <Star className="text-primary fill-primary w-6 h-6 md:w-7 md:h-7" />
                <h1 className="text-lg md:text-2xl font-extrabold tracking-widest text-slate-800">
                    HI-LO HERO
                </h1>
            </div>

            <div className="flex items-center gap-3 md:gap-6">
                <div className="flex items-center gap-2 md:gap-3 px-3 md:px-7 py-2 md:py-3 font-extrabold bg-white border border-black/5 rounded-full shadow-sm text-sm md:text-lg text-slate-900">
                    <Coins className="text-primary w-4 h-4 md:w-5 md:h-5" />
                    <span>${balance.toFixed(2)}</span>
                </div>
                <button
                    className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl shadow-sm text-slate-400 border border-black/5 hover:text-slate-600 transition-colors cursor-pointer"
                    onClick={() => setShowRules(true)}
                >
                    <Info size={20} className="md:w-6 md:h-6" />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
