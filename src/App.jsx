import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import Navbar from "./components/Navbar";
import BettingSidebar from "./components/BettingSidebar";
import Arena from "./components/Arena";
import StatsSidebar from "./components/StatsSidebar";
import ProgressBar from "./components/ProgressBar";
import RulesModal from "./components/RulesModal";
import { getRandomCard } from "./utils/cardUtils";

function App() {
  // Form handling (Game Data)
  const { register, watch, setValue, getValues } = useForm({
    defaultValues: {
      betAmount: 100,
      balance: 10000,
      multiplier: 1.0,
      gameState: "idle", // 'idle', 'live', 'burst'
      score: 0,
      bestScore: 0,
      streak: 0,
      showRules: false,
    },
  });

  // Watch values for reactive UI
  const {
    betAmount: betAmountValue,
    balance: balanceValue,
    multiplier: multiplierValue,
    gameState: gameStateValue,
    score: scoreValue,
    bestScore: bestScoreValue,
    streak: streakValue,
    showRules: showRulesValue,
  } = watch();

  // Logic/UI State (Not suitable for form)
  const [currentCard, setCurrentCard] = useState(getRandomCard());
  const [nextCard, setNextCard] = useState(null);

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
    const amount = getValues("betAmount");
    const currentBalance = getValues("balance");
    if (currentBalance < amount || amount <= 0) return;
    setValue("balance", currentBalance - amount);
    setValue("gameState", "live");
    setValue("multiplier", 1.0);
    setValue("score", 0);
    setValue("streak", 0);
  };

  const handleCashout = () => {
    if (gameStateValue !== "live") return;
    const amount = getValues("betAmount");
    const currentBalance = getValues("balance");
    const profit = amount * multiplierValue;
    setValue("balance", currentBalance + profit);
    setValue("multiplier", 1.0);
    setValue("gameState", "idle");
  };

  const handleSkip = () => {
    setShouldFlip(true);
    setCurrentCard(getRandomCard());
    setNextCard(null);
  };

  const handleGuess = (guess) => {
    if (
      gameStateValue !== "live" ||
      !!nextCard ||
      isRevealing ||
      isMoving
    )
      return;

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
        const newMult = multiplierValue * stepMult;

        setValue("multiplier", newMult);
        const newScore = scoreValue + 1;
        setValue("score", newScore);
        setValue("streak", streakValue + 1);
        if (newScore > bestScoreValue) setValue("bestScore", newScore);

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
        setValue("gameState", "burst");
        setValue("multiplier", 0);
        setValue("streak", 0);

        setTimeout(() => {
          setValue("gameState", "idle");
          setShouldFlip(true);
          setCurrentCard(getRandomCard());
          setNextCard(null);
        }, 2500);
      }
    }, 1200);
  };

  return (
    <div className="relative flex flex-col w-full min-h-screen overflow-hidden bg-slate-50">
      <Navbar
        balance={balanceValue}
        setShowRules={(val) => setValue("showRules", val)}
      />

      <main className="relative z-10 flex flex-1 items-center justify-center p-4 md:px-12 md:py-4 overflow-y-auto md:overflow-hidden">
        <div className="flex flex-col lg:grid lg:grid-cols-[320px_1fr_320px] items-center w-full max-w-[1550px] lg:h-[90%] gap-6 md:gap-10 py-8 lg:py-0">
          <div className="order-2 lg:order-1 w-full max-w-[400px] lg:max-w-none mx-auto">
            <BettingSidebar
              register={register}
              setValue={setValue}
              betAmountValue={betAmountValue}
              gameState={gameStateValue}
              handleBet={handleBet}
              handleCashout={handleCashout}
              handleSkip={handleSkip}
              multiplier={multiplierValue}
            />
          </div>

          <div className="order-1 lg:order-2 w-full">
            <Arena
              currentCard={currentCard}
              nextCard={nextCard}
              isRevealing={isRevealing}
              isMoving={isMoving}
              shouldFlip={shouldFlip}
              gameState={gameStateValue}
              odds={odds}
              handleGuess={handleGuess}
            />
          </div>

          <div className="order-3 lg:order-3 w-full max-w-[400px] lg:max-w-none mx-auto">
            <StatsSidebar score={scoreValue} bestScore={bestScoreValue} />
          </div>
        </div>
      </main>

      <ProgressBar streak={streakValue} multiplier={multiplierValue} />

      <RulesModal
        showRules={showRulesValue}
        setShowRules={(val) => setValue("showRules", val)}
      />
    </div>
  );
}

export default App;
