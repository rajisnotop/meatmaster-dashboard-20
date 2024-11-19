import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const OrderForm = () => {
  return (
    <Card className="p-6 animate-scale-in">
      <h3 className="text-lg font-semibold mb-4">New Order</h3>
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="customer">Customer Name</Label>
          <Input id="customer" placeholder="Enter customer name" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="product">Product</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beef">Beef Sirloin</SelectItem>
              <SelectItem value="chicken">Chicken Breast</SelectItem>
              <SelectItem value="pork">Pork Chops</SelectItem>
              <SelectItem value="lamb">Lamb Leg</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity (kg)</Label>
          <Input id="quantity" type="number" min="0" step="0.1" />
        </div>
        
        <Button className="w-full bg-secondary hover:bg-secondary/90">
          Create Order
        </Button>
      </form>
    </Card>
  );
};

export default OrderForm;