import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

const RulesModal = ({ showRules, setShowRules }) => {
    return (
        <AnimatePresence>
            {showRules && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[1000] flex items-center justify-center p-8 bg-slate-900/40 backdrop-blur-sm"
                    onClick={() => setShowRules(false)}
                >
                    <motion.div
                        initial={{ scale: 0.8, y: 50 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.8, y: 50 }}
                        className="w-full max-w-[450px] p-6 md:p-10 bg-white rounded-[32px] shadow-2xl flex flex-col gap-6 md:gap-8 text-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-wider">
                            How to Play
                        </h2>
                        <div className="flex flex-col gap-4 text-left">
                            <div className="flex items-center gap-4 font-bold text-slate-700">
                                <CheckCircle2
                                    className="text-primary flex-shrink-0"
                                    size={20}
                                />
                                <span>Ace is Lowest (Value: 1). Ties are Wins!</span>
                            </div>
                            <div className="flex items-center gap-4 font-bold text-slate-700">
                                <CheckCircle2
                                    className="text-primary flex-shrink-0"
                                    size={20}
                                />
                                <span>Every win multiplies your potential profit.</span>
                            </div>
                            <div className="flex items-center gap-4 font-bold text-slate-700">
                                <CheckCircle2
                                    className="text-primary flex-shrink-0"
                                    size={20}
                                />
                                <span>Cashout anytime to secure your funds.</span>
                            </div>
                            <div className="flex items-center gap-4 font-bold text-slate-700">
                                <XCircle className="text-rose-500 flex-shrink-0" size={20} />
                                <span>One wrong guess and you're BUSTED!</span>
                            </div>
                        </div>
                        <button
                            className="w-full p-5 font-black text-lg bg-primary text-teal-900 rounded-full shadow-[0_5px_0_#3bc2b0] active:translate-y-1 active:shadow-none transition-all uppercase cursor-pointer"
                            onClick={() => setShowRules(false)}
                        >
                            LET'S GO!
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default RulesModal;
