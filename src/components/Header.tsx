import { Menu } from "lucide-react";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold">Meat Shop Manager</h1>
      </div>
      <nav className="hidden lg:flex items-center space-x-6">
        <a href="#dashboard" className="hover:text-secondary transition-colors">Dashboard</a>
        <a href="#products" className="hover:text-secondary transition-colors">Products</a>
        <a href="#orders" className="hover:text-secondary transition-colors">Orders</a>
        <a href="#reports" className="hover:text-secondary transition-colors">Reports</a>
      </nav>
    </header>
  );
};

export default Header;