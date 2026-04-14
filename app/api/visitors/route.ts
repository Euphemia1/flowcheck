import { NextRequest, NextResponse } from 'next/server'

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

// Notification settings (you can move these to environment variables)
const NOTIFICATION_SETTINGS = {
  email: 'euphemia.chikungulu@example.com', // Update with your email
  phone: '+1234567890', // Update with your phone number
  enabled: true,
  cooldownMinutes: 30 // Don't send notifications more frequently than this
}

// Simple email sending function (you'll need to configure this)
async function sendEmailNotification(visitor: VisitorData) {
  try {
    // This is a placeholder - you'll need to integrate with an email service
    // Options: SendGrid, AWS SES, Resend, or Nodemailer with SMTP
    
    const emailContent = {
      to: NOTIFICATION_SETTINGS.email,
      subject: `New visitor to FlowCheck website!`,
      html: `
        <h2>FlowCheck Website Visitor Alert</h2>
        <p><strong>Time:</strong> ${new Date(visitor.timestamp).toLocaleString()}</p>
        <p><strong>IP Address:</strong> ${visitor.ip}</p>
        <p><strong>Page:</strong> ${visitor.path}</p>
        <p><strong>Browser:</strong> ${visitor.userAgent}</p>
        ${visitor.referrer ? `<p><strong>Referrer:</strong> ${visitor.referrer}</p>` : ''}
        ${visitor.location ? `<p><strong>Location:</strong> ${visitor.location.city}, ${visitor.location.country}</p>` : ''}
        <hr>
        <p>Check your FlowCheck application for more details.</p>
      `
    }

    console.log('Email notification would be sent:', emailContent)
    // TODO: Implement actual email sending
    // await emailService.send(emailContent)
    
  } catch (error) {
    console.error('Failed to send email notification:', error)
  }
}

// Simple SMS sending function (you'll need to configure this)
async function sendSMSNotification(visitor: VisitorData) {
  try {
    // This is a placeholder - you'll need to integrate with an SMS service
    // Options: Twilio, AWS SNS, MessageBird, etc.
    
    const smsContent = `FlowCheck visitor alert: ${new Date(visitor.timestamp).toLocaleString()} - ${visitor.ip} - ${visitor.path}`

    console.log('SMS notification would be sent:', smsContent)
    // TODO: Implement actual SMS sending
    // await smsService.send(NOTIFICATION_SETTINGS.phone, smsContent)
    
  } catch (error) {
    console.error('Failed to send SMS notification:', error)
  }
}

// Get visitor location from IP (using free IP geolocation service)
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

// Check if we should send notification (cooldown period)
function shouldSendNotification(lastNotificationTime: number): boolean {
  const cooldownMs = NOTIFICATION_SETTINGS.cooldownMinutes * 60 * 1000
  return Date.now() - lastNotificationTime > cooldownMs
}

export async function POST(request: NextRequest) {
  try {
    const visitorData: VisitorData = {
      timestamp: new Date().toISOString(),
      ip: request.ip || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      referrer: request.headers.get('referer') || undefined,
      path: request.headers.get('referer')?.split('/').pop() || '/'
    }

    // Get location data
    const location = await getLocationFromIP(visitorData.ip)
    visitorData.location = location || undefined

    // Store visitor data (you can save this to a database)
    console.log('Visitor tracked:', visitorData)

    // Check if notifications are enabled and within cooldown
    if (NOTIFICATION_SETTINGS.enabled) {
      // For simplicity, we'll just send notifications every time
      // In production, you'd want to track last notification time in a database
      await sendEmailNotification(visitorData)
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

export async function GET() {
  return NextResponse.json({
    message: 'Visitor tracking API is active',
    settings: {
      notificationsEnabled: NOTIFICATION_SETTINGS.enabled,
      cooldownMinutes: NOTIFICATION_SETTINGS.cooldownMinutes
    }
  })
}
