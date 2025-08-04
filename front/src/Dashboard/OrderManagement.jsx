import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../Component/ui/Table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../Component/ui/card";
import { Button } from "../Component/ui/Button";
import { Input } from "../Component/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../Component/ui/Dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../Component/ui/Select";
import { Badge } from "../Component/ui/badge";
import {
  Search,
  Filter,
  Plus,
  RefreshCw,
  ClipboardList,
  TruckIcon,
  DollarSign,
  Calendar,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../Component/ui/tabs";

export const OrderManagement = () => {
  const [openNewOrderDialog, setOpenNewOrderDialog] = useState(false);

  // Sample order data
  const [orders, setOrders] = useState([
    {
      id: "ORD-2025-001",
      customer: "Green Fields Farm",
      items: [
        { name: "Organic Chicken Feed", quantity: 200, unit: "kg", price: 240 },
        {
          name: "Cattle Mineral Supplement",
          quantity: 50,
          unit: "kg",
          price: 180,
        },
      ],
      total: 420,
      date: "2025-03-15",
      deliveryDate: "2025-03-22",
      status: "Processing",
    },
    {
      id: "ORD-2025-002",
      customer: "Riverside Ranch",
      items: [
        {
          name: "Veterinary Antibiotics",
          quantity: 20,
          unit: "bottles",
          price: 600,
        },
        { name: "Sheep Shears", quantity: 5, unit: "units", price: 250 },
      ],
      total: 850,
      date: "2025-03-10",
      deliveryDate: "2025-03-20",
      status: "Shipped",
    },
    {
      id: "ORD-2025-003",
      customer: "Sunny Poultry",
      items: [
        {
          name: "Laying Hen Nest Boxes",
          quantity: 10,
          unit: "units",
          price: 450,
        },
      ],
      total: 450,
      date: "2025-03-18",
      deliveryDate: "2025-03-25",
      status: "Pending",
    },
    {
      id: "ORD-2025-004",
      customer: "Mountain Dairy",
      items: [
        {
          name: "Cattle Mineral Supplement",
          quantity: 100,
          unit: "kg",
          price: 360,
        },
        {
          name: "Veterinary Antibiotics",
          quantity: 10,
          unit: "bottles",
          price: 300,
        },
      ],
      total: 660,
      date: "2025-03-05",
      deliveryDate: "2025-03-12",
      status: "Delivered",
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-blue-100 text-blue-800";
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      case "Shipped":
        return "bg-purple-100 text-purple-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Order Management</h2>
        <Button
          onClick={() => setOpenNewOrderDialog(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="mr-2 h-4 w-4" /> Create New Order
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ClipboardList className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-gray-500">+15% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Delivery
            </CardTitle>
            <TruckIcon className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-gray-500">8 shipping today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,580</div>
            <p className="text-xs text-gray-500">+8.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Deliveries
            </CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-gray-500">Next 7 days</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order List</CardTitle>
          <CardDescription>Manage and track customer orders</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <div className="flex justify-between items-center mb-6">
              <TabsList>
                <TabsTrigger value="all">All Orders</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="shipped">Shipped</TabsTrigger>
                <TabsTrigger value="delivered">Delivered</TabsTrigger>
              </TabsList>
              <div className="flex items-center">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search orders..."
                    className="pl-8 w-full"
                  />
                </div>
                <Button variant="outline" className="ml-2">
                  <Filter className="mr-2 h-4 w-4" /> Filter
                </Button>
                <Button variant="outline" className="ml-2">
                  <RefreshCw className="mr-2 h-4 w-4" /> Refresh
                </Button>
              </div>
            </div>

            <TabsContent value="all" className="m-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Order Date</TableHead>
                      <TableHead>Delivery Date</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {order.id}
                        </TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>{order.deliveryDate}</TableCell>
                        <TableCell>${order.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={openNewOrderDialog} onOpenChange={setOpenNewOrderDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Order</DialogTitle>
            <DialogDescription>
              Enter details for the new customer order
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">Customer</label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="greenfields">Green Fields Farm</SelectItem>
                  <SelectItem value="riverside">Riverside Ranch</SelectItem>
                  <SelectItem value="sunny">Sunny Poultry</SelectItem>
                  <SelectItem value="mountain">Mountain Dairy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">Delivery Date</label>
              <Input className="col-span-3" type="date" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">Items</label>
              <div className="col-span-3">
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" /> Add Item
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">Notes</label>
              <Input
                className="col-span-3"
                placeholder="Optional order notes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenNewOrderDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setOpenNewOrderDialog(false)}>
              Create Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderManagement;
