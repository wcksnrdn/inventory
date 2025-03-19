"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogTitle, 
  DialogDescription, 
  DialogHeader,
  DialogFooter,
  DialogTrigger, 
  DialogContent 
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Package, 
  User, 
  LogOut
} from "lucide-react";

interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface UserProfile {
  username: string;
  role: string;
  email?: string;
}

export default function InventoryPage() {
  const router = useRouter();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [newItem, setNewItem] = useState({ name: "", quantity: "", price: "" });
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Format currency to Indonesian Rupiah
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        // Decode JWT to get basic user info
        const user = JSON.parse(atob(token.split(".")[1]));
        setRole(user.role);
        setProfile({
          username: user.username,
          role: user.role,
          email: user.email
        });

        // Fetch inventory data
        const res = await fetch("http://localhost:5001/api/inventory", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setInventory(data);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleAddItem = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5001/api/inventory", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          name: newItem.name,
          quantity: parseInt(newItem.quantity),
          price: parseFloat(newItem.price)
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setInventory([...inventory, data.item]);
        setNewItem({ name: "", quantity: "", price: "" });
        setIsAddDialogOpen(false);
      }
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleEditItem = async () => {
    if (!editItem) return;
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:5001/api/inventory/${editItem.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(editItem),
      });

      if (res.ok) {
        setInventory(inventory.map(item => (item.id === editItem.id ? editItem : item)));
        setEditItem(null);
        setIsEditDialogOpen(false);
      }
    } catch (error) {
      console.error("Error editing item:", error);
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus barang ini?")) return;
    
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5001/api/inventory/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setInventory(inventory.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  // Calculate total inventory value
  const totalInventoryValue = inventory.reduce(
    (total, item) => total + item.price * item.quantity, 
    0
  );

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header with Profile */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Inventory Management</h1>
          <p className="text-gray-500">Manage your stock items</p>
        </div>
        <div className="flex items-center gap-4">
          {role === "admin" && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus size={16} />
                  <span>Tambah Barang</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl">Tambah Barang Baru</DialogTitle>
                  <DialogDescription>
                    Masukkan detail barang yang akan ditambahkan ke inventory
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Nama</Label>
                    <Input 
                      id="name"
                      className="col-span-3"
                      placeholder="Nama Barang" 
                      value={newItem.name} 
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="quantity" className="text-right">Jumlah</Label>
                    <Input 
                      id="quantity"
                      className="col-span-3"
                      type="number" 
                      placeholder="Jumlah" 
                      value={newItem.quantity} 
                      onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })} 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">Harga</Label>
                    <Input 
                      id="price"
                      className="col-span-3"
                      type="number" 
                      placeholder="Harga" 
                      value={newItem.price} 
                      onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} 
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Batal</Button>
                  <Button onClick={handleAddItem}>Simpan</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          
          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full h-10 w-10 bg-primary/10 cursor-pointer">
                <User size={20} className="text-primary" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-medium">{profile?.username}</span>
                  <span className="text-xs text-gray-500">{profile?.email}</span>
                  <span className="text-xs mt-1 bg-primary/10 text-primary px-2 py-0.5 rounded-full inline-block w-fit">
                    {profile?.role === "admin" ? "Administrator" : "Staff"}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer text-red-500 flex items-center gap-2"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{inventory.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Quantity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {inventory.reduce((total, item) => total + item.quantity, 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {formatRupiah(totalInventoryValue)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle>Daftar Barang</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : inventory.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <Package size={48} className="mx-auto mb-4 text-gray-400" />
              <p>Belum ada barang dalam inventory</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Barang</TableHead>
                  <TableHead className="text-right">Jumlah</TableHead>
                  <TableHead className="text-right">Harga Satuan</TableHead>
                  <TableHead className="text-right">Total Nilai</TableHead>
                  {role === "admin" && <TableHead className="text-right">Aksi</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">{formatRupiah(item.price)}</TableCell>
                    <TableCell className="text-right">{formatRupiah(item.price * item.quantity)}</TableCell>
                    {role === "admin" && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog open={isEditDialogOpen && editItem?.id === item.id} 
                                  onOpenChange={(open) => {
                                    setIsEditDialogOpen(open);
                                    if (open) setEditItem(item);
                                  }}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <Edit size={16} />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Edit Barang</DialogTitle>
                                <DialogDescription>
                                  Ubah detail barang
                                </DialogDescription>
                              </DialogHeader>
                              {editItem && (
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-name" className="text-right">Nama</Label>
                                    <Input 
                                      id="edit-name"
                                      className="col-span-3"
                                      value={editItem.name} 
                                      onChange={(e) => setEditItem({ ...editItem, name: e.target.value })} 
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-quantity" className="text-right">Jumlah</Label>
                                    <Input 
                                      id="edit-quantity"
                                      className="col-span-3"
                                      type="number" 
                                      value={editItem.quantity} 
                                      onChange={(e) => setEditItem({ ...editItem, quantity: parseInt(e.target.value) })} 
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-price" className="text-right">Harga</Label>
                                    <Input 
                                      id="edit-price"
                                      className="col-span-3"
                                      type="number" 
                                      value={editItem.price} 
                                      onChange={(e) => setEditItem({ ...editItem, price: parseFloat(e.target.value) })} 
                                    />
                                  </div>
                                </div>
                              )}
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Batal</Button>
                                <Button onClick={handleEditItem}>Simpan</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Button variant="destructive" size="sm" className="h-8 w-8 p-0" onClick={() => handleDeleteItem(item.id)}>
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}