import axios from 'axios'

const OLLAMA_URL = import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434'
const OLLAMA_MODEL = import.meta.env.VITE_OLLAMA_MODEL || 'llama3:latest'

export async function callOllama(body) {
  const payload = { model: OLLAMA_MODEL, prompt: body.prompt }
  const res = await axios.post(OLLAMA_URL + '/api/generate', payload)
  return res.data
}

export function buildNextQuestionPrompt(history) {
  const sys = 'Sos AntiShopper AI, un asesor responsable.'
  const transcript = history.map(function (m) { return m.role.toUpperCase() + ': ' + m.content }).join('\n')
  const user = 'Según la charla, generá SOLO la próxima pregunta.'
  return { system: sys, prompt: transcript + '\n' + user }
}

export function buildFinalAnalysisPrompt(history) {
  const sys = 'Sos AntiShopper AI. Dás un veredicto "Comprar" o "Posponer" y un resumen breve.'
  const transcript = history.map(function (m) { return m.role.toUpperCase() + ': ' + m.content }).join('\n')
  const user = 'Entregá JSON con { "verdict": "Comprar|Posponer", "summary": string }.'
  return { system: sys, prompt: transcript + '\n' + user }
}


