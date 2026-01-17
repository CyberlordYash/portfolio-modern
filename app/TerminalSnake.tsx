"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconServer,
  IconActivity,
  IconAlertTriangle,
  IconRefresh,
  IconX,
} from "@tabler/icons-react";

export default function SystemLoadBalancer() {
  const [isOpen, setIsOpen] = useState(false);
  const [score, setScore] = useState(0);
  const [latency, setLatency] = useState(20); // Starting latency in ms
  const [gameOver, setGameOver] = useState(false);
  const [playerPos, setPlayerPos] = useState(50); // Percentage 0-100
  const [packets, setPackets] = useState<
    { id: number; x: number; y: number }[]
  >([]);

  const gameContainerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();

  // 1. Spawn Packets
  useEffect(() => {
    if (!isOpen || gameOver) return;
    const interval = setInterval(
      () => {
        setPackets((prev) => [
          ...prev,
          { id: Date.now(), x: Math.random() * 90 + 5, y: -10 },
        ]);
      },
      Math.max(300, 1000 - score * 5),
    ); // Speed up as score increases

    return () => clearInterval(interval);
  }, [isOpen, gameOver, score]);

  // 2. Game Loop (Physics)
  const update = () => {
    if (gameOver) return;

    setPackets((prev) => {
      const nextPackets = prev.map((p) => ({
        ...p,
        y: p.y + (2 + score / 50),
      }));

      // Check for catches or misses
      const filtered = nextPackets.filter((p) => {
        // Missed packet
        if (p.y > 100) {
          setLatency((l) => l + 15);
          return false;
        }
        // Caught packet (collision detection)
        const isCaught = p.y > 80 && p.y < 90 && Math.abs(p.x - playerPos) < 12;
        if (isCaught) {
          setScore((s) => s + 1);
          setLatency((l) => Math.max(10, l - 2));
          return false;
        }
        return true;
      });

      return filtered;
    });

    if (latency > 250) setGameOver(true);
    requestRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    if (isOpen && !gameOver) {
      requestRef.current = requestAnimationFrame(update);
    }
    return () => cancelAnimationFrame(requestRef.current!);
  }, [isOpen, gameOver, playerPos, latency]);

  // 3. Controls
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!gameContainerRef.current) return;
    const rect = gameContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setPlayerPos(Math.min(Math.max(x, 5), 95));
  };

  const reset = () => {
    setScore(0);
    setLatency(20);
    setGameOver(false);
    setPackets([]);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all"
      >
        <IconActivity size={18} className="text-emerald-500" />
        <span className="text-xs font-mono font-bold text-emerald-500">
          STRESS_TEST_SYSTEM
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-xl"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              layoutId="game-window"
              className="relative w-full max-w-lg bg-white dark:bg-black rounded-[2rem] border border-neutral-200 dark:border-white/10 shadow-2xl overflow-hidden"
            >
              {/* Terminal Header */}
              <div className="p-4 border-b border-neutral-100 dark:border-white/5 flex justify-between items-center bg-neutral-50 dark:bg-white/[0.02]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 dark:bg-red-500/40" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/20 dark:bg-amber-500/40" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/20 dark:bg-emerald-500/40" />
                </div>
                <span className="text-[10px] font-mono font-black text-neutral-400">
                  TRAFFIC_MANAGER_V2
                </span>
                <button onClick={() => setIsOpen(false)}>
                  <IconX size={18} className="text-neutral-400" />
                </button>
              </div>

              {/* Stats Bar */}
              <div className="flex divide-x divide-neutral-100 dark:divide-white/5 border-b border-neutral-100 dark:border-white/5">
                <div className="flex-1 p-3 text-center">
                  <p className="text-[9px] text-neutral-500 font-mono uppercase">
                    Throughput
                  </p>
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    {score} Req/s
                  </p>
                </div>
                <div className="flex-1 p-3 text-center">
                  <p className="text-[9px] text-neutral-500 font-mono uppercase">
                    Latency
                  </p>
                  <p
                    className={`text-sm font-bold ${latency > 150 ? "text-red-500" : "text-emerald-500"}`}
                  >
                    {latency}ms
                  </p>
                </div>
              </div>

              {/* Canvas Area */}
              <div
                ref={gameContainerRef}
                onMouseMove={handleMouseMove}
                className="relative h-[400px] bg-neutral-50 dark:bg-[#020617] cursor-none overflow-hidden"
              >
                {/* Packets */}
                {packets.map((p) => (
                  <motion.div
                    key={p.id}
                    className="absolute w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6]"
                    style={{ left: `${p.x}%`, top: `${p.y}%` }}
                  />
                ))}

                {/* Server (Player) */}
                <div
                  className="absolute bottom-10 w-24 h-4 -translate-x-12 rounded-full bg-white dark:bg-blue-500 border border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-75 flex items-center justify-center"
                  style={{ left: `${playerPos}%` }}
                >
                  <div className="flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-blue-200 animate-pulse" />
                    <div className="w-1 h-1 rounded-full bg-blue-200 animate-pulse delay-75" />
                    <div className="w-1 h-1 rounded-full bg-blue-200 animate-pulse delay-150" />
                  </div>
                </div>

                {/* Game Over Screen */}
                <AnimatePresence>
                  {gameOver && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-white/90 dark:bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center z-50 p-6 text-center"
                    >
                      <IconAlertTriangle
                        size={48}
                        className="text-red-500 mb-4"
                      />
                      <h3 className="text-xl font-black text-neutral-900 dark:text-white mb-2 uppercase">
                        System_Overflow
                      </h3>
                      <p className="text-xs text-neutral-500 font-mono mb-6">
                        Latency exceeded 250ms threshold. <br /> Deployment
                        failed.
                      </p>
                      <button
                        onClick={reset}
                        className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:scale-105 transition-transform"
                      >
                        <IconRefresh size={18} /> RESTART_NODE
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="p-4 bg-neutral-100 dark:bg-white/[0.02] text-center">
                <p className="text-[10px] font-mono text-neutral-400">
                  Control the load balancer to intercept incoming data packets.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
