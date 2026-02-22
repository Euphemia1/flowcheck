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
    color: "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-100",
  },
  {
    type: "condition",
    label: "Condition",
    icon: AlertTriangle,
    color: "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-100",
  },
  {
    type: "notification",
    label: "Notification",
    icon: Clock,
    color: "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-100",
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
          return "bg-gray-50 border-gray-200 text-gray-700"
        case "end":
          return "bg-gray-50 border-gray-200 text-gray-700"
        case "approval":
          return "bg-white border-gray-200 text-gray-700"
        case "condition":
          return "bg-white border-gray-200 text-gray-700"
        case "notification":
          return "bg-white border-gray-200 text-gray-700"
        default:
          return "bg-white border-gray-200 text-gray-700"
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
          "absolute cursor-pointer border-2 rounded-xl p-4 min-w-[140px] text-center transition-all hover:shadow-md z-10 bg-white",
          getNodeStyle(),
          selectedNode?.id === node.id ? "ring-2 ring-gray-400 ring-offset-2 border-gray-400" : ""
        )}
        style={{ left: node.position.x, top: node.position.y }}
        onClick={(e) => {
          e.stopPropagation()
          handleNodeClick(node)
        }}
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
            {getNodeIcon()}
          </div>
          <span className="text-sm font-medium">{node.name}</span>
        </div>

        {node.type !== "start" && node.type !== "end" && (
          <div className="flex justify-center gap-2 mt-3">
            <Button
              size="sm"
              variant="outline"
              className="h-8 w-8 rounded-full p-0 bg-white hover:text-gray-900"
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
              className="h-8 w-8 rounded-full p-0 text-gray-600 bg-white hover:bg-gray-50"
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
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-200 border-2 border-white rounded-full cursor-crosshair hover:bg-gray-400 transition-all"
          onClick={(e) => {
            e.stopPropagation()
            startConnection(node.id)
          }}
        />
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-200 border-2 border-white rounded-full" />
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <DashboardHeader />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Node Palette & Properties */}
        <aside className="w-80 bg-white border-r border-gray-200 flex flex-col z-20">
          <div className="p-6 border-b border-gray-100">
            <Link href="/workflows/new" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors group">
              <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              Back to selection
            </Link>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Settings className="w-5 h-5 text-gray-600" />
              Workflow Properties
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-8">
              {/* Node Palette */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Workflow Blocks</h3>
                <div className="grid grid-cols-1 gap-3">
                  {NODE_TYPES.map((nodeType) => {
                    const Icon = nodeType.icon
                    return (
                      <div
                        key={nodeType.type}
                        className={cn(
                          "group p-4 border-2 border-dashed rounded-xl cursor-grab active:cursor-grabbing transition-all flex items-center gap-4",
                          nodeType.color
                        )}
                        draggable
                        onDragStart={() => setDraggedNodeType(nodeType.type)}
                      >
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 text-left">
                          <span className="text-sm font-medium block">{nodeType.label}</span>
                          <span className="text-xs text-gray-400">Drag to canvas</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <Separator className="bg-gray-100" />

              {/* Node Properties */}
              {selectedNode ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Step Config</h3>
                    <Badge variant="outline" className="capitalize">{selectedNode.type}</Badge>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="nodeName" className="text-gray-700 text-xs">Internal Name</Label>
                      <Input
                        id="nodeName"
                        value={selectedNode.name}
                        onChange={(e) => updateNode(selectedNode.id, { name: e.target.value })}
                        className="bg-gray-50 border-gray-200 focus:bg-white rounded-lg"
                      />
                    </div>

                    {selectedNode.type === "approval" && (
                      <div className="space-y-4">
                        <Label className="text-gray-700 text-xs">Reviewers</Label>
                        <div className="space-y-3">
                          {selectedNode.data.approvers?.map((approver, index) => (
                            <div key={index} className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
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
                                  <SelectTrigger className="flex-1 h-9 bg-white border-gray-200">
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
                                  className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
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
                                className="h-9 bg-white border-gray-200"
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
                            className="w-full h-10 border-dashed rounded-lg hover:bg-gray-50"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Reviewer
                          </Button>
                        </div>
                      </div>
                    )}

                    {selectedNode.type === "condition" && (
                      <div className="space-y-4">
                        <Label className="text-gray-700 text-xs">Logic Rules</Label>
                        <div className="space-y-3">
                          {selectedNode.data.conditions?.map((condition, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-100 space-y-2">
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
                                className="h-9 bg-white border-gray-200"
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
                                  <SelectTrigger className="flex-1 h-9 bg-white border-gray-200">
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
                                  className="h-9 bg-white border-gray-200"
                                />
                              </div>
                            </div>
                          )) || []}
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full h-10 border-dashed rounded-lg"
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
                        <Label className="text-gray-700 text-xs">Email Message</Label>
                        <Textarea
                          id="message"
                          value={selectedNode.data.message || ""}
                          onChange={(e) =>
                            updateNode(selectedNode.id, {
                              data: { ...selectedNode.data, message: e.target.value },
                            })
                          }
                          rows={6}
                          placeholder="Enter notification message..."
                          className="bg-gray-50 border-gray-200 focus:bg-white rounded-lg p-4 resize-none"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 px-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6 text-gray-400">
                    <Workflow className="w-8 h-8" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Editor Ready</h4>
                  <p className="text-sm text-gray-500">
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
          <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10 shrink-0">
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <h1 className="text-lg font-semibold text-gray-900">{workflowName}</h1>
                  <Badge variant="secondary" className="px-2 h-5 text-xs">Draft</Badge>
                </div>
                <span className="text-xs text-gray-500">{nodes.length} Blocks • {connections.length} Connections</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-9 px-3 text-gray-600 hover:bg-gray-100">
                <Copy className="w-4 h-4 mr-2" />
                Clone
              </Button>
              <Button variant="ghost" size="sm" className="h-9 px-3 text-gray-600 hover:bg-gray-100">
                <Play className="w-4 h-4 mr-2" />
                Test
              </Button>
              <Button
                onClick={saveWorkflow}
                className="h-9 px-4 text-sm"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>

          {/* Canvas */}
          <div
            ref={canvasRef}
            className="flex-1 relative bg-gray-50 overflow-auto cursor-grab active:cursor-grabbing"
            onDrop={handleCanvasDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => setSelectedNode(null)}
          >
            {/* Grid Pattern */}
            <div className="absolute inset-0"
              style={{
                backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            />

            {/* Connection Lines */}
            <svg className="absolute inset-0 pointer-events-none w-full h-full z-0">
              {connections.map((connection) => {
                const sourceNode = nodes.find((n) => n.id === connection.source)
                const targetNode = nodes.find((n) => n.id === connection.target)

                if (!sourceNode || !targetNode) return null

                const startX = sourceNode.position.x + 70
                const startY = sourceNode.position.y + 35
                const endX = targetNode.position.x + 70
                const endY = targetNode.position.y + 35

                const deltaX = Math.abs(endX - startX)
                const controlPointX = deltaX / 2

                const pathData = `M ${startX} ${startY} C ${startX + controlPointX} ${startY}, ${endX - controlPointX} ${endY}, ${endX} ${endY}`

                return (
                  <g key={connection.id}>
                    <path
                      d={pathData}
                      fill="none"
                      stroke="#d1d5db"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
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
                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 max-w-sm">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Workflow className="w-6 h-6 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Empty Canvas</h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Drag blocks from the left sidebar to start building your approval flow.
                  </p>
                  <p className="text-xs text-gray-400">
                    Connect them to define the sequence.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
