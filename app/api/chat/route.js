import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req) {
  try {
    const { income, expenses, message, history = [] } = await req.json();

    const totalExpenses = expenses.reduce((s, e) => s + e.total, 0);
    const savings = income - totalExpenses;

    const systemPrompt = `
You are BudgetBot, a professional financial advisor.

User financial data:
- Income: ${income}
- Expenses: ${JSON.stringify(expenses)}
- Savings: ${savings}

Rules:
- Never suggest cutting EMIs, rent, or essential bills
- Suggest alternatives only for replaceable expenses
- Provide India-specific advice
- Keep responses practical and concise
`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...history,
      { role: "user", content: message }
    ];

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.5
    });

    return NextResponse.json({
      reply: completion.choices[0].message.content
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Chat failed" },
      { status: 500 }
    );
  }
}
