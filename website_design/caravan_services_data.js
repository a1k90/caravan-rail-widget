/**
 * CARAVAN RAILROAD & MULTIMODAL LOGISTICS
 * Единая база данных услуг (RU / EN / ZH) с векторными профессиональными иконками
 */

// 1. Основные векторные иконки 6 видов услуг
const CARAVAN_ICONS = {
  railway: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <defs>
    <linearGradient id="bodyGradRail" x1="16" y1="27" x2="48" y2="45" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#2D3748"/>
      <stop offset="100%" stop-color="#1A202C"/>
    </linearGradient>
  </defs>
  <g stroke="#6C7A89" stroke-linecap="round">
    <line x1="18" y1="53" x2="46" y2="53" stroke-width="2" stroke-opacity="0.6" />
    <line x1="14" y1="57" x2="50" y2="57" stroke-width="2" stroke-opacity="0.6" />
    <line x1="9" y1="61" x2="55" y2="61" stroke-width="2.5" stroke-opacity="0.6" />
    <line x1="20" y1="51" x2="8" y2="61" stroke-width="3" />
    <line x1="44" y1="51" x2="56" y2="61" stroke-width="3" />
  </g>
  <g stroke="#6C7A89" stroke-width="2" stroke-linecap="round">
    <path d="M14 45 H50" stroke-width="2.5" />
    <rect x="29" y="45" width="6" height="5" rx="1" fill="#6C7A89" fill-opacity="0.2" stroke-width="1.5" />
    <path d="M18 45 L15 51" />
    <path d="M24 45 L22 51" />
    <path d="M40 45 L42 51" />
    <path d="M46 45 L49 51" />
  </g>
  <rect x="16" y="27" width="32" height="18" rx="2" fill="url(#bodyGradRail)" stroke="#6C7A89" stroke-width="2.5" />
  <path d="M19 18 L21 27 H43 L45 18 Z" fill="#2D3748" stroke="#6C7A89" stroke-width="2.5" stroke-linejoin="round" />
  <path d="M23 21 H30 V26 H23 Z" fill="#6C7A89" fill-opacity="0.35" stroke="#6C7A89" stroke-width="1.8" />
  <path d="M34 21 H41 V26 H34 Z" fill="#6C7A89" fill-opacity="0.35" stroke="#6C7A89" stroke-width="1.8" />
  <path d="M22 17 C22 12, 42 12, 42 17" stroke="#6C7A89" stroke-width="2.5" stroke-linecap="round" />
  <path d="M30 10 H34 V13 H30 Z" fill="#6C7A89" stroke="#6C7A89" stroke-width="1.5" />
  <circle cx="32" cy="15" r="2.5" fill="#E2E8F0" stroke="#6C7A89" stroke-width="1.5" />
  <path d="M25 33 L32 38 L39 33" stroke="#CBD5E1" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
  <circle cx="21" cy="38" r="3" fill="#E2E8F0" stroke="#6C7A89" stroke-width="1.5" />
  <circle cx="43" cy="38" r="3" fill="#E2E8F0" stroke="#6C7A89" stroke-width="1.5" />
  <line x1="28" y1="41" x2="36" y2="41" stroke="#6C7A89" stroke-width="2" stroke-linecap="round" />
</svg>`,

  road: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <line x1="4" y1="56" x2="60" y2="56" stroke="#6C7A89" stroke-width="2.5" stroke-linecap="round" />
  <line x1="1" y1="24" x2="4" y2="24" stroke="#6C7A89" stroke-width="2" stroke-linecap="round" />
  <line x1="2" y1="30" x2="4" y2="30" stroke="#6C7A89" stroke-width="2" stroke-linecap="round" />
  <line x1="1" y1="36" x2="4" y2="36" stroke="#6C7A89" stroke-width="2" stroke-linecap="round" />
  <rect x="6" y="16" width="34" height="26" rx="2" fill="#1E293B" stroke="#6C7A89" stroke-width="2.5" />
  <line x1="10" y1="16" x2="10" y2="42" stroke="#475569" stroke-width="2" />
  <path d="M12 28 H38" stroke="#6C7A89" stroke-width="3" stroke-linecap="round" />
  <rect x="18" y="42" width="14" height="4" rx="1" fill="#334155" stroke="#6C7A89" stroke-width="1.5" />
  <path d="M40 21 C 42 17, 47 17, 51 21 L 56 31 L 58 41 H 42 V 21 Z" fill="#2D3748" stroke="#6C7A89" stroke-width="2" stroke-linejoin="round" />
  <path d="M44 23 L 52 24 L 51 31 L 43 31 Z" fill="#6C7A89" fill-opacity="0.4" stroke="#CBD5E1" stroke-width="1.8" stroke-linejoin="round" />
  <rect x="54" y="38" width="4" height="3.5" rx="1" fill="#E2E8F0" stroke="#6C7A89" stroke-width="1.2" />
  <line x1="48" y1="41" x2="52" y2="41" stroke="#6C7A89" stroke-width="1.8" stroke-linecap="round" />
  <circle cx="14" cy="48" r="5.5" fill="#0F172A" stroke="#6C7A89" stroke-width="2" />
  <circle cx="14" cy="48" r="2.5" fill="#CBD5E1" />
  <circle cx="25" cy="48" r="5.5" fill="#0F172A" stroke="#6C7A89" stroke-width="2" />
  <circle cx="25" cy="48" r="2.5" fill="#CBD5E1" />
  <circle cx="43" cy="48" r="5.5" fill="#0F172A" stroke="#6C7A89" stroke-width="2" />
  <circle cx="43" cy="48" r="2.5" fill="#CBD5E1" />
  <circle cx="53" cy="48" r="5.5" fill="#0F172A" stroke="#6C7A89" stroke-width="2" />
  <circle cx="53" cy="48" r="2.5" fill="#CBD5E1" />
</svg>`,

  multimodal: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <path d="M4 51 C 10 49, 14 53, 20 51 C 26 49, 30 53, 36 51 C 42 49, 46 53, 52 51 C 56 49, 59 51, 62 51" stroke="#6C7A89" stroke-width="2.5" stroke-linecap="round" />
  <path d="M8 57 C 14 55, 18 59, 24 57 C 30 55, 34 59, 40 57 C 46 55, 50 59, 56 57" stroke="#6C7A89" stroke-opacity="0.5" stroke-width="2" stroke-linecap="round" />
  <path d="M7 40 L9 47 H45 L58 35 H48 L12 40 Z" fill="#1E293B" stroke="#6C7A89" stroke-width="2" stroke-linejoin="round" />
  <line x1="10" y1="43" x2="51" y2="43" stroke="#CBD5E1" stroke-width="2" stroke-linecap="round" />
  <path d="M9 25 H17 V40 H9 Z" fill="#2D3748" stroke="#6C7A89" stroke-width="2" stroke-linejoin="round" />
  <line x1="11" y1="29" x2="15" y2="29" stroke="#CBD5E1" stroke-width="2" stroke-linecap="round" />
  <line x1="13" y1="17" x2="13" y2="25" stroke="#6C7A89" stroke-width="2" stroke-linecap="round" />
  <line x1="10" y1="20" x2="16" y2="20" stroke="#6C7A89" stroke-width="1.8" stroke-linecap="round" />
  <path d="M6 28 H9 V35 H6 Z" fill="#1E293B" stroke="#6C7A89" stroke-width="1.5" />
  <line x1="6" y1="30" x2="9" y2="30" stroke="#CBD5E1" stroke-width="1.5" />
  <rect x="19" y="33" width="12" height="7" rx="1" fill="#6C7A89" fill-opacity="0.85" stroke="#6C7A89" stroke-width="1.5" />
  <line x1="23" y1="34" x2="23" y2="39" stroke="#E2E8F0" stroke-width="1" stroke-linecap="round" />
  <line x1="27" y1="34" x2="27" y2="39" stroke="#E2E8F0" stroke-width="1" stroke-linecap="round" />
  <rect x="33" y="33" width="12" height="7" rx="1" fill="#4A5568" stroke="#6C7A89" stroke-width="1.5" />
  <line x1="37" y1="34" x2="37" y2="39" stroke="#CBD5E1" stroke-width="1" stroke-linecap="round" />
  <line x1="41" y1="34" x2="41" y2="39" stroke="#CBD5E1" stroke-width="1" stroke-linecap="round" />
  <rect x="19" y="25" width="12" height="7" rx="1" fill="#4A5568" stroke="#6C7A89" stroke-width="1.5" />
  <line x1="23" y1="26" x2="23" y2="31" stroke="#CBD5E1" stroke-width="1" stroke-linecap="round" />
  <line x1="27" y1="26" x2="27" y2="31" stroke="#CBD5E1" stroke-width="1" stroke-linecap="round" />
  <rect x="33" y="25" width="12" height="7" rx="1" fill="#6C7A89" fill-opacity="0.85" stroke="#6C7A89" stroke-width="1.5" />
  <line x1="37" y1="26" x2="37" y2="31" stroke="#E2E8F0" stroke-width="1" stroke-linecap="round" />
  <line x1="41" y1="26" x2="41" y2="31" stroke="#E2E8F0" stroke-width="1" stroke-linecap="round" />
  <rect x="23" y="17" width="12" height="7" rx="1" fill="#6C7A89" stroke="#4A5568" stroke-width="1.5" />
  <line x1="27" y1="18" x2="27" y2="23" stroke="#E2E8F0" stroke-width="1" stroke-linecap="round" />
  <line x1="31" y1="18" x2="31" y2="23" stroke="#E2E8F0" stroke-width="1" stroke-linecap="round" />
  <rect x="37" y="19" width="8" height="5" rx="1" fill="#4A5568" stroke="#6C7A89" stroke-width="1.5" />
</svg>`,

  air: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <line x1="20.5" y1="39" x2="20.5" y2="60" stroke="#6C7A89" stroke-opacity="0.35" stroke-width="2" stroke-dasharray="2 3" stroke-linecap="round" />
  <line x1="43.5" y1="39" x2="43.5" y2="60" stroke="#6C7A89" stroke-opacity="0.35" stroke-width="2" stroke-dasharray="2 3" stroke-linecap="round" />
  <path d="M 32 6 C 30.5 7.5, 29 11, 29 18 L 29 24 L 6 38 C 5 38.8, 5 40.2, 6.2 40.5 L 9 41 L 29 34 L 29 48 L 17 55 C 16 55.6, 16.2 57, 17.5 57 L 21 57 L 29 53 L 30.5 58.5 C 31.2 59.5, 32.8 59.5, 33.5 58.5 L 35 53 L 43 57 C 44.3 57, 44.5 55.6, 43.5 55 L 35 48 L 35 34 L 55 41 L 57.8 40.5 C 59 40.2, 59 38.8, 58 38 L 35 24 L 35 18 C 35 11, 33.5 7.5, 32 6 Z" fill="#1E293B" stroke="#6C7A89" stroke-width="2" stroke-linejoin="round" />
  <path d="M 6 38 L 9 41 L 15 39 L 11 36 Z" fill="#6C7A89" />
  <path d="M 58 38 L 55 41 L 49 39 L 53 36 Z" fill="#6C7A89" />
  <line x1="13" y1="34" x2="28" y2="25" stroke="#CBD5E1" stroke-width="2" stroke-linecap="round" />
  <line x1="51" y1="34" x2="36" y2="25" stroke="#CBD5E1" stroke-width="2" stroke-linecap="round" />
  <rect x="18" y="28" width="5" height="10" rx="2.5" fill="#334155" stroke="#6C7A89" stroke-width="1.5" />
  <circle cx="20.5" cy="29" r="1.5" fill="#CBD5E1" />
  <rect x="41" y="28" width="5" height="10" rx="2.5" fill="#334155" stroke="#6C7A89" stroke-width="1.5" />
  <circle cx="43.5" cy="29" r="1.5" fill="#CBD5E1" />
  <path d="M 29.5 13.5 C 31 12.2, 33 12.2, 34.5 13.5" stroke="#CBD5E1" stroke-width="2.5" stroke-linecap="round" />
  <line x1="32" y1="44" x2="32" y2="56" stroke="#6C7A89" stroke-width="2.5" stroke-linecap="round" />
</svg>`,

  customs: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <path d="M12 10 H36 L46 20 V52 H12 Z" fill="#1E293B" stroke="#6C7A89" stroke-width="2.5" stroke-linejoin="round" />
  <path d="M36 10 V20 H46 Z" fill="#334155" stroke="#6C7A89" stroke-width="2.5" stroke-linejoin="round" />
  <line x1="18" y1="18" x2="28" y2="18" stroke="#CBD5E1" stroke-width="3" stroke-linecap="round" />
  <line x1="18" y1="25" x2="32" y2="25" stroke="#6C7A89" stroke-width="2" stroke-linecap="round" />
  <line x1="18" y1="31" x2="28" y2="31" stroke="#6C7A89" stroke-width="2" stroke-linecap="round" />
  <line x1="18" y1="37" x2="24" y2="37" stroke="#6C7A89" stroke-width="2" stroke-linecap="round" />
  <circle cx="23" cy="44" r="5.5" fill="#6C7A89" fill-opacity="0.15" stroke="#6C7A89" stroke-width="1.8" />
  <path d="M21 44 L22.5 45.5 L25.5 42.5" stroke="#CBD5E1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M44 26 L55 30 V42 C55 49, 44 55, 44 55 C44 55, 33 49, 33 42 V30 Z" fill="#6C7A89" stroke="#FFFFFF" stroke-width="2" stroke-linejoin="round" />
  <path d="M39 42 L42.5 45.5 L49 38" stroke="#0F172A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
</svg>`,

  forwarding: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <path d="M10 34 C10 18, 24 8, 38 8 C44 8, 49 10, 53 14" stroke="#6C7A89" stroke-width="3" stroke-linecap="round" />
  <path d="M48 13 L54 15 L52 9" stroke="#6C7A89" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M54 30 C54 46, 40 56, 26 56 C20 56, 15 54, 11 50" stroke="#6C7A89" stroke-width="3" stroke-linecap="round" />
  <path d="M16 51 L10 49 L12 55" stroke="#6C7A89" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
  <circle cx="32" cy="32" r="16" fill="#1E293B" stroke="#6C7A89" stroke-width="2.5" />
  <path d="M32 16 C25 22, 25 42, 32 48 C39 42, 39 22, 32 16" stroke="#475569" stroke-width="1.8" />
  <line x1="16" y1="32" x2="48" y2="32" stroke="#475569" stroke-width="1.8" />
  <path d="M19 24 Q32 28 45 24" stroke="#334155" stroke-width="1.5" />
  <path d="M19 40 Q32 36 45 40" stroke="#334155" stroke-width="1.5" />
  <path d="M23 27 Q 28 22 34 25 Q 39 28 44 32" stroke="#CBD5E1" stroke-width="2.5" stroke-dasharray="2 3" stroke-linecap="round" />
  <circle cx="23" cy="27" r="3" fill="#6C7A89" stroke="#FFFFFF" stroke-width="1.2" />
  <circle cx="34" cy="25" r="3" fill="#6C7A89" stroke="#FFFFFF" stroke-width="1.2" />
  <path d="M44 24 C41.5 24, 39.5 26, 39.5 28.5 C39.5 32, 44 37, 44 37 C44 37, 48.5 32, 48.5 28.5 C48.5 26, 46.5 24, 44 24 Z" fill="#6C7A89" stroke="#FFFFFF" stroke-width="1.5" stroke-linejoin="round" />
  <circle cx="44" cy="28.5" r="1.5" fill="#FFFFFF" />
</svg>`
};

