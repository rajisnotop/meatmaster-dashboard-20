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
      <aside className={cn("sidebar", isCollapsed && "sidebar-collapsed")}>
        <div className="flex flex-col h-full">
          <div className="p-4 flex items-center justify-between">
            {!isCollapsed && (
              <Link to="/" className="flex items-center gap-4">
                <img 
                  src="https://i.imgur.com/F4KFQkf.png" 
                  alt="Logo" 
                  className="h-16 w-16 object-contain rounded-full shadow-lg" 
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

          <nav className="flex-1 px-2 py-4">
            <TooltipProvider>
              {navigationItems.map(({ path, label, icon: Icon }) => (
                <Tooltip key={path} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link
                      to={path}
                      className={cn(
                        "nav-link mb-2",
                        isActive(path) ? "nav-link-active" : "nav-link-inactive"
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

      <main className={cn("main-content", isCollapsed && "main-content-collapsed")}>
        <div className="container mx-auto">
          {/* Content will be rendered here */}
        </div>
      </main>
    </>
  );
};

export default Header;