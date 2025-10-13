import axios from 'axios'

const OLLAMA_URL = import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434'
const OLLAMA_MODEL = import.meta.env.VITE_OLLAMA_MODEL || 'llama3'

export async function callOllama({ prompt, system, temperature = 0.2 }) {
  const body = {
    model: OLLAMA_MODEL,
    prompt: [system, prompt].filter(Boolean).join('\n'),
    stream: false,
    options: { temperature },
  }
  const { data } = await axios.post(`${OLLAMA_URL}/api/generate`, body)
  return data?.response || ''
}

export function buildNextQuestionPrompt(history) {
  const sys = 'Sos AntiShopper AI, un asesor responsable. Hacés 1 pregunta por turno, breve y clara, para evaluar necesidad, alternativas, presupuesto y uso. Evitá sermonear.'
  const transcript = history.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join('\n')
  const user = 'Según la charla, generá SOLO la próxima pregunta.'
  return { system: sys, prompt: `${transcript}\n${user}` }
}

export function buildFinalAnalysisPrompt(history) {
  const sys = 'Sos AntiShopper AI. Dás un veredicto "Comprar" o "Posponer" y un resumen breve (1-2 líneas).'
  const transcript = history.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join('\n')
  const user = 'Entregá JSON con { "verdict": "Comprar|Posponer", "summary": string }.'
  return { system: sys, prompt: `${transcript}\n${user}` }
}


