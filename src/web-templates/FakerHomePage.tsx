import React from "react"
import {
  Search,
  Book,
  Github,
  Twitter,
  // Discord,
  Globe,
  Sun, // Or Moon for dark mode toggle if implemented
  ChevronDown,
  User, // Generic for Person
  MapPin, // For Location
  Calendar, // For Date
  Banknote, // For Finance
  ShoppingBag, // For Commerce
  Languages, // For Localization
  ExternalLink, // For View on GitHub, etc.
} from "lucide-react"

const FakerHomePage = () => {
  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-300 font-sans">
      {/* Top Navigation */}
      <nav className="flex items-center justify-between p-4 border-b border-neutral-800">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-white text-lg font-bold">
            {/* Faker Logo (simple text for now) */}
            <User className="w-6 h-6" />
            <span>Faker</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search"
              className="pl-9 pr-3 py-1.5 rounded-md bg-neutral-800 border border-neutral-700 text-neutral-300 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="hidden md:flex items-center space-x-2 bg-neutral-800 border border-neutral-700 px-2 py-1 rounded-md text-neutral-500 text-xs font-mono">
            CMD+K
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <a
            href="#"
            className="flex items-center space-x-1 text-neutral-400 hover:text-white transition-colors"
          >
            <Book className="w-4 h-4" />
            <span>Guide</span>
          </a>
          <a
            href="#"
            className="flex items-center space-x-1 text-neutral-400 hover:text-white transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>API</span>
          </a>
          <a
            href="#"
            className="flex items-center space-x-1 text-neutral-400 hover:text-white transition-colors"
          >
            <span>Try it</span>
            <ChevronDown className="w-3 h-3" />
          </a>
          <div className="flex items-center space-x-1 text-neutral-400 hover:text-white transition-colors">
            <span>v9.1.0</span>
            <ChevronDown className="w-3 h-3" />
          </div>
          <div className="flex items-center space-x-4 text-neutral-400">
            <a href="#" className="hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            {/* <a href="#" className="hover:text-white transition-colors">
              <Discord className="w-5 h-5" />
            </a> */}
            <a href="#" className="hover:text-white transition-colors">
              <Globe className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <Sun className="w-5 h-5" />
            </a>{" "}
            {/* Placeholder for theme toggle */}
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
            CB
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="py-20 text-center relative overflow-hidden">
        {/* Placeholder for the Panda image - you can replace this with an actual SVG/image */}
        <div className="absolute top-0 right-1/4 translate-x-1/2 -translate-y-1/4 transform scale-75 lg:scale-100 z-0 opacity-40 md:opacity-100">
          <img
            src="https://fakerjs.dev/img/faker-logo.svg" // Using the actual logo as the panda
            alt="Faker.js Logo Panda"
            className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 opacity-70"
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-6xl font-extrabold text-white mb-4">Faker</h1>
          <p className="text-xl text-neutral-400 mb-8">
            Generate massive amounts of fake (but realistic) data for testing
            and development.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
              Get Started
            </button>
            <button className="bg-neutral-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-neutral-600 transition-colors">
              Browse API
            </button>
            <button className="bg-neutral-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-neutral-600 transition-colors flex items-center space-x-2">
              <span>View on GitHub</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Feature Grid */}
      <section className="px-4 py-16 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Person */}
          <div className="p-6 bg-neutral-800 rounded-lg shadow-lg border border-neutral-700 hover:border-neutral-600 transition-colors duration-200">
            <User className="w-8 h-8 text-white mb-3" />
            <h3 className="text-xl font-bold text-white mb-2">Person</h3>
            <p className="text-neutral-400 text-sm">
              Generate Names, Genders, Bios, Job Titles, and more.
            </p>
          </div>
          {/* Card 2: Location */}
          <div className="p-6 bg-neutral-800 rounded-lg shadow-lg border border-neutral-700 hover:border-neutral-600 transition-colors duration-200">
            <MapPin className="w-8 h-8 text-white mb-3" />
            <h3 className="text-xl font-bold text-white mb-2">Location</h3>
            <p className="text-neutral-400 text-sm">
              Generate Addresses, Zip Codes, Street Names, States, and
              Countries!
            </p>
          </div>
          {/* Card 3: Date */}
          <div className="p-6 bg-neutral-800 rounded-lg shadow-lg border border-neutral-700 hover:border-neutral-600 transition-colors duration-200">
            <Calendar className="w-8 h-8 text-white mb-3" />
            <h3 className="text-xl font-bold text-white mb-2">Date</h3>
            <p className="text-neutral-400 text-sm">
              Past, present, future, recent, soon... whenever!
            </p>
          </div>
          {/* Card 4: Finance */}
          <div className="p-6 bg-neutral-800 rounded-lg shadow-lg border border-neutral-700 hover:border-neutral-600 transition-colors duration-200">
            <Banknote className="w-8 h-8 text-white mb-3" />
            <h3 className="text-xl font-bold text-white mb-2">Finance</h3>
            <p className="text-neutral-400 text-sm">
              Generate stubbed out Account Details, Transactions, and Crypto
              Addresses.
            </p>
          </div>
          {/* Card 5: Commerce */}
          <div className="p-6 bg-neutral-800 rounded-lg shadow-lg border border-neutral-700 hover:border-neutral-600 transition-colors duration-200">
            <ShoppingBag className="w-8 h-8 text-white mb-3" />
            <h3 className="text-xl font-bold text-white mb-2">Commerce</h3>
            <p className="text-neutral-400 text-sm">
              Generate prices, Product Names, Adjectives, and Descriptions.
            </p>
          </div>
          {/* Card 6: Localization */}
          <div className="p-6 bg-neutral-800 rounded-lg shadow-lg border border-neutral-700 hover:border-neutral-600 transition-colors duration-200">
            <Languages className="w-8 h-8 text-white mb-3" />
            <h3 className="text-xl font-bold text-white mb-2">Localization</h3>
            <p className="text-neutral-400 text-sm">
              Pick from over 70 locales to generate realistic looking Names,
              Addresses, and Phone Numbers.
            </p>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-16 text-center max-w-3xl mx-auto px-4">
        <p className="text-neutral-400 text-sm leading-relaxed mb-8">
          Faker is freely available to use for commercial and non-commercial
          purposes under the MIT license. The development of Faker is guided by
          an international team of volunteer maintainers. If you use Faker in
          your project, please consider making a one-off or recurring donation
          via OpenCollective.
        </p>
        <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
          Support Faker on OpenCollective
        </button>
      </section>

      {/* Footer */}
      <footer className="p-6 text-center text-neutral-500 text-sm border-t border-neutral-800 mt-10">
        <p>Released under the MIT License.</p>
        <p>Copyright © 2022 present Faker.</p>
      </footer>
    </div>
  )
}

export default FakerHomePage
