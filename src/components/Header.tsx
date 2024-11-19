import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-background/80 border-b border-primary/20 py-4 px-6 flex items-center justify-between backdrop-blur-md">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="lg:hidden hover:bg-primary/20 hover:text-primary">
          <Menu className="h-6 w-6" />
        </Button>
        <Link to="/" className="text-xl font-bold text-foreground hover:text-primary transition-colors">
          Meat Shop Manager
        </Link>
      </div>
      <nav className="hidden lg:flex items-center space-x-6">
        <Link to="/" className="text-foreground hover:text-primary transition-colors">Dashboard</Link>
        <Link to="/orders" className="text-foreground hover:text-primary transition-colors">Orders</Link>
        <Link to="/products" className="text-foreground hover:text-primary transition-colors">Products</Link>
        <Link to="/reports" className="text-foreground hover:text-primary transition-colors">Reports</Link>
        <Link to="/settings" className="text-foreground hover:text-primary transition-colors">Settings</Link>
      </nav>
    </header>
  );
};

export default Header;