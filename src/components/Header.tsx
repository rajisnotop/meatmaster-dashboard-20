import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass-effect py-3">
      <div className="container mx-auto px-4">
        <div className="flex-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden hover:bg-primary/20">
              <Menu className="h-5 w-5" />
            </Button>
            <Link to="/" className="text-xl font-bold gradient-text hover:opacity-80 transition-opacity">
              Neelkantha Meat Shop
            </Link>
          </div>
          <nav className="hidden lg:flex items-center gap-1">
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
                className={`px-4 py-2 rounded-md transition-all duration-200 ${
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
      </div>
    </header>
  );
};

export default Header;