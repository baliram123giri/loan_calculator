import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, subject, message } = body;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // TODO: Replace with your actual email service
        // For now, we'll log the contact form submission
        // You can integrate with services like:
        // - SendGrid
        // - Mailgun
        // - AWS SES
        // - Resend
        // - Nodemailer with SMTP

        console.log('Contact Form Submission:', {
            name,
            email,
            subject,
            message,
            timestamp: new Date().toISOString()
        });

        // Example: Using a simple email service (you'll need to configure this)
        // Uncomment and configure when you have your email service set up
        /*
        const emailResponse = await fetch('https://api.your-email-service.com/send', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.EMAIL_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: 'support@calcbz.com',
                from: 'noreply@calcbz.com',
                replyTo: email,
                subject: `Contact Form: ${subject}`,
                html: `
                    <h2>New Contact Form Submission</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <p><strong>Message:</strong></p>
                    <p>${message.replace(/\n/g, '<br>')}</p>
                `
            })
        });

        if (!emailResponse.ok) {
            throw new Error('Failed to send email');
        }
        */

        return NextResponse.json(
            {
                success: true,
                message: 'Message sent successfully'
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json(
            { error: 'Failed to send message' },
            { status: 500 }
        );
    }
}
