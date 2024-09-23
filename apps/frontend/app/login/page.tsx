'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BACKEND_URL } from "../config"
import axios from "axios"
import { Zap } from "lucide-react"

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response=await axios.post(`${BACKEND_URL}/user/signin`,{
        email,
        password
    });
    if (response.status === 200) {
        localStorage.setItem('token', response.data.token)
      router.push('/dashboard')
    } else {
      alert('Login failed')
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
<header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <Zap className="h-6 w-6 text-blue-600" />
          <span className="ml-2 text-2xl font-bold">Autoverse</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button asChild variant="ghost">
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </nav>
      </header>      <main className="flex-1 flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Sign In to Autoverse</h1>
            <p className="text-gray-500">Enter your details to access your account</p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                placeholder="m@example.com" 
                required 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                required 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button className="w-full" type="submit">
              Sign In
            </Button>
          </form>
          <div className="text-center text-sm">
            <Link className="underline" href="#">
              Forgot password?
            </Link>
          </div>
        </div>
      </main>
      {/* Footer remains the same */}
    </div>
  )
}