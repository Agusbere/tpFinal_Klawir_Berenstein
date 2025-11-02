import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useChatContext } from '../../context/ChatContext'
import useChat from '../../hooks/useChat'
import './ChatBox.css'

export default function ChatBox() {
  const { messages, addMessage, resetChat, setFinalAnalysis } = useChatContext()
  const { processing, requestNextQuestion, requestFinalAnalysis } = useChat({ addMessage, setFinalAnalysis })
  const [input, setInput] = useState('')
  const listRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const q = params.get('q')
        if (q) {
      if (messages.length === 0) {
        addMessage({ role: 'system', content: 'Bienvenido/a a AntiShopper AI. Conversemos antes de comprar.' })
        addMessage({ role: 'user', content: `Quiero comprar ${q}` })
        requestNextQuestion([
          { role: 'system', content: 'Inicio de conversación AntiShopper AI' },
          { role: 'user', content: `Quiero comprar ${q}` },
        ])
      }
    }
  }, [location.search])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const handleSend = (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
  addMessage({ role: 'user', content: text })
  requestNextQuestion(messages.concat({ role: 'user', content: text }))
    setInput('')
  }

  const handleReset = () => {
    resetChat()
  }

  const handleFinish = async () => {
    await requestFinalAnalysis(messages)
    navigate('/resultados')
  }

  return (
    <div className="chatbox">
      <div className="chatbox__messages" ref={listRef}>
        {messages.map((m, idx) => (
          <div key={idx} className={`msg msg--${m.role}`}>
            <p>{m.content}</p>
          </div>
        ))}
      </div>
      <form className="chatbox__input" onSubmit={handleSend}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribí tu respuesta..."
        />
        <button type="submit" disabled={processing}>Enviar</button>
        <button type="button" className="secondary" onClick={handleReset}>Reiniciar</button>
        <button type="button" onClick={handleFinish}>Finalizar</button>
      </form>
    </div>
  )
}


