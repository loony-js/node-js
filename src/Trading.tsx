import React, { useRef, useEffect, useState } from "react"
import sampleData from "./data.json"

// time, open, high, low, close

// const sampleData = [
//   [1752085800000, 692, 696.75, 685, 695.6, 7733963, 0],
//   [1751999400000, 688.95, 695.5, 688.5, 692.8, 5478813, 0],
//   [1751913000000, 693, 696.95, 687.5, 693.2, 7615926, 0],
//   [1751826600000, 689.05, 691.95, 683.35, 688.85, 5428220, 0],
//   [1751567400000, 691, 692.85, 686.35, 689.05, 4942900, 0],
// ]

const CandlestickChart = ({
  data = sampleData,
  width = 1920,
  height = 1080,
}) => {
  const canvasRef = useRef(null)

  // Zoom states
  const [xScale, setXScale] = useState(1) // Time scale
  const [yScale, setYScale] = useState(1) // Price scale

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    canvas.width = width
    canvas.height = height

    const padding = 50
    const candleWidth = 10
    const baseSpacing = 20

    const prices = data.flatMap((d) => [d[2], d[3]])
    const maxPrice = Math.max(...prices)
    const minPrice = Math.min(...prices)
    const priceRange = maxPrice - minPrice

    const visibleRange = Math.floor(
      (width - 2 * padding) / (baseSpacing * xScale),
    )
    const visibleData = data.slice(-visibleRange)

    const localMax = Math.max(...visibleData.map((d) => d[2]))
    const localMin = Math.min(...visibleData.map((d) => d[3]))
    const localRange = localMax - localMin

    const scaleY = (price: number) =>
      height -
      padding -
      ((price - localMin) / localRange) * (height - 2 * padding) * yScale

    const drawPriceAxis = () => {
      ctx.fillStyle = "#000"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "left"

      const steps = 5
      for (let i = 0; i <= steps; i++) {
        const price = localMin + (i / steps) * localRange
        const y = scaleY(price)
        ctx.beginPath()
        ctx.moveTo(width - padding, y)
        ctx.lineTo(width, y)
        ctx.strokeStyle = "#ddd"
        ctx.stroke()
        ctx.fillText(price.toFixed(2), width - padding + 5, y + 3)
      }
    }

    const drawTimeAxis = () => {
      ctx.fillStyle = "#000"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"

      visibleData.forEach((d, i) => {
        const x = padding + i * baseSpacing * xScale
        if (i % 2 === 0) {
          ctx.beginPath()
          ctx.moveTo(x, height - padding)
          ctx.lineTo(x, height - padding + 5)
          ctx.strokeStyle = "#000"
          ctx.stroke()

          ctx.fillText(10, x, height - padding + 15)
        }
      })
    }

    const drawCandles = () => {
      ctx.clearRect(0, 0, width, height)

      visibleData.forEach((d, i) => {
        const x = padding + i * baseSpacing * xScale

        const openY = scaleY(d[1])
        const closeY = scaleY(d[4])
        const highY = scaleY(d[2])
        const lowY = scaleY(d[3])

        const isBull = d[4] > d[1]
        ctx.strokeStyle = isBull ? "#0f0" : "#f00"
        ctx.fillStyle = isBull ? "#0f0" : "#f00"

        // Wick
        ctx.beginPath()
        ctx.moveTo(x, highY)
        ctx.lineTo(x, lowY)
        ctx.stroke()

        // Body
        const bodyTop = Math.min(openY, closeY)
        const bodyHeight = Math.abs(openY - closeY)
        ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight || 1)
      })
    }

    drawCandles()
    drawPriceAxis()
    drawTimeAxis()
  }, [data, width, height, xScale, yScale])

  // Handle mouse wheel zooming
  const handleWheel = (e) => {
    e.preventDefault()
    const delta = e.deltaY
    const zoomIntensity = 0.1

    if (e.shiftKey) {
      // Vertical zoom
      setYScale((prev) =>
        Math.max(
          0.1,
          prev * (1 + (delta > 0 ? -zoomIntensity : zoomIntensity)),
        ),
      )
    } else {
      // Horizontal zoom
      setXScale((prev) =>
        Math.max(
          0.5,
          prev * (1 + (delta > 0 ? -zoomIntensity : zoomIntensity)),
        ),
      )
    }
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{ border: "1px solid #ccc" }}
        onWheel={handleWheel}
      />
    </div>
  )
}

export default CandlestickChart