// 2. Профессиональные векторные SVG-иконки для преимуществ (взамен эмодзи)
const CARAVAN_ADV_ICONS = {
  train: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="16" rx="2"></rect><path d="M4 11h16"></path><path d="M12 3v8"></path><circle cx="8" cy="15" r="1.5"></circle><circle cx="16" cy="15" r="1.5"></circle><path d="M7 19l-3 3"></path><path d="M17 19l3 3"></path></svg>`,
  truck: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>`,
  ship: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20a2.4 2.4 0 0 0 2 1 2.4 2.4 0 0 0 2-1 2.4 2.4 0 0 1 2-1 2.4 2.4 0 0 1 2 1 2.4 2.4 0 0 0 2 1 2.4 2.4 0 0 0 2-1 2.4 2.4 0 0 1 2-1 2.4 2.4 0 0 1 2 1 2.4 2.4 0 0 0 2 1 2.4 2.4 0 0 0 2-1"></path><path d="M4 17l1.5-7h13L20 17"></path><path d="M9 10V6l3-2 3 2v4"></path></svg>`,
  plane: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3.5c-.5-.5-2.5 0-4 1.5L13.5 8.5 5.3 6.7c-.8-.2-1.6.2-1.9.9l-.3.8 6.1 4.5-3.5 3.5-2.6-.9c-.5-.2-1.1 0-1.4.5l-.2.4 3 2.1 2.1 3 .4-.2c.5-.3.7-.9.5-1.4l-.9-2.6 3.5-3.5 4.5 6.1.8-.3c.7-.3 1.1-1.1.9-1.9z"></path></svg>`,
  container: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>`,
  gauge: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h2M20 12h2M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path><circle cx="12" cy="12" r="7"></circle><line x1="12" y1="12" x2="16" y2="8"></line></svg>`,
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
  speed: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
  satellite: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>`,
  globe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,
  door: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path><line x1="15" y1="12" x2="15.01" y2="12"></line></svg>`,
  temperature: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path></svg>`,
  tariff: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>`,
  hub: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="3" r="2"></circle><circle cx="6" cy="19" r="2"></circle><circle cx="18" cy="19" r="2"></circle><line x1="12" y1="5" x2="6" y2="17"></line><line x1="12" y1="5" x2="18" y2="17"></line></svg>`,
  document: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>`,
  customs_check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>`,
  certificate: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>`,
  surveyor: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>`,
  accounting: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`,
  charter: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>`,
  digital: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>`
};

