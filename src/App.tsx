import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/voting/Navbar";
import Footer from "./components/voting/Footer";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import VerifyOTP from "./pages/VerifyOTP";
import Login from "./pages/Login";
import VoterDashboard from "./pages/VoterDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import CandidateRegistration from "./pages/CandidateRegistration";
import CandidateSuccess from "./pages/CandidateSuccess";
import About from "./pages/About";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<VoterDashboard />} />
              <Route path="/candidate-register" element={<CandidateRegistration />} />
              <Route path="/candidate-success" element={<CandidateSuccess />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/about" element={<About />} />
              <Route path="/help" element={<Help />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
