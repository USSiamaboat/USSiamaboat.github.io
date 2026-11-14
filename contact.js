const contactForm = document.querySelector('.contact-form');
const contactStatus = document.querySelector('#contact-status');
const submitButton = contactForm.querySelector('[type="submit"]');

contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submitButton.disabled) return;

    const formData = new FormData(contactForm);
    for (const control of contactForm.elements) control.disabled = true;
    submitButton.setAttribute('aria-label', 'Sending message');
    contactStatus.textContent = '';
    contactForm.setAttribute('aria-busy', 'true');

    try {
        const response = await fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: { Accept: 'application/json' },
        });

        if (!response.ok) throw new Error('Submission failed');

        contactStatus.textContent = 'Thanks! Message sent.';
    } catch {
        contactStatus.textContent = 'Your message could not be sent. Please try again.';
        for (const control of contactForm.elements) control.disabled = false;
    } finally {
        submitButton.setAttribute('aria-label', 'Send message');
        contactForm.removeAttribute('aria-busy');
    }
});

