import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FaArrowUp } from "react-icons/fa";
import { FaStop } from "react-icons/fa";

const AiAssistant = ({ onClose,isAiOpen }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const stopTypingRef = useRef(false); // Using a ref to manage stopTyping state

  const handleSend = () => {
    if (input.trim() === "") return;

    const currentMessage = input.trim();

    // Add user message to the chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: currentMessage, type: "user" },
    ]);
    setInput("");
    setIsTyping(true); // Typing starts
    stopTypingRef.current = false; // Reset stop typing state

    // Simulate typing effect
    const simulateTypingEffect = (fullText) => {
      let displayedText = "";
      const typingSpeed = 30;
      const charsPerUpdate = 3;

      const interval = setInterval(() => {
        if (stopTypingRef.current) {
          clearInterval(interval);
          setIsTyping(false); // Typing stops
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            updatedMessages[updatedMessages.length - 1] = {
              text: displayedText,
              type: "assistant",
            };
            return updatedMessages;
          });
          return;
        }

        if (displayedText.length < fullText.length) {
          displayedText = fullText.slice(
            0,
            displayedText.length + charsPerUpdate
          );

          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            updatedMessages[updatedMessages.length - 1] = {
              text: displayedText,
              type: "assistant",
            };
            return updatedMessages;
          });
        } else {
          clearInterval(interval); // Stop typing when done
          setIsTyping(false); // Typing completes
        }
      }, typingSpeed);
    };

    // Send the question to the backend
    const sendMessageToBackend = async (prompt) => {
      try {
        const response = await axios.post(
          "http://localhost:8081/gemini/api/askQuestion",
          { "prompt": prompt },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const answerText =
          response.data?.candidates[0]?.content?.parts[0]?.text || "No answer";

        // Add a placeholder for the assistant message
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "", type: "assistant" },
        ]);

        // Simulate typing effect
        simulateTypingEffect(answerText);

        const res = await axios.post(
          "http://localhost:8081/gemini/api/savemessages",
          { 
            "messages":
            [
              {"text":prompt, "type":"user"},
              {"text":answerText, type:"assistant"}
            ]
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(res);
      } catch (error) {
        console.error("Error sending message:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Failed to fetch answer. Try again later.", type: "error" },
        ]);
        setIsTyping(false); // Typing stops due to error
      }
    };

    sendMessageToBackend(currentMessage);
  };
  const handleGetMessages =async()=>{
      try{
          const result = await axios.get(
              "http://localhost:8081/gemini/api/getMessages",
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            if(result.status === 200){
              console.log(result.data);
              setMessages(result.data);
            }
      }catch(e){
        console.log("err while ", e);
      }
  }
  useEffect(()=>{
      handleGetMessages();
  },[])
  return (
    <div  className={`fixed bottom-0 right-4 w-96 h-[82vh] bg-white shadow-lg rounded-lg overflow-hidden z-50 transform transition-transform duration-500 ${
      isAiOpen ? "translate-y-0" : "translate-y-full"
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between bg-blue-600 text-white px-4 py-2 font-sans">
        <h2 className="text-lg font-semibold text-yellow-400">MT01 Assistant</h2>
        <button
          className="bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center"
          onClick={onClose}
        >
          ✖
        </button>
      </div>

      {/* Chat Body */}
      <div className="p-4 h-[70%] overflow-y-auto">
        { Array.isArray(messages) && messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${
              msg.type === "user" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`${
                msg.type === "user"
                  ? "bg-blue-600 text-white"
                  : msg.type === "assistant"
                  ? "bg-gray-200 text-black"
                  : "bg-red-500 text-white"
              } px-3 py-2 rounded inline-block`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-100 flex items-center gap-2">
        <textarea
          className="flex-1 px-3 py-2 border rounded resize-none w-full h-24 text-black"
          placeholder="Ask a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isTyping}
        />
        {isTyping ? (
          <button
            className="bg-red-500 text-white p-3 rounded-full flex items-center justify-center"
            onClick={() => (stopTypingRef.current = true)}
          >
            <FaStop />
          </button>
        ) : (
          <button
            className={`${
              input.trim()
                ? "bg-blue-600 text-white"
                : "bg-gray-400 text-gray-200"
            } p-3 rounded-full flex items-center justify-center`}
            onClick={handleSend}
            disabled={!input.trim()}
          >
            <FaArrowUp />
          </button>
        )}
      </div>
    </div>
  );
};

export default AiAssistant;
