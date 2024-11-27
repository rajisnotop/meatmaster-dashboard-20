import Header from "@/components/Header";
import DashboardStats from "@/components/DashboardStats";
import ProductsTable from "@/components/ProductsTable";
import OrderForm from "@/components/OrderForm";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Clock, TrendingUp } from "lucide-react";
import { format } from "date-fns";

const Index = () => {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="container py-8 space-y-8">
        {/* Welcome Section */}
        <div className="flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-1"
          >
            <h1 className="text-4xl font-bold tracking-tight text-forest">
              Welcome Back!
            </h1>
            <div className="flex items-center gap-2 text-forest/70">
              <Clock className="w-4 h-4" />
              <p>{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 bg-moss/10 px-4 py-2 rounded-lg"
          >
            <TrendingUp className="w-5 h-5 text-moss" />
            <span className="text-forest font-medium">Today's Overview</span>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <DashboardStats />
        </motion.div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Order Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="h-full overflow-hidden border-moss/10">
              <div className="bg-gradient-to-r from-moss/20 to-earth/20 p-6">
                <h2 className="text-2xl font-semibold text-forest">New Order</h2>
                <p className="text-forest/70 text-sm mt-1">Create a new order quickly</p>
              </div>
              <div className="p-6 pt-4">
                <OrderForm />
              </div>
            </Card>
          </motion.div>
          
          {/* Products Management Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-3"
          >
            <Card className="h-full overflow-hidden border-moss/10">
              <div className="bg-gradient-to-r from-tiger/20 to-earth/20 p-6">
                <h2 className="text-2xl font-semibold text-forest">Products Management</h2>
                <p className="text-forest/70 text-sm mt-1">Manage your inventory efficiently</p>
              </div>
              <div className="p-6 pt-4">
                <ProductsTable />
              </div>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Index;