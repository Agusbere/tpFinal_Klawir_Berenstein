import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './HomeScreen.css'

export default function HomeScreen() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    navigate(`/chat?q=${encodeURIComponent(trimmed)}`)
  }

  return (
    <div className="home">
      <section className="home__hero">
        <h1>Comprá con cabeza, no con impulso</h1>
        <p>AntiShopper AI te ayuda a reflexionar antes de comprar. Contanos qué querés y charlamos.</p>
        <form onSubmit={handleSubmit} className="home__form">
          <input
            type="text"
            placeholder="Ej: zapatillas de running"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">Empezar</button>
        </form>
      </section>
    </div>
  )
}


