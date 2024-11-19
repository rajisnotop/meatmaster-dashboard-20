import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
        </Button>
        <Link to="/" className="text-xl font-bold">Meat Shop Manager</Link>
      </div>
      <nav className="hidden lg:flex items-center space-x-6">
        <Link to="/" className="hover:text-secondary transition-colors">Dashboard</Link>
        <Link to="/orders" className="hover:text-secondary transition-colors">Orders</Link>
      </nav>
    </header>
  );
};

export default Header;