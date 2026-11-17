// Light/dark theme toggle.
// Loaded synchronously in <head> so a saved choice is applied before first paint.
// With no saved choice the CSS follows the system setting (color-scheme: light dark).
(function () {
    var KEY = 'theme'
    var root = document.documentElement
    var system = window.matchMedia('(prefers-color-scheme: dark)')

    function saved() {
        try {
            var value = localStorage.getItem(KEY)
            return value === 'light' || value === 'dark' ? value : null
        } catch (e) {
            return null
        }
    }

    function current() {
        return root.getAttribute('data-theme') || (system.matches ? 'dark' : 'light')
    }

    function apply() {
        var theme = saved()

        if (theme) {
            root.setAttribute('data-theme', theme)
        } else {
            root.removeAttribute('data-theme')
        }
    }

    function updateButton(button) {
        var theme = current()
        // CSS shows the moon in light mode and the sun in dark mode
        button.setAttribute('data-current', theme)
        button.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode')
    }

    apply()

    document.addEventListener('DOMContentLoaded', function () {
        var button = document.querySelector('[data-theme-toggle]')

        if (!button) {
            return
        }

        updateButton(button)
        button.hidden = false

        button.addEventListener('click', function () {
            var next = current() === 'dark' ? 'light' : 'dark'

            try {
                // Picking the theme the system already uses goes back to following the system
                if (next === (system.matches ? 'dark' : 'light')) {
                    localStorage.removeItem(KEY)
                } else {
                    localStorage.setItem(KEY, next)
                }
            } catch (e) {
                // Storage blocked: still switch for this page view
                root.setAttribute('data-theme', next)
                updateButton(button)
                return
            }

            apply()
            updateButton(button)
        })

        system.addEventListener('change', function () {
            updateButton(button)
        })
    })
})()
