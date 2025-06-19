"use client";

import Image from "next/image";
import { Background } from "./components";
import GameContainer from "./game-container";

export default function Home() {
  return (
    <Background>
      <div className="w-full flex flex-col justify-center items-center h-full gap-8 p-8">
        {/* Game Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4">
            <Image
              src="/partnership.svg"
              alt="Sophon x Session Keys"
              width={200}
              height={50}
            />
          </div>
          <h1 className="text-4xl font-bold text-white">Chess with Session Keys</h1>
          <p className="text-black text-lg max-w-2xl">
            Experience the power of Session Keys through chess! Toggle between manual signing and 
            session-based moves to feel the dramatic UX difference.
          </p>
        </div>

        {/* Game Container */}
        <GameContainer />

        {/* Info Section */}
        <div className="w-full max-w-4xl mt-8">
          <div className="bg-slate-900/60 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-3">How it works:</h3>
            <div className="grid md:grid-cols-2 gap-6 text-gray-300">
              <div>
                <h4 className="font-medium text-blue-400 mb-2">🐌 Manual Mode:</h4>
                <p className="text-sm">Every chess move requires wallet confirmation. Watch how the 3-7 second delays break the flow of the game!</p>
              </div>
              <div>
                <h4 className="font-medium text-blue-400 mb-2">⚡ Session Keys Mode:</h4>
                <p className="text-sm">Pre-approve a session once, then play chess at natural speed with instant moves. Feel the seamless experience!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Background>
  );
}
