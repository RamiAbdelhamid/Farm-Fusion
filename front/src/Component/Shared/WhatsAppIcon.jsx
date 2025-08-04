// Component/Shared/WhatsAppIcon.jsx
import React, { useState } from "react";

const WhatsAppIcon = ({
  phoneNumber = "+962785956180", // Replace with your actual WhatsApp number
  message = "Hello! I have a question about your pet services.",
  position = { bottom: "20px", right: "20px" },
  profileName = "Pet Care Support",
  profileImage = "../../../src/assets/pic/User-Icon.jpg", // Replace with your actual profile image URL
  welcomeText = "Hi there! 👋 How can we help you today?",
  onlineStatus = "Online",
  replyTime = "Typically replies within an hour",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userMessage, setUserMessage] = useState(message);

  // Format the phone number - remove any non-digit characters
  const formattedNumber = phoneNumber.replace(/\D/g, "");

  // Create the WhatsApp URL
  const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(
    userMessage
  )}`;

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Open WhatsApp with the message
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div
      className="whatsapp-widget"
      style={{
        position: "fixed",
        bottom: position.bottom,
        right: position.right,
        zIndex: 1000,
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Chat Popup */}
      {isOpen && (
        <div
          className="whatsapp-popup"
          style={{
            position: "absolute",
            bottom: "80px",
            right: "0",
            width: "300px",
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
            backgroundColor: "#fff",
            marginBottom: "10px",
          }}
        >
          {/* Header */}
          <div
            className="popup-header"
            style={{
              backgroundColor: "#075E54",
              color: "white",
              padding: "15px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={profileImage}
                alt="Profile"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  marginRight: "10px",
                  objectFit: "cover",
                  border: "2px solid white",
                }}
              />
              <div>
                <h3 style={{ margin: "0", fontSize: "16px" }}>{profileName}</h3>
                <p
                  style={{
                    margin: "2px 0 0",
                    fontSize: "12px",
                    opacity: "0.8",
                  }}
                >
                  {onlineStatus}
                </p>
              </div>
              <button
                onClick={toggleChat}
                style={{
                  background: "none",
                  border: "none",
                  color: "white",
                  fontSize: "20px",
                  cursor: "pointer",
                  marginLeft: "auto",
                }}
              >
                ×
              </button>
            </div>
          </div>

          {/* Chat Body */}
          <div
            className="popup-body"
            style={{
              padding: "15px",
              backgroundColor: "#E5DDD5",
           
            
              backgroundSize: "200px",
              height: "200px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            {/* Welcome Message */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "7px",
                padding: "10px",
                marginBottom: "10px",
                maxWidth: "80%",
                alignSelf: "flex-start",
                position: "relative",
              }}
            >
              <div
                style={{
                  content: '""',
                  position: "absolute",
                  top: "0",
                  left: "-10px",
                  borderWidth: "5px 10px 5px 0",
                  borderStyle: "solid",
                  borderColor: "transparent white transparent transparent",
                }}
              ></div>
              <p style={{ margin: "0", fontSize: "14px" }}>{welcomeText}</p>
              <span
                style={{
                  fontSize: "10px",
                  color: "#888",
                  float: "right",
                  marginTop: "5px",
                }}
              >
                10:42 AM
              </span>
            </div>
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
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Type a message..."
                style={{
                  flex: "1",
                  border: "none",
                  padding: "10px 15px",
                  borderRadius: "20px",
                  outline: "none",
                  fontSize: "14px",
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: "#25D366",
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
            <p
              style={{
                margin: "10px 0 0",
                fontSize: "11px",
                color: "#888",
                textAlign: "center",
              }}
            >
              {replyTime}
            </p>
          </div>
        </div>
      )}

      {/* WhatsApp Button */}
      <button
        onClick={toggleChat}
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#25D366",
          border: "none",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        {/* WhatsApp SVG Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="white"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      </button>
    </div>
  );
};

export default WhatsAppIcon;
