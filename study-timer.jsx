import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

export default function StudyTimer() {
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsRunning(false);
            setIsFinished(true);
            // Play sound when timer finishes
            if (audioRef.current) {
              audioRef.current.play().catch(e => console.log('Audio play failed:', e));
            }
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (timeLeft === 0) {
      setTimeLeft(selectedMinutes * 60);
      setIsFinished(false);
    }
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(selectedMinutes * 60);
    setIsFinished(false);
  };

  const handleTimeSelect = (e) => {
    const minutes = parseInt(e.target.value);
    setSelectedMinutes(minutes);
    if (!isRunning) {
      setTimeLeft(minutes * 60);
      setIsFinished(false);
    }
  };

  const progress = ((selectedMinutes * 60 - timeLeft) / (selectedMinutes * 60)) * 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <audio ref={audioRef} src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURE=" />
      
      <div className="text-center mb-8">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">勉強タイマー</h1>
        <div className="inline-block">
          <label className="text-white text-xl mr-3">時間選択:</label>
          <select 
            value={selectedMinutes}
            onChange={handleTimeSelect}
            disabled={isRunning}
            className="bg-white/20 text-white text-xl px-4 py-2 rounded-lg border-2 border-white/30 focus:outline-none focus:border-white/60 disabled:opacity-50"
          >
            <option value={5}>5分</option>
            <option value={10}>10分</option>
            <option value={15}>15分</option>
            <option value={20}>20分</option>
            <option value={25}>25分</option>
            <option value={30}>30分</option>
            <option value={45}>45分</option>
            <option value={60}>60分</option>
            <option value={90}>90分</option>
          </select>
        </div>
      </div>

      <div className="relative mb-12">
        <svg className="transform -rotate-90" width="400" height="400">
          <circle
            cx="200"
            cy="200"
            r="180"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="20"
            fill="none"
          />
          <circle
            cx="200"
            cy="200"
            r="180"
            stroke="white"
            strokeWidth="20"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 180}`}
            strokeDashoffset={`${2 * Math.PI * 180 * (1 - progress / 100)}`}
            className="transition-all duration-1000 ease-linear"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`text-8xl md:text-9xl font-bold ${isFinished ? 'text-yellow-300 animate-pulse' : 'text-white'}`}>
              {formatTime(timeLeft)}
            </div>
            {isFinished && (
              <div className="text-3xl text-yellow-300 mt-4 animate-bounce">
                完了！
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl text-2xl font-bold flex items-center gap-3 shadow-lg transition-all transform hover:scale-105"
          >
            <Play size={32} />
            実行
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl text-2xl font-bold flex items-center gap-3 shadow-lg transition-all transform hover:scale-105"
          >
            <Pause size={32} />
            ストップ
          </button>
        )}
        
        <button
          onClick={handleReset}
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl text-2xl font-bold flex items-center gap-3 shadow-lg transition-all transform hover:scale-105"
        >
          <RotateCcw size={32} />
          リセット
        </button>
      </div>

      <div className="mt-8 text-white/70 text-sm">
        {isRunning ? '集中して頑張りましょう！' : '時間を選択して実行ボタンを押してください'}
      </div>
    </div>
  );
}
