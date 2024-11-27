import Header from "@/components/Header";
import DashboardStats from "@/components/DashboardStats";
import ProductsTable from "@/components/ProductsTable";
import OrderForm from "@/components/OrderForm";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="container py-6 space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-2"
        >
          <h1 className="text-3xl font-bold tracking-tight text-forest">
            Welcome Back!
          </h1>
          <p className="text-forest/80">
            Here's an overview of your shop's performance
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <DashboardStats />
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="p-6 glass-effect">
              <h2 className="text-xl font-semibold mb-4 text-tiger">New Order</h2>
              <OrderForm />
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="p-6 glass-effect">
              <h2 className="text-xl font-semibold mb-4 text-tiger">Products Management</h2>
              <ProductsTable />
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Index;