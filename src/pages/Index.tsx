import { motion } from "framer-motion";
import { Clock, TrendingUp, Search } from "lucide-react";
import { format } from "date-fns";
import Header from "@/components/Header";
import DashboardStats from "@/components/DashboardStats";
import ProductsTable from "@/components/ProductsTable";
import OrderForm from "@/components/OrderForm";
import { Input } from "@/components/ui/input";

const Index = () => {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      
      <main className="container py-6 space-y-6">
        {/* Welcome & Search Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-moss/5 p-6 rounded-xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-2"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-forest">
              Welcome Back, Admin
            </h1>
            <div className="flex items-center gap-2 text-moss/80">
              <Clock className="w-4 h-4" />
              <p className="text-sm">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
            </div>
          </motion.div>
          
          <div className="w-full md:w-auto flex gap-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-moss/50 w-4 h-4" />
              <Input 
                placeholder="Search orders..." 
                className="pl-10 bg-cream border-moss/20 focus:border-tiger"
              />
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <DashboardStats />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Quick Order Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="xl:col-span-2 h-full"
          >
            <div className="bg-cream rounded-xl border border-moss/10 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-tiger/20 via-earth/10 to-transparent p-6">
                <h2 className="text-2xl font-semibold text-forest">Quick Order</h2>
                <p className="text-moss/70 text-sm mt-1">Create new orders instantly</p>
              </div>
              <div className="p-6">
                <OrderForm />
              </div>
            </div>
          </motion.div>

          {/* Products Management */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="xl:col-span-3 h-full"
          >
            <div className="bg-cream rounded-xl border border-moss/10 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-earth/20 via-tiger/10 to-transparent p-6">
                <h2 className="text-2xl font-semibold text-forest">Products Overview</h2>
                <p className="text-moss/70 text-sm mt-1">Manage your inventory</p>
              </div>
              <div className="p-6">
                <ProductsTable />
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Index;