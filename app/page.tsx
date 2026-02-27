"use client"

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
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button>Start Free Trial</Button>
              </motion.div>
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
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Simple. Digital. Paperless.</Badge>
              </motion.div>
              <motion.h1
                className="text-4xl lg:text-6xl font-black text-slate-900 mb-6 leading-tight tracking-tight"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                Stop Chasing Approvals. <br /><span className="text-blue-600">Start Getting Work Done.</span>
              </motion.h1>
              <motion.p
                className="text-xl text-slate-600 mb-8 leading-relaxed max-w-xl"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                Automate your internal approval workflows in minutes.
                FlowCheck helps growing teams move faster by bringing structure to every request, decision, and sign-off.
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


      {/* Solution Section */}
      <motion.section 
        className="bg-gray-900 text-white py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">One Central Hub for All Your Approvals</h2>
            <p className="text-xl text-gray-400">FlowCheck replaces scattered approvals with a clear, automated system.</p>
          </motion.div>
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12"
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {[
              { icon: Calendar, color: "blue", title: "Leave & Time-Off Requests", desc: "Streamlined PTO, sick leave, and vacation approvals" },
              { icon: DollarSign, color: "green", title: "Expense Approvals", desc: "Receipts, reimbursements, spending controls" },
              { icon: FileText, color: "purple", title: "Purchase Requests", desc: "Procurement, vendor approvals, PO workflow" },
              { icon: BarChart3, color: "orange", title: "Budget Approvals", desc: "Department budgets, project spend, forecasts" },
              { icon: CheckCircle, color: "red", title: "Document Sign-Off", desc: "Contracts, policies, compliance approvals" },
              { icon: Layers, color: "teal", title: "Custom Workflows", desc: "Any internal process your team needs" }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-4 p-6 bg-gray-800 rounded-xl"
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5, backgroundColor: "#374151" }}
              >
                <motion.div 
                  className={`w-12 h-12 bg-${item.color}-600 rounded-lg flex items-center justify-center shrink-0`}
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.6 }}
                >
                  <item.icon className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            viewport={{ once: true }}
          >
            <p className="text-xl text-gray-300">Everything is submitted, tracked, approved, and recorded in one place.</p>
            <motion.p 
              className="text-lg text-blue-400 mt-2"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              No more guessing. No more lost requests.
            </motion.p>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Powerful Workflow Automation — Made Simple</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Everything you need to streamline approvals</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          <div className="p-6">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
              <Workflow className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Visual Designer</h3>
            <p className="text-slate-600 text-sm">Build flows with drag-and-drop. No code required.</p>
          </div>

          <div className="p-6">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Audit Trails</h3>
            <p className="text-slate-600 text-sm">Every action is logged and timestamped for compliance.</p>
          </div>

          <div className="p-6">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Smart Alerts</h3>
            <p className="text-slate-600 text-sm">Automatic follow-ups so requests never get stuck.</p>
          </div>

          <div className="p-6">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-6">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Real-time Analytics</h3>
            <p className="text-slate-600 text-sm">Identify bottlenecks and improve processing times.</p>
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
