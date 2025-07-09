// Elements
const svg = document.getElementById("spiral")
const tooltip = document.getElementById("tooltip")

// Colors
const COLOR1 = "#B3B3CC"
const COLOR2 = "#3333CC"

// Residue config
const MOD = 22
const HIGHLIGHT_PROP_DELAY = 10
const HIGHLIGHT_TRANSITION = 200
const HIGHLIGHT_FADE_DELAY = 100

// SVG config
const MAX_PRIME = 9000 // Largest prime that will be visible
const SVG_VIEWBOX_WIDTH = document.body.getBoundingClientRect().width
const SVG_VIEWBOX_HEIGHT = Math.round(SVG_VIEWBOX_WIDTH / 2)
const POLAR_SCALE = 0.15 * SVG_VIEWBOX_WIDTH / 1000

// Main
function main() {
    svg.setAttribute("viewBox", `-${SVG_VIEWBOX_WIDTH} -${SVG_VIEWBOX_HEIGHT} ${2*SVG_VIEWBOX_WIDTH} ${2*SVG_VIEWBOX_HEIGHT}`)
    draw()

    const circles = document.getElementsByTagName("circle")
    Array.from(circles).forEach(x => {x.addEventListener("mouseenter", tooltipCallback)})
    Array.from(circles).forEach(x => {x.addEventListener("mouseleave", hideTooltip)})

    animateResidues()
}

// Residue classes
function animateResidues() {
    const circles = document.getElementsByTagName("circle") // Guaranteed to be in sorted order
    const classes = findResidueClasses(circles).filter(x => x.length)

    const totalDuration = circles.length * 2 * HIGHLIGHT_PROP_DELAY + classes.length * HIGHLIGHT_FADE_DELAY

    let delay = 0

    for (let classNum = 0; classNum < classes.length; classNum++) {
        const classDelay = classes[classNum].length * (HIGHLIGHT_PROP_DELAY)

        for (let i = 0; i < classes[classNum].length; i++) {
            const keyframes = [
                { "fill": COLOR1, "offset": 0 },
                { "fill": COLOR2, "offset": HIGHLIGHT_TRANSITION / totalDuration, "easing": "ease-in-out" },
                { "fill": COLOR2, "offset": (classDelay + HIGHLIGHT_TRANSITION) / totalDuration },
                { "fill": COLOR1, "offset": (classDelay + 2 * HIGHLIGHT_TRANSITION) / totalDuration, "easing": "ease-in-out" },
                { "fill": COLOR1, "offset": 1 }
            ]

            classes[classNum][i].animate(
                keyframes, {
                    "duration": totalDuration,
                    "delay": delay,
                    "iterations": Infinity
                }
            )

            delay += HIGHLIGHT_PROP_DELAY
        }

        delay += HIGHLIGHT_FADE_DELAY + classDelay
    }
}

function findResidueClasses(circles) {
    let classes = Array(MOD).fill().map(() => [])

    for (const circle of circles) {
        const prime = parseInt(circle.id)

        classes[prime % MOD].push(circle)
    }

    return classes
}

// Tooltip
function hideTooltip() {
    tooltip.setAttribute("style", "display: none;")
}

function tooltipCallback(e) {
    const rect = e.target.getBoundingClientRect()
    const bodyRect = document.body.getBoundingClientRect()

    const xStr = (rect.x < bodyRect.width/2) ? `left: ${(rect.x + 5)}px;` : `right: ${bodyRect.width - rect.x + 5}px;`
    const yStr = (rect.y < 50) ? `top: ${(rect.y + window.scrollY + 15)}px;` : `top: ${rect.y + window.scrollY - 20}px;`

    tooltip.innerText = e.target.getAttribute("id")
    tooltip.setAttribute("style", xStr + yStr)
}

// Generate SVG
function draw() {
    // Must be added in sorted order

    primes = sieveOfEratosthenes(MAX_PRIME)

    let svgContent = ""

    for (const prime of primes) {
        svgContent += drawPoint(prime)
    }

    svg.innerHTML = svgContent
}

function drawPoint(p) {
    x = POLAR_SCALE * p * Math.cos(p)
    y = - POLAR_SCALE * p * Math.sin(p) // Negative to fix svg's inverted y axis

    if (Math.abs(x) > SVG_VIEWBOX_WIDTH || Math.abs(y) > SVG_VIEWBOX_HEIGHT) { return "" } // Don't draw out of bounds

    return `<circle id="${p}" cx="${x}" cy="${y}" style="animation-delay: ${(p%30)/10}s;"/>`
}

// Generate primes
function sieveOfEratosthenes(n) {
    let primes = new Uint8Array(n + 1).fill(1)

    for (let i = 2; i <= Math.sqrt(n); i++) {
        if (primes[i]) {
            for (let j = i * i; j <= n; j += i) {
                primes[j] = 0
            }
        }
    }

    let result = []
    for (let i = 2; i <= n; i++) {
        if (primes[i]) { result.push(i) }
    }

    return result
}

main()
