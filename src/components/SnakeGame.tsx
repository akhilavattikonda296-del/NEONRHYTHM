import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, Play } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export default function SnakeGame({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  const nextDirectionRef = useRef(INITIAL_DIRECTION);

  const generateFood = useCallback((currentSnake: { x: number, y: number }[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const currentDirection = nextDirectionRef.current;
      setDirection(currentDirection);
      
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + currentDirection.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + currentDirection.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        setIsPaused(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        const newScore = score + 10;
        setScore(newScore);
        onScoreChange(newScore);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, isGameOver, isPaused, score, generateFood, onScoreChange]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (direction.y === 0) nextDirectionRef.current = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (direction.y === 0) nextDirectionRef.current = { x: 0, y: 1 };
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (direction.x === 0) nextDirectionRef.current = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (direction.x === 0) nextDirectionRef.current = { x: 1, y: 0 };
        break;
      case ' ':
        setIsPaused(p => !p);
        break;
    }
  }, [direction]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const animate = useCallback((time: number) => {
    if (lastUpdateTimeRef.current === 0) lastUpdateTimeRef.current = time;
    const deltaTime = time - lastUpdateTimeRef.current;

    // Control speed: 100ms per move
    if (deltaTime > 100) {
      moveSnake();
      lastUpdateTimeRef.current = time;
    }

    gameLoopRef.current = requestAnimationFrame(animate);
  }, [moveSnake]);

  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(animate);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [animate]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    nextDirectionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setScore(0);
    onScoreChange(0);
    setIsPaused(false);
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Game Board */}
      <div 
        className="relative bg-black/40 backdrop-blur-md rounded-xl p-4 neon-border-blue"
        style={{
          width: 'min(90vw, 400px)',
          height: 'min(90vw, 400px)',
        }}
      >
        <div className="grid grid-cols-20 grid-rows-20 w-full h-full gap-0.5">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnakeHead = snake[0].x === x && snake[0].y === y;
            const isSnakeBody = snake.slice(1).some(s => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={i}
                className={`rounded-sm transition-all duration-150 ${
                  isSnakeHead 
                    ? 'bg-neon-blue shadow-[0_0_10px_#00f2ff]' 
                    : isSnakeBody 
                    ? 'bg-neon-blue/40' 
                    : isFood 
                    ? 'bg-neon-pink animate-pulse shadow-[0_0_15px_#ff007f]' 
                    : 'bg-white/5'
                }`}
              />
            );
          })}
        </div>

        {/* Overlay */}
        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-xl"
            >
              <h2 className={`text-4xl font-bold mb-6 ${isGameOver ? 'text-neon-pink neon-glow-pink' : 'text-neon-blue neon-glow-blue'}`}>
                {isGameOver ? 'SYSTEM CRITICAL' : 'BUFFERING...'}
              </h2>
              
              {isGameOver && (
                <div className="flex items-center gap-2 mb-8 text-2xl text-white/80">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  <span>FINAL SCORE: {score}</span>
                </div>
              )}

              <button
                onClick={isGameOver ? resetGame : () => setIsPaused(false)}
                className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-all hover:scale-105 active:scale-95 ${
                  isGameOver 
                    ? 'bg-neon-pink/20 text-neon-pink border border-neon-pink shadow-[0_0_15px_rgba(255,0,127,0.4)]' 
                    : 'bg-neon-blue/20 text-neon-blue border border-neon-blue shadow-[0_0_15px_rgba(0,242,255,0.4)]'
                }`}
              >
                {isGameOver ? <RefreshCw className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                {isGameOver ? 'REBOOT SYSTEM' : 'RESUME SYNC'}
              </button>
              
              {!isGameOver && (
                <p className="mt-4 text-white/40 text-sm">PRSS SPACE TO TOGGLE PAUSE</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* HUD Info */}
      <div className="mt-4 flex gap-8 font-mono">
        <div className="text-neon-blue">
          <span className="text-xs opacity-50 block uppercase">Voltage</span>
          <span className="text-xl">{score.toString().padStart(6, '0')}V</span>
        </div>
        <div className="text-neon-pink">
          <span className="text-xs opacity-50 block uppercase">Frequency</span>
          <span className="text-xl">{(10 + score / 50).toFixed(1)}Hz</span>
        </div>
      </div>
    </div>
  );
}
