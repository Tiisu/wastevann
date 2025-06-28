
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ContractProvider } from "./context/ContractContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Registration from "./pages/Registration";
import ReportWaste from "./pages/ReportWaste";
import UserReports from "./pages/UserReports";
import AgentDashboard from "./pages/AgentDashboard";
import TokenWallet from "./pages/TokenWallet";
import CommunityImpact from "./pages/CommunityImpact";
import Whitepaper from "./pages/Whitepaper";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ContractProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/community-impact" element={<CommunityImpact />} />
            <Route path="/whitepaper" element={<Whitepaper />} />

            {/* Registration route - requires wallet connection but not registration */}
            <Route
              path="/registration"
              element={
                <ProtectedRoute requiresAuth>
                  <Registration />
                </ProtectedRoute>
              }
            />

            {/* User-only routes */}
            <Route
              path="/report-waste"
              element={
                <ProtectedRoute requiresAuth requiresUser>
                  <ReportWaste />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-reports"
              element={
                <ProtectedRoute requiresAuth requiresUser>
                  <UserReports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/token-wallet"
              element={
                <ProtectedRoute requiresAuth>
                  <TokenWallet />
                </ProtectedRoute>
              }
            />

            {/* Agent-only routes */}
            <Route
              path="/agent-dashboard"
              element={
                <ProtectedRoute requiresAuth requiresAgent>
                  <AgentDashboard />
                </ProtectedRoute>
              }
            />

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ContractProvider>
  </QueryClientProvider>
);

export default App;
