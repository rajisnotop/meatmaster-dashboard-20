import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass-effect py-4 px-6">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="lg:hidden hover:bg-primary/20 hover:text-primary">
            <Menu className="h-6 w-6" />
          </Button>
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
            Neelkantha Meat Shop
          </Link>
        </div>
        <nav className="hidden lg:flex items-center space-x-1">
          {[
            { path: "/", label: "Dashboard" },
            { path: "/orders", label: "Orders" },
            { path: "/reports", label: "Reports" },
            { path: "/expenditure", label: "Expenditure" },
            { path: "/billing", label: "Billing" },
          ].map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive(path)
                  ? "bg-accent text-primary font-medium"
                  : "text-muted-foreground hover:text-primary hover:bg-accent/50"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;