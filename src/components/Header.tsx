import { Menu, Home, FileText, DollarSign, ShoppingBag, Receipt } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/orders", label: "Orders", icon: ShoppingBag },
    { path: "/reports", label: "Reports", icon: FileText },
    { path: "/expenditure", label: "Expenditure", icon: Receipt },
    { path: "/billing", label: "Billing", icon: DollarSign },
  ];

  return (
    <header className="sticky top-0 z-50 glass-effect py-3">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="hover:bg-primary/20 hover:text-primary">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
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
          
          <Link 
            to="/" 
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <img 
              src="https://i.imgur.com/F4KFQkf.png" 
              alt="Neelkantha Meat Shop Logo" 
              className="h-12 w-12 object-contain rounded-full" 
            />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
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
          <div className="ml-4 border-l pl-4 border-border/50">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;