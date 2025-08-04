import React, { useEffect, useState } from "react";
import axios from "axios";

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [playingAudio, setPlayingAudio] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/contact", {
          withCredentials: true,
        });

        console.log("Fetched messages:", res.data);

        if (Array.isArray(res.data)) {
          // Assume some messages might have audio attachments
          const processedMessages = res.data.map((msg) => ({
            ...msg,
            hasAudio: msg.audioUrl || msg.hasVoiceMessage,
          }));
          setMessages(processedMessages);
        } else {
          throw new Error("Unexpected data format");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load contact messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Cleanup function for any playing audio when component unmounts
    return () => {
      if (playingAudio) {
        playingAudio.pause();
      }
    };
  }, []);



  const sendEmail = async (message) => {
    try {
      await axios.post("http://localhost:5000/api/send-email", {
        to: message.email,
        subject: `Re: ${message.subject}`,
        body: `Hello ${message.firstName},\n\nThank you for your message:\n"${message.message}"\n\nBest regards,\nSupport Team`,
        audioUrl: message.audioUrl || `/api/messages/${message._id}/audio`,
      });
      alert("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email.");
    }
  };

  const handleReplay = (messageId, audioUrl) => {
    // If there's already audio playing, stop it
    if (playingAudio) {
      playingAudio.pause();
      playingAudio.currentTime = 0;
    }

    // If we're clicking the same button again, just stop the audio
    if (playingAudio && playingAudio.dataset.messageId === messageId) {
      setPlayingAudio(null);
      return;
    }

    // Create and play new audio
    const audio = new Audio(audioUrl || `/api/messages/${messageId}/audio`);
    audio.dataset.messageId = messageId;
    audio.play().catch((err) => {
      console.error("Error playing audio:", err);
      alert("Unable to play audio message");
    });

    audio.onended = () => {
      setPlayingAudio(null);
    };

    setPlayingAudio(audio);
  };

  if (loading)
    return (
      <div className="p-8 text-green-800 flex items-center justify-center">
        <div className="animate-pulse">
          <svg
            className="w-10 h-10 mr-2 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
          <span className="text-lg">Loading messages...</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="p-8 bg-red-50 border-l-4 border-red-600 text-red-700 rounded">
        <p className="font-medium">{error}</p>
        <p className="mt-2">Please try again later or contact support.</p>
      </div>
    );

  return (
    <div className="p-6 bg-green-50">
      <h2 className="text-2xl font-bold mb-6 text-green-800 border-b-2 border-green-200 pb-2">
        <span className="inline-block mr-2">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            ></path>
          </svg>
        </span>
        Contact Messages
      </h2>

      {messages.length === 0 ? (
        <div className="bg-amber-50 p-6 rounded-lg border border-amber-100 text-amber-700">
          <p className="flex items-center">
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            No messages found in your inbox.
          </p>
        </div>
      ) : (
        <ul className="space-y-6">
          {messages.map((msg) => (
            <li
              key={msg._id}
              className="bg-white border border-green-100 rounded-lg p-5 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col md:flex-row md:justify-between border-b border-green-100 pb-2 mb-3">
                <h3 className="font-bold text-green-800">
                  {msg.firstName} {msg.lastName}
                </h3>
                <div className="text-green-600 font-medium mt-1 md:mt-0">
                  <svg
                    className="w-5 h-5 inline-block mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    ></path>
                  </svg>
                  {msg.email}
                </div>
              </div>
              <div className="bg-green-50 p-3 rounded mb-3">
                <p className="font-medium text-green-800">{msg.subject}</p>
              </div>
              <div className="p-2 bg-white rounded">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {msg.message}
                </p>
              </div>

              {/* Audio replay section */}
              {msg.hasAudio && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-center">
                    <button
                      onClick={() => handleReplay(msg._id, msg.audioUrl)}
                      className={`flex items-center justify-center rounded-full w-10 h-10 ${
                        playingAudio &&
                        playingAudio.dataset.messageId === msg._id
                          ? "bg-red-500 text-white"
                          : "bg-green-600 text-white hover:bg-green-700"
                      } transition-colors duration-300`}
                    >
                      {playingAudio &&
                      playingAudio.dataset.messageId === msg._id ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                          ></path>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                      )}
                    </button>
                    <span className="ml-3 text-green-800">
                      {playingAudio &&
                      playingAudio.dataset.messageId === msg._id
                        ? "Playing voice message..."
                        : "Voice message attached"}
                    </span>
                  </div>
                </div>
              )}

            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ContactMessages;
