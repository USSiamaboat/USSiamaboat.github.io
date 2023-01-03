// Global
const body = document.getElementsByTagName("body")[0]

// Scroll Reminder
// ---------------------
const scrollReminder = document.getElementById("scroll-reminder")

const deleteFunction1 = () => {
	document.removeEventListener("scroll", deleteFunction1)
	scrollReminder.classList.add("invisible")
}
const deleteFunction2 = () => {
	body.removeEventListener("click", deleteFunction2)
	scrollReminder.classList.add("invisible")
}

document.addEventListener("scroll", deleteFunction1)
body.addEventListener("click", deleteFunction2)

// Pagination
// ---------------------
const links = Array.from(document.getElementsByClassName("link"))
const pages = Array.from(document.getElementsByTagName("page"))
let currentPageIndex = 0

function animatedPageTransition(index) {
	let stage = 1
	
	// Create transition div
	const transitionDiv = document.createElement("div")
	transitionDiv.classList.add("transition")
	transitionDiv.classList.add("transition1")

	// Handle animation completion
	transitionDiv.addEventListener("animationend", () => {
		if (stage == 1) {
			transitionDiv.classList.remove("transition1")
			transitionDiv.classList.add("transition2")
			setPage(index)
			stage = 2
		} else if (stage == 2) {
			transitionDiv.remove()
		}
	})

	// Add transition div to body
	body.append(transitionDiv)
}

function setPage(index) {
	// Deactivate current page
	pages[currentPageIndex].classList.add("hidden")
	links[currentPageIndex].classList.remove("active")

	// Activate the new page
	const currentPage = document.getElementById(links[index].innerText)
	currentPage.classList.remove("hidden")
	links[index].classList.add("active")

	currentPageIndex = index
}

function addEventListeners() {
	for (let i = 0; i < links.length; i++) {
		links[i].addEventListener("click", () => {
			if (i == currentPageIndex) return
			animatedPageTransition(i)
		})
	}
}

addEventListeners()

// ---------------------



// Optimized Animation
// ---------------------
function isVisible(element, page) {
	// Note: This is optimized with the assumption that the element will always be within
	//       the horizontal viewport bounds and only moves in and out of the vertical
	//       viewport bounds.
	const box = element.getBoundingClientRect()
	return !document.getElementById(page).classList.contains("hidden") && (box.bottom >= 0) && (box.top <= window.innerHeight)
}

// setInterval but will only run if the specified element is visible
function visibleInterval(callback, element, page, timeout) {
	if (isVisible(element, page)) callback()
	const self = () => visibleInterval(callback, element, page, timeout)
	const requester = () => requestAnimationFrame(self)
	if (timeout == 0) {
		requester()
	} else if (timeout > 0) {
		setTimeout(requester, timeout)
	}
}
// ---------------------



// Header description
// ---------------------
const descriptionElement = document.getElementById("descriptions")
const descriptions = [
	"Full Stack Web Developer",
	"UI/UX Designer",
	"HS Student",
	"Competitive Programmer",
	"AI Developer",
	"Musician"
]
let currentDescriptionIndex = 0

// Progress in typing description
// 0-desc.length = characters
// desc.length + 1-5 = wait 1-5
let progress = 0

// Direction of progress
// 1 = forwards
// -1 = backwards
let direction = 1

function nextDescription() {
	const description = descriptions[currentDescriptionIndex]

	// Set description text
	if (progress <= description.length) {
		descriptionElement.innerText = description.substring(0, progress)
	}

	// Change direction if needed
	if (progress == description.length + 10) {
		direction = -1
	}

	// Update progress based on current direction
	progress += direction

	if (progress == 0) {
		// Increment Description Index
		currentDescriptionIndex++
		currentDescriptionIndex %= descriptions.length

		// Reset direction
		direction = 1
	}
}

function cycleDescriptions() {
	visibleInterval(nextDescription, descriptionElement, "HOME", 50)
}

cycleDescriptions()

// ---------------------



// Logo Cloud
// ---------------------
const logos = Array.from(document.getElementsByClassName("image-container"))
const CLOUD_RADIUS = 130

const cloud = document.getElementById("cloud")
const MAX_ROT_SPEED = 0.015

