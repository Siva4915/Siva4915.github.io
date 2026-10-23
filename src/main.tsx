import React from 'react'
import ReactDOM from 'react-dom/client'
import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'
import App from './App'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// PWA install support for the browser build. Native shells do not need it.
if ('serviceWorker' in navigator && import.meta.env.PROD && !('Capacitor' in window)) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      /* The app still works without offline caching. */
    })
  })
}

// Keep the Android content below the status bar and match the app theme.
if (Capacitor.getPlatform() === 'android') {
  document.documentElement.classList.add('native-android')
}

if (Capacitor.isNativePlatform()) {
  void StatusBar.setOverlaysWebView({ overlay: false }).catch(() => undefined)
  void StatusBar.setStyle({ style: Style.Dark }).catch(() => undefined)
  void StatusBar.setBackgroundColor({ color: '#0f0f0f' }).catch(() => undefined)
}
