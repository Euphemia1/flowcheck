import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, X, Workflow } from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Workflow className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">ApprovalFlow</span>
          </Link>
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
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6 text-balance">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600 mb-8 text-pretty">
            Choose the perfect plan for your organization. All plans include our core approval workflow features with a
            14-day free trial.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 pb-16">
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
                <li className="flex items-center gap-2">
                  <X className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-400">API access</span>
                </li>
                <li className="flex items-center gap-2">
                  <X className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-400">Custom integrations</span>
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
                  <span className="text-gray-700">Email & SMS notifications</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Priority support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">API access</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Custom integrations</span>
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
                  <span className="text-gray-700">Dedicated support manager</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Custom development</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">On-premise deployment</span>
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
      </section>

      {/* Feature Comparison Table */}
      <section className="container mx-auto px-4 py-16 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Compare All Features</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            See exactly what's included in each plan to make the best choice for your organization.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full max-w-4xl mx-auto">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4 px-4 font-semibold text-gray-900">Features</th>
                <th className="text-center py-4 px-4 font-semibold text-gray-900">Starter</th>
                <th className="text-center py-4 px-4 font-semibold text-gray-900">Professional</th>
                <th className="text-center py-4 px-4 font-semibold text-gray-900">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="py-4 px-4 text-gray-700">Users</td>
                <td className="py-4 px-4 text-center">Up to 5</td>
                <td className="py-4 px-4 text-center">Up to 25</td>
                <td className="py-4 px-4 text-center">Unlimited</td>
              </tr>
              <tr>
                <td className="py-4 px-4 text-gray-700">Custom Workflows</td>
                <td className="py-4 px-4 text-center">3</td>
                <td className="py-4 px-4 text-center">Unlimited</td>
                <td className="py-4 px-4 text-center">Unlimited</td>
              </tr>
              <tr>
                <td className="py-4 px-4 text-gray-700">Analytics & Reporting</td>
                <td className="py-4 px-4 text-center">Basic</td>
                <td className="py-4 px-4 text-center">Advanced</td>
                <td className="py-4 px-4 text-center">Advanced</td>
              </tr>
              <tr>
                <td className="py-4 px-4 text-gray-700">API Access</td>
                <td className="py-4 px-4 text-center">
                  <X className="w-5 h-5 text-gray-400 mx-auto" />
                </td>
                <td className="py-4 px-4 text-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                </td>
                <td className="py-4 px-4 text-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 text-gray-700">SSO Integration</td>
                <td className="py-4 px-4 text-center">
                  <X className="w-5 h-5 text-gray-400 mx-auto" />
                </td>
                <td className="py-4 px-4 text-center">
                  <X className="w-5 h-5 text-gray-400 mx-auto" />
                </td>
                <td className="py-4 px-4 text-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 text-gray-700">White-label Options</td>
                <td className="py-4 px-4 text-center">
                  <X className="w-5 h-5 text-gray-400 mx-auto" />
                </td>
                <td className="py-4 px-4 text-center">
                  <X className="w-5 h-5 text-gray-400 mx-auto" />
                </td>
                <td className="py-4 px-4 text-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Can I change plans anytime?</h3>
            <p className="text-gray-600 mb-6">
              Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll
              prorate any billing differences.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
            <p className="text-gray-600 mb-6">
              All plans include a 14-day free trial with full access to features. No credit card required to start.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
            <p className="text-gray-600 mb-6">
              We accept all major credit cards (Visa, MasterCard, American Express) and offer annual billing with a 20%
              discount.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Do you offer custom pricing?</h3>
            <p className="text-gray-600 mb-6">
              Yes, we offer custom pricing for large enterprises with specific requirements. Contact our sales team for
              a personalized quote.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">What happens if I exceed my user limit?</h3>
            <p className="text-gray-600 mb-6">
              We'll notify you when you're approaching your limit and help you upgrade to accommodate additional users
              seamlessly.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Is my data secure?</h3>
            <p className="text-gray-600 mb-6">
              Absolutely. We use enterprise-grade security with SOC 2 compliance, end-to-end encryption, and regular
              security audits.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of organizations streamlining their approval processes with ApprovalFlow.
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
                Schedule a Demo
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
            <p>&copy; 2024 ApprovalFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
