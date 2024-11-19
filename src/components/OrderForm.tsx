import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useStore } from "@/store/store";
import { useToast } from "./ui/use-toast";

const OrderForm = () => {
  const { products, addOrder } = useStore();
  const { toast } = useToast();
  const [order, setOrder] = useState({
    customerName: "",
    productId: "",
    quantity: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!order.customerName || !order.productId || !order.quantity) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const product = products.find((p) => p.id === order.productId);
    if (!product) return;

    const total = product.price * Number(order.quantity);

    addOrder({
      customerName: order.customerName,
      productId: order.productId,
      quantity: Number(order.quantity),
      total,
    });

    setOrder({ customerName: "", productId: "", quantity: "" });
    toast({
      title: "Success",
      description: "Order created successfully",
    });
  };

  return (
    <Card className="p-6 bg-background/80 border border-border/50 backdrop-blur-sm animate-scale-in">
      <h3 className="text-lg font-semibold mb-4">New Order</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="customer">Customer Name</Label>
          <Input
            id="customer"
            placeholder="Enter customer name"
            value={order.customerName}
            onChange={(e) => setOrder({ ...order, customerName: e.target.value })}
            className="bg-background border-border/50 focus:border-primary/50"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="product">Product</Label>
          <Select value={order.productId} onValueChange={(value) => setOrder({ ...order, productId: value })}>
            <SelectTrigger className="bg-background border-border/50">
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name} - NPR {product.price.toLocaleString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity (kg)</Label>
          <Input
            id="quantity"
            type="number"
            min="0"
            step="0.1"
            value={order.quantity}
            onChange={(e) => setOrder({ ...order, quantity: e.target.value })}
            className="bg-background border-border/50 focus:border-primary/50"
          />
        </div>
        
        <Button type="submit" className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/20">
          Create Order
        </Button>
      </form>
    </Card>
  );
};

export default OrderForm;