// 3. Профессиональные векторные SVG-значки интерфейса и секций (взамен всех эмодзи)
const CARAVAN_UI_ICONS = {
  // Иконки секций карточки
  advantages: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 12L2 9z"></path><path d="M2 9h20"></path><path d="M10 3l-4 6 6 12 6-12-4-6"></path></svg>`,
  specs: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>`,
  corridors: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="10" r="3"></circle><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path></svg>`,
  steps: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
  globe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,
  phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`,
  mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
  arrowRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`,

  // Иконки панелей и кнопок студии
  grid: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
  edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
  palette: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path></svg>`,
  image: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`,
  layers: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`,
  type: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>`,
  sliders: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>`,
  camera: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>`,
  filePdf: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
  download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
  upload: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>`,
  save: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>`,
  refresh: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>`,
  sparkle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`
};

const CARAVAN_SERVICES_DEFAULT_DATA = {
  // 01. Ж/Д Перевозки
  railway: {
    id: "railway",
    number: "01",
    iconKey: "railway",
    badge: {
      ru: "Ж/Д ЛОГИСТИКА 1520 & 1435 ММ",
      en: "RAIL FREIGHT 1520 & 1435 MM",
      zh: "铁路物流 1520 与 1435 毫米轨距"
    },
    title: {
      ru: "Железнодорожные перевозки",
      en: "Rail Freight Transportation",
      zh: "铁路货物运输"
    },
    subtitle: {
      ru: "Организация повагонных, контейнерных и маршрутных отправок по СНГ, Китаю и Европе",
      en: "Wagonload, container, and block train shipments across CIS, China, and Europe",
      zh: "覆盖独联体、中国及欧洲的全车、集装箱及班列铁路物流网络"
    },
    description: {
      ru: "Организация повагонных, контейнерных и маршрутных отправок. Работа с крытыми вагонами, полувагонами, цистернами и специализированным подвижным составом. Разработка оптимальных схем крепежа и негабаритных маршрутов.",
      en: "Organization of wagonload, container, and block train shipments. Full operation with covered wagons, open-top gondolas, tank cars, and specialized rolling stock. Custom development of approved securing schemes and clearance for out-of-gauge cargo.",
      zh: "提供全车、集装箱及整列班列发运服务。全面运营棚车、敞车、罐车及特种铁路车辆。专业设计并审批超限超重货物加固方案与最优铁路线路。"
    },
    metrics: [
      { label: { ru: "Вагонов в парке", en: "Rolling Stock Fleet", zh: "自备及管控车队" }, val: "1 480+" },
      { label: { ru: "Срок расчета ставки", en: "Rate Calculation", zh: "运费核算时间" }, val: "от 15 мин" },
      { label: { ru: "Станций покрытия", en: "Stations Covered", zh: "覆盖铁路站点" }, val: "3 200+" },
      { label: { ru: "Точность графика", en: "Schedule Punctuality", zh: "准点运行率" }, val: "99.4%" }
    ],
    advantages: [
      {
        icon: "train",
        title: { ru: "Собственный & привлеченный парк", en: "Own & Leased Fleet", zh: "自备与长租多元车队" },
        desc: { ru: "Крытые вагоны 138-158 м³, полувагоны 70 т, платформы 40/60/80 фут, цистерны и зерновозы.", en: "Covered wagons 138-158 m³, 70t gondolas, 40/60/80ft flatcars, chemical tanks & grain hoppers.", zh: "容积138-158立方棚车、70吨敞车、各类集装箱平板车及罐车。" }
      },
      {
        icon: "gauge",
        title: { ru: "Негабаритные & тяжеловесные грузы", en: "Out-of-Gauge & Heavy Cargo", zh: "大件超限与特种加固" },
        desc: { ru: "Расчет НТУ, МТУ, чертежей размещения и крепления груза с согласованием во всех инстанциях.", en: "Official calculation and authorization of special securing blueprints and heavy cargo clearance.", zh: "专业编制超限货物装载技术条件（МТУ/НТУ）与绑扎加固方案。" }
      },
      {
        icon: "tariff",
        title: { ru: "Сквозные тарифы без посредников", en: "Direct National Tariffs", zh: "铁路局一手直签运价" },
        desc: { ru: "Прямые коды и договоры с железнодорожными администрациями Казахстана, Узбекистана, РФ и Китая.", en: "Direct forwarding codes with railway authorities of Kazakhstan, Uzbekistan, Russia, and China.", zh: "拥有哈萨克斯坦、乌兹别克斯坦、中国及俄铁直属过境铁运代码。" }
      },
      {
        icon: "satellite",
        title: { ru: "Круглосуточная дислокация 24/7", en: "24/7 Live Wagon Tracking", zh: "24小时全程车皮定位" },
        desc: { ru: "Автоматизированные отчеты по станциям прохождения, расчет прогнозного времени прибытия (ETA).", en: "Automated daily station milestone reports and precise predictive ETA calculations.", zh: "每天定时推送过境站点动态，精准预测到达时间（ETA）。" }
      }
    ],
    fleetSpecs: [
      { name: { ru: "Крытые вагоны", en: "Boxcars / Covered Wagons", zh: "通用棚车" }, spec: "138-158 м³ / 68 т" },
      { name: { ru: "Полувагоны люковые", en: "Open Gondola Cars", zh: "底开门敞车" }, spec: "70-75 т / 85-92 м³" },
      { name: { ru: "Фитинговые платформы", en: "Fitting Flatcars", zh: "集装箱专用平板车" }, spec: "40', 60', 80' / 72 т" },
      { name: { ru: "Цистерны", en: "Tank Cars", zh: "罐车" }, spec: "60-120 м³ (нефть, химия, пищевые)" }
    ],
    corridors: {
      ru: "Китай (Сиань, Чэнду, Ухань) ➔ Достык / Алтынколь ➔ Казахстан ➔ Ташкент / СНГ ➔ Европа",
      en: "China (Xi'an, Chengdu, Wuhan) ➔ Dostyk / Altynkol ➔ Kazakhstan ➔ Tashkent / CIS ➔ Europe",
      zh: "中国（西安、成都、武汉等）➔ 多斯特克/阿腾科里 ➔ 哈萨克斯坦 ➔ 塔什干/独联体 ➔ 欧洲"
    },
    steps: [
      { num: "01", title: { ru: "Заявка и расчет", en: "Request & Rate", zh: "询价与方案核算" }, desc: { ru: "Мгновенный расчет тарифа и согласование схемы", en: "Instant tariff calc & loading scheme approval", zh: "15分钟内核准全口径铁运运价与配车方案" } },
      { num: "02", title: { ru: "Подача состава", en: "Rolling Stock Delivery", zh: "车辆调配与装载" }, desc: { ru: "Подача исправных вагонов на станцию погрузки", en: "Dispatch of certified clean wagons to loading track", zh: "调配适运洁净车皮进厂装载并完成铅封" } },
      { num: "03", title: { ru: "Диспетчеризация", en: "En-Route Tracking", zh: "在途监控与口岸换装" }, desc: { ru: "Ежедневный трекинг и контроль перегруза на стыках", en: "Daily milestone tracking & border bogie exchange", zh: "全程GPS与口岸换装站过轨监督" } },
      { num: "04", title: { ru: "Выдача груза", en: "Arrival & Handover", zh: "到达交付与结算" }, desc: { ru: "Раскредитование документов и подача на путь клиента", en: "Bill of lading surrender & final delivery", zh: "到站票据清退与最后一公里送达" } }
    ]
  },

  // 02. Автоперевозки
  road: {
    id: "road",
    number: "02",
    iconKey: "road",
    badge: {
      ru: "АВТОМОБИЛЬНАЯ ЛОГИСТИКА FTL & LTL",
      en: "ROAD FREIGHT FTL & LTL",
      zh: "公路卡航 FTL 与 LTL 整零运输"
    },
    title: {
      ru: "Автомобильные перевозки",
      en: "Road Freight Transport",
      zh: "公路货物运输"
    },
    subtitle: {
      ru: "Доставка «от двери до двери» с бесплатным расчетом и круглосуточным GPS-трекингом",
      en: "Door-to-door delivery with transparent pricing and 24/7 live GPS satellite tracking",
      zh: "“门到门”便捷跨国卡航物流，即时免费测算与24小时卫星轨迹追踪"
    },
    description: {
      ru: "Доставка «от двери до двери» с бесплатным расчетом и круглосуточным трекингом на сайте.",
      en: "Door-to-door delivery with instant free quote calculation, comprehensive FTL/LTL solutions, and 24/7 online GPS tracking directly on our portal.",
      zh: "提供“门到门”全流程卡车运输服务，支持网站免费即时测算与全天候GPS实时轨迹追踪。"
    },
    metrics: [
      { label: { ru: "Тягачей на линиях", en: "Trucks on Route", zh: "在途干线车辆" }, val: "320+" },
      { label: { ru: "Срок Китай — Алматы", en: "Transit China-Almaty", zh: "中国至阿拉木图时效" }, val: "3-5 дней" },
      { label: { ru: "Точность доставки", en: "On-Time Delivery", zh: "准时交付率" }, val: "99.1%" },
      { label: { ru: "Страховое покрытие", en: "Insurance Limit", zh: "单车货物险额" }, val: "до €500 000" }
    ],
    advantages: [
      {
        icon: "door",
        title: { ru: "Сквозной Door-to-Door", en: "Complete Door-to-Door", zh: "全流程门到门服务" },
        desc: { ru: "Забор со склада отправителя в любой провинции и прямая доставка на склад получателя без перетарок.", en: "Pickup directly from manufacturer factory and delivery to receiver warehouse without intermediate handling.", zh: "发货人库房提货，直达目的地仓库，免除多次倒装破损风险。" }
      },
      {
        icon: "temperature",
        title: { ru: "Рефрижераторный контроль", en: "Thermo Reefer Fleet", zh: "全程温控冷藏车队" },
        desc: { ru: "Современные установки ThermoKing с режимом от -25°C до +25°C и предоставлением термочека.", en: "Certified ThermoKing units maintaining -25°C to +25°C with tamper-proof digital temperature logs.", zh: "进口冷机精准控温（-25℃至+25℃），全程出具温度记录凭条。" }
      },
      {
        icon: "speed",
        title: { ru: "Экспресс-карта «Авто-Шелк»", en: "Express Silk Route", zh: "新丝路加急卡航" },
        desc: { ru: "Двухвахтенные экипажи водителей для непрерывного движения по маршрутам Китай — Казахстан — СНГ.", en: "Dual-driver crews ensuring round-the-clock driving across China-Kazakhstan-CIS transit corridors.", zh: "双司机轮流值班日夜兼程，确保最急货物在最短时效内安全送达。" }
      },
      {
        icon: "shield",
        title: { ru: "TIR Carnet & CMR страхование", en: "TIR Carnet & CMR", zh: "TIR国际卡航通关保函" },
        desc: { ru: "Ускоренное прохождение таможенных переходов без задержек по процедуре МДП (TIR).", en: "Streamlined border clearance under TIR Carnet convention without border convoy delays.", zh: "持有国际道路运输公约TIR资质，口岸绿色通道免验免检快速通关。" }
      }
    ],
    fleetSpecs: [
      { name: { ru: "Еврофуры тентованные", en: "Curtainsider Mega Trailer", zh: "标准与超大幕布拖车" }, spec: "86-92 м³ / 22 т" },
      { name: { ru: "Сцепки (Jumbo)", en: "Jumbo Road Trains", zh: "大容积子母车" }, spec: "110-120 м³ / 20 т" },
      { name: { ru: "Рефрижераторы", en: "Refrigerated Semi-trailers", zh: "恒温冷藏集装厢" }, spec: "86 м³ (-25°C ... +25°C)" },
      { name: { ru: "Низкорамные тралы", en: "Lowboy Heavy Platforms", zh: "低平板超重特种车" }, spec: "до 80 т (негабаритная спецтехника)" }
    ],
    corridors: {
      ru: "Урумчи / Хоргос ➔ Алматы ➔ Ташкент ➔ Бишкек ➔ Самара / Москва",
      en: "Urumqi / Khorgos ➔ Almaty ➔ Tashkent ➔ Bishkek ➔ Samara / Moscow",
      zh: "乌鲁木齐/霍尔果斯 ➔ 阿拉木图 ➔ 塔什干 ➔ 比什凯克 ➔ 萨马拉/莫斯科"
    },
    steps: [
      { num: "01", title: { ru: "Заявка и букинг", en: "Booking & Rate", zh: "快速询价与订舱" }, desc: { ru: "Согласование объема и типа кузова", en: "Rate agreement and vehicle reservation", zh: "核实货量规格并锁定对应车型" } },
      { num: "02", title: { ru: "Подача под погрузку", en: "Vehicle Positioning", zh: "车辆到位验货装载" }, desc: { ru: "Прибытие авто на склад, фотофиксация", en: "Arrival at pickup address, cargo photo check", zh: "货车抵达装载现场，拍照验货铅封" } },
      { num: "03", title: { ru: "Транзит и границы", en: "Transit & Border Crossing", zh: "高速在途与快速过关" }, desc: { ru: "GPS мониторинг и оформление TIR/CMR", en: "Real-time GPS tracking and customs TIR pass", zh: "24小时卫星轨迹监控与口岸清关" } },
      { num: "04", title: { ru: "Выгрузка у клиента", en: "Direct Delivery", zh: "末端库房安全拆卸" }, desc: { ru: "Сдача груза по местам и возврат документов", en: "Cargo count verification and signed POD return", zh: "清点交付签署回单并在线回传" } }
    ]
  },

  // 03. Мультимодальные перевозки
  multimodal: {
    id: "multimodal",
    number: "03",
    iconKey: "multimodal",
    badge: {
      ru: "ИНТЕРМОДАЛЬНЫЕ РЕШЕНИЯ SEA + RAIL + ROAD",
      en: "INTERMODAL SEA + RAIL + ROAD",
      zh: "海铁陆联运与集装箱全程贯通"
    },
    title: {
      ru: "Мультимодальные и контейнерные перевозки",
      en: "Multimodal & Container Transport",
      zh: "多式联运与集装箱运输"
    },
    subtitle: {
      ru: "Сквозная доставка с объединением ж/д, авто и морского транспорта в единый транспортный документ",
      en: "End-to-end multimodal supply chain linking rail, ocean shipping, and trucking under a single bill of lading",
      zh: "贯穿铁运、海运与汽运的一体化大通道，单一运单实现全球门到门交付"
    },
    description: {
      ru: "Сквозная доставка с объединением ж/д, авто и морского транспорта. Полный контроль перемещения на стыковых станциях и в портах.",
      en: "End-to-end delivery combining rail, road, and maritime shipping. Full control of cargo transition at dry ports, junction stations, and sea terminals.",
      zh: "全程无缝多式联运，综合运用铁路、卡车与远洋货轮。在各大换装站、无水港及深水港区实施严格的全程节点管控。"
    },
    metrics: [
      { label: { ru: "Контейнеров в обороте", en: "TEU in Circulation", zh: "在运标准箱规模" }, val: "12 500+ TEU" },
      { label: { ru: "Портов партнеров", en: "Partner Ports", zh: "全球合作海港" }, val: "48 портов" },
      { label: { ru: "Ускоренных поездов", en: "Block Trains/Mo", zh: "月度固定集装箱班列" }, val: "65+ составов" },
      { label: { ru: "Экономия на логистике", en: "Average Cost Saving", zh: "客户综合物流成本节约" }, val: "до 28%" }
    ],
    advantages: [
      {
        icon: "ship",
        title: { ru: "Сквозной мультимодальный коносамент", en: "Single Through B/L", zh: "一单到底多式联运提单" },
        desc: { ru: "Один договор и единая ответственность экспедитора от завода в Азии до конечного склада получателя.", en: "One single contract and unified carrier liability from Asian factory to destination consignee.", zh: "一张提单管全程，发货人省去多头对接烦恼，全权承担承运责任。" }
      },
      {
        icon: "container",
        title: { ru: "COC / SOC контейнерный парк", en: "Full Container Range", zh: "全规格集装箱装备保障" },
        desc: { ru: "20'DC, 40'HC, 45'PW, Open Top, Flat Rack, танк-контейнеры для химии и пищевых наливных грузов.", en: "20'DC, 40'HC, 45'PW, Open Top, Flat Rack, and specialized ISO tanks for liquid products.", zh: "配备20尺标箱、40尺高箱、45尺超宽箱、开顶箱及ISO Tank化学品集装罐。" }
      },
      {
        icon: "hub",
        title: { ru: "Собственные перегрузочные хабы", en: "Dedicated Border Hubs", zh: "专属口岸无水港作业区" },
        desc: { ru: "Приоритетная обработка и перегрузка контейнеров на стыках колей 1435/1520 мм на границе Китая и Казахстана.", en: "Priority transshipment slots at 1435/1520 mm track gauge interchange hubs along China-Kazakhstan borders.", zh: "在霍尔果斯/阿拉山口等关键边境场站享有优先吊装换装绿色通道。" }
      },
      {
        icon: "globe",
        title: { ru: "Транскаспийский маршрут (ТМТМ)", en: "Middle Corridor (TITR)", zh: "跨里海中间走廊（TITR）" },
        desc: { ru: "Стабильный фидерный сервис через порты Актау / Курык в Баку, Поти и далее в страны Южной Европы.", en: "Regular feeder sea links via Aktau/Kuryk to Baku, Poti, and onwards to Southern and Eastern Europe.", zh: "经由阿克套/库雷克港衔接巴库、波季，直通土耳其及欧洲地中海市场。" }
      }
    ],
    fleetSpecs: [
      { name: { ru: "20' Dry Cargo (DC)", en: "20' Standard Container", zh: "20尺标准普箱" }, spec: "33.2 м³ / до 28.2 т" },
      { name: { ru: "40' High Cube (HC)", en: "40' High Cube Container", zh: "40尺超高集装箱" }, spec: "76.4 м³ / до 28.8 т" },
      { name: { ru: "45' High Cube Pallet Wide", en: "45' HC Pallet Wide", zh: "45尺托盘特宽箱" }, spec: "86.0 м³ (вмещает 33 европаллеты)" },
      { name: { ru: "ISO Tank / Реф-контейнеры", en: "ISO Tank / Reefer 40'", zh: "ISO罐箱/40尺冷藏集装箱" }, spec: "21-26 тыс. л / (-30°C...+30°C)" }
    ],
    corridors: {
      ru: "Шанхай / Нинбо ➔ Тяньцзинь ➔ Достык ➔ Астана ➔ Москва / Санкт-Петербург / Баку / Поти",
      en: "Shanghai / Ningbo ➔ Tianjin ➔ Dostyk ➔ Astana ➔ Moscow / Saint Petersburg / Baku / Poti",
      zh: "上海/宁波 ➔ 天津 ➔ 多斯特克 ➔ 阿斯塔纳 ➔ 莫斯科/圣彼得堡/巴库/波季"
    },
    steps: [
      { num: "01", title: { ru: "План цепочки", en: "Routing Matrix", zh: "全程联运方案制定" }, desc: { ru: "Выбор лучшей стыковки море+ж/д+авто", en: "Optimizing sea + rail + road interchange links", zh: "测算海铁公多式衔接的最优时效与运价比" } },
      { num: "02", title: { ru: "Подача порожнего КТК", en: "Empty Container Positioning", zh: "集装箱精准配发到位" }, desc: { ru: "Выдача оборудования в ближайшем депо", en: "Release of inspected container from nearest depot", zh: "就近场站验箱并调度至工厂完成装箱" } },
      { num: "03", title: { ru: "Перевалка в хабах", en: "Port & Rail Transshipment", zh: "港口铁运枢纽换装" }, desc: { ru: "Сквозной контроль крановых операций в портах", en: "Coordinated crane handling at terminal hubs", zh: "专人现场把控码头船桥吊装与铁路换装" } },
      { num: "04", title: { ru: "Финальный дроп-офф", en: "Delivery & Empty Return", zh: "终点拆箱与就近还箱" }, desc: { ru: "Доставка авто до склада и возврат тары", en: "Last-mile truck delivery and empty return to depot", zh: "卡车派送至收货地，空箱就近场站核销" } }
    ]
  },

  // 04. Авиационная логистика
  air: {
    id: "air",
    number: "04",
    iconKey: "air",
    badge: {
      ru: "МЕЖДУНАРОДНЫЙ АВИАФРАХТ & EXPRESS",
      en: "INTERNATIONAL AIR CARGO & EXPRESS",
      zh: "国际航空货运与跨境极速特快"
    },
    title: {
      ru: "Авиационная логистика",
      en: "Air Cargo Logistics",
      zh: "航空货运物流"
    },
    subtitle: {
      ru: "Срочная доставка по всему миру с мгновенной калькуляцией и онлайн-мониторингом рейсов",
      en: "Urgent global air freight with instantaneous online quote calculations and flight monitoring",
      zh: "覆盖五大洲的极速航空货运网络，支持即时运费核算与航班全程追踪"
    },
    description: {
      ru: "Срочная доставка по всему миру с мгновенной калькуляцией и онлайн-мониторингом. Полный контроль перемещения груза и оперативное получение всех документов в личном кабинете.",
      en: "Urgent express air delivery worldwide with instant cost calculation and live flight monitoring. Full cargo tracking and instant document access in customer portal.",
      zh: "面向全球的加急空运服务，提供快速运价测算与航班节点追踪。客户可在个人后台实时查验空运单证并全程掌握货物轨迹。"
    },
    metrics: [
      { label: { ru: "Срок авиадоставки", en: "Transit Window", zh: "主流航线时效" }, val: "24-72 часа" },
      { label: { ru: "Аэропортов назначения", en: "Destination Hubs", zh: "直通国际枢纽空港" }, val: "220+ IATA" },
      { label: { ru: "Грузов в месяц", en: "Tonnage Handled/Mo", zh: "月度空运处理吨位" }, val: "180+ тонн" },
      { label: { ru: "Личный кабинет", en: "E-Air Waybill", zh: "电子运单在线出具" }, val: "100% Онлайн" }
    ],
    advantages: [
      {
        icon: "plane",
        title: { ru: "Блок-места и чартерные рейсы", en: "Block Space & Charters", zh: "包机保障与稳定舱位" },
        desc: { ru: "Организация регулярных рейсов и выделенных грузовых чартеров для негабаритных и срочных партий.", en: "Scheduled allocations and heavy cargo charter flights for urgent deliveries and high-value tech.", zh: "可灵活组织全货机包机执飞，满足高附加值电子产品与紧急大件需求。" }
      },
      {
        icon: "speed",
        title: { ru: "Авиа-экспресс до 24 часов", en: "Next-Flight-Out Express", zh: "Next-Flight-Out极速发运" },
        desc: { ru: "Бронирование на ближайший вылет с приоритетной обработкой в грузовых терминалах аэропортов.", en: "Priority terminal staging and immediate booking on next flight out without ground backlog.", zh: "机场货站绿色安检直通道，搭乘最近一班离港航班即刻起飞。" }
      },
      {
        icon: "temperature",
        title: { ru: "Pharma & Опасные грузы (DGR)", en: "Pharma & DGR Handling", zh: "冷链医药与DGR危险品" },
        desc: { ru: "Сертифицированная обработка IATA DGR, температурный режим (активные термоконтейнеры Envirotainer).", en: "Certified IATA DGR processing and active Envirotainer cold-chain containment systems.", zh: "严格遵循国际航空运输协会IATA DGR标准，提供专业温控集装箱。" }
      },
      {
        icon: "digital",
        title: { ru: "Электронная авианакладная (e-AWB)", en: "Digital e-AWB Portal", zh: "数字化电子运单e-AWB" },
        desc: { ru: "Моментальное скачивание AWB, таможенных деклараций и инвойсов в личном кабинете сразу после взлета.", en: "Immediate online retrieval of AWB, export proof, and release documentation post-takeoff.", zh: "起飞即可于系统后台一键获取正式航空提单与随附商业发票。" }
      }
    ],
    fleetSpecs: [
      { name: { ru: "Boeing 747-400F / 777F", en: "B747-400F / B777F Cargo", zh: "波音747/777全货机" }, spec: "до 112 т / 700+ м³" },
      { name: { ru: "Airbus A330-200F", en: "Airbus A330-200F", zh: "空客A330中远程货机" }, spec: "до 65 т / 475 м³" },
      { name: { ru: "Пассажирские рейсы (Belly Cargo)", en: "Belly Cargo Space", zh: "客机机腹定期货舱" }, spec: "2-15 т на регулярных рейсах" },
      { name: { ru: "Авиапаллеты и ULD", en: "PAG / PMC Pallets & ULD", zh: "标准集装板ULD" }, spec: "PMC (244×318 см), AKE, RKN" }
    ],
    corridors: {
      ru: "Шэньчжэнь / Гуанчжоу / Франкфурт / Дубай ➔ Алматы / Ташкент / Астана / Москва",
      en: "Shenzhen / Guangzhou / Frankfurt / Dubai ➔ Almaty / Tashkent / Astana / Moscow",
      zh: "深圳/广州/法兰克福/迪拜 ➔ 阿拉木图/塔什干/阿斯塔纳/莫斯科"
    },
    steps: [
      { num: "01", title: { ru: "Заявка и бронь AWB", en: "Air Booking & AWB", zh: "订舱锁定航班舱位" }, desc: { ru: "Расчет тарифа и бронь слота на рейсе", en: "Instant quotation and cargo slot confirmation", zh: "核定毛重与体积重，确认并锁定航线舱位" } },
      { num: "02", title: { ru: "Приемка в терминале", en: "Airport Staging", zh: "机场货站验货过机" }, desc: { ru: "Взвешивание, DGR-скрининг и паллетирование", en: "Weighing, security screening, ULD buildup", zh: "入库过磅安检，打板绑扎并贴上条形码" } },
      { num: "03", title: { ru: "Авиаперелет & статус", en: "Flight & Status Update", zh: "高空直飞与实时监控" }, desc: { ru: "Посекундный трекинг борта по номеру рейса", en: "Live flight path tracking via tail number", zh: "根据航班号全程在线监控飞行与中转动向" } },
      { num: "04", title: { ru: "Выдача в аэропорту", en: "Customs & Release", zh: "目的港提货派送" }, desc: { ru: "Таможенная очистка и адресная автодоставка", en: "Airport cargo terminal clearance & doorstep van", zh: "目的港航站楼清关提货，直派收货人门点" } }
    ]
  },

  // 05. Таможенное оформление
  customs: {
    id: "customs",
    number: "05",
    iconKey: "customs",
    badge: {
      ru: "ТАМОЖЕННЫЙ БРОКЕР & ВЭД СОПРОВОЖДЕНИЕ",
      en: "CUSTOMS BROKERAGE & FOREIGN TRADE",
      zh: "专业报关清关与全流程外贸合规"
    },
    title: {
      ru: "Таможенное оформление",
      en: "Customs Clearance",
      zh: "报关与清关服务"
    },
    subtitle: {
      ru: "Профессиональное сопровождение ВЭД, быстрая очистка грузов и прозрачный расчет платежей",
      en: "Professional foreign trade compliance, expedited cargo release, and transparent tariff calculation",
      zh: "专业外贸合规护航，进出口货物极速放行，税费明晰透明在线可查"
    },
    description: {
      ru: "Профессиональное сопровождение ВЭД и быстрая очистка грузов без задержек. Прозрачный расчет стоимости, надежный контроль и вся документация онлайн.",
      en: "Professional foreign trade support and prompt customs clearance without demurrage. Transparent duties calculation, compliant documentation, and digital filing.",
      zh: "专业的外贸合规支持，确保进出口货物快速高效通关。透明化关税核算，全程线上化单证管理与合规风控。"
    },
    metrics: [
      { label: { ru: "Время выпуска ДТ", en: "Average Clearance Time", zh: "平均通关放行时效" }, val: "до 4 часов" },
      { label: { ru: "Точность кодов ТН ВЭД", en: "HS Code Accuracy", zh: "HS编码合规准确率" }, val: "99.9%" },
      { label: { ru: "Таможенных постов", en: "Customs Posts Presence", zh: "常驻驻场报关网点" }, val: "24 поста" },
      { label: { ru: "Деклараций в год", en: "Declarations / Year", zh: "年度申报成功单量" }, val: "14 000+" }
    ],
    advantages: [
      {
        icon: "document",
        title: { ru: "Классификация ТН ВЭД без риска КТС", en: "Zero-Risk HS Coding", zh: "精准HS编码与防审价" },
        desc: { ru: "Предварительный юридический аудит контрактов и получение предварительных класс-решений таможни.", en: "Pre-shipment contract audit and official binding tariff classifications to avoid adjustments.", zh: "发运前合同与单证预审，提前申请海关预裁定，避免额外补税。" }
      },
      {
        icon: "customs_check",
        title: { ru: "Электронное декларирование за 4 ч", en: "4-Hour Fast Release", zh: "4小时极速电子通关申报" },
        desc: { ru: "Прямая подача деклараций в систему «АСТАНА-1» и ЕАЭС с приоритетным «зеленым коридором».", en: "Direct API submission to national customs engines with automated green corridor clearance.", zh: "直联海关电子清关核心系统，力争绿道免验，4小时内完成放行。" }
      },
      {
        icon: "certificate",
        title: { ru: "Сертификация и нетарифное регул.", en: "Certification & Permits", zh: "全项商检资质与许可证件" },
        desc: { ru: "Оформление СТ-1, фитосанитарных, ветеринарных сертификатов, нотификаций ФСБ и лицензий.", en: "Acquisition of phytosanitary, veterinary, EAC certificates, and technical state permits.", zh: "协助办理动植物检疫证明、EAC符合性声明、机电产品进口许可证。" }
      },
      {
        icon: "tariff",
        title: { ru: "Прозрачный расчет таможенных платежей", en: "Transparent Duties Ledger", zh: "关税与增值税清晰透彻" },
        desc: { ru: "Детализированная смета пошлин, НДС, сборов и утилизационного сбора до момента пересечения границы.", en: "Itemized breakdown of import duties, VAT, excise, and environmental recycling fees in advance.", zh: "发货前精确核算关税、进口增值税与海关手续费，账目一清二楚。" }
      }
    ],
    fleetSpecs: [
      { name: { ru: "Электронные декларации", en: "Electronic Declaration Types", zh: "电子报关申报类型" }, spec: "ИМ-40 (выпуск), ЭК-10 (экспорт), ТТ (транзит)" },
      { name: { ru: "Склады СВХ и ТС", en: "Bonded Warehouses (TSW)", zh: "保税仓与海关监管库" }, spec: "Собственные аккредитованные зоны досмотра" },
      { name: { ru: "Сертификаты ЕАЭС", en: "EAC Certifications", zh: "欧亚联盟准入认证" }, spec: "ТР ТС 010, 004, 020, 021, 032" },
      { name: { ru: "Инкотермс 2020", en: "Incoterms Support", zh: "国际贸易术语支持" }, spec: "DDP (Под ключ), DAP, CIF, CIP, FCA, EXW" }
    ],
    corridors: {
      ru: "Таможенные посты: Достык, Алтынколь, Хоргос, Бахты, Курык, порты и аэропорты СНГ",
      en: "Customs checkpoints: Dostyk, Altynkol, Khorgos, Bakhty, Kuryk, air & maritime ports",
      zh: "核心常驻口岸：多斯特克、阿腾科里、霍尔果斯、巴克图、库雷克及各枢纽国际空港"
    },
    steps: [
      { num: "01", title: { ru: "Аудит документов", en: "Document Audit", zh: "单证合规预先审核" }, desc: { ru: "Проверка инвойсов, упаковочных, контракта", en: "Review of invoices, packing lists, trade contracts", zh: "核验商业发票、装箱单与外贸合同合规性" } },
      { num: "02", title: { ru: "Коды и сертификация", en: "HS Codes & Permits", zh: "HS编码核准与办证" }, desc: { ru: "Определение кодов ТН ВЭД и расчет пошлин", en: "HS code mapping and precise tax computations", zh: "确定最优HS编码，核准税率并申办准入许可" } },
      { num: "03", title: { ru: "Подача декларации", en: "Declaration Filing", zh: "海关电子申报送审" }, desc: { ru: "Подача ДТ в таможенную систему онлайн", en: "Instant electronic transmission to customs engine", zh: "线上报送报关单并实时跟进海关查验指令" } },
      { num: "04", title: { ru: "Выпуск в обращение", en: "Customs Release", zh: "结关放行凭证交接" }, desc: { ru: "Получение штампа «Выпуск разрешен»", en: "Obtaining official Green Release stamp", zh: "取得正式放行通知，完成税费核销并出库" } }
    ]
  },

  // 06. Экспедирование
  forwarding: {
    id: "forwarding",
    number: "06",
    iconKey: "forwarding",
    badge: {
      ru: "ТРАНСПОРТНОЕ ЭКСПЕДИРОВАНИЕ 24/7",
      en: "FREIGHT FORWARDING & SUPPLY CHAIN 24/7",
      zh: "全程货运代理与智能供应链管控"
    },
    title: {
      ru: "Экспедирование",
      en: "Freight Forwarding",
      zh: "全程货运代理"
    },
    subtitle: {
      ru: "Комплексный контроль всех этапов перевозки, круглосуточный трекинг и электронная бухгалтерия",
      en: "Comprehensive management of every transport stage, 24/7 real-time tracking, and integrated digital accounting",
      zh: "全流程把控运输每一环节，官网提供24小时动态追踪与线上便捷财务对账"
    },
    description: {
      ru: "Комплексный контроль всех этапов перевозки и круглосуточная прослежка на сайте. Бесплатный расчет маршрутов и удобная онлайн-бухгалтерия всегда под рукой.",
      en: "Comprehensive control of every transport stage and 24/7 live wagon/container tracking on the portal. Free multi-leg route calculations and digital paperless accounting.",
      zh: "全方位把控运输各环节，网站提供24小时不间断车皮与集装箱追踪。免费路线规划与线上便捷财务对账服务。"
    },
    metrics: [
      { label: { ru: "Обработано отправок", en: "Shipments Handled", zh: "累计代理发运批次" }, val: "85 000+" },
      { label: { ru: "Оплата ж/д тарифов", en: "Tariff Payment Time", zh: "过境运费代缴时效" }, val: "до 2 часов" },
      { label: { ru: "Сюрвейерский контроль", en: "Surveyor Inspections", zh: "口岸第三方监装率" }, val: "100%" },
      { label: { ru: "Личный кабинет B2B", en: "B2B Digital Platform", zh: "企业客户专属后台" }, val: "24/7" }
    ],
    advantages: [
      {
        icon: "tariff",
        title: { ru: "Оплата ж/д тарифов по всем ЖД", en: "Direct Railway Tariff Payouts", zh: "代缴欧亚全境铁路过境费" },
        desc: { ru: "Лицевые счета и прямые экспедиторские коды в КТЖ, РЖД, ТРК, УТИ, БЧ, UZ и европейских дорогах.", en: "Direct escrow accounts and authorized forwarding codes with major Eurasian rail networks.", zh: "拥有中欧、中亚全线铁路局一级过境代码，两小时内快速完成运费代缴。" },
      },
      {
        icon: "surveyor",
        title: { ru: "Сюрвейерский контроль и пломбировка", en: "Certified Surveyor Oversight", zh: "独立验货理货与防损施封" },
        desc: { ru: "Независимая фото- и видеофиксация целостности груза, проверка пломб и составление коммерческих актов.", en: "Independent photo/video inspection, seal verification, and cargo damage survey reports.", zh: "装载及口岸换装时安排专业理货员验货拍照，施加高保封条并出具理货报告。" },
      },
      {
        icon: "accounting",
        title: { ru: "Онлайн-бухгалтерия & ЭДО", en: "Digital B2B Accounting", zh: "线上电子发票与无纸化对账" },
        desc: { ru: "Моментальное выставление актов выполненных работ, счетов-фактур, CMR, СМГС и сверка расчетов в 1 клик.", en: "Instant generation of work completion certificates, e-invoices, SMGS/CMR waybills, and ledgers.", zh: "全程电子合同与发票支持，运费结算账单清晰，企业财务随时一键对账。" },
      },
      {
        icon: "shield",
        title: { ru: "Страхование грузов All Risks", en: "All-Risk Cargo Insurance", zh: "一切险（All Risks）全保" },
        desc: { ru: "Покрытие рисков в ведущих международных страховых компаниях по ставке от 0.08% от инвойсной стоимости.", en: "Comprehensive underwriting with tier-1 insurance giants starting from 0.08% of invoice value.", zh: "与国际知名保险公司直签，费率低至0.08%，实现货物在途全程零后顾之忧。" },
      }
    ],
    fleetSpecs: [
      { name: { ru: "Экспедиторские коды", en: "Forwarding Codes", zh: "铁路过境代码资质" }, spec: "Казахстан (КТЖ), Узбекистан (УТИ), РФ, Туркменистан, КНР" },
      { name: { ru: "Документооборот", en: "Bill of Lading Standards", zh: "国际联运单据标准" }, spec: "СМГС (SMGS), CIM/SMGS, CMR, FBL FIATA" },
      { name: { ru: "Сюрвейерские услуги", en: "Surveyor Services", zh: "口岸验货服务" }, spec: "Весовой контроль, сюрвейерские сертификаты, пломбирование" },
      { name: { ru: "Интеграция API", en: "API & Data Feeds", zh: "ERP/API系统对接" }, spec: "1C, SAP, Webhook уведомления по дислокации" }
    ],
    corridors: {
      ru: "Транссиб, Шелковый Путь, Коридор Север — Юг, Транскаспий (ТМТМ), Китай — ЦА — Турция — ЕС",
      en: "Trans-Siberian, New Silk Road, North-South, TITR Middle Corridor, China-Central Asia-EU",
      zh: "新丝绸之路、北南国际走廊、跨里海中间走廊、中国-中亚-土耳其-欧洲全网"
    },
    steps: [
      { num: "01", title: { ru: "Расчет и договор", en: "Agreement & Planning", zh: "需求分析与代理签约" }, desc: { ru: "Согласование сквозной ставки и подписание договора", en: "Freight rate optimization and service agreement", zh: "测算全程最优综合运费并网签代理协议" } },
      { num: "02", title: { ru: "Оплата тарифов", en: "Tariff Payment", zh: "铁路局过境费即时代缴" }, desc: { ru: "Проставление кодов и оплата ж/д тарифа по маршруту", en: "Filing forwarding codes and paying transit fees", zh: "代报铁路发运代码并划拨全线过境运杂费" } },
      { num: "03", title: { ru: "Сюрвей и контроль", en: "Surveyor & Transit", zh: "全程节点监控与理货" }, desc: { ru: "Контроль перевалки и ежедневная дислокация", en: "Supervising transshipment & daily GPS tracking", zh: "重点枢纽现场督导换装并推送每日动态" } },
      { num: "04", title: { ru: "Закрывающие док-ты", en: "Audit & POD Archive", zh: "回单签收与财务结清" }, desc: { ru: "Передача оригиналов СМГС/CMR и закрытие в ЭДО", en: "Surrender of original stamped waybills & e-closing", zh: "返还正本带章货运凭据，财务系统一键核销" } }
    ]
  }
};

