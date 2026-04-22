import { NextRequest, NextResponse } from 'next/server'
import AfricasTalking from 'africastalking'

interface VisitorData {
  timestamp: string
  ip: string
  userAgent: string
  referrer?: string
  path: string
  location?: {
    country?: string
    city?: string
  }
}

const NOTIFICATION_SETTINGS = {
  email: process.env.NOTIFICATION_EMAIL || '',
  phone: process.env.AFRICAS_TALKING_PHONE || '',
  enabled: process.env.NOTIFICATIONS_ENABLED === 'true',
  cooldownMinutes: 30
}

async function sendSMSNotification(visitor: VisitorData) {
  const apiKey = process.env.AFRICAS_TALKING_API_KEY?.trim()
  const username = process.env.AFRICAS_TALKING_USERNAME?.trim() || 'sandbox'

  if (!apiKey) {
    console.warn('SMS notifications skipped: AFRICAS_TALKING_API_KEY is missing.')
    return
  }

  if (!NOTIFICATION_SETTINGS.phone) {
    console.warn('SMS notifications skipped: AFRICAS_TALKING_PHONE is missing.')
    return
  }

  try {
    const sms = AfricasTalking({ apiKey, username }).SMS
    const message = `FlowCheck visitor alert: ${visitor.path} visited from ${visitor.ip} at ${new Date(visitor.timestamp).toLocaleString()}`

    const response = await sms.send({
      to: [NOTIFICATION_SETTINGS.phone],
      message,
      from: process.env.AFRICAS_TALKING_SENDER_ID || undefined
    })

    console.log('SMS notification sent:', response)
  } catch (error) {
    console.error('Failed to send SMS notification:', error)
  }
}

async function getLocationFromIP(ip: string) {
  try {
    if (ip === '127.0.0.1' || ip === '::1') {
      return { country: 'Local', city: 'Development' }
    }

    const response = await fetch(`http://ip-api.com/json/${ip}`)
    const data = await response.json()

    if (data.status === 'success') {
      return {
        country: data.country,
        city: data.city
      }
    }
  } catch (error) {
    console.error('Failed to get location:', error)
  }

  return null
}

export async function POST(request: NextRequest) {
  try {
    const forwardedFor = request.headers.get('x-forwarded-for')
    const ip = forwardedFor?.split(',')[0] || 'unknown'

    const visitorData: VisitorData = {
      timestamp: new Date().toISOString(),
      ip,
      userAgent: request.headers.get('user-agent') || 'unknown',
      referrer: request.headers.get('referer') || undefined,
      path: request.headers.get('referer')?.split('/').pop() || '/'
    }

    const location = await getLocationFromIP(visitorData.ip)
    visitorData.location = location || undefined

    console.log('Visitor tracked:', visitorData)

    if (NOTIFICATION_SETTINGS.enabled) {
      await sendSMSNotification(visitorData)
    }

    return NextResponse.json({
      success: true,
      message: 'Visitor tracked successfully',
      visitor: visitorData
    })
  } catch (error) {
    console.error('Error tracking visitor:', error)

    return NextResponse.json(
      { error: 'Failed to track visitor' },
      { status: 500 }
    )
  }
}
