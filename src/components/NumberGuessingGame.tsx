import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Target, RotateCcw, Trophy, Zap, TrendingUp, TrendingDown } from "lucide-react";

interface GameState {
  targetNumber: number;
  attempts: number;
  isGameWon: boolean;
  gameStarted: boolean;
  bestScore: number | null;
}

interface FeedbackState {
  message: string;
  type: 'idle' | 'too-high' | 'too-low' | 'correct' | 'invalid';
}

export function NumberGuessingGame() {
  const [gameState, setGameState] = useState<GameState>({
    targetNumber: Math.floor(Math.random() * 100) + 1,
    attempts: 0,
    isGameWon: false,
    gameStarted: false,
    bestScore: null,
  });
  
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState<FeedbackState>({
    message: "Enter a number between 1 and 100 to start!",
    type: 'idle'
  });
  
  const { toast } = useToast();

  // Load best score from localStorage on component mount
  useEffect(() => {
    const savedBestScore = localStorage.getItem('numberGuessingBestScore');
    if (savedBestScore) {
      setGameState(prev => ({ ...prev, bestScore: parseInt(savedBestScore) }));
    }
  }, []);

  const startNewGame = () => {
    const newTarget = Math.floor(Math.random() * 100) + 1;
    setGameState(prev => ({
      ...prev,
      targetNumber: newTarget,
      attempts: 0,
      isGameWon: false,
      gameStarted: true,
    }));
    setGuess("");
    setFeedback({
      message: "New game started! Guess the number between 1 and 100.",
      type: 'idle'
    });
  };

  const handleGuess = () => {
    const numGuess = parseInt(guess);
    
    // Validation
    if (isNaN(numGuess) || numGuess < 1 || numGuess > 100) {
      setFeedback({
        message: "Please enter a valid number between 1 and 100!",
        type: 'invalid'
      });
      return;
    }

    const newAttempts = gameState.attempts + 1;
    setGameState(prev => ({ ...prev, attempts: newAttempts, gameStarted: true }));

    if (numGuess === gameState.targetNumber) {
      // Game won!
      const isNewBestScore = !gameState.bestScore || newAttempts < gameState.bestScore;
      
      if (isNewBestScore) {
        localStorage.setItem('numberGuessingBestScore', newAttempts.toString());
        setGameState(prev => ({ ...prev, bestScore: newAttempts }));
        toast({
          title: "🎉 New Best Score!",
          description: `You found the number in ${newAttempts} attempts - that's a new personal record!`,
        });
      } else {
        toast({
          title: "🎯 Congratulations!",
          description: `You found the number ${gameState.targetNumber} in ${newAttempts} attempts!`,
        });
      }

      setGameState(prev => ({ ...prev, isGameWon: true }));
      setFeedback({
        message: `🎉 Correct! The number was ${gameState.targetNumber}!`,
        type: 'correct'
      });
    } else if (numGuess < gameState.targetNumber) {
      setFeedback({
        message: `${numGuess} is too low! Try a higher number.`,
        type: 'too-low'
      });
    } else {
      setFeedback({
        message: `${numGuess} is too high! Try a lower number.`,
        type: 'too-low'
      });
    }
    
    setGuess("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !gameState.isGameWon) {
      handleGuess();
    }
  };

  const getFeedbackIcon = () => {
    switch (feedback.type) {
      case 'too-high':
        return <TrendingDown className="h-5 w-5 text-game-warning" />;
      case 'too-low':
        return <TrendingUp className="h-5 w-5 text-game-warning" />;
      case 'correct':
        return <Trophy className="h-5 w-5 text-success" />;
      case 'invalid':
        return <Zap className="h-5 w-5 text-game-error" />;
      default:
        return <Target className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getFeedbackVariant = () => {
    switch (feedback.type) {
      case 'correct':
        return 'success';
      case 'invalid':
        return 'error';
      case 'too-high':
      case 'too-low':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-primary/20 shadow-2xl backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-game-primary-glow rounded-full flex items-center justify-center shadow-lg">
            <Target className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-game-primary-glow bg-clip-text text-transparent">
            Number Guessing Game
          </CardTitle>
          <CardDescription className="text-base">
            I'm thinking of a number between 1 and 100. Can you guess it?
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Game Stats */}
          <div className="flex justify-between items-center gap-4">
            <Badge variant="outline" className="flex items-center gap-2">
              <Zap className="h-3 w-3" />
              Attempts: {gameState.attempts}
            </Badge>
            {gameState.bestScore && (
              <Badge variant="outline" className="flex items-center gap-2">
                <Trophy className="h-3 w-3" />
                Best: {gameState.bestScore}
              </Badge>
            )}
          </div>

          {/* Feedback */}
          <div 
            className={`p-4 rounded-lg border flex items-center gap-3 transition-all duration-300 ${
              feedback.type === 'correct' ? 'animate-bounce-in' : 
              feedback.type === 'invalid' ? 'animate-shake' : ''
            }`}
          >
            {getFeedbackIcon()}
            <p className="text-sm font-medium">{feedback.message}</p>
          </div>

          {/* Game Input */}
          {!gameState.isGameWon ? (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Enter your guess..."
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  onKeyPress={handleKeyPress}
                  min="1"
                  max="100"
                  className="text-center text-lg"
                  disabled={gameState.isGameWon}
                />
                <Button 
                  onClick={handleGuess}
                  variant="game"
                  size="lg"
                  disabled={!guess.trim() || gameState.isGameWon}
                >
                  <Target className="h-4 w-4" />
                  Guess
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="animate-bounce-in">
                <Trophy className="h-16 w-16 text-success mx-auto mb-2" />
                <p className="text-lg font-semibold text-success">
                  Congratulations! 🎉
                </p>
                <p className="text-sm text-muted-foreground">
                  You found the number in {gameState.attempts} attempts!
                </p>
              </div>
            </div>
          )}

          {/* New Game Button */}
          <Button 
            onClick={startNewGame}
            variant={gameState.isGameWon ? "success" : "outline"}
            size="lg"
            className="w-full"
          >
            <RotateCcw className="h-4 w-4" />
            {gameState.gameStarted ? "New Game" : "Start Game"}
          </Button>

          {/* Game Rules */}
          <div className="text-xs text-muted-foreground text-center space-y-1">
            <p>🎯 Guess the number between 1 and 100</p>
            <p>📊 Try to win in the fewest attempts possible</p>
            <p>🏆 Beat your personal best score</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}