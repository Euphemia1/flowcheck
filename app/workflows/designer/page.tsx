"use client"

import type React from "react"

import { useState, useCallback, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Workflow,
  Plus,
  Save,
  Play,
  Settings,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  X,
  Copy,
  Trash2,
  ArrowRight,
  ArrowDown,
  Sparkles,
  ChevronLeft,
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface WorkflowNode {
  id: string
  type: "start" | "approval" | "condition" | "notification" | "end"
  name: string
  position: { x: number; y: number }
  data: {
    approvers?: ApproverConfig[]
    conditions?: ConditionConfig[]
    timeout?: number
    escalation?: EscalationConfig
    message?: string
  }
}

interface ApproverConfig {
  type: "role" | "user" | "manager" | "department"
  value: string
  required: boolean
}

interface ConditionConfig {
  field: string
  operator: "equals" | "greater_than" | "less_than" | "contains"
  value: any
}

interface EscalationConfig {
  timeoutHours: number
  escalateTo: ApproverConfig[]
}

interface WorkflowConnection {
  id: string
  source: string
  target: string
  label?: string
}

const NODE_TYPES = [
  {
    type: "approval",
    label: "Approval Step",
    icon: Users,
    color: "bg-blue-50 text-blue-600 border-blue-200 hover:border-blue-400 hover:bg-blue-100/50",
    gradient: "from-blue-500 to-indigo-600"
  },
  {
    type: "condition",
    label: "Condition",
    icon: AlertTriangle,
    color: "bg-amber-50 text-amber-600 border-amber-200 hover:border-amber-400 hover:bg-amber-100/50",
    gradient: "from-amber-400 to-orange-500"
  },
  {
    type: "notification",
    label: "Notification",
    icon: Clock,
    color: "bg-purple-50 text-purple-600 border-purple-200 hover:border-purple-400 hover:bg-purple-100/50",
    gradient: "from-purple-500 to-violet-600"
  },
]

export default function WorkflowDesignerPage() {
  const [workflowName, setWorkflowName] = useState("New Workflow")
  const [workflowDescription, setWorkflowDescription] = useState("")
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    {
      id: "start",
      type: "start",
      name: "Start",
      position: { x: 100, y: 100 },
      data: {},
    },
    {
      id: "end",
      type: "end",
      name: "End",
      position: { x: 100, y: 400 },
      data: {},
    },
  ])
  const [connections, setConnections] = useState<WorkflowConnection[]>([])
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null)
  const [draggedNodeType, setDraggedNodeType] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionStart, setConnectionStart] = useState<string | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  // Load from URL params if available
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const name = params.get("name")
    const desc = params.get("description")
    if (name) setWorkflowName(name)
    if (desc) setWorkflowDescription(desc)
  }, [])

  const addNode = useCallback((type: string, position: { x: number; y: number }) => {
    const newNode: WorkflowNode = {
      id: `${type}-${Date.now()}`,
      type: type as WorkflowNode["type"],
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Step`,
      position,
      data: type === "approval" ? { approvers: [] } : {},
    }
    setNodes((prev) => [...prev, newNode])
    setSelectedNode(newNode)
  }, [])

  const updateNode = useCallback((nodeId: string, updates: Partial<WorkflowNode>) => {
    setNodes((prev) => prev.map((node) => (node.id === nodeId ? { ...node, ...updates } : node)))
  }, [])

  const deleteNode = useCallback((nodeId: string) => {
    if (nodeId === "start" || nodeId === "end") return
    setNodes((prev) => prev.filter((node) => node.id !== nodeId))
    setConnections((prev) => prev.filter((conn) => conn.source !== nodeId && conn.target !== nodeId))
    setSelectedNode(null)
  }, [])

  const handleCanvasDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      if (!draggedNodeType || !canvasRef.current) return

      const rect = canvasRef.current.getBoundingClientRect()
      const position = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }

      addNode(draggedNodeType, position)
      setDraggedNodeType(null)
    },
    [draggedNodeType, addNode],
  )

  const handleNodeClick = useCallback(
    (node: WorkflowNode) => {
      if (isConnecting && connectionStart) {
        // Create connection
        if (connectionStart !== node.id) {
          const newConnection: WorkflowConnection = {
            id: `${connectionStart}-${node.id}`,
            source: connectionStart,
            target: node.id,
          }
          setConnections((prev) => [...prev, newConnection])
        }
        setIsConnecting(false)
        setConnectionStart(null)
      } else {
        setSelectedNode(node)
      }
    },
    [isConnecting, connectionStart],
  )

  const startConnection = useCallback((nodeId: string) => {
    setIsConnecting(true)
    setConnectionStart(nodeId)
  }, [])

  const saveWorkflow = useCallback(() => {
    const workflow = {
      name: workflowName,
      description: workflowDescription,
      nodes,
      connections,
      createdAt: new Date().toISOString(),
    }

    // Save to localStorage for now
    const savedWorkflows = JSON.parse(localStorage.getItem("workflows") || "[]")
    savedWorkflows.push(workflow)
    localStorage.setItem("workflows", JSON.stringify(savedWorkflows))

    alert("Workflow saved successfully!")
  }, [workflowName, workflowDescription, nodes, connections])

  const NodeComponent = ({ node }: { node: WorkflowNode }) => {
    const getNodeStyle = () => {
      switch (node.type) {
        case "start":
          return "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-emerald-100"
        case "end":
          return "bg-rose-50 border-rose-200 text-rose-700 shadow-rose-100"
        case "approval":
          return "bg-blue-50 border-blue-200 text-blue-700 shadow-blue-100"
        case "condition":
          return "bg-amber-50 border-amber-200 text-amber-700 shadow-amber-100"
        case "notification":
          return "bg-purple-50 border-purple-200 text-purple-700 shadow-purple-100"
        default:
          return "bg-slate-50 border-slate-200 text-slate-700 shadow-slate-100"
      }
    }

    const getNodeIcon = () => {
      switch (node.type) {
        case "start":
          return <Play className="w-5 h-5" />
        case "end":
          return <CheckCircle className="w-5 h-5" />
        case "approval":
          return <Users className="w-5 h-5" />
        case "condition":
          return <AlertTriangle className="w-5 h-5" />
        case "notification":
          return <Clock className="w-5 h-5" />
        default:
          return <Settings className="w-5 h-5" />
      }
    }

    return (
      <div
        className={cn(
          "absolute cursor-pointer border-2 rounded-2xl p-4 min-w-[160px] text-center transition-all hover:shadow-xl hover:-translate-y-1 active:scale-95 z-10 bg-white/80 backdrop-blur-sm shadow-lg",
          getNodeStyle(),
          selectedNode?.id === node.id ? "ring-2 ring-indigo-500 ring-offset-2 border-indigo-300" : ""
        )}
        style={{ left: node.position.x, top: node.position.y }}
        onClick={(e) => {
          e.stopPropagation()
          handleNodeClick(node)
        }}
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shadow-md",
            node.type === "start" ? "bg-emerald-500 text-white" :
              node.type === "end" ? "bg-rose-500 text-white" :
                node.type === "approval" ? "bg-blue-500 text-white" :
                  node.type === "condition" ? "bg-amber-500 text-white" :
                    node.type === "notification" ? "bg-purple-500 text-white" : "bg-slate-500 text-white"
          )}>
            {getNodeIcon()}
          </div>
          <span className="text-sm font-bold tracking-tight">{node.name}</span>
        </div>

        {node.type !== "start" && node.type !== "end" && (
          <div className="flex justify-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="outline"
              className="h-8 w-8 rounded-full p-0 bg-white shadow-sm hover:text-indigo-600"
              onClick={(e) => {
                e.stopPropagation()
                startConnection(node.id)
              }}
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 w-8 rounded-full p-0 text-rose-600 bg-white shadow-sm hover:bg-rose-50"
              onClick={(e) => {
                e.stopPropagation()
                deleteNode(node.id)
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Connection points */}
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-slate-200 border-2 border-white rounded-full cursor-crosshair hover:bg-indigo-500 hover:scale-125 transition-all"
          onClick={(e) => {
            e.stopPropagation()
            startConnection(node.id)
          }}
        />
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-slate-200 border-2 border-white rounded-full" />
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-[#fcfcfd] overflow-hidden">
      <DashboardHeader />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Node Palette & Properties */}
        <aside className="w-80 bg-white/80 backdrop-blur-xl border-r border-slate-100 flex flex-col shadow-2xl z-20">
          <div className="p-6 border-b border-slate-50">
            <Link href="/workflows/new" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-6 transition-colors group">
              <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              Back to selection
            </Link>
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-600" />
              Workflow Properties
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-6 space-y-8">
              {/* Node Palette */}
              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Workflow Blocks</h3>
                <div className="grid grid-cols-1 gap-3">
                  {NODE_TYPES.map((nodeType) => {
                    const Icon = nodeType.icon
                    return (
                      <div
                        key={nodeType.type}
                        className={cn(
                          "group p-4 border-2 border-dashed rounded-2xl cursor-grab active:cursor-grabbing transition-all duration-300 flex items-center gap-4",
                          nodeType.color
                        )}
                        draggable
                        onDragStart={() => setDraggedNodeType(nodeType.type)}
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-black/5 bg-gradient-to-br transition-transform group-hover:scale-110",
                          nodeType.gradient
                        )}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 text-left">
                          <span className="text-sm font-bold block">{nodeType.label}</span>
                          <span className="text-[10px] opacity-70">Drag to canvas</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <Separator className="bg-slate-50" />

              {/* Node Properties */}
              {selectedNode ? (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Step Config</h3>
                    <Badge className="bg-indigo-50 text-indigo-600 border-indigo-100 capitalize">{selectedNode.type}</Badge>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="nodeName" className="text-slate-700 font-bold text-xs">Internal Name</Label>
                      <Input
                        id="nodeName"
                        value={selectedNode.name}
                        onChange={(e) => updateNode(selectedNode.id, { name: e.target.value })}
                        className="bg-slate-50 border-slate-100 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all rounded-xl"
                      />
                    </div>

                    {selectedNode.type === "approval" && (
                      <div className="space-y-4">
                        <Label className="text-slate-700 font-bold text-xs">Reviewers</Label>
                        <div className="space-y-3">
                          {selectedNode.data.approvers?.map((approver, index) => (
                            <div key={index} className="flex flex-col gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 animate-in zoom-in-95">
                              <div className="flex items-center justify-between gap-2">
                                <Select
                                  value={approver.type}
                                  onValueChange={(value) => {
                                    const newApprovers = [...(selectedNode.data.approvers || [])]
                                    newApprovers[index] = { ...approver, type: value as any }
                                    updateNode(selectedNode.id, {
                                      data: { ...selectedNode.data, approvers: newApprovers },
                                    })
                                  }}
                                >
                                  <SelectTrigger className="flex-1 h-9 bg-white border-slate-200">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="role">By Role</SelectItem>
                                    <SelectItem value="user">By User</SelectItem>
                                    <SelectItem value="manager">Immediate Manager</SelectItem>
                                    <SelectItem value="department">Head of Dept.</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600 transition-colors"
                                  onClick={() => {
                                    const newApprovers = selectedNode.data.approvers?.filter((_, i) => i !== index) || []
                                    updateNode(selectedNode.id, {
                                      data: { ...selectedNode.data, approvers: newApprovers },
                                    })
                                  }}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                              <Input
                                placeholder="e.g. Finance"
                                value={approver.value}
                                onChange={(e) => {
                                  const newApprovers = [...(selectedNode.data.approvers || [])]
                                  newApprovers[index] = { ...approver, value: e.target.value }
                                  updateNode(selectedNode.id, {
                                    data: { ...selectedNode.data, approvers: newApprovers },
                                  })
                                }}
                                className="h-9 bg-white border-slate-200"
                              />
                            </div>
                          )) || []}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const newApprovers = [
                                ...(selectedNode.data.approvers || []),
                                { type: "role", value: "", required: true },
                              ]
                              updateNode(selectedNode.id, {
                                data: { ...selectedNode.data, approvers: newApprovers },
                              })
                            }}
                            className="w-full h-10 border-dashed border-2 rounded-xl text-indigo-600 border-indigo-100 hover:bg-indigo-50 transition-colors"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Reviewer
                          </Button>
                        </div>
                      </div>
                    )}

                    {selectedNode.type === "condition" && (
                      <div className="space-y-4">
                        <Label className="text-slate-700 font-bold text-xs">Logic Rules</Label>
                        <div className="space-y-3">
                          {selectedNode.data.conditions?.map((condition, index) => (
                            <div key={index} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 animate-in zoom-in-95">
                              <Input
                                placeholder="Field Name"
                                value={condition.field}
                                onChange={(e) => {
                                  const newConditions = [...(selectedNode.data.conditions || [])]
                                  newConditions[index] = { ...condition, field: e.target.value }
                                  updateNode(selectedNode.id, {
                                    data: { ...selectedNode.data, conditions: newConditions },
                                  })
                                }}
                                className="h-9 bg-white border-slate-200"
                              />
                              <div className="flex gap-2">
                                <Select
                                  value={condition.operator}
                                  onValueChange={(value) => {
                                    const newConditions = [...(selectedNode.data.conditions || [])]
                                    newConditions[index] = { ...condition, operator: value as any }
                                    updateNode(selectedNode.id, {
                                      data: { ...selectedNode.data, conditions: newConditions },
                                    })
                                  }}
                                >
                                  <SelectTrigger className="flex-1 h-9 bg-white border-slate-200">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="equals">Equals</SelectItem>
                                    <SelectItem value="greater_than">&gt;</SelectItem>
                                    <SelectItem value="less_than">&lt;</SelectItem>
                                    <SelectItem value="contains">Contains</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Input
                                  placeholder="Value"
                                  value={condition.value}
                                  onChange={(e) => {
                                    const newConditions = [...(selectedNode.data.conditions || [])]
                                    newConditions[index] = { ...condition, value: e.target.value }
                                    updateNode(selectedNode.id, {
                                      data: { ...selectedNode.data, conditions: newConditions },
                                    })
                                  }}
                                  className="h-9 bg-white border-slate-200"
                                />
                              </div>
                            </div>
                          )) || []}
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full h-10 border-dashed border-2 rounded-xl"
                            onClick={() => {
                              const newConditions = [
                                ...(selectedNode.data.conditions || []),
                                { field: "", operator: "equals", value: "" },
                              ]
                              updateNode(selectedNode.id, {
                                data: { ...selectedNode.data, conditions: newConditions },
                              })
                            }}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Rule
                          </Button>
                        </div>
                      </div>
                    )}

                    {selectedNode.type === "notification" && (
                      <div className="space-y-4">
                        <Label className="text-slate-700 font-bold text-xs">Email Message</Label>
                        <Textarea
                          id="message"
                          value={selectedNode.data.message || ""}
                          onChange={(e) =>
                            updateNode(selectedNode.id, {
                              data: { ...selectedNode.data, message: e.target.value },
                            })
                          }
                          rows={6}
                          placeholder="Hey, a new request is waiting for you..."
                          className="bg-slate-50 border-slate-100 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all rounded-xl p-4 resize-none"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 px-6">
                  <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                    <Workflow className="w-8 h-8" />
                  </div>
                  <h4 className="font-black text-slate-900 mb-2">Editor Ready</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Select a step on the canvas to configure its properties or drag a new block to begin.
                  </p>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          {/* Top Bar */}
          <div className="h-20 bg-white/60 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-10 z-10 shrink-0">
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-black text-slate-900">{workflowName}</h1>
                  <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 px-3 h-6">Published</Badge>
                </div>
                <span className="text-xs text-slate-500 font-medium">{nodes.length} Blocks • {connections.length} Connections</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="h-10 px-4 rounded-xl text-slate-600 hover:bg-slate-100 font-bold">
                <Copy className="w-4 h-4 mr-2" />
                Clone
              </Button>
              <Button variant="ghost" size="sm" className="h-10 px-4 rounded-xl text-slate-600 hover:bg-slate-100 font-bold">
                <Play className="w-4 h-4 mr-2" />
                Test Flow
              </Button>
              <Button
                onClick={saveWorkflow}
                className="h-10 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5"
              >
                <Save className="w-4 h-4 mr-2" />
                Deploy
              </Button>
            </div>
          </div>

          {/* Canvas */}
          <div
            ref={canvasRef}
            className="flex-1 relative bg-[#fcfcfd] overflow-auto cursor-grab active:cursor-grabbing"
            onDrop={handleCanvasDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => setSelectedNode(null)}
          >
            {/* Dots Grid Pattern */}
            <div className="absolute inset-0"
              style={{
                backgroundImage: 'radial-gradient(circle, #e2e8f0 1.5px, transparent 1.5px)',
                backgroundSize: '32px 32px'
              }}
            />

            {/* Connection Lines */}
            <svg className="absolute inset-0 pointer-events-none w-full h-full z-0">
              {connections.map((connection) => {
                const sourceNode = nodes.find((n) => n.id === connection.source)
                const targetNode = nodes.find((n) => n.id === connection.target)

                if (!sourceNode || !targetNode) return null

                const startX = sourceNode.position.x + 80
                const startY = sourceNode.position.y + 40
                const endX = targetNode.position.x + 80
                const endY = targetNode.position.y + 40

                // Cubic Bezier curve for smoother lines
                const deltaX = Math.abs(endX - startX)
                const controlPointX = deltaX / 2

                const pathData = `M ${startX} ${startY} C ${startX + controlPointX} ${startY}, ${endX - controlPointX} ${endY}, ${endX} ${endY}`

                return (
                  <g key={connection.id} className="animate-in fade-in duration-500">
                    <path
                      d={pathData}
                      fill="none"
                      stroke="#cbd5e1"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <path
                      d={pathData}
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="3"
                      strokeDasharray="12 12"
                      className="animate-[dash_20s_linear_infinite]"
                      strokeOpacity="0.5"
                    />
                    {/* Arrow head */}
                    <circle cx={endX} cy={endY} r="4" fill="#6366f1" />
                  </g>
                )
              })}
            </svg>

            {/* Nodes */}
            {nodes.map((node) => (
              <NodeComponent key={node.id} node={node} />
            ))}

            {/* Instructions Overlay */}
            {nodes.length === 2 && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <div className="bg-white/80 backdrop-blur-md p-10 rounded-[3rem] shadow-2xl border border-slate-100 max-w-sm animate-in zoom-in-95 duration-1000">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-200 animate-bounce">
                    <Workflow className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Empty Canvas</h3>
                  <p className="text-slate-500 mb-8 leading-relaxed">
                    Drag blocks from the left sidebar to start building your approval flow. Connect them to define the sequence.
                  </p>
                  <div className="flex items-center justify-center gap-3 text-sm font-bold text-indigo-600">
                    <Sparkles className="w-5 h-5" />
                    <span>Pro Tip: Add an approval block first.</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -1000;
          }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #e2e8f0;
        }
      `}</style>
    </div>
  )
}
