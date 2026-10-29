import { quickTips } from '../data/learn'

export default function QuickTips() {
  return (
    <section className="w-full bg-forest text-cream py-16 sm:py-24 px-6 mt-20 sm:mt-28">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-cream tracking-tight text-center mb-12 sm:mb-16">
          Six habits to start today
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {quickTips.map((tip, index) => (
            <div key={index} className="flex items-start gap-4">
              <span className="font-heading font-bold text-2xl sm:text-3xl text-leaf shrink-0 leading-none">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="font-heading font-semibold text-cream text-lg sm:text-xl mb-1.5">
                  {tip.title}
                </h3>
                <p className="text-sm sm:text-base text-cream/80 leading-relaxed">
                  {tip.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 sm:mt-16 flex justify-center">
          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent('ecobuddy:ask', {
                  detail: "I'd like to learn more about sustainability.",
                })
              )
            }}
            className="px-8 py-3.5 rounded-full border-2 border-cream text-cream font-medium text-base hover:bg-cream hover:text-forest transition-colors cursor-pointer"
          >
            Still curious? Ask Eco Buddy
          </button>
        </div>
      </div>
    </section>
  )
}

