import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Home, Settings, Bot, Shield, Zap, Activity, 
  Server, BarChart3, Users, User, BookOpen, ShieldCheck, FileCheck2, FileText
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

const navigationItems = [
  {
    title: "Network Overview",
    url: createPageUrl("Dashboard"),
    icon: Home,
    color: "text-green-400"
  },
  {
    title: "Bot Settings",
    url: createPageUrl("BotSettings"), 
    icon: Settings,
    color: "text-blue-400"
  },
  {
    title: "Server Management",
    url: createPageUrl("Servers"),
    icon: Server,
    color: "text-purple-400"
  },
  {
    title: "Analytics",
    url: createPageUrl("Analytics"),
    icon: BarChart3,
    color: "text-cyan-400"
  },
  {
    title: "Documentation",
    url: createPageUrl("Documentation"),
    icon: BookOpen,
    color: "text-yellow-400"
  },
  {
    title: "Team",
    url: createPageUrl("Team"),
    icon: Users,
    color: "text-pink-400"
  },
  {
    title: "Privacy Policy",
    url: createPageUrl("PrivacyPolicy"),
    icon: ShieldCheck,
    color: "text-gray-400"
  },
  {
    title: "Terms of Use",
    url: createPageUrl("TermsOfUse"),
    icon: FileCheck2,
    color: "text-gray-400"
  }
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-950">
        <style>
          {`
            :root {
              --cytherion-green: #10b981;
              --cytherion-dark: #1f2937;
              --redbot-red: #ef4444;
              --sentric-blue: #3b82f6;
              --sentric-gold: #f59e0b;
            }
            
            .glow-green {
              box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
            }
            
            .glow-red {
              box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
            }
            
            .glow-blue {
              box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
            }
            
            .glow-purple {
              box-shadow: 0 0 20px rgba(168, 85, 247, 0.3);
            }
            
            .glow-cyan {
              box-shadow: 0 0 20px rgba(34, 211, 238, 0.3);
            }
            
            .glow-yellow {
              box-shadow: 0 0 20px rgba(251, 191, 36, 0.3);
            }
          `}
        </style>
        
        <Sidebar className="border-r border-gray-800 bg-gray-900">
          <SidebarHeader className="border-b border-gray-800 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center glow-green">
                <span className="text-2xl font-bold text-white">C</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-200">Cytherion</h2>
                <p className="text-sm text-gray-400">Bot Network</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider px-2 py-2">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-gray-800/50 transition-all duration-200 rounded-xl ${
                          location.pathname === item.url ? 'bg-gray-800 shadow-lg' : ''
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className={`w-5 h-5 ${item.color}`} />
                          <span className="font-medium text-gray-300">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-6">
              <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider px-2 py-2">
                Bot Status
              </SidebarGroupLabel>
              <SidebarGroupContent className="px-3 py-2">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-300">Cytherion</span>
                    </div>
                    <Badge className="bg-green-900/50 text-green-400 border-green-700">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-300">RedBot</span>
                    </div>
                    <Badge className="bg-red-900/50 text-red-400 border-red-700">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-300">SentriCordAI</span>
                    </div>
                    <Badge className="bg-blue-900/50 text-blue-400 border-blue-700">Online</Badge>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-gray-800 p-4">
            <div className="mb-4 text-center">
              <Link 
                to={createPageUrl("Imprint")} 
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                <FileText className="w-3 h-3 inline mr-1" />
                Imprint
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-300 text-sm truncate">Network Admin</p>
                <p className="text-xs text-gray-500 truncate">Manage your bot network</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col bg-gray-950">
          <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-gray-800 p-2 rounded-lg transition-colors duration-200 text-gray-400" />
              <h1 className="text-xl font-semibold text-gray-200">Cytherion Network</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}