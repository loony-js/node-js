import { useState } from "react"

export default function HSLPaletteGenerator() {
  const [hue, setHue] = useState(210)

  const generateHSLPalette = (hue: number) => {
    const steps = [95, 90, 80, 70, 60, 50, 40, 30, 20, 10, 5]
    const keys = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
    return Object.fromEntries(
      steps.map((light, i) => [keys[i], `hsl(${hue}, 80%, ${light}%)`]),
    )
  }

  const palette = generateHSLPalette(hue)

  const getTextColor = (hsl: string) => {
    const match = hsl.match(/(\d+)%\)$/)
    const lightness = match ? parseInt(match[1], 10) : 50
    return lightness < 50 ? "text-white" : "text-gray-900"
  }

  return (
    <div className="ml-72 p-4 flex-1 bg-stone-50 dark:bg-[#212121] dark:text-white overflow-y-auto mt-16">
      <div className="min-h-screen flex flex-col items-center p-6">
        <h1 className="text-2xl font-semibold mb-4">
          🎨 HSL Palette Generator
        </h1>

        <div className="flex items-center gap-4 mb-8">
          <label className="font-medium">
            Hue: <span className="font-semibold">{hue}°</span>
          </label>
          <input
            type="range"
            min="0"
            max="360"
            value={hue}
            onChange={(e) => setHue(Number(e.target.value))}
            className="w-56 accent-blue-500"
          />
        </div>

        <div className="w-full max-w-md rounded-xl shadow overflow-hidden">
          {Object.entries(palette).map(([key, color]) => (
            <div
              key={key}
              className={`flex justify-between items-center px-4 py-3 ${getTextColor(
                color,
              )}`}
              style={{ backgroundColor: color }}
            >
              <span className="font-semibold">{key}</span>
              <span className="opacity-80">{color}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
