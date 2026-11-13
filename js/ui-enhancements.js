// js/ui-enhancements.js

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initPasswordToggles();
});

// 1. Dark / Bright Theme Switcher
function initThemeToggle() {
    const savedTheme = localStorage.getItem('gp_theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }

    const navList = document.querySelector('header nav ul');
    if (!navList) return;

    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.id = 'theme-toggle-btn';
    btn.type = 'button';
    btn.style.cssText = 'background: rgba(255,255,255,0.15); color: #fff; border: 1px solid rgba(255,255,255,0.3); padding: 5px 10px; border-radius: 5px; cursor: pointer; font-size: 0.85rem;';
    btn.textContent = document.body.classList.contains('dark-theme') ? '☀️ Light' : '🌙 Dark';

    btn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('gp_theme', isDark ? 'dark' : 'light');
        btn.textContent = isDark ? '☀️ Light' : '🌙 Dark';
    });

    li.appendChild(btn);
    navList.appendChild(li);
}

// 2. Show / Hide Password Toggle for all Password Fields
function initPasswordToggles() {
    const passwordInputs = document.querySelectorAll('input[type="password"]');

    passwordInputs.forEach((input) => {
        // Avoid wrapping twice
        if (input.parentElement.classList.contains('password-wrapper')) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'password-wrapper';
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(input);

        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'toggle-password-btn';
        toggleBtn.textContent = 'Show';

        toggleBtn.addEventListener('click', () => {
            const isHidden = input.type === 'password';
            input.type = isHidden ? 'text' : 'password';
            toggleBtn.textContent = isHidden ? 'Hide' : 'Show';
        });

        wrapper.appendChild(toggleBtn);
    });
}