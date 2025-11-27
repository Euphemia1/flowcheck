"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
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
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

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
  { type: "approval", label: "Approval Step", icon: Users, color: "bg-blue-100 text-blue-600" },
  { type: "condition", label: "Condition", icon: AlertTriangle, color: "bg-yellow-100 text-yellow-600" },
  { type: "notification", label: "Notification", icon: Clock, color: "bg-green-100 text-green-600" },
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

  const addNode = useCallback((type: string, position: { x: number; y: number }) => {
    const newNode: WorkflowNode = {
      id: `${type}-${Date.now()}`,
      type: type as WorkflowNode["type"],
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Step`,
      position,
      data: type === "approval" ? { approvers: [] } : {},
    }
    setNodes((prev) => [...prev, newNode])
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
          return "bg-green-100 border-green-300 text-green-700"
        case "end":
          return "bg-red-100 border-red-300 text-red-700"
        case "approval":
          return "bg-blue-100 border-blue-300 text-blue-700"
        case "condition":
          return "bg-yellow-100 border-yellow-300 text-yellow-700"
        case "notification":
          return "bg-purple-100 border-purple-300 text-purple-700"
        default:
          return "bg-gray-100 border-gray-300 text-gray-700"
      }
    }

    const getNodeIcon = () => {
      switch (node.type) {
        case "start":
          return <Play className="w-4 h-4" />
        case "end":
          return <CheckCircle className="w-4 h-4" />
        case "approval":
          return <Users className="w-4 h-4" />
        case "condition":
          return <AlertTriangle className="w-4 h-4" />
        case "notification":
          return <Clock className="w-4 h-4" />
        default:
          return <Settings className="w-4 h-4" />
      }
    }

    return (
      <div
        className={`absolute cursor-pointer border-2 rounded-lg p-3 min-w-32 text-center transition-all hover:shadow-md ${getNodeStyle()} ${
          selectedNode?.id === node.id ? "ring-2 ring-blue-500" : ""
        }`}
        style={{ left: node.position.x, top: node.position.y }}
        onClick={() => handleNodeClick(node)}
        onDoubleClick={() => setSelectedNode(node)}
      >
        <div className="flex items-center justify-center gap-2 mb-1">
          {getNodeIcon()}
          <span className="text-sm font-medium">{node.name}</span>
        </div>

        {node.type !== "start" && node.type !== "end" && (
          <div className="flex justify-center gap-1 mt-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation()
                startConnection(node.id)
              }}
            >
              <ArrowRight className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 text-red-600"
              onClick={(e) => {
                e.stopPropagation()
                deleteNode(node.id)
              }}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar - Node Palette */}
        <div className="w-80 bg-white border-r p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Workflow Info */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Workflow Details</h2>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="workflowName">Name</Label>
                  <Input id="workflowName" value={workflowName} onChange={(e) => setWorkflowName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="workflowDescription">Description</Label>
                  <Textarea
                    id="workflowDescription"
                    value={workflowDescription}
                    onChange={(e) => setWorkflowDescription(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Node Palette */}
            <div>
              <h3 className="font-medium mb-3">Workflow Steps</h3>
              <div className="space-y-2">
                {NODE_TYPES.map((nodeType) => {
                  const Icon = nodeType.icon
                  return (
                    <div
                      key={nodeType.type}
                      className={`p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-grab hover:border-blue-400 transition-colors ${nodeType.color}`}
                      draggable
                      onDragStart={() => setDraggedNodeType(nodeType.type)}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{nodeType.label}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
              <p className="text-xs text-gray-500 mt-2">Drag and drop steps onto the canvas to build your workflow</p>
            </div>

            <Separator />

            {/* Node Properties */}
            {selectedNode && (
              <div>
                <h3 className="font-medium mb-3">Step Properties</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="nodeName">Step Name</Label>
                    <Input
                      id="nodeName"
                      value={selectedNode.name}
                      onChange={(e) => updateNode(selectedNode.id, { name: e.target.value })}
                    />
                  </div>

                  {selectedNode.type === "approval" && (
                    <div className="space-y-3">
                      <Label>Approvers</Label>
                      <div className="space-y-2">
                        {selectedNode.data.approvers?.map((approver, index) => (
                          <div key={index} className="flex gap-2">
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
                              <SelectTrigger className="flex-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="role">Role</SelectItem>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                                <SelectItem value="department">Department</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input
                              placeholder="Value"
                              value={approver.value}
                              onChange={(e) => {
                                const newApprovers = [...(selectedNode.data.approvers || [])]
                                newApprovers[index] = { ...approver, value: e.target.value }
                                updateNode(selectedNode.id, {
                                  data: { ...selectedNode.data, approvers: newApprovers },
                                })
                              }}
                              className="flex-1"
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                const newApprovers = selectedNode.data.approvers?.filter((_, i) => i !== index) || []
                                updateNode(selectedNode.id, {
                                  data: { ...selectedNode.data, approvers: newApprovers },
                                })
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
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
                          className="w-full"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Approver
                        </Button>
                      </div>

                      <div>
                        <Label htmlFor="timeout">Timeout (hours)</Label>
                        <Input
                          id="timeout"
                          type="number"
                          value={selectedNode.data.timeout || ""}
                          onChange={(e) =>
                            updateNode(selectedNode.id, {
                              data: { ...selectedNode.data, timeout: Number.parseInt(e.target.value) || undefined },
                            })
                          }
                        />
                      </div>
                    </div>
                  )}

                  {selectedNode.type === "condition" && (
                    <div className="space-y-3">
                      <Label>Conditions</Label>
                      <div className="space-y-2">
                        {selectedNode.data.conditions?.map((condition, index) => (
                          <div key={index} className="grid grid-cols-3 gap-2">
                            <Input
                              placeholder="Field"
                              value={condition.field}
                              onChange={(e) => {
                                const newConditions = [...(selectedNode.data.conditions || [])]
                                newConditions[index] = { ...condition, field: e.target.value }
                                updateNode(selectedNode.id, {
                                  data: { ...selectedNode.data, conditions: newConditions },
                                })
                              }}
                            />
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
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="equals">Equals</SelectItem>
                                <SelectItem value="greater_than">Greater Than</SelectItem>
                                <SelectItem value="less_than">Less Than</SelectItem>
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
                            />
                          </div>
                        )) || []}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const newConditions = [
                              ...(selectedNode.data.conditions || []),
                              { field: "", operator: "equals", value: "" },
                            ]
                            updateNode(selectedNode.id, {
                              data: { ...selectedNode.data, conditions: newConditions },
                            })
                          }}
                          className="w-full"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Condition
                        </Button>
                      </div>
                    </div>
                  )}

                  {selectedNode.type === "notification" && (
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        value={selectedNode.data.message || ""}
                        onChange={(e) =>
                          updateNode(selectedNode.id, {
                            data: { ...selectedNode.data, message: e.target.value },
                          })
                        }
                        rows={3}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="bg-white border-b p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold">{workflowName}</h1>
              <Badge variant="secondary">Draft</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </Button>
              <Button variant="outline" size="sm">
                <Play className="w-4 h-4 mr-2" />
                Test
              </Button>
              <Button onClick={saveWorkflow} size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>

          {/* Canvas */}
          <div
            ref={canvasRef}
            className="flex-1 relative bg-gray-50 overflow-auto"
            onDrop={handleCanvasDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => setSelectedNode(null)}
          >
            {/* Grid Background */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                  linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                `,
                backgroundSize: "20px 20px",
              }}
            />

            {/* Connections */}
            <svg className="absolute inset-0 pointer-events-none">
              {connections.map((connection) => {
                const sourceNode = nodes.find((n) => n.id === connection.source)
                const targetNode = nodes.find((n) => n.id === connection.target)

                if (!sourceNode || !targetNode) return null

                const startX = sourceNode.position.x + 64
                const startY = sourceNode.position.y + 40
                const endX = targetNode.position.x + 64
                const endY = targetNode.position.y + 40

                return (
                  <g key={connection.id}>
                    <line
                      x1={startX}
                      y1={startY}
                      x2={endX}
                      y2={endY}
                      stroke="#6b7280"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                  </g>
                )
              })}
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
                </marker>
              </defs>
            </svg>

            {/* Nodes */}
            {nodes.map((node) => (
              <NodeComponent key={node.id} node={node} />
            ))}

            {/* Instructions */}
            {nodes.length === 2 && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-dashed border-gray-300">
                  <Workflow className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Build Your Workflow</h3>
                  <p className="text-gray-600 mb-4">
                    Drag workflow steps from the sidebar to create your approval process
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <ArrowDown className="w-4 h-4" />
                    <span>Start by adding an approval step</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
