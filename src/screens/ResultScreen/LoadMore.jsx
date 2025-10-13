import './ResultScreen.css'

export default function LoadMore({ onClick, disabled }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 12 }}>
      <button className="btn-load" onClick={onClick} disabled={disabled}>Cargar más</button>
    </div>
  )
}