const CARAVAN_GLOBAL_SETTINGS = {
  phone: "+99895 157 8888",
  email: "info@caravanrailroad.com",
  website: "caravanrailroad.com",
  sectionTitles: {
    metrics: { ru: "Показатели сервиса", en: "Service Performance", zh: "核心服务指标" },
    advantages: { ru: "Ключевые преимущества и возможности", en: "Key Advantages & Capabilities", zh: "核心竞争优势与能力保障" },
    specs: { ru: "Подвижной состав & Технические параметры", en: "Fleet Equipment & Technical Specifications", zh: "运输装备与技术规格参数" },
    corridors: { ru: "География перевозок & Транзитные коридоры", en: "Transit Corridors & Global Geography", zh: "经贸辐射网络与主力运输走廊" },
    steps: { ru: "Процесс организации отправки", en: "Service Execution Workflow", zh: "标准化作业与发运流程" }
  },
  styles: {
    fontFamily: "'Inter', 'Noto Sans SC', sans-serif",
    headingFont: "'Unbounded', sans-serif",
    fontSizeScale: 100,
    accentColor: "#F59E0B",
    headingColor: "#FFFFFF",
    sectionTitleColor: "#6C7A89",
    textColor: "#CBD5E1",
    mutedColor: "#94A3B8",
    cardBgColor: "#080D1A",
    borderColor: "rgba(108, 122, 137, 0.35)",
    boxBgColor: "rgba(15, 26, 48, 0.65)",
    bgType: "gradient", // "gradient", "solid", "image"
    bgPreset: "none",
    bgImage: "", // URL / dataURL
    bgOverlayColor: "#080D1A", // цвет оверлея
    bgOverlayOpacity: 85, // 0 to 100%
    bgBlur: 0, // 0 to 20px
    bgPattern: false // тонкая сетка
  }
};

if (typeof window !== 'undefined') {
  window.CARAVAN_ICONS = CARAVAN_ICONS;
  window.CARAVAN_ADV_ICONS = CARAVAN_ADV_ICONS;
  window.CARAVAN_UI_ICONS = CARAVAN_UI_ICONS;
  window.CARAVAN_SERVICES_DEFAULT_DATA = CARAVAN_SERVICES_DEFAULT_DATA;
  window.CARAVAN_GLOBAL_SETTINGS = CARAVAN_GLOBAL_SETTINGS;
}
