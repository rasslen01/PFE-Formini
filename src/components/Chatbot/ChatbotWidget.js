// src/components/Chatbot/ChatbotWidget.js
// Version avec BOUTON TRÈS GRAND ET VISIBLE

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000/chatbot/message";

const QUICK_QUESTIONS = [
    "Quelles formations sont disponibles ?",
    "Y a-t-il des formations gratuites ?",
    "Quels sont les centres disponibles ?",
    "Formations en développement web ?",
];

function Message({ msg }) {
    const isBot = msg.role === "assistant";
    return (
        <div className={`flex gap-2 mb-3 ${isBot ? "justify-start" : "justify-end"}`}>
            {isBot && (
                <div className="w-7 h-7 rounded-full bg-lightBlue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i className="fas fa-robot text-white" style={{ fontSize: 11 }} />
                </div>
            )}
            <div
                className={`max-w-xs px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    isBot
                        ? "bg-white text-blueGray-700 rounded-tl-none shadow-sm border border-blueGray-100"
                        : "bg-lightBlue-500 text-white rounded-tr-none"
                }`}
            >
                {msg.content}
            </div>
        </div>
    );
}

export default function ChatbotWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "assistant", content: "👋 Bonjour ! Je suis l'assistant Formini. Je peux vous aider à trouver des formations, des centres, ou répondre à vos questions sur la plateforme. Comment puis-je vous aider ?" },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [unread, setUnread] = useState(0);

    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
    useEffect(() => {
        if (open) { 
            setUnread(0); 
            setTimeout(() => inputRef.current?.focus(), 100); 
        }
    }, [open]);

    const sendMessage = async (text) => {
        const content = (text || input).trim();
        if (!content || loading) return;

        const userMsg = { role: "user", content };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput("");
        setLoading(true);

        try {
            const history = newMessages.slice(1, -1);
            const res = await axios.post(API, { message: content, history }, {
                headers: {
                    "Content-Type": "application/json",
                    ...(localStorage.getItem("token") ? { Authorization: `Bearer ${localStorage.getItem("token")}` } : {}),
                },
            });
            setMessages(prev => [...prev, { role: "assistant", content: res.data.reply }]);
            if (!open) setUnread(u => u + 1);
        } catch (err) {
            setMessages(prev => [...prev, { role: "assistant", content: err.response?.data?.error || "Désolé, une erreur est survenue. Réessayez." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } };
    const clearChat = () => setMessages([{ role: "assistant", content: "Chat réinitialisé. Comment puis-je vous aider ?" }]);

    return (
        <>
            {/* Fenêtre de discussion */}
            {open && (
                <div 
                    className="fixed z-50 flex flex-col bg-white rounded-2xl shadow-2xl border border-blueGray-100"
                    style={{ 
                        width: 380, 
                        height: 550,
                        position: 'fixed',
                        bottom: '100px',
                        right: '20px'
                    }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-lightBlue-500 rounded-t-2xl">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                                <i className="fas fa-robot text-white text-sm" />
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm leading-tight">Assistant Formini</p>
                                <p className="text-lightBlue-100 text-xs">Réponses basées sur nos données</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={clearChat} className="text-lightBlue-200 hover:text-white transition-colors" title="Réinitialiser">
                                <i className="fas fa-redo text-xs" />
                            </button>
                            <button onClick={() => setOpen(false)} className="text-lightBlue-200 hover:text-white transition-colors">
                                <i className="fas fa-times" />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-3 py-3 bg-blueGray-50">
                        {messages.map((msg, i) => <Message key={i} msg={msg} />)}
                        {loading && (
                            <div className="flex gap-2 mb-3">
                                <div className="w-7 h-7 rounded-full bg-lightBlue-500 flex items-center justify-center flex-shrink-0">
                                    <i className="fas fa-robot text-white" style={{ fontSize: 11 }} />
                                </div>
                                <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-sm border border-blueGray-100 flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-lightBlue-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                                    <span className="w-2 h-2 rounded-full bg-lightBlue-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                                    <span className="w-2 h-2 rounded-full bg-lightBlue-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Questions rapides */}
                    {messages.length <= 1 && (
                        <div className="px-3 py-2 border-t border-blueGray-100 bg-white">
                            <p className="text-xs text-blueGray-400 mb-2">Suggestions :</p>
                            <div className="flex flex-wrap gap-1">
                                {QUICK_QUESTIONS.map(q => (
                                    <button key={q} onClick={() => sendMessage(q)}
                                        className="text-xs bg-lightBlue-50 text-lightBlue-600 border border-lightBlue-200 px-2 py-1 rounded-full hover:bg-lightBlue-100 transition-all">
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <div className="px-3 py-3 border-t border-blueGray-100 bg-white rounded-b-2xl">
                        <div className="flex items-center gap-2 bg-blueGray-50 rounded-xl px-3 py-2 border border-blueGray-200 focus-within:border-lightBlue-400 transition-colors">
                            <input 
                                ref={inputRef} 
                                type="text" 
                                value={input}
                                onChange={e => setInput(e.target.value)} 
                                onKeyDown={handleKey}
                                placeholder="Posez votre question..." 
                                disabled={loading}
                                className="flex-1 bg-transparent text-sm text-blueGray-700 outline-none placeholder-blueGray-400" 
                            />
                            <button 
                                onClick={() => sendMessage()} 
                                disabled={!input.trim() || loading}
                                className="w-8 h-8 rounded-lg bg-lightBlue-500 hover:bg-lightBlue-600 flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0">
                                <i className="fas fa-paper-plane text-white" style={{ fontSize: 12 }} />
                            </button>
                        </div>
                        <p className="text-center text-xs text-blueGray-300 mt-1.5">
                            Propulsé par IA · Données Formini
                        </p>
                    </div>
                </div>
            )}

            {/* ⭐⭐⭐ BOUTON MEGA GRAND - Version XL ⭐⭐⭐ */}
            <button 
                onClick={() => {
                    console.log("Bouton cliqué - open devient:", !open);
                    setOpen(!open);
                }}
                style={{ 
                    position: 'fixed',
                    bottom: '30px',
                    right: '30px',
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    backgroundColor: '#0ea5e9',
                    border: 'none',
                    cursor: 'pointer',
                    zIndex: 9999,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3), 0 0 0 4px rgba(14,165,233,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    transform: open ? 'scale(0.9)' : 'scale(1)'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.backgroundColor = '#0284c7';
                    e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.4), 0 0 0 6px rgba(14,165,233,0.3)';
                }}
                onMouseLeave={(e) => {
                    if (!open) {
                        e.currentTarget.style.transform = 'scale(1)';
                    }
                    e.currentTarget.style.backgroundColor = '#0ea5e9';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3), 0 0 0 4px rgba(14,165,233,0.2)';
                }}
                title="Assistant Formini"
            >
                {/* Animation de pulsation */}
                {!open && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: '50%',
                        backgroundColor: '#0ea5e9',
                        animation: 'pulse 1.5s ease-in-out infinite',
                        opacity: 0.6
                    }}></div>
                )}
                
                {/* Icône */}
                <i 
                    className={`fas ${open ? "fa-times" : "fa-comment-dots"}`} 
                    style={{ 
                        fontSize: '32px', 
                        color: 'white',
                        position: 'relative',
                        zIndex: 10
                    }} 
                />
                
                {/* Badge notification */}
                {!open && unread > 0 && (
                    <span style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-5px',
                        minWidth: '24px',
                        height: '24px',
                        borderRadius: '12px',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 6px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        zIndex: 20,
                        animation: 'bounce 0.5s ease-in-out'
                    }}>
                        {unread > 9 ? '9+' : unread}
                    </span>
                )}
            </button>

            {/* Animation CSS */}
            <style>{`
                @keyframes pulse {
                    0% {
                        transform: scale(1);
                        opacity: 0.6;
                    }
                    50% {
                        transform: scale(1.15);
                        opacity: 0.3;
                    }
                    100% {
                        transform: scale(1);
                        opacity: 0.6;
                    }
                }
                
                @keyframes bounce {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-3px);
                    }
                }
            `}</style>
        </>
    );
}