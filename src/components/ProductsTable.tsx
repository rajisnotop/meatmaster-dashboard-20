import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Plus, Trash2, Search } from "lucide-react";
import { Input } from "./ui/input";
import { useStore } from "@/store/store";
import { useToast } from "./ui/use-toast";
import { motion } from "framer-motion";

const ProductsTable = () => {
  const { products, addProduct, deleteProduct } = useStore();
  const { toast } = useToast();
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    addProduct({
      name: newProduct.name,
      price: Number(newProduct.price),
      stock: 0,
    });

    setNewProduct({ name: "", price: "" });
    toast({
      title: "Success",
      description: "Product added successfully",
    });
  };

  const handleDeleteProduct = (id: string) => {
    deleteProduct(id);
    toast({
      title: "Success",
      description: "Product deleted successfully",
    });
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-moss/50 w-4 h-4" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-cream border-moss/20 focus:border-tiger"
          />
        </div>
        <div className="flex gap-4 flex-1">
          <Input
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="bg-cream border-moss/20 focus:border-tiger"
          />
          <Input
            type="number"
            placeholder="Price (NPR)"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            className="bg-cream border-moss/20 focus:border-tiger"
          />
          <Button 
            onClick={handleAddProduct}
            className="bg-tiger text-cream hover:bg-tiger/90 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-moss/10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-moss/5 hover:bg-moss/10">
              <TableHead className="text-forest">Product Name</TableHead>
              <TableHead className="text-forest">Price</TableHead>
              <TableHead className="text-right text-forest">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product, index) => (
              <motion.tr
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-cream hover:bg-moss/5 transition-colors"
              >
                <TableCell className="font-medium text-forest">{product.name}</TableCell>
                <TableCell className="text-moss">NPR {product.price.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-tiger hover:text-tiger/80 hover:bg-tiger/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};

export default ProductsTable;