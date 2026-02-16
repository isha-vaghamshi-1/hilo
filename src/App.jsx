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
  Coins,
  Banknote
} from 'lucide-react';
import './App.css';

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
  // Balance & Betting
  const [balance, setBalance] = useState(10000);
  const [betAmount, setBetAmount] = useState(100);
  const [multiplier, setMultiplier] = useState(1.00);
  const [gameState, setGameState] = useState('idle'); // 'idle', 'live', 'burst'

  // Game Play
  const [currentCard, setCurrentCard] = useState(getRandomCard());
  const [nextCard, setNextCard] = useState(null);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [message, setMessage] = useState('');
  const [streak, setStreak] = useState(0);
  const [showRules, setShowRules] = useState(false);

  // Probability Math
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
    setLives(3);
    setMessage('GAME LIVE!');
  };

  const handleCashout = () => {
    if (gameState !== 'live') return;
    const profit = betAmount * multiplier;
    setBalance(prev => prev + profit);
    setMessage(`CASHOUT: +$${profit.toFixed(2)}`);
    setGameState('idle');
    setMultiplier(1.00);
    setTimeout(() => setMessage(''), 2000);
  };

  const handleSkip = () => {
    // Usually skip is available during play or idle
    setCurrentCard(getRandomCard());
    setNextCard(null);
    setMessage('CARD SKIPPED');
    setTimeout(() => setMessage(''), 1000);
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
      setMessage(`CORRECT! ${streak + 1} STREAK!`);

      setTimeout(() => {
        setCurrentCard(drawnCard);
        setNextCard(null);
        if (gameState === 'live') setMessage('');
      }, 800);
    } else {
      setGameState('burst');
      setMessage('BUSTED!');
      setMultiplier(0);
      setStreak(0);

      setTimeout(() => {
        setGameState('idle');
        setCurrentCard(getRandomCard());
        setNextCard(null);
        setMessage('Try again?');
      }, 2000);
    }
  };

  return (
    <div className="hero-app-shell">
      <div className="bg-ornament op-1" />
      <div className="bg-ornament op-2" />

      <nav className="top-nav">
        <div className="brand">
          <Star fill="var(--primary)" color="var(--primary)" size={28} />
          <h1>HI-LO HERO</h1>
        </div>

        <div className="top-right-stats">
          <div className="balance-box glass">
            <Coins size={20} color="var(--primary)" />
            <span>${balance.toFixed(2)}</span>
          </div>
          <button className="icon-btn" onClick={() => setShowRules(!showRules)}>
            <Info size={24} />
          </button>
        </div>
      </nav>

      <main className="main-content">
        <div className="game-hud">
          {/* Bet Panel on Left */}
          <div className="betting-sidebar glass">
            <span className="sidebar-label">WAGER CONTROL</span>

            <div className="bet-input-zone">
              <div className="input-header">
                <span>Bet Amount</span>
                <span className="min-max">Min $1</span>
              </div>
              <div className="input-with-actions">
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                  disabled={gameState === 'live'}
                />
                <div className="quick-actions">
                  <button onClick={() => setBetAmount(prev => prev / 2)} disabled={gameState === 'live'}>1/2</button>
                  <button onClick={() => setBetAmount(prev => prev * 2)} disabled={gameState === 'live'}>2x</button>
                </div>
              </div>
            </div>

            {gameState === 'idle' ? (
              <button className="main-action-btn bet-btn" onClick={handleBet}>
                PLACE BET
              </button>
            ) : (
              <button
                className="main-action-btn cashout-btn"
                onClick={handleCashout}
                disabled={multiplier <= 1 || gameState === 'burst'}
              >
                CASHOUT (${(betAmount * multiplier).toFixed(2)})
              </button>
            )}

            <button className="skip-btn-casual" onClick={handleSkip} disabled={gameState === 'burst'}>
              <SkipForward size={18} /> SKIP CARD
            </button>
          </div>

          {/* Central Area */}
          <div className="arena-v2">
            <div className="cards-wrapper">
              <div className="card-column">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentCard.id}
                    initial={{ rotateY: 90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    className={`pro-hero-card ${currentCard.isRed ? 'red' : 'black'}`}
                  >
                    <div className="c-top">{currentCard.rank}<span>{currentCard.suit}</span></div>
                    <div className="c-mid">{currentCard.suit}</div>
                  </motion.div>
                </AnimatePresence>
                <span className="c-label">CURRENT</span>
              </div>

              <div className="card-column">
                <AnimatePresence mode="wait">
                  {nextCard ? (
                    <motion.div
                      key={nextCard.id}
                      initial={{ rotateY: -90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      className={`pro-hero-card ${nextCard.isRed ? 'red' : 'black'}`}
                    >
                      <div className="c-top">{nextCard.rank}<span>{nextCard.suit}</span></div>
                      <div className="c-mid">{nextCard.suit}</div>
                      <div className="c-bot">{nextCard.rank}<span>{nextCard.suit}</span></div>
                      {gameState === 'burst' && <div className="lose-overlay-v2">BUST!</div>}
                    </motion.div>
                  ) : (
                    <div className="pro-hero-card ghost">
                      <span className="mystery">?</span>
                    </div>
                  )}
                </AnimatePresence>
                <span className="c-label">NEXT</span>
              </div>
            </div>

            <div className="interaction-hub">
              <AnimatePresence mode="wait">
                {message && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="message-toast"
                  >
                    {message}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="guess-row">
                <button
                  className="guess-btn up"
                  onClick={() => handleGuess('higher')}
                  disabled={gameState !== 'live' || !!nextCard}
                >
                  <div className="btn-content">
                    <ArrowUp size={24} />
                    <div className="btn-text">
                      <span className="dir">HIGHER</span>
                      <span className="odds">{odds.higher}% ({odds.hMult}x)</span>
                    </div>
                  </div>
                </button>

                <button
                  className="guess-btn down"
                  onClick={() => handleGuess('lower')}
                  disabled={gameState !== 'live' || !!nextCard}
                >
                  <div className="btn-content">
                    <ArrowDown size={24} />
                    <div className="btn-text">
                      <span className="dir">LOWER</span>
                      <span className="odds">{odds.lower}% ({odds.lMult}x)</span>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Stats on Right */}
          <div className="stats-sidebar glass">
            <div className="stat-unit">
              <Trophy size={18} color="var(--primary)" />
              <div className="unit-info">
                <span className="l">SESSION SCORE</span>
                <span className="v">{score}</span>
              </div>
            </div>
            <div className="stat-unit">
              <Star size={18} color="#ffbe0b" />
              <div className="unit-info">
                <span className="l">BEST STREAK</span>
                <span className="v">{bestScore}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Rules Modal */}
      <AnimatePresence>
        {showRules && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rules-overlay"
            onClick={() => setShowRules(false)}
          >
            <motion.div
              className="rules-modal glass"
              onClick={e => e.stopPropagation()}
            >
              <h2>How to Play</h2>
              <div className="rules-content">
                <div className="rule-item"><CheckCircle2 size={16} /> <span>Ace is (1). Ties are Wins!</span></div>
                <div className="rule-item"><CheckCircle2 size={16} /> <span>Every win multiplies your profit.</span></div>
                <div className="rule-item"><CheckCircle2 size={16} /> <span>Cashout anytime to secure funds.</span></div>
                <div className="rule-item"><CheckCircle2 size={16} /> <span>3 Lives before you BUST!</span></div>
              </div>
              <button className="close-rules" onClick={() => setShowRules(false)}>LET'S GO!</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
