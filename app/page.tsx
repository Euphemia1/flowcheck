import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Users, Workflow, BarChart3, Shield, Clock } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Workflow className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">ApprovalFlow</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/demo">
              <Button variant="ghost">Request Demo</Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 text-balance">
            Simple Approval Automation for Growing Teams
          </h1>
          <p className="text-xl text-gray-600 mb-8 text-pretty max-w-2xl mx-auto">
            Automate leave requests, expense approvals, and internal workflows in one simple system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="px-8">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="px-8 bg-transparent">
                Book a Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Stop Managing Approvals in Email & Excel</h2>
          <p className="text-xl text-gray-600">Still using email, WhatsApp, or Excel to manage approvals?</p>
        </div>
        <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Email Threads</h3>
            <p className="text-sm text-gray-600">Lost in endless email chains, no visibility</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">WhatsApp Messages</h3>
            <p className="text-sm text-gray-600">Informal, hard to track, no audit trail</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Paper Forms</h3>
            <p className="text-sm text-gray-600">Physical paperwork gets lost, slow processing</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Spreadsheets</h3>
            <p className="text-sm text-gray-600">Manual updates, version chaos, no alerts</p>
          </div>
        </div>
        <div className="text-center mt-8">
          <p className="text-lg text-gray-700 font-medium">Things get lost. Delays happen. Accountability disappears.</p>
          <p className="text-gray-600 mt-2">FlowCheck fixes that.</p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16 bg-gray-50">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <Workflow className="w-10 h-10 text-blue-600 mb-2" />
              <CardTitle>Custom Workflows</CardTitle>
              <CardDescription>
                Design approval workflows that match your organization's unique processes and requirements.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <Users className="w-10 h-10 text-green-600 mb-2" />
              <CardTitle>Role-Based Access</CardTitle>
              <CardDescription>
                Control who can approve what with granular permissions and role-based access controls.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <Clock className="w-10 h-10 text-orange-600 mb-2" />
              <CardTitle>Real-Time Tracking</CardTitle>
              <CardDescription>
                Monitor approval status in real-time with automated notifications and progress updates.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <Shield className="w-10 h-10 text-purple-600 mb-2" />
              <CardTitle>Audit Trail</CardTitle>
              <CardDescription>
                Complete audit trails ensure compliance and provide full visibility into approval history.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <BarChart3 className="w-10 h-10 text-red-600 mb-2" />
              <CardTitle>Analytics & Reports</CardTitle>
              <CardDescription>
                Gain insights into approval bottlenecks and process efficiency with detailed analytics.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CheckCircle className="w-10 h-10 text-teal-600 mb-2" />
              <CardTitle>Cloud-Based</CardTitle>
              <CardDescription>
                Access your approval workflows from anywhere with our secure, cloud-based platform.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Solution Section */}
      <section className="container mx-auto px-4 py-16 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Create workflows. Assign approvers. Track in real time.</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need to replace messy manual processes with clean, automated approval workflows.
          </p>
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
              <CardDescription className="mt-2">Perfect for small teams getting started</CardDescription>
            </CardHeader>
            <div className="px-6 pb-6">
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Up to 5 users</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">3 custom workflows</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Basic reporting</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Email notifications</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Standard support</span>
                </li>
              </ul>
              <Link href="/auth/register?plan=starter">
                <Button className="w-full bg-transparent" variant="outline">
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </Card>

          {/* Professional Plan */}
          <Card className="border-2 border-blue-500 hover:border-blue-600 transition-colors relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
            </div>
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl font-bold text-gray-900">Professional</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">$79</span>
                <span className="text-gray-600">/month</span>
              </div>
              <CardDescription className="mt-2">Ideal for growing organizations</CardDescription>
            </CardHeader>
            <div className="px-6 pb-6">
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Up to 25 users</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Unlimited workflows</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Advanced analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Custom integrations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Priority support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">API access</span>
                </li>
              </ul>
              <Link href="/auth/register?plan=professional">
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
              <CardDescription className="mt-2">For large organizations with complex needs</CardDescription>
            </CardHeader>
            <div className="px-6 pb-6">
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Unlimited users</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Advanced workflow builder</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">White-label options</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">SSO integration</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Dedicated support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Custom development</span>
                </li>
              </ul>
              <Link href="/demo?plan=enterprise">
                <Button className="w-full bg-transparent" variant="outline">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Who is FlowCheck for?</h3>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Growing SMEs</h4>
              <p className="text-sm text-gray-600">Teams of 10-100 people who have outgrown email and spreadsheets</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Operations Managers</h4>
              <p className="text-sm text-gray-600">Need visibility and control over internal processes</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">HR & Finance Teams</h4>
              <p className="text-sm text-gray-600">Processing leave, expenses, and purchase requests daily</p>
            </div>
          </div>
          
          <div className="bg-blue-50 p-8 rounded-xl mb-12">
            <h3 className="text-xl font-bold text-gray-900 mb-4">What problem does it solve?</h3>
            <p className="text-gray-700 mb-4">
              Every growing team faces the same chaos: requests scattered across email, WhatsApp, and paper. 
              Someone asks "Did my leave get approved?" and nobody knows. Expense reports sit in inboxes for weeks. 
              Purchase approvals get lost in the shuffle.
            </p>
            <p className="text-gray-700">
              FlowCheck brings order to this chaos. One place for all approvals, automatic routing, real-time tracking, 
              and a complete audit trail.
            </p>
          </div>
          
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Why is it better than doing it manually?</h3>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">10x</div>
                <p className="text-sm text-gray-600">Faster approval processing</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">Zero</div>
                <p className="text-sm text-gray-600">Lost requests</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
                <p className="text-sm text-gray-600">Visibility & accountability</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center border-t pt-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple Pricing</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Can I change plans anytime?</h4>
              <p className="text-gray-600 text-sm">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Is there a free trial?</h4>
              <p className="text-gray-600 text-sm">
                All plans include a 14-day free trial with full access to features.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">What payment methods do you accept?</h4>
              <p className="text-gray-600 text-sm">
                We accept all major credit cards and offer annual billing with a 20% discount.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Do you offer custom pricing?</h4>
              <p className="text-gray-600 text-sm">
                Yes, we offer custom pricing for large enterprises with specific requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Stop the Approval Chaos?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join teams who have replaced email threads and spreadsheets with simple, automated workflows.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" variant="secondary" className="px-8">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/demo">
              <Button
                size="lg"
                variant="outline"
                className="px-8 border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                Book a Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Workflow className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">ApprovalFlow</span>
          </div>
          <div className="text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} ApprovalFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
