import { useCallback, useState } from 'react'
import { callOllama, buildNextQuestionPrompt, buildFinalAnalysisPrompt } from '../utils/llm.jsx'

export default function useChat({ addMessage, setFinalAnalysis }) {
  const [processing, setProcessing] = useState(false)

  const requestNextQuestion = useCallback(async (history) => {
    setProcessing(true)
    try {
      const { system, prompt } = buildNextQuestionPrompt(history)
      const resp = await callOllama({ system, prompt })
      addMessage({ role: 'assistant', content: resp.trim() })
    } catch (e) {
      addMessage({ role: 'assistant', content: 'Hubo un problema generando la pregunta. Probá de nuevo.' })
    } finally {
      setProcessing(false)
    }
  }, [addMessage])

  const requestFinalAnalysis = useCallback(async (history) => {
    setProcessing(true)
    try {
      const { system, prompt } = buildFinalAnalysisPrompt(history)
      const resp = await callOllama({ system, prompt })
      const parsed = JSON.parse(resp)
      setFinalAnalysis({ verdict: parsed.verdict, summary: parsed.summary })
    } catch (e) {
      setFinalAnalysis({ verdict: 'Posponer', summary: 'No pude analizar automáticamente. Basate en tus respuestas.' })
    } finally {
      setProcessing(false)
    }
  }, [setFinalAnalysis])

  return { processing, requestNextQuestion, requestFinalAnalysis }
}


