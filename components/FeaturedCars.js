import Image from "next/image"
import { useRouter } from "next/navigation"
import { MapPin, Gauge, Settings, Fuel, Users, Star } from "lucide-react"

const featuredParts = [
  {
    id: 1,
    name: "Kawasaki Engine Gasket Set",
    partNumber: "EG-1234",
    compatibility: "Kawasaki, Arctic Cat, Polaris",
    price: "89.99",
    image: "/images/home/fc1.jpeg",
    rating: 4.96,
    reviews: 672,
  },
  {
    id: 2,
    name: "Polaris Suspension Kit",
    partNumber: "SK-5678",
    compatibility: "Polaris, Can-Am, Yamaha",
    price: "299.99",
    image: "/images/home/fc2.jpg",
    rating: 4.92,
    reviews: 512,
  },
  {
    id: 3,
    name: "Arctic Cat Brake Pads",
    partNumber: "BP-9101",
    compatibility: "Arctic Cat, John Deere, Kubota",
    price: "49.99",
    image: "/images/home/fc3.png",
    rating: 4.88,
    reviews: 430,
  },
];

export default function FeaturedParts() {
  const router = useRouter();
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredParts.map((part) => (
            <div
              key={part.id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative h-64 bg-gray-100">
                <img src={part.image || "/placeholder.svg"} alt={part.name} className="object-cover w-full h-full" />
                <div className="absolute top-3 right-3 bg-white rounded-full px-2 py-1 flex items-center gap-1 shadow-sm">
                  <span className="text-xs font-medium text-gray-900">{part.rating}</span>
                  <span className="text-xs text-gray-500">({part.reviews} reviews)</span>
                </div>
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">{part.name}</h3>
              <div className="flex items-center text-gray-600 mb-2">
                <span className="text-sm font-medium">Part #:</span>
                <span className="ml-1 text-sm">{part.partNumber}</span>
              </div>
              <div className="flex items-center text-gray-600 mb-2">
                <span className="text-sm font-medium">Compatibility:</span>
                <span className="ml-1 text-sm">{part.compatibility}</span>
              </div>
              <div className="flex items-center text-gray-600 mb-2">
                <span className="text-sm font-medium">Price:</span>
                <span className="ml-1 text-sm">${part.price}</span>
              </div>
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => router.push('/checkout')}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors mt-2"
                >
                  Place Order
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}