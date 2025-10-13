import { createContext, useContext, useMemo, useState } from 'react'

const ChatContext = createContext(null)

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([])
  const [finalAnalysis, setFinalAnalysis] = useState(null)

  const addMessage = (message) => {
    setMessages((prev) => [...prev, { role: message.role, content: message.content }])
  }

  const resetChat = () => {
    setMessages([])
    setFinalAnalysis(null)
  }

  const value = useMemo(() => ({
    messages,
    addMessage,
    resetChat,
    finalAnalysis,
    setFinalAnalysis,
  }), [messages, finalAnalysis])

  return (
    <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
  )
}

export function useChatContext() {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChatContext must be used within ChatProvider')
  return ctx
}


