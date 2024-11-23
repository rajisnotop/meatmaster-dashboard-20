import { Input } from "@/components/ui/input";
import { Search, Calendar, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface OrdersSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  searchDate: string;
  setSearchDate: (value: string) => void;
}

const OrdersSearch = ({
  searchTerm,
  setSearchTerm,
  searchDate,
  setSearchDate,
}: OrdersSearchProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 bg-background/60 backdrop-blur-sm border-border/50"
        />
      </div>
      <div className="relative w-full sm:w-auto">
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="YYYY/MM/DD"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="pl-9 bg-background/60 backdrop-blur-sm border-border/50 w-full"
        />
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0">
            <Filter className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Advanced Filters</SheetTitle>
            <SheetDescription>
              Apply filters to find specific orders
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Payment Status</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="qr">Paid with QR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Amount Range</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input type="number" placeholder="Min" />
                <Input type="number" placeholder="Max" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Date Range</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input type="date" />
                <Input type="date" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Product</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  {/* Products will be populated from store */}
                </SelectContent>
              </Select>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default OrdersSearch;