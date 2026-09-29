import React from 'react';
import { ParchmentRibbon } from '../components/ParchmentRibbon.js';
import { QuestMap } from '../components/QuestMap.js';
import { PlayerCard } from '../components/PlayerCard.js';
import { ActionMedallions } from '../components/ActionMedallions.js';
import { GlobalStatsRibbon } from '../components/GlobalStatsRibbon.js';
import { RadialCompass } from '../components/RadialCompass.js';

export const HomeScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2 select-none">
      {/* 1. Top Section: Logo, Curved Parchment Ribbon, Subtitle & Centered "Upload Chapter" button */}
      <ParchmentRibbon />

      {/* 2. Middle Section: Winding Horizontal Quest Path with Mountain Backdrop & Emerald Markers */}
      <main className="w-full flex-1 flex flex-col justify-center my-1">
        <QuestMap />
      </main>

      {/* 3. Bottom HUD Section (Matching reference image: Player Card, Center Action Medallions + Stats Ribbon, Radial Compass) */}
      <footer className="w-full mt-2 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
          
          {/* Bottom-Left: Lindsey's Player Card */}
          <div className="lg:col-span-3 flex justify-center lg:justify-start">
            <PlayerCard />
          </div>

          {/* Bottom-Center: Lightweight Action Medallions & Curved Stats Ribbon */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <ActionMedallions />
            <GlobalStatsRibbon />
          </div>

          {/* Bottom-Right: Floating Radial Compass Navigation */}
          <div className="lg:col-span-3 flex justify-center lg:justify-end">
            <RadialCompass />
          </div>

        </div>
      </footer>
    </div>
  );
};
