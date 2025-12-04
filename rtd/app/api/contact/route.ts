import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

// Initialize Resend with API key check
const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
  console.error("RESEND_API_KEY is not set in environment variables");
}

const resend = apiKey ? new Resend(apiKey) : null;

// Rate limiting: Store IP addresses and their submission counts
// In production, consider using Redis or a database for distributed rate limiting
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Rate limit configuration
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_SUBMISSIONS_PER_HOUR = 3; // Max 3 submissions per IP per hour
const MIN_FORM_TIME = 3000; // Minimum 3 seconds between form load and submit (prevents bots)

// Spam keywords to check for
const SPAM_KEYWORDS = [
  "viagra", "cialis", "casino", "poker", "loan", "debt", "free money",
  "click here", "limited time", "act now", "buy now", "discount",
  "winner", "congratulations", "prize", "lottery", "inheritance",
  "nigerian prince", "urgent", "asap", "seo services", "link building",
  "crypto", "bitcoin", "investment opportunity", "make money fast",
];

// Get client IP address
function getClientIP(request: NextRequest): string {
  // Check various headers for IP (handles proxies/load balancers)
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfConnectingIP = request.headers.get("cf-connecting-ip"); // Cloudflare
  
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  // Fallback (won't work in serverless, but good for local dev)
  return request.ip || "unknown";
}

// Check rate limit
function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetTime) {
    // No entry or window expired, create new entry
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return { allowed: true, remaining: MAX_SUBMISSIONS_PER_HOUR - 1 };
  }

  if (entry.count >= MAX_SUBMISSIONS_PER_HOUR) {
    return { allowed: false, remaining: 0 };
  }

  // Increment count
  entry.count++;
  rateLimitStore.set(ip, entry);
  return { allowed: true, remaining: MAX_SUBMISSIONS_PER_HOUR - entry.count };
}

// Clean up old rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}, 60 * 60 * 1000); // Clean up every hour

// Check for spam content
function containsSpam(content: string): boolean {
  const lowerContent = content.toLowerCase();
  return SPAM_KEYWORDS.some(keyword => lowerContent.includes(keyword));
}

export async function POST(request: NextRequest) {
  try {
    // Check if Resend is configured
    if (!resend || !apiKey) {
      console.error("Resend is not configured. RESEND_API_KEY is missing.");
      return NextResponse.json(
        { error: "Email service is not configured. Please contact the administrator." },
        { status: 500 }
      );
    }

    // Get client IP for rate limiting
    const clientIP = getClientIP(request);

    // Check rate limit
    const rateLimit = checkRateLimit(clientIP);
    if (!rateLimit.allowed) {
      console.warn(`Rate limit exceeded for IP: ${clientIP}`);
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, message, website, timeSinceLoad } = body;

    // Honeypot check - if website field is filled, it's a bot
    if (website && website.trim() !== "") {
      console.warn(`Honeypot triggered for IP: ${clientIP}`);
      return NextResponse.json(
        { error: "Spam detected" },
        { status: 400 }
      );
    }

    // Time-based validation - prevent instant submissions (bot behavior)
    if (timeSinceLoad && timeSinceLoad < MIN_FORM_TIME) {
      console.warn(`Form submitted too quickly (${timeSinceLoad}ms) for IP: ${clientIP}`);
      return NextResponse.json(
        { error: "Please take your time filling out the form." },
        { status: 400 }
      );
    }

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Content filtering - check for spam keywords
    const fullContent = `${name} ${email} ${message}`.toLowerCase();
    if (containsSpam(fullContent)) {
      console.warn(`Spam content detected for IP: ${clientIP}`);
      return NextResponse.json(
        { error: "Your message contains content that appears to be spam. Please revise and try again." },
        { status: 400 }
      );
    }

    // Additional validation: Check for suspicious patterns
    // Very long messages might be spam
    if (message.length > 5000) {
      console.warn(`Message too long (${message.length} chars) for IP: ${clientIP}`);
      return NextResponse.json(
        { error: "Message is too long. Please keep it under 5000 characters." },
        { status: 400 }
      );
    }

    // Check for excessive links (common spam pattern)
    const linkCount = (message.match(/https?:\/\//g) || []).length;
    if (linkCount > 5) {
      console.warn(`Too many links (${linkCount}) in message for IP: ${clientIP}`);
      return NextResponse.json(
        { error: "Message contains too many links. Please reduce the number of links." },
        { status: 400 }
      );
    }

    // Send email using Resend
    // Use your verified domain instead of onboarding@resend.dev
    console.log("Attempting to send email via Resend...");
    console.log("API Key exists:", !!apiKey);
    
    // Try sending to multiple addresses to test delivery
    // Note: You can also use 'cc' or 'bcc' fields if needed
    const { data, error } = await resend.emails.send({
      from: "Red Tower Contact Form <noreply@redtowerdigital.com>", // Use your verified domain
      to: ["ben@redtowerdigital.com"],
      cc: ["sam@redtowerdigital.com"],
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
      text: `
        New Contact Form Submission
        
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
    });

    if (error) {
      console.error("Resend API error:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: `Failed to send email: ${error.message || JSON.stringify(error)}` },
        { status: 500 }
      );
    }

    console.log("Email sent successfully. Resend ID:", data?.id);

    return NextResponse.json(
      { success: true, message: "Email sent successfully", emailId: data?.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("API error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Full error:", JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: `Internal server error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
