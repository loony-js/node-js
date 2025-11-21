import {
  Plane,
  Bus,
  Train,
  Smartphone,
  Apple,
  Satellite,
  Tv,
  Zap,
  CreditCard,
  Percent,
  Flame,
  Shield,
  Home,
  Waves,
  Phone,
  Wifi,
  Banknote,
  GraduationCap,
  Car,
  Bike,
  FastForward,
  // Subway,
} from "lucide-react"

// --- Data Structure for the Service Grid ---
const serviceData = [
  {
    category: "Travel",
    items: [
      { name: "Flights", Icon: Plane },
      { name: "Bus Tickets", Icon: Bus },
      { name: "Trains", Icon: Train },
    ],
  },
  {
    category: "Recharges",
    items: [
      { name: "Mobile Recharge", Icon: Smartphone },
      { name: "App Store Code", Icon: Apple },
      { name: "DTH Recharge", Icon: Satellite },
      { name: "Google Play Recharge", Icon: Tv }, // Placeholder icon
    ],
  },
  {
    category: "Bill Payments",
    items: [
      { name: "Electricity", Icon: Zap },
      { name: "Mobile Postpaid", Icon: Smartphone },
      { name: "Credit Card Bill", Icon: CreditCard },
      { name: "Loan Repayment", Icon: Percent },
      { name: "LPG", Icon: Flame },
      { name: "Insurance Premium", Icon: Shield },
      { name: "Piped Gas", Icon: Home }, // Placeholder icon
      { name: "Water Bill", Icon: Waves },
      { name: "Landline", Icon: Phone },
      { name: "Broadband", Icon: Wifi },
      { name: "Municipal Tax", Icon: Banknote },
      { name: "Cable TV", Icon: Tv },
      { name: "Education Fees", Icon: GraduationCap },
    ],
  },
  {
    category: "Daily Transit",
    items: [
      { name: "FASTag", Icon: FastForward },
      // { name: "Metro Recharge", Icon: Subway },
    ],
  },
  {
    category: "Insurance",
    items: [
      { name: "Car Insurance", Icon: Car },
      { name: "Bike Insurance", Icon: Bike },
    ],
  },
]

// --- Service Grid Component ---

export const AmazonCard = () => {
  return (
    // Main container with a deep dark background
    <div className="p-4 sm:p-8 bg-neutral-950 min-h-screen text-white">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-white mb-6">Payment Services</h1>

        {serviceData.map((section) => (
          <div
            key={section.category}
            className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl"
          >
            {/* Category Header */}
            <h2 className="text-xl font-semibold text-white mb-6 border-b border-neutral-800 pb-3">
              {section.category}
            </h2>

            {/* Service Items Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-y-8 gap-x-4">
              {section.items.map(({ name, Icon }) => (
                <div
                  key={name}
                  className="flex flex-col items-center justify-start cursor-pointer group transition-transform duration-200 hover:scale-[1.05]"
                  // onClick={() => onServiceClick(name)}
                  title={`Go to ${name}`}
                >
                  {/* Icon Circle */}
                  <div className="p-4 rounded-xl bg-neutral-800/80 group-hover:bg-neutral-800 border border-neutral-700 transition-colors duration-200 shadow-md">
                    {/* Teal accent color for the icon */}
                    <Icon className="w-6 h-6 text-teal-400" />
                  </div>

                  {/* Service Name */}
                  <p className="mt-2 text-xs text-center font-medium text-neutral-300 group-hover:text-white transition-colors duration-200 line-clamp-2">
                    {name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
