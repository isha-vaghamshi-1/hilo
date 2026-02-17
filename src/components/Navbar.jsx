import React from "react";
import { Star, Info, Coins } from "lucide-react";

const Navbar = ({ balance, setShowRules }) => {
    return (
        <nav className="z-50 flex items-center justify-between px-12 py-5 bg-white/60 backdrop-blur-md border-b border-black/5">
            <div className="flex items-center gap-4">
                <Star className="text-primary fill-primary" size={28} />
                <h1 className="text-2xl font-extrabold tracking-widest text-slate-800">
                    HI-LO HERO
                </h1>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 px-7 py-3 font-extrabold bg-white border border-black/5 rounded-full shadow-sm text-lg text-slate-900">
                    <Coins className="text-primary" size={20} />
                    <span>${balance.toFixed(2)}</span>
                </div>
                <button
                    className="flex items-center justify-center w-12 h-12 bg-white rounded-2xl shadow-sm text-slate-400 border border-black/5 hover:text-slate-600 transition-colors cursor-pointer"
                    onClick={() => setShowRules(true)}
                >
                    <Info size={24} />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
