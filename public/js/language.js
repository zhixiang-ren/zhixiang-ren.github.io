;(() => {
  const root = document.documentElement

  const savedLanguage = (() => {
    try {
      return localStorage.getItem("site-language")
    } catch {
      return null
    }
  })()
  root.lang = savedLanguage === "zh" ? "zh-CN" : "en"

  const initializeLanguageToggle = () => {
    const button = document.getElementById("language-toggle")
    if (!button || button.dataset.ready === "true") return
    button.dataset.ready = "true"

    const updateState = () => {
      const isChinese = root.lang === "zh-CN"
      button.setAttribute("aria-pressed", String(isChinese))
      button.setAttribute("aria-label", isChinese ? "Switch to English" : "切换到中文")
      document.title = isChinese ? document.body.dataset.titleZh : document.body.dataset.titleEn
    }

    button.addEventListener("click", () => {
      const nextChinese = root.lang !== "zh-CN"
      const applyLanguage = () => {
        root.lang = nextChinese ? "zh-CN" : "en"
        try {
          localStorage.setItem("site-language", nextChinese ? "zh" : "en")
        } catch {}
        updateState()
      }

      if (document.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
        document.startViewTransition(applyLanguage)
      } else {
        applyLanguage()
      }
    })

    updateState()
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeLanguageToggle)
  } else {
    initializeLanguageToggle()
  }
  document.addEventListener("astro:page-load", initializeLanguageToggle)
})()
