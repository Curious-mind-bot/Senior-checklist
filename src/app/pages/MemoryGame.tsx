import { useState, useEffect } from 'react';
import { Navigation } from '../components/Navigation';
import { SupportFooter } from '../components/SupportFooter';
import { Button } from '../components/ui/button';
import { RotateCcw, Trophy, Clock, Zap } from 'lucide-react';
import {
  Heart,
  Star,
  Sun,
  Moon,
  Cloud,
  Flower2,
  Apple,
  Coffee,
  Music,
  Bike,
  Home,
  Book,
  Gift,
  Bell,
  Crown,
  Gem,
} from 'lucide-react';

const icons = [
  Heart, Star, Sun, Moon, Cloud, Flower2, Apple, Coffee,
  Music, Bike, Home, Book, Gift, Bell, Crown, Gem,
];

interface Card {
  id: number;
  icon: any;
  isFlipped: boolean;
  isMatched: boolean;
}

type Difficulty = 'easy' | 'medium' | 'hard';

const difficultySettings = {
  easy: { pairs: 6, name: 'Easy (6 pairs)' },
  medium: { pairs: 8, name: 'Medium (8 pairs)' },
  hard: { pairs: 12, name: 'Hard (12 pairs)' },
};

export function MemoryGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [bestScores, setBestScores] = useState<Record<Difficulty, { moves: number; time: number } | null>>(() => {
    const saved = localStorage.getItem('memoryGameScores');
    return saved ? JSON.parse(saved) : { easy: null, medium: null, hard: null };
  });

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && !gameCompleted && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameCompleted, startTime]);

  const initializeGame = (diff: Difficulty) => {
    const pairCount = difficultySettings[diff].pairs;
    const selectedIcons = icons.slice(0, pairCount);
    const cardPairs = [...selectedIcons, ...selectedIcons];
    
    // Shuffle cards
    const shuffled = cardPairs
      .map((icon, index) => ({
        id: index,
        icon,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5);

    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setGameStarted(true);
    setGameCompleted(false);
    setStartTime(Date.now());
    setElapsedTime(0);
  };

  const handleCardClick = (cardId: number) => {
    if (!gameStarted || gameCompleted) return;
    if (flippedCards.length === 2) return;
    if (flippedCards.includes(cardId)) return;
    if (cards[cardId].isMatched) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // Update card to show as flipped
    setCards(cards.map(card =>
      card.id === cardId ? { ...card, isFlipped: true } : card
    ));

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      
      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards[firstId];
      const secondCard = cards[secondId];

      if (firstCard.icon === secondCard.icon) {
        // Match found!
        setTimeout(() => {
          setCards(cards.map(card =>
            card.id === firstId || card.id === secondId
              ? { ...card, isMatched: true, isFlipped: false }
              : card
          ));
          setMatches(matches + 1);
          setFlippedCards([]);

          // Check if game is completed
          if (matches + 1 === difficultySettings[difficulty].pairs) {
            setGameCompleted(true);
            updateBestScore();
          }
        }, 600);
      } else {
        // No match
        setTimeout(() => {
          setCards(cards.map(card =>
            card.id === firstId || card.id === secondId
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const updateBestScore = () => {
    const currentScore = bestScores[difficulty];
    const newScore = { moves: moves + 1, time: elapsedTime };
    
    if (!currentScore || moves + 1 < currentScore.moves || 
        (moves + 1 === currentScore.moves && elapsedTime < currentScore.time)) {
      const updatedScores = { ...bestScores, [difficulty]: newScore };
      setBestScores(updatedScores);
      localStorage.setItem('memoryGameScores', JSON.stringify(updatedScores));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const gridCols = difficulty === 'easy' ? 'grid-cols-3' : difficulty === 'medium' ? 'grid-cols-4' : 'grid-cols-4';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <Navigation />

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl sm:text-4xl text-gray-800 mb-2">
                Memory Game
              </h1>
              <p className="text-lg text-gray-600">
                Match all the pairs to win!
              </p>
            </div>
            <Zap className="w-12 h-12 text-purple-500" />
          </div>

          {/* Difficulty Selection */}
          {!gameStarted && (
            <div className="space-y-4 mt-6">
              <h2 className="text-xl text-gray-700">Choose Difficulty:</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(Object.keys(difficultySettings) as Difficulty[]).map((diff) => (
                  <Button
                    key={diff}
                    onClick={() => {
                      setDifficulty(diff);
                      initializeGame(diff);
                    }}
                    className="h-20 text-xl bg-purple-500 hover:bg-purple-600"
                  >
                    {difficultySettings[diff].name}
                  </Button>
                ))}
              </div>

              {/* Best Scores */}
              <div className="mt-8">
                <h2 className="text-xl text-gray-700 mb-3">Your Best Scores:</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(Object.keys(difficultySettings) as Difficulty[]).map((diff) => {
                    const score = bestScores[diff];
                    return (
                      <div
                        key={diff}
                        className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-4"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Trophy className="w-5 h-5 text-yellow-600" />
                          <p className="text-lg font-semibold text-gray-800 capitalize">
                            {diff}
                          </p>
                        </div>
                        {score ? (
                          <div className="text-sm text-gray-600">
                            <p>{score.moves} moves</p>
                            <p>{formatTime(score.time)}</p>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-400">No score yet</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Game Stats */}
          {gameStarted && (
            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Moves</p>
                <p className="text-3xl text-blue-600">{moves}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Matches</p>
                <p className="text-3xl text-green-600">
                  {matches}/{difficultySettings[difficulty].pairs}
                </p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <p className="text-sm text-gray-600">Time</p>
                </div>
                <p className="text-3xl text-purple-600">{formatTime(elapsedTime)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Game Board */}
        {gameStarted && !gameCompleted && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className={`grid ${gridCols} gap-3 sm:gap-4`}>
              {cards.map((card) => {
                const IconComponent = card.icon;
                return (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    disabled={card.isMatched || card.isFlipped}
                    className={`aspect-square rounded-xl border-4 transition-all transform hover:scale-105 ${
                      card.isMatched
                        ? 'bg-green-100 border-green-400 opacity-60'
                        : card.isFlipped
                        ? 'bg-purple-100 border-purple-400'
                        : 'bg-gradient-to-br from-blue-400 to-purple-500 border-blue-500 hover:from-blue-500 hover:to-purple-600'
                    }`}
                  >
                    {(card.isFlipped || card.isMatched) ? (
                      <IconComponent className="w-full h-full p-4 text-gray-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl sm:text-5xl text-white">?</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <Button
              onClick={() => {
                setGameStarted(false);
                setCards([]);
              }}
              variant="outline"
              className="w-full h-16 text-xl mt-6"
            >
              <RotateCcw className="w-6 h-6 mr-2" />
              New Game
            </Button>
          </div>
        )}

        {/* Victory Screen */}
        {gameCompleted && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-3xl sm:text-4xl text-gray-800 mb-2">
                🎉 Congratulations!
              </h2>
              <p className="text-xl text-gray-600">
                You completed the {difficulty} level!
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Your Moves</p>
                  <p className="text-3xl text-purple-600">{moves}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Your Time</p>
                  <p className="text-3xl text-purple-600">{formatTime(elapsedTime)}</p>
                </div>
              </div>

              {bestScores[difficulty] && 
                (moves === bestScores[difficulty].moves && elapsedTime === bestScores[difficulty].time) && (
                <div className="mt-4 p-3 bg-yellow-100 border-2 border-yellow-300 rounded-lg">
                  <p className="text-lg text-yellow-800">
                    🏆 New Best Score!
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => initializeGame(difficulty)}
                className="w-full h-16 text-xl bg-purple-500 hover:bg-purple-600"
              >
                <RotateCcw className="w-6 h-6 mr-2" />
                Play Again
              </Button>
              <Button
                onClick={() => {
                  setGameStarted(false);
                  setGameCompleted(false);
                  setCards([]);
                }}
                variant="outline"
                className="w-full h-16 text-xl"
              >
                Back to Menu
              </Button>
            </div>
          </div>
        )}
      </div>

      <SupportFooter />
    </div>
  );
}