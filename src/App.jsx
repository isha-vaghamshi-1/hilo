import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Heart,
  ArrowUp,
  ArrowDown,
  SkipForward,
  Info,
  CheckCircle2,
  Trophy,
  XCircle,
  Coins
} from 'lucide-react';

const SUITS = ['♥️', '♦️', '♣️', '♠️'];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const VALUES = {
  'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7,
  '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13
};

const getRandomCard = () => {
  const suit = SUITS[Math.floor(Math.random() * SUITS.length)];
  const rank = RANKS[Math.floor(Math.random() * RANKS.length)];
  return {
    id: Math.random(),
    suit,
    rank,
    value: VALUES[rank],
    isRed: suit === '♥️' || suit === '♦️'
  };
};

function App() {
  const [balance, setBalance] = useState(10000);
  const [betAmount, setBetAmount] = useState(100);
  const [multiplier, setMultiplier] = useState(1.00);
  const [gameState, setGameState] = useState('idle'); // 'idle', 'live', 'burst'
  const [currentCard, setCurrentCard] = useState(getRandomCard());
  const [nextCard, setNextCard] = useState(null);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [message, setMessage] = useState('');
  const [streak, setStreak] = useState(0);
  const [showRules, setShowRules] = useState(false);

  const odds = useMemo(() => {
    const v = currentCard.value;
    const houseEdge = 0.04;
    const hProb = (13 - v + 1) / 13;
    const lProb = v / 13;
    return {
      higher: ((hProb * 100)).toFixed(2),
      lower: ((lProb * 100)).toFixed(2),
      hMult: (1 / hProb * (1 - houseEdge)).toFixed(2),
      lMult: (1 / lProb * (1 - houseEdge)).toFixed(2)
    };
  }, [currentCard]);

  const handleBet = () => {
    if (balance < betAmount || betAmount <= 0) return;
    setBalance(prev => prev - betAmount);
    setGameState('live');
    setMultiplier(1.00);
    setScore(0);
    setStreak(0);
  };

  const handleCashout = () => {
    if (gameState !== 'live') return;
    const profit = betAmount * multiplier;
    setBalance(prev => prev + profit);
    setMultiplier(1.00);
  };

  const handleSkip = () => {
    setCurrentCard(getRandomCard());
    setNextCard(null);
    setNextCard(null);
  };

  const handleGuess = (guess) => {
    if (gameState !== 'live' || !!nextCard) return;

    const drawnCard = getRandomCard();
    setNextCard(drawnCard);

    let isCorrect = false;
    if (guess === 'higher' && drawnCard.value >= currentCard.value) isCorrect = true;
    if (guess === 'lower' && drawnCard.value <= currentCard.value) isCorrect = true;

    if (isCorrect) {
      const stepMult = parseFloat(guess === 'higher' ? odds.hMult : odds.lMult);
      const newMult = multiplier * stepMult;

      setMultiplier(newMult);
      setScore(s => s + 1);
      setStreak(st => st + 1);
      if (score + 1 > bestScore) setBestScore(score + 1);

      setTimeout(() => {
        setCurrentCard(drawnCard);
        setNextCard(null);
      }, 800);
    } else {
      setGameState('burst');
      setMultiplier(0);
      setStreak(0);

      setTimeout(() => {
        setGameState('idle');
        setCurrentCard(getRandomCard());
        setNextCard(null);
      }, 2000);
    }
  };

  return (
    <div className="relative flex flex-col w-full h-screen overflow-hidden">
      {/* Navigation */}
      <nav className="z-50 flex items-center justify-between px-12 py-5 bg-white/60 backdrop-blur-md border-b border-black/5">
        <div className="flex items-center gap-4">
          <Star className="text-primary fill-primary" size={28} />
          <h1 className="text-2xl font-extrabold tracking-widest text-slate-800">HI-LO HERO</h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 px-7 py-3 font-extrabold bg-white border border-black/5 rounded-full shadow-sm text-lg text-slate-900">
            <Coins className="text-primary" size={20} />
            <span>${balance.toFixed(2)}</span>
          </div>
          <button
            className="flex items-center justify-center w-12 h-12 bg-white rounded-2xl shadow-sm text-slate-400 border border-black/5 hover:text-slate-600 transition-colors"
            onClick={() => setShowRules(true)}
          >
            <Info size={24} />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-12 py-4">
        <div className="grid grid-cols-[320px_1fr_320px] items-center w-full max-w-[1550px] h-[90%] gap-10">

          {/* Betting Sidebar */}
          <aside className="flex flex-col gap-9 p-9 bg-white rounded-[36px] shadow-2xl shadow-slate-200/50 border border-white/80 self-center">
            <span className="text-xs font-extrabold tracking-[2px] text-slate-400 uppercase">WAGER CONTROL</span>

            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-sm font-bold text-slate-600">
                <span>Bet Amount</span>
                <span>Min $1</span>
              </div>
              <div className="flex flex-col gap-3">
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                  disabled={gameState === 'live'}
                  className="w-full p-4 text-xl font-bold bg-slate-100 border-2 border-transparent rounded-[18px] text-slate-900 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all disabled:opacity-50"
                />
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setBetAmount(prev => prev / 2)}
                    disabled={gameState === 'live'}
                    className="p-3 font-extrabold bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-800 hover:text-white transition-all disabled:opacity-50"
                  >
                    1/2
                  </button>
                  <button
                    onClick={() => setBetAmount(prev => prev * 2)}
                    disabled={gameState === 'live'}
                    className="p-3 font-extrabold bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-800 hover:text-white transition-all disabled:opacity-50"
                  >
                    2x
                  </button>
                </div>
              </div>
            </div>

            {gameState === 'idle' ? (
              <button
                className="w-full p-5 font-black text-lg tracking-wider bg-primary text-teal-900 rounded-[20px] shadow-[0_6px_0_#3bc2b0] hover:-translate-y-0.5 hover:shadow-[0_8px_0_#3bc2b0] active:translate-y-1 active:shadow-[0_3px_0_#3bc2b0] transition-all"
                onClick={handleBet}
              >
                PLACE BET
              </button>
            ) : (
              <button
                className="w-full p-5 font-black text-lg tracking-wider bg-amber-400 text-amber-900 rounded-[20px] shadow-[0_6px_0_#d97706] hover:-translate-y-0.5 hover:shadow-[0_8px_0_#d97706] active:translate-y-1 active:shadow-[0_3px_0_#d97706] transition-all disabled:opacity-50"
                onClick={handleCashout}
                disabled={multiplier <= 1 || gameState === 'burst'}
              >
                CASHOUT (${(betAmount * multiplier).toFixed(2)})
              </button>
            )}

            <button
              className="flex items-center justify-center gap-2 font-bold text-sm text-slate-400 hover:text-slate-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              onClick={handleSkip}
              disabled={gameState !== 'live'}
            >
              <SkipForward size={18} /> SKIP CARD
            </button>
          </aside>

          {/* Central Arena */}
          <div className="relative flex flex-col items-center justify-center flex-1 h-full px-4">

            <div className="grid grid-cols-2 gap-16 mb-14">
              {/* Current Card */}
              <div className="flex flex-col items-center gap-6">
                <motion.div
                  key={currentCard.id}
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  className={`relative w-[240px] h-[340px] p-8 flex flex-col justify-between bg-gradient-to-br from-white to-slate-50 rounded-[32px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] border border-white ${currentCard.isRed ? 'text-rose-500' : 'text-slate-800'}`}
                >
                  <div className="flex flex-col text-[2.75rem] font-black leading-none uppercase">
                    {currentCard.rank}<span className="text-[2rem] mt-1">{currentCard.suit}</span>
                  </div>
                  <div className="self-center text-[9.5rem] drop-shadow-sm leading-none">{currentCard.suit}</div>
                </motion.div>
                <span className="text-sm font-black tracking-[4px] text-slate-400 uppercase">CURRENT</span>
              </div>

              {/* Next Card */}
              <div className="flex flex-col items-center gap-6">
                <AnimatePresence mode="wait">
                  {nextCard ? (
                    <motion.div
                      key={nextCard.id}
                      initial={{ rotateY: -90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      className={`relative w-[240px] h-[340px] p-8 flex flex-col justify-between bg-gradient-to-br from-white to-slate-50 rounded-[32px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] border border-white overflow-hidden ${nextCard.isRed ? 'text-rose-500' : 'text-slate-800'}`}
                    >
                      <div className="flex flex-col text-[2.75rem] font-black leading-none uppercase">
                        {nextCard.rank}<span className="text-[2rem] mt-1">{nextCard.suit}</span>
                      </div>
                      <div className="self-center text-[9.5rem] drop-shadow-sm leading-none">{nextCard.suit}</div>
                      {gameState === 'burst' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-rose-500/20 backdrop-blur-[2px] z-10 text-[3.5rem] font-black tracking-[10px] text-white/90 shadow-inner uppercase">
                          BUST!
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <div className="flex items-center justify-center w-[240px] h-[340px] bg-white/40 border-4 border-dashed border-slate-300 rounded-[32px]">
                      <span className="text-[7.5rem] font-black text-slate-300">?</span>
                    </div>
                  )}
                </AnimatePresence>
                <span className="text-sm font-black tracking-[4px] text-slate-400 uppercase">NEXT</span>
              </div>
            </div>

            {/* Interaction Buttons */}
            <div className="w-full flex justify-center gap-10">
              <button
                onClick={() => handleGuess('higher')}
                disabled={gameState !== 'live' || !!nextCard}
                className="group flex-1 max-w-[280px] p-6 bg-white rounded-[28px] shadow-lg border-4 border-primary hover:-translate-y-2 hover:shadow-2xl transition-all disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed disabled:transform-none"
              >
                <div className="flex items-center justify-center gap-5">
                  <ArrowUp size={32} className="text-slate-800" />
                  <div className="flex flex-col items-start">
                    <span className="text-xl font-black text-slate-800">HIGHER</span>
                    <span className="text-sm font-bold text-slate-500">{odds.higher}% ({odds.hMult}x)</span>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleGuess('lower')}
                disabled={gameState !== 'live' || !!nextCard}
                className="group flex-1 max-w-[280px] p-6 bg-white rounded-[28px] shadow-lg border-4 border-danger hover:-translate-y-2 hover:shadow-2xl transition-all disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed disabled:transform-none"
              >
                <div className="flex items-center justify-center gap-5">
                  <ArrowDown size={32} className="text-slate-800" />
                  <div className="flex flex-col items-start">
                    <span className="text-xl font-black text-slate-800">LOWER</span>
                    <span className="text-sm font-bold text-slate-500">{odds.lower}% ({odds.lMult}x)</span>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Stats Sidebar */}
          <aside className="flex flex-col gap-6 p-9 bg-white rounded-[36px] shadow-2xl shadow-slate-200/50 border border-white/80 self-center">
            <span className="text-xs font-extrabold tracking-[2px] text-slate-400 uppercase">SESSION STATS</span>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-5 p-6 bg-slate-50 rounded-[26px] border border-black/5">
                <Trophy className="text-primary" size={24} />
                <div className="flex flex-col gap-1">
                  <span className="text-[0.65rem] font-black tracking-widest text-slate-400 uppercase">SCORE</span>
                  <span className="text-3xl font-black text-slate-800 leading-none">{score}</span>
                </div>
              </div>
              <div className="flex items-center gap-5 p-6 bg-slate-50 rounded-[26px] border border-black/5">
                <Star className="text-amber-400" size={24} />
                <div className="flex flex-col gap-1">
                  <span className="text-[0.65rem] font-black tracking-widest text-slate-400 uppercase">BEST STREAK</span>
                  <span className="text-3xl font-black text-slate-800 leading-none">{bestScore}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Probability Tracker Footer */}
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

      {/* Rules Modal */}
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
              className="w-full max-w-[450px] p-10 bg-white rounded-[32px] shadow-2xl flex flex-col gap-8 text-center"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-wider">How to Play</h2>
              <div className="flex flex-col gap-4 text-left">
                <div className="flex items-center gap-4 font-bold text-slate-700">
                  <CheckCircle2 className="text-primary flex-shrink-0" size={20} />
                  <span>Ace is Lowest (Value: 1). Ties are Wins!</span>
                </div>
                <div className="flex items-center gap-4 font-bold text-slate-700">
                  <CheckCircle2 className="text-primary flex-shrink-0" size={20} />
                  <span>Every win multiplies your potential profit.</span>
                </div>
                <div className="flex items-center gap-4 font-bold text-slate-700">
                  <CheckCircle2 className="text-primary flex-shrink-0" size={20} />
                  <span>Cashout anytime to secure your funds.</span>
                </div>
                <div className="flex items-center gap-4 font-bold text-slate-700">
                  <XCircle className="text-rose-500 flex-shrink-0" size={20} />
                  <span>One wrong guess and you're BUSTED!</span>
                </div>
              </div>
              <button
                className="w-full p-5 font-black text-lg bg-primary text-teal-900 rounded-full shadow-[0_5px_0_#3bc2b0] active:translate-y-1 active:shadow-none transition-all uppercase"
                onClick={() => setShowRules(false)}
              >
                LET'S GO!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
