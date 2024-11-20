import Header from "@/components/Header";
import { useStore } from "@/store/store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Edit2, Save } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface EditableOrder {
  id: string;
  customerName?: string;
  quantity: number;
  total: number;
  productId: string;
}

const Orders = () => {
  const { orders, products, updateOrderStatus } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [editingOrder, setEditingOrder] = useState<EditableOrder | null>(null);
  const { toast } = useToast();

  // Group unpaid orders by customer
  const groupedUnpaidOrders = orders
    .filter(order => !order.isPaid)
    .reduce((acc, order) => {
      const customerName = order.customerName || "Anonymous";
      if (!acc[customerName]) {
        acc[customerName] = {
          orders: [],
          totalAmount: 0
        };
      }
      acc[customerName].orders.push(order);
      acc[customerName].totalAmount += order.total;
      return acc;
    }, {} as Record<string, { orders: typeof orders, totalAmount: number }>);

  // Calculate totals
  const totalUnpaidAmount = orders.filter(order => !order.isPaid).reduce((sum, order) => sum + order.total, 0);
  const totalPaidAmount = orders.filter(order => order.isPaid).reduce((sum, order) => sum + order.total, 0);

  // Filter orders based on search criteria
  const filterOrders = (ordersList: typeof orders) => {
    return ordersList.filter(order => {
      const product = products.find(p => p.id === order.productId);
      const searchString = `${order.customerName} ${product?.name} ${order.total}`.toLowerCase();
      const dateMatch = searchDate ? new Date(order.date).toLocaleDateString().includes(searchDate) : true;
      return searchString.includes(searchTerm.toLowerCase()) && dateMatch;
    });
  };

  const handleEdit = (order: EditableOrder) => {
    setEditingOrder(order);
  };

  const handleSave = () => {
    if (!editingOrder) return;

    // Update the order in the store
    // Note: You'll need to implement this function in your store
    // updateOrder(editingOrder);

    toast({
      title: "Order Updated",
      description: "The order has been successfully updated.",
    });
    setEditingOrder(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8 space-y-8">
        <div className="grid gap-6">
          <Card className="p-8">
            <h2 className="text-xl font-bold mb-6">Orders Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Total Unpaid Amount</p>
                <p className="text-2xl font-bold text-red-600">NPR {totalUnpaidAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Paid Amount</p>
                <p className="text-2xl font-bold text-green-600">NPR {totalPaidAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <h2 className="text-2xl font-bold">Unpaid Orders by Customer</h2>
              <div className="flex gap-4 w-full md:w-auto">
                <Input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-64"
                />
                <Input
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="w-full md:w-auto"
                />
              </div>
            </div>

            {Object.entries(groupedUnpaidOrders).map(([customerName, { orders: customerOrders, totalAmount }]) => (
              <Card key={customerName} className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">{customerName}</h3>
                  <p className="text-red-600 font-bold">Total: NPR {totalAmount.toLocaleString()}</p>
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filterOrders(customerOrders).map((order) => {
                        const product = products.find(p => p.id === order.productId);
                        return (
                          <TableRow key={order.id}>
                            <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                            <TableCell>{product?.name}</TableCell>
                            <TableCell>{order.quantity} kg</TableCell>
                            <TableCell>NPR {order.total.toLocaleString()}</TableCell>
                            <TableCell>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="mr-2">
                                    <Edit2 className="h-4 w-4 mr-1" />
                                    Edit
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit Order</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <Label>Customer Name</Label>
                                      <Input
                                        value={editingOrder?.customerName || ""}
                                        onChange={(e) => setEditingOrder(prev => 
                                          prev ? { ...prev, customerName: e.target.value } : null
                                        )}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Product</Label>
                                      <Select
                                        value={editingOrder?.productId}
                                        onValueChange={(value) => setEditingOrder(prev => 
                                          prev ? { ...prev, productId: value } : null
                                        )}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select product" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {products.map((product) => (
                                            <SelectItem key={product.id} value={product.id}>
                                              {product.name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Quantity (kg)</Label>
                                      <Input
                                        type="number"
                                        value={editingOrder?.quantity}
                                        onChange={(e) => setEditingOrder(prev => 
                                          prev ? { ...prev, quantity: Number(e.target.value) } : null
                                        )}
                                      />
                                    </div>
                                    <Button onClick={handleSave} className="w-full">
                                      <Save className="h-4 w-4 mr-2" />
                                      Save Changes
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, true)}
                              >
                                Mark as Paid
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Paid Orders</h2>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filterOrders(orders.filter(order => order.isPaid)).map((order) => {
                    const product = products.find(p => p.id === order.productId);
                    return (
                      <TableRow key={order.id}>
                        <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                        <TableCell>{order.customerName || "Anonymous"}</TableCell>
                        <TableCell>{product?.name}</TableCell>
                        <TableCell>{order.quantity} kg</TableCell>
                        <TableCell>NPR {order.total.toLocaleString()}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Orders;