function sin(x) {
	return Math.sin(x)
}

function cos(x) {
	return Math.cos(x)
}

function generatePoints(n, radius) {
	let points = []
	const RADIAN_PHI = Math.PI * (3 - Math.sqrt(5))

	for (let i = 0; i < n; i++) {
		// Distribute x values from -radius to radius
		const x = radius * (2*(i / (n-1)) - 1)

		// Calculate radius of slice of circle with x by pythagorean theorem
		const slice_radius = Math.sqrt(radius**2 - x**2)

		// Calculate angle using golden angle increments
		const theta = i * RADIAN_PHI

		// Calculate y and z with known values
		const y =  slice_radius * cos(theta)
		const z = slice_radius * sin(theta)

		// Add point to point list
		points.push([x, y, z])
	}

	return points
}

function placeLogos(points) {
	for (let i = 0; i < points.length; i++) {
		logos[i].setAttribute("style", `transform: translate3d(${points[i][1]}px, ${points[i][0]}px, ${points[i][2]}px); opacity: ${(points[i][2]+CLOUD_RADIUS)/CLOUD_RADIUS}; z-index: ${Math.round(points[i][2])};`)
	}
}

function rotatePoints(points, x, y, z) {
	// Precompute trigonometric values
	const sx = sin(x)
	const sy = sin(y)
	const sz = sin(z)
	const cx = cos(x)
	const cy = cos(y)
	const cz = cos(z)

	// Define 3x3 rotation matrix
	const rotationMatrix = [
		[cy*cz, sx*sy*cz - cx*sz, cx*sy*cz + sx*sz],
		[cy*sz, sx*sy*sz + cx*cz, cx*sy*sz - sx*cz],
		[-1*sy, sx*cy, cx*cy]
	]

	// Computes the dot product of 2 vectors of size 3
	const vector3Dot = (vec1, vec2) => vec1[0]*vec2[0] + vec1[1]*vec2[1] + vec1[2]*vec2[2]

	// Create a function that rotates each point using the rotation matrix
	const rotatePoint = (point) => [vector3Dot(point, rotationMatrix[0]), vector3Dot(point, rotationMatrix[1]), vector3Dot(point, rotationMatrix[2])]

	// Rotates each point
	let out = []
	for (let point of points) {
		out.push(rotatePoint(point))
	}

	return out
}

let xRot = MAX_ROT_SPEED/3
let yRot = MAX_ROT_SPEED/4

function capRotation(rot) {
	if (rot < MAX_ROT_SPEED * -1) {
		return MAX_ROT_SPEED * -1
	} else if (rot > MAX_ROT_SPEED) {
		return MAX_ROT_SPEED
	} else {
		return rot
	}
}

function cursorMove(x, y) {
	const cloudX = cloud.getBoundingClientRect().x + cloud.clientWidth/2
	const cloudY = cloud.getBoundingClientRect().y + cloud.clientHeight/2

	xRot = capRotation(-1*MAX_ROT_SPEED*(x-cloudX)/(cloud.clientWidth))
	yRot = capRotation(MAX_ROT_SPEED*(y-cloudY)/(cloud.clientHeight))

	// Limit actual rotation amount to set max speed
	if (xRot**2 + yRot**2 > MAX_ROT_SPEED**2) {
		// Calculate a coefficient to multiply x and y rotation amounts
		const reductionCoef = Math.sqrt((MAX_ROT_SPEED**2)/(xRot**2 + yRot**2))

		// Scale rotation amounts to fit the maximum
		xRot = xRot*reductionCoef
		yRot = yRot*reductionCoef
	}
}

function animateLogos() {
	let points = generatePoints(15, CLOUD_RADIUS)
	placeLogos(points)

	const frame = () => {
		points = rotatePoints(points, xRot, yRot, 0)
		placeLogos(points)
	}

	visibleInterval(frame, cloud, "HOME", 0)
}

document.onmousemove = (event) => {cursorMove(event.clientX, event.clientY)}

document.ontouchstart = (event) => {cursorMove(event.changedTouches[0].clientX, event.changedTouches[0].clientY)}

animateLogos()
// ---------------------

