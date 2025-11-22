import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { MessageCircle, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';

interface GeminiTutorProps {
  context: string; // The current lesson content or title
}

export const GeminiTutor: React.FC<GeminiTutorProps> = ({ context }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: `Hello! I'm the AI Teaching Assistant for Dr. Jewoong Moon's Educational Game Design course. I can help answer questions about "${context}" or help you brainstorm game mechanics based on ADDIE Lab research.`,
      timestamp: new Date(),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Reset chat when context changes significantly, or just inform the model
  useEffect(() => {
    if (isOpen) {
       // Optional: Add a system note to history if context changes (omitted for simplicity in this demo)
    }
  }, [context, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || !process.env.API_KEY) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Construct a prompt that includes context
      const systemPrompt = `You are an expert AI Teaching Assistant for Dr. Jewoong Moon's "Educational Game Design" course at the University of Alabama (ADDIE Lab).
      The student is currently studying: "${context}".
      
      Key Persona Traits:
      1. Tone: Academic, encouraging, innovative, and grounded in instructional design theory.
      2. Expertise: Emphasize Dr. Moon's research interests: immersive learning (VR/XR), AI-augmented instructional design, learning analytics, and ethical reasoning.
      3. Goal: Help students translate theory into practical game prototypes.
      
      If the student asks for examples, prioritize serious games or educational simulations over pure entertainment titles.
      Always keep answers concise and relevant to the current lesson context.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            { role: 'user', parts: [{ text: systemPrompt + "\n\nStudent Question: " + userMsg.text }] }
        ]
      });

      const text = response.text || "I'm sorry, I couldn't generate a response at this time.";

      setMessages((prev) => [
        ...prev,
        { role: 'model', text: text, timestamp: new Date() }
      ]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: 'model', text: "I'm having trouble connecting to the University server. Please try again.", timestamp: new Date() }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-xl transition-all duration-300 ${
          isOpen ? 'bg-gray-800 rotate-90' : 'bg-ua-crimson hover:bg-red-800'
        } text-white flex items-center justify-center`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 max-w-[90vw] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          
          {/* Header */}
          <div className="bg-ua-crimson p-4 flex items-center justify-between text-white">
            <div className="flex items-center space-x-2">
              <Sparkles size={18} className="text-yellow-400" />
              <h3 className="font-semibold">ADDIE Lab Tutor</h3>
            </div>
            <span className="text-xs bg-white/20 px-2 py-1 rounded text-white/90">Gemini Powered</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-ua-crimson text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
               <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100">
                   <Loader2 size={16} className="animate-spin text-ua-crimson" />
                </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex items-center space-x-2 bg-gray-50 rounded-full px-4 py-2 border border-gray-200 focus-within:border-ua-crimson focus-within:ring-1 focus-within:ring-ua-crimson transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about game design..."
                className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
                disabled={isLoading}
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="text-ua-crimson disabled:text-gray-300 hover:scale-110 transition-transform"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};