export default function PromoCards() {
  const cards = [
    {
      tag: "Only This Week",
      title: "We provide you the best quality products",
      subtitle: "Only this week. Don’t miss...",
      button: "Shop Now",
    },
    {
      tag: "Only This Week",
      title: "We make your grocery shopping more exciting",
      subtitle: "Feed your family the best",
      button: "Shop Now",
    },
    {
      tag: "Only This Week",
      title: "The one supermarket that saves your money",
      subtitle: "Eat one every day",
      button: "Shop Now",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="relative bg-[#f7f4ef] rounded-xl sm:rounded-2xl overflow-hidden p-3 sm:p-6 flex items-center justify-between cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => {
              const paths = ["/quality-products", "/almost-finished", "/save-money"];
              window.location.href = paths[index];
            }}
          >
            {/* Text Content */}
            <div className="w-full">
              <span className="text-[10px] sm:text-sm font-semibold text-orange-500">
                {card.tag}
              </span>

              <h2 className="mt-1 sm:mt-2 text-sm sm:text-xl font-bold text-gray-900 leading-tight sm:leading-snug">
                {card.title}
              </h2>

              <p className="mt-1 sm:mt-2 text-[10px] sm:text-sm text-gray-600 leading-tight">
                {card.subtitle}
              </p>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  const paths = ["/quality-products", "/almost-finished", "/save-money"];
                  window.location.href = paths[index];
                }}
                className="mt-2 sm:mt-5 inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full bg-white text-[10px] sm:text-sm font-medium text-gray-900 shadow hover:shadow-md transition cursor-pointer"
              >
                {card.button}
                <span className="text-xs sm:text-lg">→</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
