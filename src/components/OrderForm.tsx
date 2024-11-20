import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useStore } from "@/store/store";
import { useToast } from "./ui/use-toast";
import { useNavigate } from "react-router-dom";

const OrderForm = () => {
  const { products, addOrder } = useStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [order, setOrder] = useState({
    customerName: "",
    productId: "",
    quantity: "",
    price: "",
  });

  const selectedProduct = products.find((p) => p.id === order.productId);

  useEffect(() => {
    if (selectedProduct && order.price && !order.quantity) {
      const quantity = Number(order.price) / selectedProduct.price;
      setOrder(prev => ({ ...prev, quantity: quantity.toFixed(2) }));
    }
  }, [order.price, selectedProduct]);

  useEffect(() => {
    if (selectedProduct && order.quantity && !order.price) {
      const price = selectedProduct.price * Number(order.quantity);
      setOrder(prev => ({ ...prev, price: price.toFixed(2) }));
    }
  }, [order.quantity, selectedProduct]);

  const handleSubmit = (isPaid: boolean) => {
    if (!order.productId || (!order.quantity && !order.price)) {
      toast({
        title: "Error",
        description: "Please fill in required fields",
        variant: "destructive",
      });
      return;
    }

    const product = products.find((p) => p.id === order.productId);
    if (!product) return;

    const total = product.price * Number(order.quantity);

    const newOrder = {
      customerName: order.customerName || undefined,
      productId: order.productId,
      quantity: Number(order.quantity),
      total,
      isPaid,
      date: new Date(),
    };

    console.log("Creating new order:", newOrder);
    addOrder(newOrder);
    setOrder({ customerName: "", productId: "", quantity: "", price: "" });

    if (!isPaid) {
      navigate("/credit");
    } else {
      toast({
        title: "Success",
        description: "Order created successfully",
      });
    }
  };

  return (
    <Card className="p-6 bg-background/80 border border-border/50 backdrop-blur-sm animate-scale-in">
      <h3 className="text-lg font-semibold mb-4">New Order</h3>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="customer">Customer Name (Optional)</Label>
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

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity (kg)</Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              step="0.1"
              value={order.quantity}
              onChange={(e) => setOrder({ ...order, quantity: e.target.value, price: "" })}
              className="bg-background border-border/50 focus:border-primary/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (NPR)</Label>
            <Input
              id="price"
              type="number"
              min="0"
              value={order.price}
              onChange={(e) => setOrder({ ...order, price: e.target.value, quantity: "" })}
              className="bg-background border-border/50 focus:border-primary/50"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Button 
            type="button"
            onClick={() => handleSubmit(true)}
            className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-500 border border-green-500/20"
          >
            Create Paid Order
          </Button>
          
          <Button 
            type="button"
            onClick={() => handleSubmit(false)}
            className="w-full bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-500 border border-yellow-500/20"
          >
            Create Unpaid Order
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default OrderForm;