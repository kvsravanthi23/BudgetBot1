// app/api/chat/route.js
import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

export async function POST(request) {
  try {
    const { income, expenses, message } = await request.json();

    if (!GEMINI_API_KEY) {
      console.error('API key not configured');
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    if (!income || !expenses || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Format expenses with item count
    const expenseBreakdown = expenses
      .map((exp) => `- ${exp.title}: $${exp.total} (${exp.items?.length || 0} items)`)
      .join('\n');
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.total, 0);
    const savings = income - totalExpenses;

    const prompt = `
      You are a financial advisor. Based on the following data:
      - Total Income: $${income}
      - Total Expenses: $${totalExpenses}
      - Current Savings: $${savings}
      - Expense Breakdown:
${expenseBreakdown}
      - User's Question: "${message}"
      Analyze the expense categories and identify any that seem irrelevant, excessive, or discretionary (e.g., non-essential spending like entertainment or dining out). Use the number of items in each category to assess frequency or necessity. Provide financial advice in this format: a short introductory paragraph (2-3 sentences) summarizing the financial situation, followed by a list of concise recommendations in bullet points. Start each bullet point with a hyphen (-) and do not use asterisks (*) or other Markdown symbols in the response.
    `;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API error: ${response.status} - ${errorText}`);
      throw new Error(`Gemini API responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini API response:', data); // Log for debugging

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!reply) {
      throw new Error('Invalid response structure from Gemini API');
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    return NextResponse.json({ error: 'Failed to fetch advice from Gemini API' }, { status: 500 });
  }
}