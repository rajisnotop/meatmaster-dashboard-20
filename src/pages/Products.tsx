import Header from "@/components/Header";
import ProductsTable from "@/components/ProductsTable";

const Products = () => {
  return (
    <div className="min-h-screen bg-accent">
      <Header />
      <main className="container py-8 space-y-8">
        <h1 className="text-3xl font-bold text-foreground">Products</h1>
        <ProductsTable />
      </main>
    </div>
  );
};

export default Products;