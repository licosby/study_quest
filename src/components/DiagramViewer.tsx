import React from 'react';
import { QuestionDiagram } from '../types/quest.js';

interface DiagramViewerProps {
  diagram: QuestionDiagram;
}

export const DiagramViewer: React.FC<DiagramViewerProps> = ({ diagram }) => {
  return (
    <div className="my-5 p-4 rounded-2xl bg-[#0F172A] border-2 border-amber-400/50 shadow-xl text-white">
      <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-3">
        <span className="font-cinzel text-xs font-black uppercase tracking-wider text-amber-300">
          🔬 Science Visual Diagram • {diagram.title}
        </span>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
          Target: {diagram.markedPoint}
        </span>
      </div>

      <div className="flex flex-col items-center justify-center p-2">
        {diagram.type === 'cell' && (
          <svg viewBox="0 0 460 260" className="w-full max-w-md h-auto select-none">
            {/* Plasma Membrane */}
            <ellipse cx="230" cy="130" rx="200" ry="110" fill="#1E293B" stroke="#059669" strokeWidth="5" />
            {/* Cytoplasm */}
            <ellipse cx="230" cy="130" rx="192" ry="102" fill="#0F172A" />

            {/* Endoplasmic Reticulum folds */}
            <path d="M120,100 Q140,80 160,110 T190,100" stroke="#F59E0B" strokeWidth="4" fill="none" opacity="0.8" />
            <path d="M110,120 Q130,105 155,130 T180,120" stroke="#F59E0B" strokeWidth="4" fill="none" opacity="0.8" />

            {/* Nucleus */}
            <circle cx="210" cy="130" r="42" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="3" />
            <circle cx="210" cy="130" r="18" fill="#1E3A8A" />
            <text x="210" y="134" fill="#93C5FD" fontSize="10" fontWeight="bold" textAnchor="middle">Nucleus</text>

            {/* Golgi Apparatus */}
            <path d="M290,140 Q320,130 330,160" stroke="#EC4899" strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M298,150 Q328,140 338,170" stroke="#EC4899" strokeWidth="5" strokeLinecap="round" fill="none" />
            <text x="325" y="185" fill="#F472B6" fontSize="9" textAnchor="middle">Golgi</text>

            {/* Mitochondria with Target Marker [A] */}
            <g transform="translate(100, 160) rotate(-20)">
              <ellipse cx="25" cy="15" rx="30" ry="16" fill="#B45309" stroke="#F59E0B" strokeWidth="2.5" />
              {/* Cristae folds inside */}
              <path d="M5,15 Q15,8 20,15 T35,15 T45,15" stroke="#FDE68A" strokeWidth="2" fill="none" />
            </g>

            {/* Target Marker Pointer [A] pointing to Mitochondrion */}
            <line x1="80" y1="120" x2="115" y2="155" stroke="#EF4444" strokeWidth="2.5" strokeDasharray="4 2" />
            <circle cx="115" cy="155" r="4" fill="#EF4444" />
            <g transform="translate(60, 100)">
              <circle cx="14" cy="14" r="14" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2" />
              <text x="14" y="19" fill="#FFFFFF" fontSize="14" fontWeight="black" textAnchor="middle">A</text>
            </g>

            {/* Ribosomes */}
            <circle cx="150" cy="75" r="2.5" fill="#34D399" />
            <circle cx="165" cy="70" r="2.5" fill="#34D399" />
            <circle cx="280" cy="90" r="2.5" fill="#34D399" />
            <circle cx="140" cy="180" r="2.5" fill="#34D399" />

            {/* Vacuole */}
            <ellipse cx="300" cy="80" rx="28" ry="18" fill="#0284C7" opacity="0.6" stroke="#38BDF8" strokeWidth="2" />
            <text x="300" y="83" fill="#BAE6FD" fontSize="8" textAnchor="middle">Vacuole</text>
          </svg>
        )}

        {diagram.type === 'mitochondria' && (
          <svg viewBox="0 0 460 220" className="w-full max-w-md h-auto select-none">
            {/* Outer Membrane */}
            <ellipse cx="230" cy="110" rx="180" ry="85" fill="#78350F" stroke="#F59E0B" strokeWidth="4" />
            {/* Intermembrane space */}
            <ellipse cx="230" cy="110" rx="170" ry="76" fill="#92400E" />

            {/* Matrix & Deep Cristae Infoldings */}
            <path
              d="M90,110 C120,70 140,150 170,110 C200,70 220,150 250,110 C280,70 300,150 330,110 C360,70 380,130 370,110"
              stroke="#FDE68A"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
            />
            <text x="230" y="60" fill="#FEF08A" fontSize="11" fontWeight="bold" textAnchor="middle">Inner Membrane (Cristae)</text>
            <text x="230" y="165" fill="#FCD34D" fontSize="11" fontWeight="bold" textAnchor="middle">Mitochondrial Matrix</text>

            {/* Pointer to Cristae Marker [A] */}
            <line x1="130" y1="35" x2="170" y2="100" stroke="#EF4444" strokeWidth="2.5" strokeDasharray="4 2" />
            <circle cx="170" cy="100" r="4" fill="#EF4444" />
            <g transform="translate(115, 15)">
              <circle cx="14" cy="14" r="14" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2" />
              <text x="14" y="19" fill="#FFFFFF" fontSize="14" fontWeight="black" textAnchor="middle">A</text>
            </g>
          </svg>
        )}

        {(diagram.type === 'photosynthesis' || diagram.type === 'chloroplast' || diagram.type === 'respiration') && (
          <svg viewBox="0 0 460 220" className="w-full max-w-md h-auto select-none">
            {/* Chloroplast Double Membrane */}
            <ellipse cx="230" cy="110" rx="180" ry="85" fill="#064E3B" stroke="#10B981" strokeWidth="4" />
            <ellipse cx="230" cy="110" rx="168" ry="76" fill="#022C22" />

            {/* Thylakoid Stacks (Grana) */}
            <g transform="translate(130, 80)">
              <rect x="0" y="0" width="45" height="10" rx="4" fill="#34D399" stroke="#059669" />
              <rect x="0" y="14" width="45" height="10" rx="4" fill="#34D399" stroke="#059669" />
              <rect x="0" y="28" width="45" height="10" rx="4" fill="#34D399" stroke="#059669" />
              <rect x="0" y="42" width="45" height="10" rx="4" fill="#34D399" stroke="#059669" />
            </g>

            <g transform="translate(230, 75)">
              <rect x="0" y="0" width="45" height="10" rx="4" fill="#34D399" stroke="#059669" />
              <rect x="0" y="14" width="45" height="10" rx="4" fill="#34D399" stroke="#059669" />
              <rect x="0" y="28" width="45" height="10" rx="4" fill="#34D399" stroke="#059669" />
              <rect x="0" y="42" width="45" height="10" rx="4" fill="#34D399" stroke="#059669" />
            </g>

            {/* Stroma fluid label */}
            <text x="330" y="115" fill="#A7F3D0" fontSize="12" fontWeight="bold">Stroma</text>

            {/* Target Marker pointing to Thylakoid stack [A] */}
            <line x1="85" y1="50" x2="130" y2="90" stroke="#EF4444" strokeWidth="2.5" strokeDasharray="4 2" />
            <circle cx="130" cy="90" r="4" fill="#EF4444" />
            <g transform="translate(65, 30)">
              <circle cx="14" cy="14" r="14" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2" />
              <text x="14" y="19" fill="#FFFFFF" fontSize="14" fontWeight="black" textAnchor="middle">A</text>
            </g>
          </svg>
        )}
      </div>

      <p className="text-[11px] text-slate-300 italic text-center mt-1">
        {diagram.caption}
      </p>
    </div>
  );
};
