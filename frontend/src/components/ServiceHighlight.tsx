import { CreditCard, Percent, ShieldCheck, Truck } from "lucide-react";

export default function ServiceHighlights() {
  const features = [
    {
      icon: CreditCard,
      title: "Payment only online",
      description:
        "Tasigförsamhet beteendedesign. Mobile checkout. Ylig kärrtorpa.",
    },
    {
      icon: Percent,
      title: "New stocks and sales",
      description:
        "Tasigförsamhet beteendedesign. Mobile checkout. Ylig kärrtorpa.",
    },
    {
      icon: ShieldCheck,
      title: "Quality assurance",
      description:
        "Tasigförsamhet beteendedesign. Mobile checkout. Ylig kärrtorpa.",
    },
    {
      icon: Truck,
      title: "Delivery from 1 hour",
      description:
        "Tasigförsamhet beteendedesign. Mobile checkout. Ylig kärrtorpa.",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {features.map((item, index) => (
          <div key={index} className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-4">
            {/* Icon */}
            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
              <item.icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            {/* Text */}
            <div>
              <h4 className="font-semibold text-gray-900 text-xs sm:text-base">
                {item.title}
              </h4>
              <p className="mt-1 text-[10px] sm:text-sm text-gray-500 leading-tight sm:leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
