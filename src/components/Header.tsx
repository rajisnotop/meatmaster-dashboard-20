import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import {
  Menu,
  Home,
  FileText,
  DollarSign,
  ShoppingBag,
  Receipt,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Header = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/orders", label: "Orders", icon: ShoppingBag },
    { path: "/reports", label: "Reports", icon: FileText },
    { path: "/expenditure", label: "Expenditure", icon: Receipt },
    { path: "/billing", label: "Billing", icon: DollarSign },
  ];

  return (
    <>
      <aside className={cn(
        "fixed left-0 top-0 z-30 h-screen w-64 border-r border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "transition-all duration-300 ease-in-out",
        isCollapsed && "w-20"
      )}>
        <div className="flex h-full flex-col">
          <div className="p-4 flex items-center justify-between">
            {!isCollapsed && (
              <Link to="/" className="flex items-center gap-4">
                <img 
                  src="https://i.imgur.com/F4KFQkf.png" 
                  alt="Logo" 
                  className="h-12 w-12 rounded-full ring-2 ring-primary/20" 
                />
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Neelkantha
                </span>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="ml-auto"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          <nav className="flex-1 space-y-2 px-2 py-4">
            <TooltipProvider>
              {navigationItems.map(({ path, label, icon: Icon }) => (
                <Tooltip key={path} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link
                      to={path}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                        "hover:bg-accent/50",
                        isActive(path) ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                        isCollapsed && "justify-center"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {!isCollapsed && <span>{label}</span>}
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right">
                      <p>{label}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              ))}
            </TooltipProvider>
          </nav>

          <div className="p-4 border-t border-border/50">
            <ThemeToggle />
          </div>
        </div>
      </aside>

      <main className={cn(
        "min-h-screen transition-all duration-300 ease-in-out",
        isCollapsed ? "pl-20" : "pl-64"
      )}>
        <div className="container mx-auto p-6">
          {/* Content will be rendered here */}
        </div>
      </main>
    </>
  );
};

export default Header;