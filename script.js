// Detect Mobile

let mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

// Mobile Menu

const mobileMenuToggle = document.getElementById("mobile-menu-toggle")
let isMobileMenuOpen = false

function toggleMobileMenu(e) {
	if (e.currentTarget.id == "mobile-menu-toggle") {
		e.stopPropagation()
	}

	mobileMenuToggle.classList.toggle("active")
	isMobileMenuOpen = !isMobileMenuOpen

	if (!isMobileMenuOpen) return
}

mobileMenuToggle.addEventListener("click", toggleMobileMenu)

function closeMobileMenu(e) {
	mobileMenuToggle.classList.remove("active")
}

document.addEventListener("click", closeMobileMenu)

// Form character counter

const textFields = Array.from(document.getElementsByClassName("text-input"))

textFields.forEach(textField => {
	const input = textField.getElementsByTagName("textarea")[0]
	const counter = textField.getElementsByClassName("char-limit")[0]
	const charLimit = counter.getAttribute("data-limit")

	input.addEventListener("input", e => {
		counter.innerText = `${input.value.length}/${charLimit}`
	})
})

// Form

const modal = document.getElementsByTagName("dialog")[0]
const buttons = Array.from(modal.getElementsByClassName("clickable"))
const emailField = document.getElementById("email")
const messageField = document.getElementById("message")
const errorEl = document.getElementById("form-error")

function openModal() {
	modal.showModal()
}

function closeModal() {
	modal.close()
}

buttons[0].addEventListener("click", closeModal)

buttons[1].addEventListener("click", e => {
	const approved = submitMessage(emailField.value, messageField.value)
	
	if (approved == "😀") {
		closeModal()
		return
	}

	errorEl.innerText = approved
	errorEl.classList.add("shown")
})

// Send Form Data

const url = "https://send.pageclip.co/7A5E2mxhjVipBMIYPlmA2RmtGkLWEGvZ/webportfolio"
const oneDay = 1000*60*60*24

function post(url, data) {
	let xhr

	if (window.XMLHttpRequest) {
		xhr = new XMLHttpRequest()
	} else if (window.ActiveXObject) {
		xhr = new ActiveXObject("Microsoft.XMLHTTP")
	}

	xhr.open("POST", url, true)
	xhr.setRequestHeader("Content-Type", "application/json")
	xhr.setRequestHeader("Accept", "application/json")
	xhr.send(JSON.stringify(data))

	localStorage.setItem("lastsubmitted", new Date().toString())
}

function validateEmail(email) {
	return String(email)
		.toLowerCase()
		.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		)
}

function isValid(email, message) {
	return (email.length <= 50)
		&& (message.length <= 500)
		&& (message.length > 0)
		&& validateEmail(email)
}

function submitMessage(email, message) {
	const lastSubmitted = new Date(localStorage.getItem("lastsubmitted"))

	const isOutsideOneDay = (lastSubmitted == null) || (new Date() - lastSubmitted > oneDay)
	const isValidMessage = isValid(email, message)

	if (!isOutsideOneDay) return "Sending Failed: Only 1 message allowed per day"
	if (!isValidMessage) return "Sending Failed: Invalid email/message"

	post(url, {"email": email, "message": message})
	errorEl.classList.remove("shown")
	return "😀"
}

// Link message modal to mail buttons

const mails = Array.from(document.querySelectorAll("[data-action='message']"))

mails.forEach(mail => {
	mail.addEventListener("click", openModal)
})

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

// Links

const links = Array.from(document.querySelectorAll("[data-link]"))

function goToURL(url) {
	if (mobile && (url.substring(0, 1) == "#")) {
		document.getElementById(url.substring(1)).scrollIntoView()
	} else {
		window.open(url, "_blank")
	}
}

links.forEach(link => {
	link.addEventListener("click", e => {
		goToURL(link.getAttribute("data-link"))
	})
})

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
