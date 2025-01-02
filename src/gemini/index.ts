import { GoogleGenerativeAI } from '@google/generative-ai'

import { GEMINI_API_KEY } from '~/configs/env'

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

export const sendPromptToGemini = async (prompt: string) => {
  const result = await model.generateContent(prompt)
  return result.response.text()
}
