import { useStore } from "@/store/store";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";

const Orders = () => {
  const { orders, products } = useStore();

  return (
    <div className="min-h-screen bg-accent">
      <Header />
      <main className="container py-8">
        <h2 className="text-2xl font-bold mb-4">Orders</h2>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Name</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const product = products.find((p) => p.id === order.productId);
                return (
                  <TableRow key={order.id}>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{product?.name}</TableCell>
                    <TableCell>{order.quantity} kg</TableCell>
                    <TableCell>NPR {order.total.toLocaleString()}</TableCell>
                    <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
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