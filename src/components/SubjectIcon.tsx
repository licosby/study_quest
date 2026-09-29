import React from 'react';
import { SubjectIconType } from '../types/quest.js';

interface SubjectIconProps {
  icon: SubjectIconType | string;
  className?: string;
}

export const SubjectIcon: React.FC<SubjectIconProps> = ({ icon, className = 'w-8 h-8' }) => {
  switch (icon) {
    case 'scroll':
      return (
        <svg viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Detailed Antique Parchment Scroll with Wax Seal */}
          <path d="M8 6C8 4.89543 8.89543 4 10 4H26C27.1046 4 28 4.89543 28 6V28C28 29.1046 27.1046 30 26 30H10C8.89543 30 8 29.1046 8 28V6Z" fill="#FDFBF7" stroke="#92400E" strokeWidth="1.5" />
          {/* Scroll curl top and bottom */}
          <path d="M6 6C6 3.79086 7.79086 2 10 2H28C28 4.20914 26.2091 6 24 6H6Z" fill="#FDE68A" stroke="#78350F" strokeWidth="1.2" />
          <path d="M6 30C6 32.2091 7.79086 34 10 34H26C28.2091 34 30 32.2091 30 30H6Z" fill="#FDE68A" stroke="#78350F" strokeWidth="1.2" />
          {/* Text lines */}
          <line x1="12" y1="10" x2="24" y2="10" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="12" y1="14" x2="24" y2="14" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="12" y1="18" x2="20" y2="18" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" />
          {/* Crimson Wax Seal */}
          <circle cx="23" cy="23" r="4.5" fill="#DC2626" stroke="#991B1B" strokeWidth="1" />
          <circle cx="23" cy="23" r="2.5" fill="#EF4444" />
        </svg>
      );

    case 'dome':
      return (
        <svg viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Neoclassical Capitol Dome with Pillars */}
          {/* Top Spire */}
          <line x1="18" y1="2" x2="18" y2="6" stroke="#FEF08A" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="18" cy="2" r="1.5" fill="#F59E0B" />
          {/* Lantern */}
          <rect x="16" y="6" width="4" height="3" fill="#D97706" />
          {/* Semicircular Dome */}
          <path d="M10 16C10 10.5 13.5 9 18 9C22.5 9 26 10.5 26 16H10Z" fill="#FDE68A" stroke="#92400E" strokeWidth="1.5" />
          {/* Entablature */}
          <rect x="8" y="16" width="20" height="2.5" fill="#F59E0B" stroke="#78350F" strokeWidth="1" />
          {/* 4 Pillars */}
          <rect x="9" y="18.5" width="2" height="11" fill="#FEF08A" stroke="#78350F" strokeWidth="0.8" />
          <rect x="14" y="18.5" width="2" height="11" fill="#FEF08A" stroke="#78350F" strokeWidth="0.8" />
          <rect x="20" y="18.5" width="2" height="11" fill="#FEF08A" stroke="#78350F" strokeWidth="0.8" />
          <rect x="25" y="18.5" width="2" height="11" fill="#FEF08A" stroke="#78350F" strokeWidth="0.8" />
          {/* Base Plinth */}
          <rect x="6" y="29.5" width="24" height="3" fill="#B45309" stroke="#78350F" strokeWidth="1" />
        </svg>
      );

    case 'scales':
      return (
        <svg viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Ornate Brass Scales of Justice */}
          <line x1="18" y1="4" x2="18" y2="30" stroke="#FDE68A" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="18" cy="4" r="2.5" fill="#F59E0B" stroke="#78350F" strokeWidth="1" />
          {/* Crossbeam */}
          <line x1="6" y1="10" x2="30" y2="10" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
          {/* Left Pan & Chains */}
          <line x1="7" y1="10" x2="5" y2="20" stroke="#FEF08A" strokeWidth="1" />
          <line x1="11" y1="10" x2="13" y2="20" stroke="#FEF08A" strokeWidth="1" />
          <path d="M4 20C4 23 14 23 14 20H4Z" fill="#FDE68A" stroke="#92400E" strokeWidth="1.2" />
          {/* Right Pan & Chains */}
          <line x1="25" y1="10" x2="23" y2="20" stroke="#FEF08A" strokeWidth="1" />
          <line x1="29" y1="10" x2="31" y2="20" stroke="#FEF08A" strokeWidth="1" />
          <path d="M22 20C22 23 32 23 32 20H22Z" fill="#FDE68A" stroke="#92400E" strokeWidth="1.2" />
          {/* Pedestal */}
          <path d="M12 30H24V32H12V30Z" fill="#92400E" />
        </svg>
      );

    case 'star':
      return (
        <svg viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Faceted Lone Star of Texas Medal */}
          <circle cx="18" cy="18" r="15" fill="#78350F" stroke="#FDE68A" strokeWidth="1.5" />
          <circle cx="18" cy="18" r="13" fill="#92400E" />
          {/* 5-point Faceted Star */}
          <polygon points="18,5 22,14 31,14 24,20 27,29 18,23 9,29 12,20 5,14 14,14" fill="#FDE68A" stroke="#B45309" strokeWidth="1" />
          <polygon points="18,5 22,14 18,18" fill="#F59E0B" />
          <polygon points="31,14 24,20 18,18" fill="#D97706" />
          <polygon points="27,29 18,23 18,18" fill="#B45309" />
          <polygon points="9,29 12,20 18,18" fill="#D97706" />
          <polygon points="5,14 14,14 18,18" fill="#F59E0B" />
        </svg>
      );

    case 'flask':
      return (
        <svg viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Scientific Glass Erlenmeyer Flask with Liquid & Bubbles */}
          <path d="M15 4H21V12L28 26C29 28 27.5 30 25 30H11C8.5 30 7 28 8 26L15 12V4Z" fill="#0F172A" stroke="#FDE68A" strokeWidth="1.8" />
          {/* Glowing Reagent Fluid inside */}
          <path d="M10 25L13 18H23L26 25C26.5 26.5 25.5 28 24 28H12C10.5 28 9.5 26.5 10 25Z" fill="#10B981" fillOpacity="0.85" />
          {/* Bubbles */}
          <circle cx="15" cy="22" r="1.5" fill="#FEF08A" />
          <circle cx="19" cy="24" r="2" fill="#FEF08A" />
          <circle cx="21" cy="19" r="1" fill="#FEF08A" />
          {/* Lip */}
          <rect x="13" y="3" width="10" height="2" rx="1" fill="#FDE68A" />
          {/* Glass Highlight */}
          <path d="M11 26L16 15" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
        </svg>
      );

    case 'calculator':
      return (
        <svg viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Vintage Mechanical Mathematical Calculator */}
          <rect x="7" y="4" width="22" height="28" rx="4" fill="#1E293B" stroke="#FDE68A" strokeWidth="1.8" />
          {/* Screen */}
          <rect x="10" y="7" width="16" height="6" rx="1.5" fill="#A7F3D0" stroke="#059669" strokeWidth="1" />
          <text x="24" y="12" fill="#065F46" fontSize="6" fontWeight="bold" textAnchor="end">888.8</text>
          {/* Button Grid (9 keys) */}
          <rect x="10" y="16" width="4" height="3" rx="0.5" fill="#FEF08A" />
          <rect x="16" y="16" width="4" height="3" rx="0.5" fill="#FEF08A" />
          <rect x="22" y="16" width="4" height="3" rx="0.5" fill="#F59E0B" />
          <rect x="10" y="21" width="4" height="3" rx="0.5" fill="#FEF08A" />
          <rect x="16" y="21" width="4" height="3" rx="0.5" fill="#FEF08A" />
          <rect x="22" y="21" width="4" height="3" rx="0.5" fill="#F59E0B" />
          <rect x="10" y="26" width="4" height="3" rx="0.5" fill="#FEF08A" />
          <rect x="16" y="26" width="4" height="3" rx="0.5" fill="#FEF08A" />
          <rect x="22" y="26" width="4" height="3" rx="0.5" fill="#EF4444" />
        </svg>
      );

    case 'brain':
      return (
        <svg viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Anatomical Neural Brain with Gold Synapses */}
          {/* Left Hemisphere */}
          <path d="M17 7C14 6 10 8 9 11C8 13 8 16 7 18C6 20 6 23 8 25C9 26 12 27 14 27C15 27 16 28 17 29V7Z" fill="#FDE68A" stroke="#92400E" strokeWidth="1.5" />
          {/* Right Hemisphere */}
          <path d="M19 7C22 6 26 8 27 11C28 13 28 16 29 18C30 20 30 23 28 25C27 26 24 27 22 27C21 27 20 28 19 29V7Z" fill="#FDE68A" stroke="#92400E" strokeWidth="1.5" />
          {/* Convolutions / Sulci */}
          <path d="M12 12C14 13 14 16 11 17C13 19 14 22 13 24" stroke="#78350F" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M24 12C22 13 22 16 25 17C23 19 22 22 23 24" stroke="#78350F" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );

    case 'books':
      return (
        <svg viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Bound Leather Tome Stack */}
          {/* Bottom Book */}
          <rect x="6" y="24" width="24" height="6" rx="1.5" fill="#78350F" stroke="#FEF08A" strokeWidth="1.2" />
          <line x1="6" y1="26" x2="28" y2="26" stroke="#FEF08A" strokeWidth="0.8" />
          {/* Middle Book */}
          <rect x="8" y="16" width="21" height="6" rx="1.5" fill="#047857" stroke="#FEF08A" strokeWidth="1.2" />
          <line x1="8" y1="18" x2="27" y2="18" stroke="#FEF08A" strokeWidth="0.8" />
          {/* Top Book */}
          <rect x="10" y="8" width="18" height="6" rx="1.5" fill="#B45309" stroke="#FEF08A" strokeWidth="1.2" />
          <line x1="10" y1="10" x2="26" y2="10" stroke="#FEF08A" strokeWidth="0.8" />
          {/* Bookmark Ribbon */}
          <path d="M22 8V18L24 16L26 18V8" fill="#EF4444" />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="14" fill="#FDE68A" stroke="#78350F" strokeWidth="2" />
          <polygon points="18,8 21,15 28,15 23,20 25,27 18,23 11,27 13,20 8,15 15,15" fill="#B45309" />
        </svg>
      );
  }
};
