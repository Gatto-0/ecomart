import { marqueePhrases } from '../data/landing'

function LeafIcon() {
  return (
    <svg
      className="marquee-leaf w-4 h-4 shrink-0 mx-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  )
}

// Stable items array outside component so re-renders never restart the animation
const MARQUEE_ITEMS = [
  ...marqueePhrases,
  ...marqueePhrases,
  ...marqueePhrases,
  ...marqueePhrases,
]

export default function Marquee() {
  return (
    <div className="marquee-wrapper w-full py-4 overflow-hidden select-none">
      <style>{`
        .marquee-wrapper {
          --oak: #6F4E32;
          --cream: #FBF3E4;
          --leaf-brown: #B59B5A;
          background-color: var(--oak);
          color: var(--cream);
        }
        .marquee-text {
          color: var(--cream);
        }
        .marquee-leaf {
          color: var(--leaf-brown);
        }
        @keyframes marqueeScroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marqueeScroll 38s linear infinite;
        }
        .marquee-wrapper:hover .marquee-track,
        .marquee-wrapper:focus-within .marquee-track,
        .marquee-track:hover,
        .marquee-track:focus-within {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none;
            transform: none;
            flex-wrap: wrap;
            justify-content: center;
          }
        }
      `}</style>
      <div className="marquee-track items-center">
        {MARQUEE_ITEMS.map((phrase, index) => (
          <div key={index} className="flex items-center shrink-0">
            <span className="marquee-text text-sm sm:text-base font-medium tracking-wide whitespace-nowrap">
              {phrase}
            </span>
            <LeafIcon />
          </div>
        ))}
      </div>
    </div>
  )
}
