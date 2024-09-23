"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from "axios"
import { PlusCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { BACKEND_URL } from "../config"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function Component() {
    const [availableActions, setAvailableActions] = useState<{
        id: string;
        name: string;
    }[]>([]);
    const [availableTriggers, setAvailableTriggers] = useState<{ id: string; name: string; image: string; }[]>([]);
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/trigger/available`)
            .then(x => setAvailableTriggers(x.data.availableTriggers))

        axios.get(`${BACKEND_URL}/action/available`)
            .then(x => setAvailableActions(x.data.availableActions))
        
        setLoading(false);
    }, [])

    const [selectedTrigger, setSelectedTrigger] = useState<{
        id: string;
        name: string;
    }>();

    const [selectedActions, setSelectedActions] = useState<{
        index: number;
        availableActionId: string;
        availableActionName: string;
        metadata: any;
    }[]>([]);
  return loading?<>Loading</>:(
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Create a New Zap</h1>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Trigger</CardTitle>
          </CardHeader>
          <CardContent>
            <Select onValueChange={(e)=>{
                setSelectedTrigger(availableTriggers.find(x => x.name === e));
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select a trigger" />
              </SelectTrigger>
              <SelectContent>
                {availableTriggers.map((trigger:any) => (
                    <SelectItem className="flex gap-x-1 items-center" key={trigger.id} value={trigger.name}>
                        <Image alt={trigger.name} src={trigger.image} width={20} height={20} />
                        <div>{trigger.name}</div></SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        {selectedActions.map((action, index) => (
            <Card key={index}>
                <CardHeader>
                    <CardTitle>Action {index + 1}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Select onValueChange={(e) => setSelectedActions(a=>{
                        const newActions = [...a];
                        newActions[index].availableActionId = availableActions.find(x => x.name === e)?.id || "";
                        newActions[index].availableActionName =e;
                        return newActions;
                    })}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select an action" />
                        </SelectTrigger>
                        <SelectContent>
                        {availableActions.map((action:any) => (
                    <SelectItem className="flex gap-x-1 items-center" key={action.id} value={action.name}>
                        <Image alt={action.name} src={action.image} width={20} height={20} />
                        <div>{action.name}</div></SelectItem>
                ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>
        ))}
        <Button className="w-full" onClick={() => {
                        setSelectedActions(a => [...a, {
                            index: a.length + 2,
                            availableActionId: "",
                            availableActionName: "",
                            metadata: {}
                        }])
                    }}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Another Action
        </Button>
        <div className="space-y-2">
          <Label htmlFor="zap-name">Zap Name</Label>
          <Input id="zap-name" placeholder="Enter a name for your Zap" />
        </div>
        <Button className="w-full" onClick={async () => {
                console.log(selectedTrigger);
                console.log(selectedActions);
                if (!selectedTrigger?.id) {
                    alert("Please select a trigger");
                    return;
                }

                const response = await axios.post(`${BACKEND_URL}/zap`, {
                    "availableTriggersId": selectedTrigger.id,
                    "triggerMetadata": {},
                    "actions": selectedActions.map(a => ({
                        availableActionId: a.availableActionId,
                        metadata: a.metadata
                    }))
                }, {
                    headers: {
                        Authorization: localStorage.getItem("token")
                    }
                })
                
                router.push("/dashboard");

            }}>Create Zap</Button>
      </div>
    </div>
  )
}