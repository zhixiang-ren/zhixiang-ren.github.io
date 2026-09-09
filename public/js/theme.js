;(() => {
  const root = document.documentElement
  const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches

  const savedTheme = (() => {
    try {
      return localStorage.getItem("theme")
    } catch {
      return null
    }
  })()
  const initialDark =
    savedTheme === "dark" ||
    (savedTheme !== "light" && matchMedia("(prefers-color-scheme: dark)").matches)
  root.classList.toggle("dark", initialDark)

  const updateButton = () => {
    const button = document.getElementById("header-theme-button")
    if (!button) return
    const dark = root.classList.contains("dark")
    button.setAttribute("aria-pressed", String(dark))
    button.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme")
  }

  const applyTheme = (dark) => {
    root.classList.toggle("dark", dark)
    try {
      localStorage.setItem("theme", dark ? "dark" : "light")
    } catch {}
    updateButton()
  }

  const initializeThemeButton = () => {
    const button = document.getElementById("header-theme-button")
    if (!button || button.dataset.ready === "true") return
    button.dataset.ready = "true"
    button.addEventListener("click", () => {
      const change = () => applyTheme(!root.classList.contains("dark"))
      if (document.startViewTransition && !reducedMotion()) document.startViewTransition(change)
      else change()
    })
    updateButton()
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", initializeThemeButton)
  else initializeThemeButton()
  document.addEventListener("astro:page-load", initializeThemeButton)
})()
