export const SUITS = ["♥️", "♦️", "♣️", "♠️"];
export const RANKS = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
];
export const VALUES = {
    A: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    J: 11,
    Q: 12,
    K: 13,
};

export const getRandomCard = () => {
    const suit = SUITS[Math.floor(Math.random() * SUITS.length)];
    const rank = RANKS[Math.floor(Math.random() * RANKS.length)];
    return {
        id: Math.random(),
        suit,
        rank,
        value: VALUES[rank],
        isRed: suit === "♥️" || suit === "♦️",
    };
};
