import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import AppRouter from './navigation/AppRouter'
import { ChatProvider } from './context/ChatContext'

export default function App() {
  return (
    <ChatProvider>
      <AppRouter />
    </ChatProvider>
  )
}

const rootElement = document.getElementById('root')
if (rootElement && !rootElement._reactRootContainer) {
  const root = createRoot(rootElement)
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}
