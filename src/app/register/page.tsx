"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ 
    username: "", 
    password: "", 
    confirmPassword: "", 
    role: "staff" 
  });
  const [isHuman, setIsHuman] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validations
    if (form.username.length < 3) {
      setError("Username harus minimal 3 karakter!");
      setIsLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError("Password harus minimal 6 karakter!");
      setIsLoading(false);
      return;
    }

    // Cek apakah password dan konfirmasinya cocok
    if (form.password !== form.confirmPassword) {
      setError("Password dan konfirmasi password harus sama!");
      setIsLoading(false);
      return;
    }

    // Cek apakah sudah centang "Verified Human"
    if (!isHuman) {
      setError("Silakan centang 'Verified Human' untuk melanjutkan.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
          role: form.role,
        }),
      });

      const data = await res.json();
      
      if (res.ok) {
        toast({
          title: "Registrasi Berhasil",
          description: "Silahkan login dengan akun yang baru dibuat",
        });
        router.push("/login"); // Redirect ke halaman login setelah sukses
      } else {
        setError(data.message || "Registrasi gagal, coba lagi.");
      }
    } catch (err) {
      setError("Terjadi kesalahan pada server. Silakan coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Register</CardTitle>
          <CardDescription className="text-center">
            Buat akun baru untuk mengakses sistem
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username"
                name="username" 
                placeholder="Masukkan username" 
                onChange={handleChange} 
                className="w-full"
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input 
                  id="password"
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  placeholder="Masukkan password" 
                  onChange={handleChange} 
                  className="w-full pr-10"
                  required 
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <div className="relative">
                <Input 
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"} 
                  name="confirmPassword" 
                  placeholder="Konfirmasi password" 
                  onChange={handleChange} 
                  className="w-full pr-10"
                  required 
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={form.role} 
                onValueChange={(value) => setForm({ ...form, role: value })}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2 pt-2">
              <Checkbox 
                id="human-check" 
                checked={isHuman} 
                onCheckedChange={(checked) => setIsHuman(checked === true)} 
              />
              <Label htmlFor="human-check" className="text-sm cursor-pointer">
                Saya menyatakan bahwa saya adalah manusia
              </Label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full mt-6" 
              disabled={isLoading}
            >
              {isLoading ? "Memproses..." : "Buat Akun"}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Sudah punya akun?{" "}
            <a 
              href="/login" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Login
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

function toast(arg0: { title: string; description: string; }) {
    throw new Error("Function not implemented.");
}
