import React from "react";
import { Menu, Home, FileText, DollarSign, ShoppingBag, Receipt, RotateCcw, Settings as SettingsIcon, Table } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { useSettingsStore } from "@/store/settingsStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const location = useLocation();
  const { navStyle } = useSettingsStore();
  
  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/orders", label: "Orders", icon: ShoppingBag },
    { path: "/reports", label: "Reports", icon: FileText },
    { path: "/expenditure", label: "Expenditure", icon: Receipt },
    { path: "/billing", label: "Billing", icon: DollarSign },
    { path: "/excel", label: "Excel", icon: Table },
    { path: "/reset", label: "Reset Data", icon: RotateCcw },
    { path: "/settings", label: "Settings", icon: SettingsIcon },
  ];

  if (navStyle === 'side') {
    return (
      <aside className="fixed left-0 top-0 h-screen w-64 bg-moss text-cream p-4 flex flex-col animate-slide-in">
        <div className="mb-8">
          <Link to="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
            <img 
              src="https://i.imgur.com/F4KFQkf.png" 
              alt="Logo" 
              className="h-12 w-12 object-contain rounded-full shadow-lg" 
            />
            <span className="text-lg font-bold text-cream">
              Neelkantha Meat Shop
            </span>
          </Link>
        </div>

        <nav className="flex-1 space-y-2">
          {navigationItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                ${isActive(path) 
                  ? 'bg-earth text-forest font-medium' 
                  : 'text-cream hover:bg-forest/50'
                }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="pt-4 border-t border-cream/20">
          <ThemeToggle />
        </div>
      </aside>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-moss shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="text-cream hover:bg-forest/20">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 bg-cream">
                {navigationItems.map(({ path, label, icon: Icon }) => (
                  <DropdownMenuItem key={path} asChild>
                    <Link 
                      to={path}
                      className="flex items-center space-x-2 w-full px-2 py-1.5"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link to="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
              <img 
                src="https://i.imgur.com/F4KFQkf.png" 
                alt="Logo" 
                className="h-12 w-12 object-contain rounded-full shadow-lg" 
              />
              <span className="text-lg font-bold text-cream hidden md:inline">
                Neelkantha Meat Shop
              </span>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`nav-link ${
                  isActive(path) ? "nav-link-active" : "nav-link-inactive"
                }`}
              >
                <Icon className="h-4 w-4 mr-2 inline-block" />
                {label}
              </Link>
            ))}
            <div className="ml-4 border-l pl-4 border-cream/20">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;