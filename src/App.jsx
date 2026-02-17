import React, { useState, useMemo } from "react";
import Navbar from "./components/Navbar";
import BettingSidebar from "./components/BettingSidebar";
import Arena from "./components/Arena";
import StatsSidebar from "./components/StatsSidebar";
import ProgressBar from "./components/ProgressBar";
import RulesModal from "./components/RulesModal";
import { getRandomCard } from "./utils/cardUtils";

function App() {
  // State
  const [balance, setBalance] = useState(10000);
  const [betAmount, setBetAmount] = useState(100);
  const [multiplier, setMultiplier] = useState(1.0);
  const [gameState, setGameState] = useState("idle"); // 'idle', 'live', 'burst'
  const [currentCard, setCurrentCard] = useState(getRandomCard());
  const [nextCard, setNextCard] = useState(null);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showRules, setShowRules] = useState(false);

  // Animation states
  const [isRevealing, setIsRevealing] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [shouldFlip, setShouldFlip] = useState(true);

  // Memoized Odds
  const odds = useMemo(() => {
    const v = currentCard.value;
    const houseEdge = 0.04;
    const hProb = (13 - v + 1) / 13;
    const lProb = v / 13;
    return {
      higher: (hProb * 100).toFixed(2),
      lower: (lProb * 100).toFixed(2),
      hMult: ((1 / hProb) * (1 - houseEdge)).toFixed(2),
      lMult: ((1 / lProb) * (1 - houseEdge)).toFixed(2),
    };
  }, [currentCard]);

  // Handlers
  const handleBet = () => {
    if (balance < betAmount || betAmount <= 0) return;
    setBalance((prev) => prev - betAmount);
    setGameState("live");
    setMultiplier(1.0);
    setScore(0);
    setStreak(0);
  };

  const handleCashout = () => {
    if (gameState !== "live") return;
    const profit = betAmount * multiplier;
    setBalance((prev) => prev + profit);
    setMultiplier(1.0);
    setGameState("idle");
  };

  const handleSkip = () => {
    setShouldFlip(true);
    setCurrentCard(getRandomCard());
    setNextCard(null);
  };

  const handleGuess = (guess) => {
    if (gameState !== "live" || !!nextCard || isRevealing || isMoving) return;

    setIsRevealing(true);

    // Suspense delay
    setTimeout(() => {
      const drawnCard = getRandomCard();
      setIsRevealing(false);
      setNextCard(drawnCard);

      let isCorrect = false;
      if (guess === "higher" && drawnCard.value >= currentCard.value)
        isCorrect = true;
      if (guess === "lower" && drawnCard.value <= currentCard.value)
        isCorrect = true;

      if (isCorrect) {
        const stepMult = parseFloat(
          guess === "higher" ? odds.hMult : odds.lMult,
        );
        const newMult = multiplier * stepMult;

        setMultiplier(newMult);
        setScore((s) => s + 1);
        setStreak((st) => st + 1);
        if (score + 1 > bestScore) setBestScore(score + 1);

        // Wait to show the card, then move it
        setTimeout(() => {
          setIsMoving(true);

          // Wait for move animation to finish
          setTimeout(() => {
            setShouldFlip(false); // DO NOT flip when shifting
            setCurrentCard(drawnCard);
            setNextCard(null);
            setIsMoving(false);
          }, 600); // Duration of the slide
        }, 800);
      } else {
        setGameState("burst");
        setMultiplier(0);
        setStreak(0);

        setTimeout(() => {
          setGameState("idle");
          setShouldFlip(true);
          setCurrentCard(getRandomCard());
          setNextCard(null);
        }, 2500);
      }
    }, 1200);
  };

  return (
    <div className="relative flex flex-col w-full h-screen overflow-hidden">
      <Navbar balance={balance} setShowRules={setShowRules} />

      <main className="relative z-10 flex flex-1 items-center justify-center px-12 py-4">
        <div className="grid grid-cols-[320px_1fr_320px] items-center w-full max-w-[1550px] h-[90%] gap-10">
          <BettingSidebar
            betAmount={betAmount}
            setBetAmount={setBetAmount}
            gameState={gameState}
            handleBet={handleBet}
            handleCashout={handleCashout}
            handleSkip={handleSkip}
            multiplier={multiplier}
          />

          <Arena
            currentCard={currentCard}
            nextCard={nextCard}
            isRevealing={isRevealing}
            isMoving={isMoving}
            shouldFlip={shouldFlip}
            gameState={gameState}
            odds={odds}
            handleGuess={handleGuess}
          />

          <StatsSidebar score={score} bestScore={bestScore} />
        </div>
      </main>

      <ProgressBar streak={streak} multiplier={multiplier} />

      <RulesModal showRules={showRules} setShowRules={setShowRules} />
    </div>
  );
}

export default App;
