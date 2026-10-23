import { Download, X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export const InstallPrompt = () => {
  const [event, setEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault()
      setEvent(e as BeforeInstallPromptEvent)
    }
    const onInstalled = () => setHidden(true)
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  if (!event || hidden) return null

  const install = async () => {
    await event.prompt()
    const choice = await event.userChoice
    if (choice.outcome === 'accepted') setHidden(true)
    setEvent(null)
  }

  return (
    <div className="install-prompt" role="dialog" aria-label="Install Vuemora">
      <img src="/icons/icon-192.png" alt="" />
      <div className="install-prompt-copy">
        <strong>Install Vuemora</strong>
        <span>Add the app to your home screen for a full-screen experience.</span>
      </div>
      <button className="install-prompt-btn" onClick={install}><Download size={16} /> Install</button>
      <button className="install-prompt-close" onClick={() => setHidden(true)} aria-label="Dismiss install prompt"><X size={16} /></button>
    </div>
  )
}
