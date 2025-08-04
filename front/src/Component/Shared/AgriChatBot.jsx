import React, { useState, useRef, useEffect } from "react";





const AgriChatBot = ({
  position = { bottom: "20px", right: "20px" },
  profileName = "Farm Assistant",
  welcomeText = "Hello! 🐓 How can I help with your farm or pet questions today?",
  defaultResponses = {
    greetings:
      "Hi there! I'm your virtual farm assistant. Ask me about animal care, farming tips, or our products!",
    products:
      "We offer a wide range of products for pets and farm animals. Check out our shop section for feeds, medicines, accessories, and more!",
    services:
      "Our services include veterinary consultations, vaccination programs, animal nutrition advice, and farm setup guidance.",
    contact:
      "You can reach our team at contact@example.com or call us at (123) 456-7890. Our support hours are 9am-6pm, Monday to Saturday.",
    default:
      "I'm not sure about that. Would you like to chat with a human expert? Click the WhatsApp button to connect with our team.",
  },
  phoneNumber = "1234567890", // WhatsApp fallback number
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: welcomeText,
      sender: "bot",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);
  const [isJumping, setIsJumping] = useState(true);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Toggle jumping effect when chat is opened/closed
  useEffect(() => {
    setIsJumping(!isOpen);
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Add user message
    const userMessage = {
      text: inputText,
      sender: "user",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    // Process user message and generate response
    setTimeout(() => {
      const botResponse = generateResponse(inputText);
      const responseMessage = {
        text: botResponse,
        sender: "bot",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, responseMessage]);
    }, 500);
  };

  const generateResponse = (input) => {
    const lowercaseInput = input.toLowerCase();

    // Simple response logic based on keywords
    if (
      lowercaseInput.includes("hi") ||
      lowercaseInput.includes("hello") ||
      lowercaseInput.includes("hey")
    ) {
      return defaultResponses.greetings;
    } else if (
      lowercaseInput.includes("product") ||
      lowercaseInput.includes("shop") ||
      lowercaseInput.includes("buy")
    ) {
      return defaultResponses.products;
    } else if (
      lowercaseInput.includes("service") ||
      lowercaseInput.includes("help") ||
      lowercaseInput.includes("offer")
    ) {
      return defaultResponses.services;
    } else if (
      lowercaseInput.includes("contact") ||
      lowercaseInput.includes("phone") ||
      lowercaseInput.includes("email") ||
      lowercaseInput.includes("reach")
    ) {
      return defaultResponses.contact;
    } else if (
      lowercaseInput.includes("chicken") ||
      lowercaseInput.includes("poultry")
    ) {
      return "For our poultry products and health guides, please visit the poultry section in our shop. We have feeds, supplements, and housing solutions!";
    } else if (
      lowercaseInput.includes("cow") ||
      lowercaseInput.includes("cattle")
    ) {
      return "Our cattle section offers premium feeds, health supplements, and equipment. Check our health guide for cattle care best practices!";
    } else if (
      lowercaseInput.includes("dog") ||
      lowercaseInput.includes("cat") ||
      lowercaseInput.includes("pet")
    ) {
      return "We love pets! Browse our pet section for quality foods, toys, grooming products, and health supplements. Our vet services include checkups and vaccinations!";
    } else if (
      lowercaseInput.includes("feed") ||
      lowercaseInput.includes("food")
    ) {
      return "We stock premium animal feeds for all farm animals and pets. Our feeds are nutritionally balanced and sourced from trusted manufacturers.";
    } else if (
      lowercaseInput.includes("medicine") ||
      lowercaseInput.includes("health") ||
      lowercaseInput.includes("sick")
    ) {
      return "For animal health concerns, we recommend consulting our veterinarians. We also stock a range of approved medicines and supplements.";
    } else if (
      lowercaseInput.includes("human") ||
      lowercaseInput.includes("person") ||
      lowercaseInput.includes("talk to someone")
    ) {
      return "Would you like to speak with our team directly? Click the WhatsApp button to connect with a human representative.";
    }

    return defaultResponses.default;
  };

  const contactViaWhatsApp = () => {
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      "Hi! I was chatting with your farm assistant bot and would like some human assistance."
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div
      className="farm-chatbot"
      style={{
        position: "fixed",
        bottom: position.bottom,
        right: position.right,
        zIndex: 100,
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Chat Popup */}
      {isOpen && (
        <div
          className="chatbot-popup"
          style={{
            position: "absolute",
            bottom: "80px",
            right: "0",
            width: "320px",
            borderRadius: "15px",
            overflow: "hidden",
            boxShadow: "0 5px 20px rgba(0, 0, 0, 0.2)",
            backgroundColor: "#fff",
            marginBottom: "10px",
            border: "1px solid #ddd",
          }}
        >
          {/* Header */}
          <div
            className="popup-header"
            style={{
              backgroundColor: "#F7A456",
              color: "white",
              padding: "15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  marginRight: "10px",
                  backgroundColor: "white",
                  borderRadius: "50%",
                  padding: "5px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="#F7A456"
                  style={{ minWidth: "24px" }}
                >
                  <path d="M8,8.5L9.5,10L7.5,12.95V16H6V12.95L4,10L5.5,8.5L4,7L5.5,5.5L4,4L5.5,2.5L7,4L8.5,2.5L10,4L8.5,5.5L10,7L8.5,8.5M12.5,16H11V12.95L9,10L10.5,8.5L9,7L10.5,5.5L9,4L10.5,2.5L12,4L13.5,2.5L15,4L13.5,5.5L15,7L13.5,8.5L15,10L12.95,13H20V16H12.95L12.5,16Z" />
                </svg>
              </div>
              <div>
                <h3 style={{ margin: "0", fontSize: "16px" }}>{profileName}</h3>
                <p
                  style={{
                    margin: "2px 0 0",
                    fontSize: "12px",
                    opacity: "0.9",
                  }}
                >
                  Online
                </p>
              </div>
            </div>
            <button
              onClick={toggleChat}
              style={{
                background: "none",
                border: "none",
                color: "white",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>

          {/* Chat Messages */}
          <div
            className="popup-messages"
            style={{
              padding: "15px",
              height: "300px",
              overflowY: "auto",
              backgroundColor: "#F9F5E9",
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23F7E2C0' fill-opacity='0.2' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")",
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.sender === "user" ? "flex-end" : "flex-start",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    backgroundColor:
                      msg.sender === "user" ? "#F2E3C6" : "white",
                    borderRadius: "12px",
                    padding: "8px 12px",
                    maxWidth: "70%",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                    position: "relative",
                  }}
                >
                  <p
                    style={{ margin: "0", fontSize: "14px", lineHeight: "1.4" }}
                  >
                    {msg.text}
                  </p>
                  <span
                    style={{
                      fontSize: "10px",
                      color: "#888",
                      display: "block",
                      textAlign: "right",
                      marginTop: "4px",
                    }}
                  >
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer */}
          <div
            className="popup-footer"
            style={{
              backgroundColor: "#F0F0F0",
              padding: "10px",
              borderTop: "1px solid #E0E0E0",
            }}
          >
            <form onSubmit={handleSubmit} style={{ display: "flex" }}>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your question..."
                style={{
                  flex: "1",
                  border: "1px solid #ddd",
                  padding: "10px 15px",
                  borderRadius: "20px",
                  outline: "none",
                  fontSize: "14px",
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: "#F7A456",
                  border: "none",
                  borderRadius: "50%",
                  width: "36px",
                  height: "36px",
                  marginLeft: "10px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="white"
                >
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                </svg>
              </button>
            </form>

            {/* WhatsApp fallback link */}
            <div style={{ marginTop: "10px", textAlign: "center" }}>
              <button
                onClick={contactViaWhatsApp}
                style={{
                  backgroundColor: "transparent",
                  color: "#F7A456",
                  border: "none",
                  fontSize: "12px",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Need to speak with a human? Chat with us on WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chicken-Shaped Chat Button with Jumping Animation */}
      <button
        onClick={toggleChat}
        style={{
          position: "relative",
          width: "70px",
          height: "70px",
          backgroundColor: "transparent",
          border: "none",
          boxShadow: "none",
          cursor: "pointer",
          transition: "all 0.3s ease",
          transform: isJumping ? "translateY(0)" : "translateY(0)",
          animation: isJumping ? "jump 1.5s infinite" : "none",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        {/* SVG Chicken Shape */}
        <svg
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            width: "100%",
            height: "100%",
            filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))",
          }}
        >
          {/* Chicken Body */}
          <ellipse cx="100" cy="120" rx="65" ry="60" fill="#F8A049" />

          {/* Chicken Head */}
          <circle cx="145" cy="70" r="35" fill="#F8A049" />

          {/* Chicken Comb */}
          <path
            d="M145 45 L160 30 L175 35 L170 45 L180 50 L170 55 L175 65 L160 60 L145 45"
            fill="#D9534F"
          />

          {/* Chicken Beak */}
          <path d="M175 70 L195 75 L175 85" fill="#F5D76E" />

          {/* Chicken Wattle */}
          <path d="M160 95 L175 120 L145 110" fill="#D9534F" />

          {/* Chicken Eye */}
          <circle cx="155" cy="65" r="6" fill="white" />
          <circle cx="157" cy="65" r="3" fill="black" />

          {/* Chicken Wing */}
          <path d="M60 120 C30 100, 20 140, 50 150" fill="#E67E22" />

          {/* Chicken Tail Feathers */}
          <path
            d="M35 90 L20 60 L40 70 L30 40 L50 65 L45 30 L65 70 L70 30 L75 70"
            fill="#E67E22"
          />

          {/* Chicken Feet */}
          <path
            d="M90 180 L75 200 M90 180 L90 200 M90 180 L105 200"
            fill="#F5D76E"
            stroke="#F5D76E"
            strokeWidth="3"
          />
          <path
            d="M120 180 L105 200 M120 180 L120 200 M120 180 L135 200"
            fill="#F5D76E"
            stroke="#F5D76E"
            strokeWidth="3"
          />
        </svg>
      </button>

      {/* CSS for jumping animation */}
      <style>
        {`
          @keyframes jump {
            0%, 100% {
              transform: translateY(0) scale(1);
            }
            50% {
              transform: translateY(-15px) scale(1.05);
            }
          }
        `}
      </style>
    </div>
  );
};

export default AgriChatBot;
