import { GoogleGenAI, Type } from '@google/genai';

export enum FieldType {
  TEXT = 'text',
  NUMBER = 'number',
  DROPDOWN = 'dropdown',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  DATE = 'date',
  FILE = 'file',
}

const questionGenerationSchema = {
  type: Type.ARRAY,
  items: {
      type: Type.OBJECT,
      properties: {
          label: {
              type: Type.STRING,
              description: 'The question text for the form field.'
          },
          type: {
              type: Type.STRING,
              description: `The type of the form field. Must be one of: ${Object.values(FieldType).join(', ')}.`,
              enum: Object.values(FieldType),
          },
          options: {
              type: Type.ARRAY,
              description: 'An array of string options, only if the type is "dropdown" or "radio". Otherwise, this should be omitted.',
              items: { type: Type.STRING }
          },
          required: {
            type: Type.BOOLEAN,
            description: 'Whether the question is required or not.'
          }
      },
      required: ['label', 'type'],
  }
};

export async function generateQuestionsHandler(params: { topic: string; count: number }) {
  const { topic, count } = params;
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  if (!apiKey) {
    throw new Error('Server API key not configured');
  }
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Generate ${count} diverse form questions about "${topic}". Include various question types like text, number, dropdown, radio, checkbox, and date. For dropdown or radio types, provide relevant options.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: questionGenerationSchema
    }
  });
  const jsonText = response.text.trim();
  if (!jsonText) {
    throw new Error('Empty response from model');
  }
  return JSON.parse(jsonText);
}


