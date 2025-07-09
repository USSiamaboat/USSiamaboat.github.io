// Title glitch animator
// ==================== //
// TODO: change from somewhat questionable setTimeout sequences to requestAnimationFrame

// Setup
const titleElt = document.getElementById("title")

const BLANK = "⠀"
const GLITCHES = "!@#$%^&[](){}"
const TITLES = [
    "Data Scientist",
    "ML Researcher",
    "Quantitative Trader",
    "Award-Winning Pianist",
    "Web Developer"
]
const MAX_TITLE_LEN = TITLES.reduce((acc, curr) => Math.max(acc, curr.length), 0)
const GLITCH_DELAY = 30
const LINGER_TIME = 1000

// Main
function runTitleGlitch() {
    let curr = 1
    titleElt.innerText = TITLES[0]

    function helper() {
        curr = (curr + 1) % TITLES.length

        setTimeout(() => { glitchTo(TITLES[curr], helper) }, LINGER_TIME)
    }

    setTimeout(() => { glitchTo(TITLES[curr], helper) }, LINGER_TIME)
}

// Randomizer
function randomGlitch() {
    return GLITCHES[Math.floor(Math.random() * GLITCHES.length)]
}

// Animation sequence
function glitchTo(target, callback) {
    const source = titleElt.innerText

    // Add blanks if needed
    titleElt.innerText += BLANK.repeat(Math.max(0, target.length - source.length))

    // Helpers
    function glitchHelper(i, l) {
        let newText = ""

        for (let j = 0; j < i; j++) {
            newText += randomGlitch()
        }

        newText += titleElt.innerText.slice(i, l)

        titleElt.innerText = newText
    }

    function unglitchHelper(i) {
        let newText = target.slice(0, i)

        for (let j = i; j < target.length; j++) {
            newText += randomGlitch()
        }

        titleElt.innerText = newText
    }
    
    // Glitch all
    let lastDelay = 0
    for (let i = 1; i <= titleElt.innerText.length; i++) {
        lastDelay += GLITCH_DELAY
        setTimeout(() => { glitchHelper(i, titleElt.innerText.length) }, lastDelay)
    }

    // Remove excess length
    for (let i = source.length; i >= target.length; i--) {
        lastDelay += GLITCH_DELAY
        setTimeout(() => { glitchHelper(i, i) }, lastDelay)
    }

    // Unglitch all
    for (let i = 1; i <= target.length; i++) {
        lastDelay += GLITCH_DELAY
        setTimeout(() => { unglitchHelper(i) }, lastDelay)
    }

    // Callback
    lastDelay += GLITCH_DELAY
    setTimeout(callback, lastDelay)
}


// Prime spiral
// ==================== //

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
const SVG_VIEWBOX_HEIGHT = Math.round(SVG_VIEWBOX_WIDTH / 1.7)
const POLAR_SCALE = 0.15 * SVG_VIEWBOX_WIDTH / 1000

// Main
function runPrimeSpiral() {
    svg.setAttribute("viewBox", `-${SVG_VIEWBOX_WIDTH} -${SVG_VIEWBOX_HEIGHT} ${2*SVG_VIEWBOX_WIDTH} ${2*SVG_VIEWBOX_HEIGHT}`)
    draw()

    const circles = document.getElementsByTagName("circle")
    Array.from(circles).forEach(x => {
        x.addEventListener("mouseenter", tooltipCallback)
        x.addEventListener("mouseleave", hideTooltip)
    })

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


// Form
// ==================== //
const formElt = document.getElementById("form")
const emailElt = document.getElementById("email")
const messageElt = document.getElementById("message")
const submitElt = document.getElementById("submit")

let allowSubmit = true

let angryExpiration = new Date()
const ANGRY_LEN = 2000

const FORM_URL = "https://formspree.io/f/mldnywrv"

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function storeValue(elt, newValue) {
    elt.setAttribute("storedValue", elt.value)
    elt.value = newValue
    elt.setAttribute("disabled", true)
}

function restoreValue(elt) {
    elt.value = elt.getAttribute("storedValue")
    elt.removeAttribute("storedValue")
    elt.removeAttribute("disabled")
}

async function angryForm(message = "Form couldn't send!") {
    if (new Date() < angryExpiration) { return }

    angryExpiration = new Date() + ANGRY_LEN
    formElt.classList.add("angry")
    storeValue(emailElt, "Error!")
    storeValue(messageElt, message)
    
    await delay(ANGRY_LEN)

    formElt.classList.remove("angry")
    restoreValue(emailElt)
    restoreValue(messageElt)

    allowSubmit = true
}

function validate(data) {
    // Check email
    const emailRe = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const emailGood = data["email"].toLowerCase().match(emailRe)

    if (!emailGood) {
        angryForm("Invalid email")
        return false
    }
    
    // TODO: maybe add more validation if it becomes a problem

    return true
}

async function sendForm(data) {
    try {
        const response = await fetch(FORM_URL, {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            "body": JSON.stringify(data)
        })

        if (response.ok) {
            emailElt.value = "Success."
            messageElt.value = "I have been notified!"

            emailElt.setAttribute("disabled", true)
            messageElt.setAttribute("disabled", true)
            submitElt.setAttribute("disabled", true)
        } else {
            const responseData = await response.json();
            if (responseData.hasOwnProperty('errors')) {
                await angryForm(responseData.errors.map(error => error.message).join(", "))
            } else {
                await angryForm()
            }
        }
    } catch (error) {
        await angryForm()
    }
}

submitElt.addEventListener("click", () => {
    if (new Date() < angryExpiration) { return }
    else if (!allowSubmit) { return }

    allowSubmit = false

    let data = {
        "email": emailElt.value,
        "message": messageElt.value
    }

    if (!validate(data)) { return }

    sendForm(data)
})

// Run all
// ==================== //
window.addEventListener('load', () => {
  runTitleGlitch()
  runPrimeSpiral()
})
