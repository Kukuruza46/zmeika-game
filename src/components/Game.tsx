import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, Play, RotateCcw } from 'lucide-react';

type Position = {
  x: number;
  y: number;
};

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 15, y: 15 };
const GAME_SPEED = 150;

export default function Game() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>(INITIAL_FOOD);
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    return newFood;
  }, []);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood());
    setDirection('RIGHT');
    setIsGameOver(false);
    setScore(0);
    setIsPaused(true);
  }, [generateFood]);

  const checkCollision = useCallback((head: Position) => {
    // Wall collision
    if (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE
    ) {
      return true;
    }
    // Self collision
    return snake.some((segment) => segment.x === head.x && segment.y === head.y);
  }, [snake]);

  const moveSnake = useCallback(() => {
    if (isPaused || isGameOver) return;

    const head = { ...snake[0] };
    switch (direction) {
      case 'UP':
        head.y -= 1;
        break;
      case 'DOWN':
        head.y += 1;
        break;
      case 'LEFT':
        head.x -= 1;
        break;
      case 'RIGHT':
        head.x += 1;
        break;
    }

    if (checkCollision(head)) {
      setIsGameOver(true);
      setHighScore((prev) => Math.max(prev, score));
      return;
    }

    const newSnake = [head, ...snake];
    if (head.x === food.x && head.y === food.y) {
      setFood(generateFood());
      setScore((prev) => prev + 10);
    } else {
      newSnake.pop();
    }
    setSnake(newSnake);
  }, [snake, direction, food, isPaused, isGameOver, checkCollision, generateFood, score]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        setIsPaused((prev) => !prev);
        return;
      }

      const keyMap: { [key: string]: Direction } = {
        ArrowUp: 'UP',
        ArrowDown: 'DOWN',
        ArrowLeft: 'LEFT',
        ArrowRight: 'RIGHT',
      };

      if (keyMap[e.key]) {
        const newDirection = keyMap[e.key];
        const opposites = {
          UP: 'DOWN',
          DOWN: 'UP',
          LEFT: 'RIGHT',
          RIGHT: 'LEFT',
        };
        
        if (opposites[newDirection] !== direction) {
          setDirection(newDirection);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameLoop);
  }, [moveSnake]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="text-yellow-400" size={24} />
            <span className="text-white">Score: {score}</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="text-yellow-400" size={24} />
            <span className="text-white">High Score: {highScore}</span>
          </div>
        </div>
        
        <div 
          className="grid gap-1 bg-black/20 p-4 rounded-lg"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 20px)`,
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
            const x = index % GRID_SIZE;
            const y = Math.floor(index / GRID_SIZE);
            const isSnake = snake.some((segment) => segment.x === x && segment.y === y);
            const isFood = food.x === x && food.y === y;
            
            return (
              <div
                key={index}
                className={`w-5 h-5 rounded-sm transition-colors duration-100 ${
                  isSnake
                    ? 'bg-green-400'
                    : isFood
                    ? 'bg-red-400'
                    : 'bg-gray-800/40'
                }`}
              />
            );
          })}
        </div>

        <div className="mt-6 flex justify-center gap-4">
          {isPaused ? (
            <button
              onClick={() => setIsPaused(false)}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              <Play size={20} /> Start
            </button>
          ) : (
            <button
              onClick={() => setIsPaused(true)}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
            >
              Pause
            </button>
          )}
          <button
            onClick={resetGame}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <RotateCcw size={20} /> Reset
          </button>
        </div>

        {isGameOver && (
          <div className="mt-4 text-center">
            <p className="text-red-400 font-bold text-lg mb-2">Game Over!</p>
            <p className="text-white">Final Score: {score}</p>
          </div>
        )}

        <div className="mt-4 text-center text-gray-300 text-sm">
          Use arrow keys to move • Space to pause
        </div>
      </div>
    </div>
  );
}