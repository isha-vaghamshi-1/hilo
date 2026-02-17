import React from "react";
import { SkipForward } from "lucide-react";

const BettingSidebar = ({
    register,
    setValue,
    betAmountValue,
    gameState,
    handleBet,
    handleCashout,
    handleSkip,
    multiplier,
}) => {
    return (
        <aside className="flex flex-col gap-6 md:gap-9 p-6 md:p-9 bg-white rounded-[24px] md:rounded-[36px] shadow-xl md:shadow-2xl shadow-slate-200/50 border border-white/80 self-center">
            <span className="text-xs font-extrabold tracking-[2px] text-slate-400 uppercase">
                WAGER CONTROL
            </span>

            <div className="flex flex-col gap-3">
                <div className="flex justify-between text-sm font-bold text-slate-600">
                    <span>Bet Amount</span>
                </div>
                <div className="flex flex-col gap-3">
                    <input
                        type="number"
                        {...register("betAmount", { valueAsNumber: true })}
                        disabled={gameState === "live"}
                        className="w-full p-4 text-xl font-bold bg-slate-100 border-2 border-transparent rounded-[18px] text-slate-900 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all disabled:opacity-50"
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() =>
                                setValue("betAmount", Math.max(0, (betAmountValue || 0) / 2))
                            }
                            disabled={gameState === "live"}
                            className="p-3 font-extrabold bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-800 hover:text-white transition-all disabled:opacity-50 cursor-pointer"
                        >
                            1/2
                        </button>
                        <button
                            onClick={() => setValue("betAmount", (betAmountValue || 0) * 2)}
                            disabled={gameState === "live"}
                            className="p-3 font-extrabold bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-800 hover:text-white transition-all disabled:opacity-50 cursor-pointer"
                        >
                            2x
                        </button>
                    </div>
                </div>
            </div>

            {gameState === "idle" ? (
                <button
                    className="w-full p-5 font-black text-lg tracking-wider bg-primary text-teal-900 rounded-[20px] shadow-[0_6px_0_#3bc2b0] hover:-translate-y-0.5 hover:shadow-[0_8px_0_#3bc2b0] active:translate-y-1 active:shadow-[0_3px_0_#3bc2b0] transition-all cursor-pointer"
                    onClick={handleBet}
                >
                    PLACE BET
                </button>
            ) : (
                <button
                    className="w-full p-5 font-black text-lg tracking-wider bg-amber-400 text-amber-900 rounded-[20px] shadow-[0_6px_0_#d97706] hover:-translate-y-0.5 hover:shadow-[0_8px_0_#d97706] active:translate-y-1 active:shadow-[0_3px_0_#d97706] transition-all disabled:opacity-50 cursor-pointer"
                    onClick={handleCashout}
                    disabled={multiplier <= 1 || gameState === "burst"}
                >
                    CASHOUT ({((betAmountValue || 0) * multiplier).toFixed(2)})
                </button>
            )}

            <button
                className="flex items-center justify-center gap-2 font-bold text-sm text-slate-400 hover:text-slate-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                onClick={handleSkip}
                disabled={gameState !== "live"}
            >
                <SkipForward size={18} /> SKIP CARD
            </button>
        </aside>
    );
};

export default BettingSidebar;
