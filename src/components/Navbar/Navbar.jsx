import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const location = useLocation()

  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <Link to="/">AntiShopper AI</Link>
      </div>
      <div className="navbar__links">
        <Link className={location.pathname === '/' ? 'active' : ''} to="/">Inicio</Link>
        <Link className={location.pathname === '/chat' ? 'active' : ''} to="/chat">Chat</Link>
        <Link className={location.pathname === '/resultados' ? 'active' : ''} to="/resultados">Resultados</Link>
      </div>
    </nav>
  )
}


