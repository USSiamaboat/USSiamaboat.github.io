// Detect Mobile

let mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

// Mobile Menu

const mobileMenuToggle = document.getElementById("mobile-menu-toggle")
let isMobileMenuOpen = false

function toggleMobileMenu(e) {
	e.stopPropagation()

	mobileMenuToggle.classList.toggle("active")
	isMobileMenuOpen = !isMobileMenuOpen

	if (!isMobileMenuOpen) return
}

mobileMenuToggle.addEventListener("click", toggleMobileMenu)

function closeMobileMenu(e) {
	mobileMenuToggle.classList.remove("active")
}

document.addEventListener("click", closeMobileMenu)

// Smooth Scrolling

const body = document.body;
const main = document.getElementById("scroll-container");

let targetY = 0
let currY = targetY

function updateTarget() {
	targetY = window.pageYOffset
}

function lin_interp(a, b, t) {
	// Linear interpolation between a and b at time t in [0, 1]
	return (1 - t) * a + t * b
}

function update() {
	// Reduces the distance to the target by approximated exponential decay
	body.style.height = `${main.clientHeight}px`

	currY = lin_interp(currY, targetY, 0.1)
	currY = Math.floor(currY * 100) / 100

	main.style.transform = `translateY(-${currY}px)`

  	window.requestAnimationFrame(update)
}

function removeScrollElements() {
	body.append(...main.children)
	main.remove()
}

if (!mobile) {
	window.addEventListener("scroll", updateTarget)
	window.requestAnimationFrame(update)
} else {
	removeScrollElements()
}

// Desktop Scrollto
const scrollTos = Array.from(document.querySelectorAll("[data-scrollto]"))

function getTargetY(el) {
	return el.getClientRects()[0]["y"] - 85 + currY
}

if (!mobile) {
	scrollTos.forEach(el => {
		el.addEventListener("click", e => {
			const destinationID = e.target.getAttribute("data-scrollto")
			const destination = document.getElementById(destinationID)
			targetY = getTargetY(destination)
		})
	})
}

// Hero Description

const heroDesc = document.getElementById("hero-desc")
const descs = [
	"Full-Stack Web Developer     ",
	"AI Researcher     ",
	"Award-Winning Pianist     ",
	"Competitive Programmer     ",
	"High School Student     ",
	"Entrepreneur     "
]
const fadeDuration = 100

let isAdding = true
let currentDescIndex = 0
let currentLetterIndex = 0
let currentWord = null
let newWord = true
let deleteStack = []

const fadeIn = [
	{ opacity: 0, transform: "translateX(30%)" },
	{ opacity: 1, transform: "translateX(0%)" },
]

const fadeOut = [
	{ opacity: 1, transform: "translateX(0%)" },
	{ opacity: 0, transform: "translateX(50%)" },
]

const timing = {
	duration: fadeDuration,
	iterations: 1,
	easing: "ease-in-out",
}

function stepIndices() {
	const currentDesc = descs[currentDescIndex]
	
	if (isAdding) {
		currentLetterIndex++
	} else {
		currentLetterIndex--
	}

	if (currentLetterIndex == currentDesc.length) {
		isAdding = false
		currentLetterIndex--
	} else if (currentLetterIndex == -1) {
		isAdding = true
		currentLetterIndex++
		currentDescIndex++
		currentDescIndex = currentDescIndex % descs.length
	}
}

function updateHeroDesc() {
	if (newWord) {
		currentWord = document.createElement("div")
		currentWord.classList.add("word")
		heroDesc.append(currentWord)
		newWord = false
	}

	if (isAdding) {
		const newLetterElement = document.createElement("p")

		const currentDesc = descs[currentDescIndex]
		const newLetter = currentDesc.substring(currentLetterIndex, currentLetterIndex+1)

		if (currentLetterIndex == 0) {
			deleteStack = []
			Array.from(heroDesc.children).forEach(child => {
				child.remove()
			})

			currentWord = document.createElement("div")
			currentWord.classList.add("word")
			heroDesc.append(currentWord)
		}

		if (newLetter == " ") {			
			currentWord = document.createElement("div")
			currentWord.classList.add("word")
			heroDesc.append(currentWord)

			deleteStack.push(currentWord)
		} else {
			newLetterElement.innerText = newLetter
		}

		currentWord.append(newLetterElement)

		deleteStack.push(newLetterElement)

		newLetterElement.animate(fadeIn, timing)

		stepIndices()
	} else {
		const currentLetterElement = deleteStack[currentLetterIndex]

		currentLetterElement.animate(fadeOut, timing)

		setTimeout(() => {
			currentLetterElement.remove()
		}, fadeDuration)

		stepIndices()
	}
}

setInterval(updateHeroDesc, 100)
