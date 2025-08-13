export default function Services() {
  const services = [
    {
      icon: "💰",
      title: "Financing Options",
      description: "Get pre-approved for financing with competitive rates from our network of lenders.",
      link: "/financing"
    },
    {
      icon: "🔄",
      title: "Trade-In Value",
      description: "Get an instant quote for your current auto part and maximize your trade-in value.",
      link: "/trade-in"
    },
    {
      icon: "⭐",
      title: "Expert Reviews",
      description: "Read detailed reviews and ratings from automotive experts and real customers.",
      link: "/reviews"
    },
    {
      icon: "🛡️",
      title: "Vehicle History",
      description: "Access comprehensive vehicle history reports including accidents and maintenance.",
      link: "/history"
    },
    {
      icon: "📱",
      title: "Mobile App",
      description: "Search, compare, and save cars on the go with our mobile application.",
      link: "/app"
    },
    {
      icon: "🎯",
      title: "Price Match",
      description: "We'll match any competitor's price to ensure you get the best deal possible.",
      link: "/price-match"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose AutoParts?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We provide everything you need to make an informed ATV parts purchase with confidence
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="text-center p-6 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {service.description}
              </p>
              <a 
                href={service.link}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Learn More →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 