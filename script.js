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
