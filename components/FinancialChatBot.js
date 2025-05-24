"use client";

import { useState, useContext, useRef, useEffect } from "react";
import axios from "axios";
import { FinanceContext } from "@/lib/finance-context";
import { FaMicrophone, FaRobot, FaTimes } from "react-icons/fa";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

export default function FinancialChatbot() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { income, expenses } = useContext(FinanceContext);
  const chatRef = useRef(null);

  const { transcript, resetTranscript, listening } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setMessage(transcript);
    }
  }, [transcript]);

  const handleStartListening = () => {
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      alert("Your browser does not support speech recognition.");
      return;
    }
    resetTranscript();
    SpeechRecognition.startListening({ continuous: false, language: "en-US" });
  };

  const speakResponse = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    speechSynthesis.speak(utterance);
  };

  const handleChat = async () => {
    if (!message.trim()) {
      alert("Please enter or speak a question.");
      return;
    }

    setLoading(true);
    setResponse("");

    try {
      const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);
      const expenseDetails = expenses.map((expense) => ({
        title: expense.title,
        total: expense.total,
        items: expense.items || [],
      }));

      const res = await axios.post("/api/chat", {
        income: totalIncome,
        expenses: expenseDetails,
        message,
      });

      const reply = res.data.reply || "No advice received. Please try again.";
      setResponse(reply);
      setMessage("");
      speakResponse(reply);
    } catch (error) {
      console.error("Chatbot Error:", error.response?.data || error.message);
      const errorMsg = "Error fetching advice. Please try again.";
      setResponse(errorMsg);
      speakResponse(errorMsg);
    } finally {
      setLoading(false);
      resetTranscript();
    }
  };

  const renderResponse = () => {
    if (!response) return null;
    const cleanedResponse = response.replace(/\*{1,3}/g, "").trim();
    const lines = cleanedResponse.split("\n").filter((line) => line.trim());
    const paragraphLines = lines.slice(0, 3).join(" ");
    const bulletLines = lines.slice(3);

    return (
      <div className="mt-4 text-gray-900">
        <p>{paragraphLines}</p>
        {bulletLines.length > 0 && (
          <ul className="list-disc list-inside mt-2">
            {bulletLines.map((line, index) => (
              <li key={index}>{line.replace(/^- /, "")}</li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div>
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-[#4A90E2] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#3A7EC1] transition-transform duration-300 transform hover:scale-110 z-50"
        aria-label="Open Financial Chatbot"
      >
        <FaRobot className="text-2xl" />
      </button>

      {isChatOpen && (
        <div
          ref={chatRef}
          className="fixed bottom-24 right-6 w-80 bg-white text-gray-900 rounded-xl shadow-xl p-4 transition-all duration-300 transform animate-slide-up z-50"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">💬 BudgetBot</h2>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-gray-500 hover:text-gray-900"
              aria-label="Close Chatbot"
            >
              <FaTimes />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                type="text"
                className="w-full px-4 py-2 bg-[#1B1F3B] text-white rounded-xl placeholder-gray-300"
                placeholder="Ask for financial advice..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleChat()}
              />
              <button
                onClick={handleStartListening}
                className={`p-2 rounded-full text-white ${
                  listening ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
                }`}
                aria-label={listening ? "Stop Listening" : "Start Listening"}
              >
                <FaMicrophone />
              </button>
            </div>
            <button
              className="w-full btn btn-primary disabled:bg-gray-500"
              onClick={handleChat}
              disabled={loading}
            >
              {loading ? "Processing..." : "Get Advice"}
            </button>
            <div className="max-h-64 overflow-y-auto mb-4 p-2 bg-gray-100 rounded-lg">
              {response ? (
                renderResponse()
              ) : (
                <p className="text-gray-500 text-sm">Ask a question to get started.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}