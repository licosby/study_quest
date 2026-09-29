import React, { useState } from 'react';
import { useStudyQuest } from '../context/StudyQuestContext.js';
import { Compass, Sparkles } from 'lucide-react';

export const RadialCompass: React.FC = () => {
  const { courses, openCourseModal, setSelectedRouteId } = useStudyQuest();
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);

  // Map cardinal points to distinct subject landmarks
  const landmarkPoints = {
    N: {
      courseId: 'us-history-1',
      name: 'Constitutional Citadel',
      deg: '0° N',
    },
    E: {
      courseId: 'biology',
      name: 'Biolab Observatory',
      deg: '90° E',
    },
    S: {
      courseId: 'ethics',
      name: 'Temple of Virtue',
      deg: '180° S',
    },
    W: {
      courseId: 'tx-gov',
      name: 'Alamo Garrison',
      deg: '270° W',
    },
  };

  const handleLandmarkJump = (courseId: string) => {
    setSelectedRouteId(courseId);
    const course = courses.find((c) => c.id === courseId);
    if (course) {
      openCourseModal(course);
    }
  };

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* Tooltip / Active Landmark Readout above compass */}
      <div className="h-6 mb-1 text-center">
        {hoveredPoint ? (
          <span className="font-cinzel text-[11px] font-black tracking-wider text-amber-300 bg-slate-950/80 px-3 py-0.5 rounded-full border border-amber-400/50 shadow-md">
            {hoveredPoint}
          </span>
        ) : (
          <span className="font-cinzel text-[10px] font-bold text-amber-200/60 uppercase tracking-widest">
            Nautical Expedition Compass
          </span>
        )}
      </div>

      {/* Antique Nautical Brass Compass Body */}
      <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full flex items-center justify-center filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)]">
        {/* Outer Heavy Beveled Brass / Bronze Bezel */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#5E441B] via-[#DFB86C] to-[#4A3210] p-1.5 shadow-2xl border-2 border-[#FFE8A3]">
          
          {/* Inner Aged Parchment Dial Surface */}
          <div className="relative w-full h-full rounded-full bg-gradient-to-b from-[#F9F3E5] via-[#EFE2C8] to-[#D5C19A] flex items-center justify-center border border-[#9A7D46] shadow-inner overflow-hidden">
            
            {/* Azimuth Degrees Tick Marks (SVG) */}
            <svg viewBox="0 0 160 160" className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Outer circular degree ring */}
              <circle cx="80" cy="80" r="72" fill="none" stroke="#9A7D46" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="80" cy="80" r="66" fill="none" stroke="#9A7D46" strokeWidth="0.75" />

              {/* 16-point Faceted Compass Rose Star */}
              {/* Primary 4 points (N, S, E, W) */}
              {/* North facet */}
              <polygon points="80,18 85,75 80,80" fill="#92400E" />
              <polygon points="80,18 75,75 80,80" fill="#F59E0B" />
              {/* South facet */}
              <polygon points="80,142 85,85 80,80" fill="#F59E0B" />
              <polygon points="80,142 75,85 80,80" fill="#92400E" />
              {/* East facet */}
              <polygon points="142,80 85,75 80,80" fill="#92400E" />
              <polygon points="142,80 85,85 80,80" fill="#F59E0B" />
              {/* West facet */}
              <polygon points="18,80 75,75 80,80" fill="#F59E0B" />
              <polygon points="18,80 75,85 80,80" fill="#92400E" />

              {/* Secondary corner points (NE, NW, SE, SW) */}
              <polygon points="124,36 82,76 80,80" fill="#B45309" opacity="0.8" />
              <polygon points="124,36 84,78 80,80" fill="#FBBF24" opacity="0.8" />
              <polygon points="36,36 78,76 80,80" fill="#FBBF24" opacity="0.8" />
              <polygon points="36,36 76,78 80,80" fill="#B45309" opacity="0.8" />
              <polygon points="124,124 84,82 80,80" fill="#B45309" opacity="0.8" />
              <polygon points="124,124 82,84 80,80" fill="#FBBF24" opacity="0.8" />
              <polygon points="36,124 76,82 80,80" fill="#FBBF24" opacity="0.8" />
              <polygon points="36,124 78,84 80,80" fill="#B45309" opacity="0.8" />

              {/* Decorative crosshairs */}
              <line x1="80" y1="20" x2="80" y2="140" stroke="#78350F" strokeWidth="0.5" strokeDasharray="2 4" />
              <line x1="20" y1="80" x2="140" y2="80" stroke="#78350F" strokeWidth="0.5" strokeDasharray="2 4" />
            </svg>

            {/* Interactive Cardinal Buttons (Teleport to specific Landmark destinations) */}
            
            {/* North Point */}
            <button
              onClick={() => handleLandmarkJump(landmarkPoints.N.courseId)}
              onMouseEnter={() => setHoveredPoint(`North: ${landmarkPoints.N.name}`)}
              onMouseLeave={() => setHoveredPoint(null)}
              className="absolute top-1 font-cinzel font-black text-xs text-[#78350F] hover:text-[#B45309] hover:scale-125 transition-transform p-1 cursor-pointer z-20"
              title="Expedition to Constitutional Citadel"
            >
              N
            </button>

            {/* East Point */}
            <button
              onClick={() => handleLandmarkJump(landmarkPoints.E.courseId)}
              onMouseEnter={() => setHoveredPoint(`East: ${landmarkPoints.E.name}`)}
              onMouseLeave={() => setHoveredPoint(null)}
              className="absolute right-1 font-cinzel font-black text-xs text-[#78350F] hover:text-[#B45309] hover:scale-125 transition-transform p-1 cursor-pointer z-20"
              title="Expedition to Biolab Observatory"
            >
              E
            </button>

            {/* South Point */}
            <button
              onClick={() => handleLandmarkJump(landmarkPoints.S.courseId)}
              onMouseEnter={() => setHoveredPoint(`South: ${landmarkPoints.S.name}`)}
              onMouseLeave={() => setHoveredPoint(null)}
              className="absolute bottom-1 font-cinzel font-black text-xs text-[#78350F] hover:text-[#B45309] hover:scale-125 transition-transform p-1 cursor-pointer z-20"
              title="Expedition to Temple of Virtue"
            >
              S
            </button>

            {/* West Point */}
            <button
              onClick={() => handleLandmarkJump(landmarkPoints.W.courseId)}
              onMouseEnter={() => setHoveredPoint(`West: ${landmarkPoints.W.name}`)}
              onMouseLeave={() => setHoveredPoint(null)}
              className="absolute left-1 font-cinzel font-black text-xs text-[#78350F] hover:text-[#B45309] hover:scale-125 transition-transform p-1 cursor-pointer z-20"
              title="Expedition to Alamo Garrison"
            >
              W
            </button>

            {/* Center Sapphire Gemstone Cap */}
            <button
              onClick={() => setSelectedRouteId('all')}
              onMouseEnter={() => setHoveredPoint('Center: All Landmark Waypoints')}
              onMouseLeave={() => setHoveredPoint(null)}
              className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-[#1E3A8A] via-[#3B82F6] to-[#60A5FA] border-2 border-amber-300 shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-transform z-30 cursor-pointer"
              title="Reset View: All Overland Waypoints"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-white opacity-80" />
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};
