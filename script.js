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

// Inline svg
function inlineSVG() {
    fetch("images/precomputed.svg")
        .then(res => res.text())
        .then(text => {
            const elt = document.getElementById("hero")
            const parser = new DOMParser()
            const svgDoc = parser.parseFromString(text, "text/html")
            elt.prepend(svgDoc.body.firstChild)
        })
        .catch(e => console.log(":(", e))
}

// Tooltip
function hideTooltip(elt) {
    tooltip.setAttribute("style", "display: none;")
}

function tooltipCallback(elt) {
    const rect = elt.getBoundingClientRect()
    const bodyRect = document.body.getBoundingClientRect()

    const xStr = (rect.x < bodyRect.width/2) ? `left: ${(rect.x + 5)}px;` : `right: ${bodyRect.width - rect.x + 5}px;`
    const yStr = (rect.y < 50) ? `top: ${(rect.y + window.scrollY + 15)}px;` : `top: ${rect.y + window.scrollY - 20}px;`

    tooltip.innerText = elt.getAttribute("id")
    tooltip.setAttribute("style", xStr + yStr)
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
window.addEventListener("load", () => {
    inlineSVG()
    runTitleGlitch()
})
