import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "./ui/input";
import { useStore } from "@/store/store";
import { useToast } from "./ui/use-toast";

const ProductsTable = () => {
  const { products, addProduct, deleteProduct } = useStore();
  const { toast } = useToast();
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
  });

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
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
      stock: Number(newProduct.stock),
    });

    setNewProduct({ name: "", price: "", stock: "" });
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

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex gap-4">
        <Input
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Price (NPR)"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Stock"
          value={newProduct.stock}
          onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
        />
        <Button onClick={handleAddProduct}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>NPR {product.price.toLocaleString()}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProductsTable;