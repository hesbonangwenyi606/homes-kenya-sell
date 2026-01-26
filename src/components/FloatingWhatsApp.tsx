import React from "react";
import { Tooltip } from "@/components/ui/tooltip"; // If using your Tooltip component

const FloatingWhatsApp: React.FC = () => {
  const phoneNumber = "254725604549"; // WhatsApp number without +
  
  // Pre-filled universal message
  const message =
    "Hello Mr Henry👋 I visited your website and I’d like full information about your properties, prices, locations, and how to proceed. Please assist me.";

  return (
    <>
      {/* Inline animation styles */}
      <style>
        {`
          @keyframes whatsappBounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }
        `}
      </style>

      {/* Tooltip wrapper (optional if using your tooltip library) */}
      <Tooltip content="Chat with us" side="left">
        <a
          href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg transition-transform hover:scale-110"
          style={{
            animation: "whatsappBounce 1.8s ease-in-out infinite",
          }}
        >
          {/* WhatsApp Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            className="w-7 h-7"
          >
            <path d="M12 2a9.93 9.93 0 0 0-8.94 14.28L2 22l5.86-1.53A9.94 9.94 0 1 0 12 2Zm0 18.2a8.18 8.18 0 0 1-4.18-1.15l-.3-.18-3.48.91.93-3.39-.2-.32A8.2 8.2 0 1 1 12 20.2Zm4.77-6.14c-.26-.13-1.54-.76-1.78-.85-.24-.09-.42-.13-.6.13-.18.26-.69.85-.85 1.02-.16.18-.31.2-.57.07-.26-.13-1.11-.41-2.12-1.31-.79-.7-1.32-1.57-1.47-1.83-.15-.26-.02-.4.11-.53.12-.12.26-.31.39-.46.13-.15.18-.26.26-.44.09-.18.04-.33-.02-.46-.07-.13-.6-1.45-.82-1.99-.22-.53-.44-.46-.6-.47h-.51c-.18 0-.46.07-.7.33-.24.26-.92.9-.92 2.19 0 1.29.94 2.53 1.07 2.71.13.18 1.85 2.83 4.48 3.97.63.27 1.12.43 1.5.55.63.2 1.2.17 1.65.1.5-.08 1.54-.63 1.76-1.24.22-.61.22-1.13.15-1.24-.06-.11-.24-.18-.5-.31Z" />
          </svg>
        </a>
      </Tooltip>
    </>
  );
};

export default FloatingWhatsApp;
