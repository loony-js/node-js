/* eslint-disable no-undef */
const candles = require("./local/data.json")

// [timestamp, open, high, low, close, volume, ???]

function analyzeBestTradingDays() {
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  const weekStats = {}
  const monthStats = {}

  let dayIndex = 4

  for (let i = 0; i < candles.length; i++) {
    const [timestamp, open, , , close] = candles[i]
    const date = new Date(timestamp)
    const dayOfWeek = daysOfWeek[dayIndex]
    const dayOfMonth = date.getUTCDate()
    const percentChange = ((close - open) / open) * 100

    // Weekday grouping
    if (!weekStats[dayOfWeek]) {
      weekStats[dayOfWeek] = []
    }
    weekStats[dayOfWeek].push(percentChange)

    // Day of month grouping
    if (!monthStats[dayOfMonth]) {
      monthStats[dayOfMonth] = []
    }
    monthStats[dayOfMonth].push(percentChange)

    if (dayIndex === 0) {
      dayIndex = 4
    } else {
      dayIndex -= 1
    }
  }

  function average(arr) {
    return arr.reduce((sum, val) => sum + val, 0) / arr.length
  }

  function findBestDays(stats) {
    let bestUp = { day: null, avg: -Infinity }
    let bestDown = { day: null, avg: Infinity }

    for (const day in stats) {
      const avgChange = average(stats[day])
      if (avgChange > bestUp.avg) bestUp = { day, avg: avgChange }
      if (avgChange < bestDown.avg) bestDown = { day, avg: avgChange }
    }

    return { bestUp, bestDown }
  }

  const bestWeekdays = findBestDays(weekStats)
  const bestMonthDays = findBestDays(monthStats)

  return {
    bestWeekdays,
    bestMonthDays,
  }
}

const result = analyzeBestTradingDays()
console.log("📈 Best weekday to trade UP:", result.bestWeekdays.bestUp)
console.log("📉 Best weekday to trade DOWN:", result.bestWeekdays.bestDown)
console.log("📈 Best calendar day to trade UP:", result.bestMonthDays.bestUp)
console.log(
  "📉 Best calendar day to trade DOWN:",
  result.bestMonthDays.bestDown,
)
