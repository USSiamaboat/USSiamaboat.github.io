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
	{ opacity: 0 },
	{ opacity: 1 },
]

const fadeOut = [
	{ opacity: 1 },
	{ opacity: 0 },
]

const timing = {
	duration: fadeDuration,
	iterations: 1,
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
