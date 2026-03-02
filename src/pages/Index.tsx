
import React from 'react';
import AppLayout from '@/components/AppLayout';
import { AppProvider } from '@/contexts/AppContext';

const Index: React.FC = () => {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
};

export default Index;





// import React from "react";
// import ContactSection from "@/components/ContactSection";
// import RevealOnScroll from "@/components/RevealOnScroll";

// // Simple homepage showing images
// const images = [
//   "/home sales 1.jpeg",
//   "/home sales 2.jpeg",
//   "/home sales 3.jpeg",
//   "/home sales 4.jpeg",
// ];

// const Index: React.FC = () => {
//   return (
//     <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
//       <header style={{ textAlign: "center", marginBottom: "2rem" }}>
//         <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
//           Welcome to Homes Kenya
//         </h1>
//         <p style={{ fontSize: "1.2rem", color: "#555" }}>
//           Find your dream home with us!
//         </p>
//       </header>

//       {/* Image Gallery */}
//       <section
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
//           gap: "1rem",
//           marginBottom: "2rem",
//         }}
//       >
//         {images.map((src, i) => (
//           <img
//             key={i}
//             src={src}
//             alt={`Home ${i + 1}`}
//             style={{ width: "100%", borderRadius: "8px" }}
//           />
//         ))}
//       </section>

//       {/* RevealOnScroll example */}
//       <RevealOnScroll>
//         <section style={{ marginBottom: "2rem" }}>
//           <h2>Our Featured Properties</h2>
//           <p>
//             Explore our latest listings and find the perfect property that fits
//             your lifestyle.
//           </p>
//         </section>
//       </RevealOnScroll>

//       {/* Contact Section */}
//       <ContactSection />
//     </div>
//   );
// };

// export default Index;