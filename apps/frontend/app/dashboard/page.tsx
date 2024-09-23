"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { PlusCircle, Zap, MoreVertical, MoreHorizontal, Play, Pause, Edit, Trash } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import axios from "axios"
import { BACKEND_URL, HOOKS_URL } from "../config"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

interface Zap {
    "id": string,
    "triggerId": string,
    "userId": number,
    "actions": {
        "id": string,
        "zapId": string,
        "actionId": string,
        "sortingOrder": number,
        "type": {
            "id": string,
            "name": string
            "image": string
        }
    }[],
    "trigger": {
        "id": string,
        "zapId": string,
        "triggerId": string,
        "type": {
            "id": string,
            "name": string,
            "image": string
        }
    }
}

export default function Dashboard() {
  const [zaps, setZaps] = useState<Zap[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    axios.get(`${BACKEND_URL}/zap`, {
        headers: {
            "Authorization": localStorage.getItem("token")
        }
    })
        .then(res => {
            setZaps(res.data.zaps);
            console.log(res.data.zaps)
            setLoading(false)
        })
}, []);

  return loading?<>Loading</>:(
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="#">
          <Zap className="h-6 w-6 text-blue-600" />
          <span className="ml-2 text-2xl font-bold">Autoverse</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <Button variant="ghost">Dashboard</Button>
          <Button variant="ghost">Explore</Button>
          <Button variant="ghost">Settings</Button>
        </nav>
      </header>
      <main className="flex-1 container mx-auto p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Your Zaps</h1>
          <Button asChild>
            <Link href="/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Zap
            </Link>
          </Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead>Id</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Webhook URL</TableHead>
                <TableHead className="w-[300px]">Go</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {zaps.map((zap) => (
                <TableRow key={zap.id}>
                  <TableCell className="font-medium flex gap-x-1 items-center"><img src={zap.trigger.type.image} className="w-[30px] h-[30px]" /> {zap.actions.map(x => <img src={x.type.image} className="w-[30px] h-[30px]" />)}</TableCell>
                  <TableCell>
                    {zap.id}
                  </TableCell>
                  <TableCell>{Date.now()}</TableCell>
                  <TableCell>{`${HOOKS_URL}/hooks/catch/1/${zap.id}`}</TableCell>
                  <TableCell>
                  <div className="flex-1"><Button onClick={() => {
                    router.push("/zap/" + zap.id)
                }}>Go</Button></div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2024 Autoverse. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}