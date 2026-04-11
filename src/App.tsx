import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import AboutPage from "./pages/AboutPage";
import ComingSoon from "./pages/ComingSoon";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/blog" element={<ComingSoon title="Blog" />} />
            <Route path="/careers" element={<ComingSoon title="Careers" />} />
            <Route path="/faqs" element={<ComingSoon title="FAQs" />} />
            <Route path="/contact" element={<ComingSoon title="Contact" />} />
            <Route path="/privacy-policy" element={<ComingSoon title="Privacy Policy" />} />
            <Route path="/terms-of-service" element={<ComingSoon title="Terms of Service" />} />
            <Route path="/cookie-policy" element={<ComingSoon title="Cookie Policy" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>

        {/* ✅ Floating WhatsApp Button */}
        <FloatingWhatsApp />
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
