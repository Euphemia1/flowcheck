import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Users, Workflow, BarChart3, Shield, Clock, ArrowRight, Star, Zap, Lock, MessageSquare, FileText, Calendar, DollarSign, ChevronRight, PlayCircle, Check, Layers, TrendingUp, UserCheck, Bell } from "lucide-react"
import Link from "next/link"
import { motion, useScroll, useTransform, useInView } from "framer-motion"

export default function HomePage() {
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 300], [0, -50])
  
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Header */}
      <motion.header 
        className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div 
              className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <Workflow className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-xl font-bold"><span className="text-blue-600">Flow</span><span className="text-gray-900">Check</span></span>
          </motion.div>
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link href="/demo">
              <Button variant="ghost">Book a Demo</Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Start Free Trial</Button>
            </Link>
          </motion.div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 lg:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              style={{ y: heroY }}
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.div 
                className="mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Free 14-Day Trial • No Credit Card Required</Badge>
              </motion.div>
              <motion.h1 
                className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                Approval Bottlenecks Are Slowing Your Team Down.
              </motion.h1>
              <motion.h2 
                className="text-2xl lg:text-3xl font-bold text-blue-600 mb-6 leading-tight"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                FlowCheck Automates Every Approval — So Work Keeps Moving.
              </motion.h2>
              <motion.p 
                className="text-xl text-gray-600 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                Stop chasing emails. Stop losing requests.
                Create structured workflows for leave, expenses, purchasing, and internal approvals — all in one system.
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 mb-8"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
              >
                <Link href="/auth/register">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" className="px-8 w-full sm:w-auto">
                      Start Free Trial <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/demo">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" size="lg" className="px-8 w-full sm:w-auto">
                      <PlayCircle className="mr-2 w-4 h-4" /> Book a Demo
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
              <motion.p 
                className="text-gray-600 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.6 }}
              >
                Move faster. Stay organized. Scale without chaos.
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row items-center gap-6 text-sm text-gray-600"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.8 }}
              >
                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.1 }}
                >
                  <Check className="w-4 h-4 text-green-600" /> No contracts
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.1 }}
                >
                  <Check className="w-4 h-4 text-green-600" /> Cancel anytime
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.1 }}
                >
                  <Check className="w-4 h-4 text-green-600" /> Your data stays yours
                </motion.div>
              </motion.div>
            </motion.div>
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <motion.div 
                className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 border border-blue-100"
                whileHover={{ scale: 1.02, rotateY: 5 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div 
                  className="bg-white rounded-xl shadow-lg p-6 space-y-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                >
                  <div className="flex items-center justify-between pb-4 border-b">
                    <div>
                      <h3 className="font-semibold text-gray-900">Leave Request</h3>
                      <p className="text-sm text-gray-500">From: Sarah Johnson</p>
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>
                    </motion.div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-600">SJ</div>
                    <div className="flex-1">
                      <div className="h-2 bg-gray-100 rounded-full">
                        <motion.div 
                          className="h-2 bg-blue-600 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "33.33%" }}
                          transition={{ duration: 2, delay: 2 }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Step 1 of 3: Manager Review</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button size="sm" variant="outline" className="flex-1">Reject</Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button size="sm" className="flex-1">Approve</Button>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Problem Section */}
      <motion.section 
        className="container mx-auto px-4 py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.div 
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">As Your Team Grows, So Does the Chaos</h2>
          <p className="text-xl text-gray-600">What worked when you had 5 people breaks at 25… and completely fails at 100.</p>
        </motion.div>
        <motion.div 
          className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto mb-12"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {[
            { icon: MessageSquare, bgColor: "bg-red-50", borderColor: "border-red-100", iconBg: "bg-red-100", iconColor: "text-red-600", title: "Endless Email Chains", desc: "Requests buried in threads, no visibility" },
            { icon: Clock, bgColor: "bg-orange-50", borderColor: "border-orange-100", iconBg: "bg-orange-100", iconColor: "text-orange-600", title: "Slack/WhatsApp Buried", desc: "Messages getting lost in constant chat" },
            { icon: FileText, bgColor: "bg-yellow-50", borderColor: "border-yellow-100", iconBg: "bg-yellow-100", iconColor: "text-yellow-600", title: "Manual Spreadsheets", desc: "Version chaos, manual updates, errors" },
            { icon: Users, bgColor: "bg-blue-50", borderColor: "border-blue-100", iconBg: "bg-blue-100", iconColor: "text-blue-600", title: "Verbal Approvals", desc: "No tracking, no proof, confusion" },
            { icon: Shield, bgColor: "bg-purple-50", borderColor: "border-purple-100", iconBg: "bg-purple-100", iconColor: "text-purple-600", title: "No Visibility", desc: "No idea where requests stand" }
          ].map((item, index) => (
            <motion.div
              key={index}
              className={`text-center p-6 ${item.bgColor} rounded-xl border ${item.borderColor}`}
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <motion.div 
                className={`w-12 h-12 ${item.iconBg} rounded-lg flex items-center justify-center mx-auto mb-4`}
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <item.icon className={`w-6 h-6 ${item.iconColor}`} />
              </motion.div>
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
        <motion.div 
          className="text-center max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          viewport={{ once: true }}
        >
          <p className="text-lg text-gray-700 font-medium mb-2">Delays increase. Accountability drops. Operations slow down.</p>
          <motion.p 
            className="text-xl"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <span className="font-bold text-blue-600">Flow</span><span className="font-bold text-gray-900">Check</span> brings structured workflows to growing teams.
          </motion.p>
        </motion.div>
      </motion.section>



      {/* Emotional Bridge */}
      <motion.section 
        className="bg-gradient-to-br from-blue-50 to-indigo-50 py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">Imagine This Instead</h2>
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              {[
                { icon: Workflow, color: "blue", title: "Every request follows a clear path", desc: "No more confusion, no more lost items" },
                { icon: CheckCircle, color: "green", title: "Managers approve in one click", desc: "Fast, informed decisions" },
                { icon: BarChart3, color: "purple", title: "Finance sees everything instantly", desc: "Complete visibility, no surprises" },
                { icon: TrendingUp, color: "orange", title: "Nothing gets lost. Nothing gets delayed.", desc: "Work keeps moving forward" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1, y: -10 }}
                >
                  <motion.div 
                    className={`w-16 h-16 bg-${item.color}-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4`}
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                  >
                    <item.icon className="w-8 h-8" />
                  </motion.div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
            <motion.div 
              className="bg-white rounded-2xl p-8 shadow-lg"
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <p className="text-xl text-gray-700 font-medium">That's what structured approvals look like.</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Solution Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">One Central Hub for All Your Approvals</h2>
            <p className="text-xl text-gray-400">FlowCheck replaces scattered approvals with a clear, automated system.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            <div className="flex items-start gap-4 p-6 bg-gray-800 rounded-xl">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Leave & Time-Off Requests</h3>
                <p className="text-gray-400 text-sm">Streamlined PTO, sick leave, and vacation approvals</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-gray-800 rounded-xl">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center shrink-0">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Expense Approvals</h3>
                <p className="text-gray-400 text-sm">Receipts, reimbursements, spending controls</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-gray-800 rounded-xl">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Purchase Requests</h3>
                <p className="text-gray-400 text-sm">Procurement, vendor approvals, PO workflow</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-gray-800 rounded-xl">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center shrink-0">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Budget Approvals</h3>
                <p className="text-gray-400 text-sm">Department budgets, project spend, forecasts</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-gray-800 rounded-xl">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center shrink-0">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Document Sign-Off</h3>
                <p className="text-gray-400 text-sm">Contracts, policies, compliance approvals</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-gray-800 rounded-xl">
              <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center shrink-0">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Custom Workflows</h3>
                <p className="text-gray-400 text-sm">Any internal process your team needs</p>
              </div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-xl text-gray-300">Everything is submitted, tracked, approved, and recorded in one place.</p>
            <p className="text-lg text-blue-400 mt-2">No more guessing. No more lost requests.</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Powerful Workflow Automation — Made Simple</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Everything you need to streamline approvals</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Workflow className="w-10 h-10 text-blue-600 mb-4" />
              <CardTitle className="text-xl">Custom Workflow Builder</CardTitle>
              <CardDescription className="text-base">
                Design approval flows that match your team's structure. Add multiple approval levels, conditions, and roles — no coding required.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <UserCheck className="w-10 h-10 text-green-600 mb-4" />
              <CardTitle className="text-xl">Role-Based Access Control</CardTitle>
              <CardDescription className="text-base">
                Assign managers, finance leads, and department heads with clear approval authority.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <BarChart3 className="w-10 h-10 text-orange-600 mb-4" />
              <CardTitle className="text-xl">Real-Time Tracking Dashboard</CardTitle>
              <CardDescription className="text-base">
                See every request's status instantly — pending, approved, rejected, or escalated.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Bell className="w-10 h-10 text-purple-600 mb-4" />
              <CardTitle className="text-xl">Smart Notifications & Reminders</CardTitle>
              <CardDescription className="text-base">
                Automatic alerts ensure approvals don't get stuck. Escalate to managers when needed.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Shield className="w-10 h-10 text-red-600 mb-4" />
              <CardTitle className="text-xl">Complete Audit Trails</CardTitle>
              <CardDescription className="text-base">
                Every action is logged, timestamped, and recorded for transparency and accountability.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <TrendingUp className="w-10 h-10 text-teal-600 mb-4" />
              <CardTitle className="text-xl">Analytics & Insights</CardTitle>
              <CardDescription className="text-base">
                Track approval times, identify bottlenecks, and improve operational efficiency.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Get Up and Running in Minutes</h2>
            <p className="text-xl text-gray-600">No complex onboarding. No technical team required.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="relative">
              <div className="bg-white rounded-xl p-8 shadow-lg text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6">1</div>
                <h3 className="text-xl font-semibold mb-3">Create Your Workflow</h3>
                <p className="text-gray-600">Set up approval steps tailored to your team structure.</p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-xl p-8 shadow-lg text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6">2</div>
                <h3 className="text-xl font-semibold mb-3">Assign Approvers</h3>
                <p className="text-gray-600">Define who reviews and approves each request type.</p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-xl p-8 shadow-lg text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6">3</div>
                <h3 className="text-xl font-semibold mb-3">Submit & Track</h3>
                <p className="text-gray-600">Team members submit requests. Approvers get notified.</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6">4</div>
              <h3 className="text-xl font-semibold mb-3">Monitor & Optimize</h3>
              <p className="text-gray-600">Use insights to reduce delays and improve turnaround.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Designed for Growing Teams That Need Structure</h2>
            <p className="text-xl text-gray-600">FlowCheck is ideal for:</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="p-6 bg-blue-50 rounded-xl text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Operations Teams</h4>
              <p className="text-sm text-gray-600">Streamline internal processes and approvals</p>
            </div>
            <div className="p-6 bg-green-50 rounded-xl text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">HR Departments</h4>
              <p className="text-sm text-gray-600">Manage leave, hiring, and policy approvals</p>
            </div>
            <div className="p-6 bg-purple-50 rounded-xl text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Finance Teams</h4>
              <p className="text-sm text-gray-600">Control expenses, budgets, and purchasing</p>
            </div>
            <div className="p-6 bg-orange-50 rounded-xl text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Layers className="w-6 h-6 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Department Managers</h4>
              <p className="text-sm text-gray-600">Oversee team requests and approvals</p>
            </div>
          </div>
          <div className="bg-gray-900 text-white p-8 rounded-xl text-center">
            <h3 className="text-xl font-bold mb-2">Scaling Companies Adding New Layers of Management</h3>
            <p className="text-gray-400">If your team handles recurring approvals, FlowCheck brings clarity and control.</p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Growing Teams Choose FlowCheck</h2>
            <p className="text-xl text-gray-600">When approvals move faster, your entire organization moves faster.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
              <CheckCircle className="w-6 h-6 text-green-600 shrink-0" />
              <span className="text-gray-700">Approvals completed in hours instead of days</span>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
              <CheckCircle className="w-6 h-6 text-green-600 shrink-0" />
              <span className="text-gray-700">Managers stop chasing follow-ups</span>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
              <CheckCircle className="w-6 h-6 text-green-600 shrink-0" />
              <span className="text-gray-700">Finance gains full visibility</span>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
              <CheckCircle className="w-6 h-6 text-green-600 shrink-0" />
              <span className="text-gray-700">Teams operate with clear accountability</span>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
              <CheckCircle className="w-6 h-6 text-green-600 shrink-0" />
              <span className="text-gray-700">Structured processes as you scale</span>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
              <CheckCircle className="w-6 h-6 text-green-600 shrink-0" />
              <span className="text-gray-700">Less manual follow-up and chasing</span>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Control */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">Secure, Controlled, and Scalable</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="p-6 bg-blue-50 rounded-xl">
              <Lock className="w-10 h-10 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Role-Based Access</h3>
              <p className="text-gray-600 text-sm">Granular permissions ensure only authorized users can approve</p>
            </div>
            <div className="p-6 bg-green-50 rounded-xl">
              <Shield className="w-10 h-10 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Secure Data Handling</h3>
              <p className="text-gray-600 text-sm">Bank-level encryption protects sensitive approval data</p>
            </div>
            <div className="p-6 bg-purple-50 rounded-xl">
              <FileText className="w-10 h-10 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Full Action History</h3>
              <p className="text-gray-600 text-sm">Complete audit logs for compliance and accountability</p>
            </div>
          </div>
          <p className="text-gray-600">Your processes remain organized and protected as you expand.</p>
        </div>
      </section>

      {/* Scalability Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-8">Built to Scale With You</h2>
            <p className="text-xl text-blue-100 mb-12">As your team grows, FlowCheck grows with you:</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-blue-700 rounded-xl">
                <Users className="w-8 h-8 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Add New Departments</h3>
                <p className="text-blue-200 text-sm">Easily onboard new teams</p>
              </div>
              <div className="p-6 bg-blue-700 rounded-xl">
                <Layers className="w-8 h-8 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">More Approval Layers</h3>
                <p className="text-blue-200 text-sm">Complex hierarchies supported</p>
              </div>
              <div className="p-6 bg-blue-700 rounded-xl">
                <Workflow className="w-8 h-8 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">New Workflow Types</h3>
                <p className="text-blue-200 text-sm">Unlimited custom processes</p>
              </div>
              <div className="p-6 bg-blue-700 rounded-xl">
                <TrendingUp className="w-8 h-8 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Higher Volumes</h3>
                <p className="text-blue-200 text-sm">Handle thousands of requests</p>
              </div>
            </div>
            <p className="text-xl mt-12 text-blue-100">FlowCheck grows with your organization — without adding complexity.</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">Flexible plans designed for growing teams of different sizes. Upgrade anytime as your needs grow.</p>
          <div className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-semibold border border-green-100">
            <Zap className="w-4 h-4 mr-2" /> Save 20% with annual billing
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Starter Plan */}
          <Card className="border-2 border-gray-200 hover:border-blue-300 transition-colors">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl font-bold text-gray-900">Starter</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">$29</span>
                <span className="text-gray-600">/month</span>
              </div>
              <CardDescription className="mt-2">Perfect for small teams replacing email approvals</CardDescription>
            </CardHeader>
            <div className="px-6 pb-6">
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Up to 5 users</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">3 custom workflows</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Basic reporting</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Email notifications</span>
                </li>
              </ul>
              <Link href="/auth/register?plan=starter">
                <Button className="w-full" variant="outline">
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </Card>

          {/* Growth Plan */}
          <Card className="border-2 border-blue-500 hover:border-blue-600 transition-colors relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
            </div>
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl font-bold text-gray-900">Growth</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">$79</span>
                <span className="text-gray-600">/month</span>
              </div>
              <CardDescription className="mt-2">⭐ Best for teams scaling past 10 people</CardDescription>
            </CardHeader>
            <div className="px-6 pb-6">
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Up to 25 users</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Unlimited workflows</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Advanced analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Priority support</span>
                </li>
              </ul>
              <Link href="/auth/register?plan=growth">
                <Button className="w-full">Start Free Trial</Button>
              </Link>
            </div>
          </Card>

          {/* Enterprise Plan */}
          <Card className="border-2 border-gray-200 hover:border-purple-300 transition-colors">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl font-bold text-gray-900">Enterprise</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">$199</span>
                <span className="text-gray-600">/month</span>
              </div>
              <CardDescription className="mt-2">For organizations with complex hierarchies & compliance needs</CardDescription>
            </CardHeader>
            <div className="px-6 pb-6">
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Unlimited users</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">SSO integration</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Dedicated support</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Custom development</span>
                </li>
              </ul>
              <Link href="/demo?plan=enterprise">
                <Button className="w-full" variant="outline">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know about FlowCheck</p>
          </div>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">How long does setup take?</h3>
              <p className="text-gray-600">Most teams are up and running in under 30 minutes. No technical skills required.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Do we need technical skills?</h3>
              <p className="text-gray-600">No. FlowCheck is designed for operations teams, not developers. If you can use email, you can use FlowCheck.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Can we customize workflows?</h3>
              <p className="text-gray-600">Yes. Create unlimited custom workflows for any approval process your team needs.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Is our data secure?</h3>
              <p className="text-gray-600">Absolutely. Bank-level encryption, role-based access, and complete audit trails keep your data safe.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Can we upgrade later?</h3>
              <p className="text-gray-600">Yes. Upgrade or downgrade anytime. Changes take effect immediately.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Do you integrate with other tools?</h3>
              <p className="text-gray-600">FlowCheck integrates with Slack, Microsoft Teams, and email. More integrations coming soon.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Bring Structure to Your Approvals?</h2>
          <p className="text-xl text-gray-400 mb-4">
            Stop relying on email chains and manual processes.
          </p>
          <p className="text-lg text-blue-400 mb-8">
            Automate approvals. Improve accountability. Scale with confidence.
          </p>
          <p className="text-gray-500 mb-8">Start your free trial today — or schedule a personalized demo.</p>
          <div className="bg-gray-800 rounded-xl p-6 mb-8">
            <p className="text-gray-300 text-center">
              <span className="text-green-400 font-semibold">No contracts.</span> Cancel anytime. Your data stays yours.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="px-8">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="px-8 border-white text-white hover:bg-white hover:text-gray-900 bg-transparent">
                Book a Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Workflow className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold"><span className="text-blue-600">Flow</span><span className="text-white">Check</span></span>
          </div>
          <div className="text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} <span className="font-bold text-blue-600">Flow</span><span className="font-bold text-white">Check</span>. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
