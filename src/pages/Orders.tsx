import { useStore } from "@/store/store";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";

const Orders = () => {
  const { orders, products } = useStore();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container py-8">
        <h2 className="text-2xl font-bold mb-4 text-foreground">Orders</h2>
        <Card className="bg-accent/50 border-primary/20 backdrop-blur-sm">
          <Table>
            <TableHeader>
              <TableRow className="border-primary/20">
                <TableHead className="text-foreground">Customer Name</TableHead>
                <TableHead className="text-foreground">Product</TableHead>
                <TableHead className="text-foreground">Quantity</TableHead>
                <TableHead className="text-foreground">Total</TableHead>
                <TableHead className="text-foreground">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const product = products.find((p) => p.id === order.productId);
                return (
                  <TableRow key={order.id} className="border-primary/20 hover:bg-primary/5">
                    <TableCell className="text-foreground">{order.customerName}</TableCell>
                    <TableCell className="text-foreground">{product?.name}</TableCell>
                    <TableCell className="text-foreground">{order.quantity} kg</TableCell>
                    <TableCell className="text-foreground">NPR {order.total.toLocaleString()}</TableCell>
                    <TableCell className="text-foreground">{new Date(order.date).toLocaleDateString()}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      </main>
    </div>
  );
};

export default Orders;