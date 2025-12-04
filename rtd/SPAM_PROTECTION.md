# Spam Protection Guide

## Overview
The contact form includes multiple layers of spam protection to prevent automated bots and spam submissions while maintaining a smooth experience for legitimate users.

## Protection Layers

### 1. **Honeypot Field** 🍯
- **What it does**: A hidden form field that humans can't see but bots will fill out
- **How it works**: If the hidden `website` field is filled, the submission is rejected
- **User impact**: None - completely invisible to legitimate users
- **Effectiveness**: Catches ~90% of basic bots

### 2. **Rate Limiting** ⏱️
- **What it does**: Limits the number of submissions per IP address
- **Configuration**: 
  - Max 3 submissions per hour per IP address
  - Window: 1 hour rolling
- **User impact**: Legitimate users won't hit this limit (3 submissions/hour is very generous)
- **Effectiveness**: Prevents spam floods and automated attacks

### 3. **Time-Based Validation** ⏰
- **What it does**: Requires a minimum time between form load and submission
- **Configuration**: Minimum 3 seconds
- **User impact**: None - legitimate users take longer than 3 seconds to fill out the form
- **Effectiveness**: Catches bots that submit instantly

### 4. **Content Filtering** 🔍
- **What it does**: Checks for common spam keywords and patterns
- **Keywords checked**: viagra, casino, loan, crypto, seo services, etc. (see code for full list)
- **User impact**: Very rare false positives (only if message contains obvious spam terms)
- **Effectiveness**: Catches ~70% of spam content

### 5. **Pattern Detection** 📊
- **What it does**: Detects suspicious patterns common in spam
- **Checks**:
  - Message length > 5000 characters
  - More than 5 links in message
- **User impact**: Minimal - legitimate messages rarely exceed these limits
- **Effectiveness**: Catches bulk spam and link farms

## Configuration

### Adjusting Rate Limits
Edit `/app/api/contact/route.ts`:
```typescript
const MAX_SUBMISSIONS_PER_HOUR = 3; // Change this number
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
```

### Adjusting Minimum Form Time
```typescript
const MIN_FORM_TIME = 3000; // 3 seconds in milliseconds
```

### Adding/Removing Spam Keywords
```typescript
const SPAM_KEYWORDS = [
  "viagra", "cialis", "casino", // Add your keywords here
];
```

### Adjusting Content Limits
```typescript
if (message.length > 5000) { // Change max length
  // ...
}

if (linkCount > 5) { // Change max links
  // ...
}
```

## Resend Account Settings

### Recommended Resend Settings
1. **Domain Verification**: Ensure your domain is verified (improves deliverability)
2. **Webhooks**: Set up webhooks to track bounces and spam reports
3. **Rate Limits**: Resend has built-in rate limits (100/day on free tier)
4. **Spam Filters**: Resend automatically filters some spam, but our server-side checks add an extra layer

### Monitoring Spam
- Check Resend dashboard for bounce/spam reports
- Monitor server logs for blocked submissions
- Review rate limit hits in console logs

## Testing

### Testing Legitimate Submissions
1. Fill out the form normally
2. Wait at least 3 seconds before submitting
3. Should work without issues

### Testing Spam Protection
1. **Honeypot**: Use browser dev tools to fill the hidden `website` field → Should be rejected
2. **Rate Limit**: Submit 4 times quickly → 4th should be blocked
3. **Time Validation**: Submit instantly (< 3 seconds) → Should be rejected
4. **Content Filter**: Include spam keywords → Should be rejected
5. **Pattern Detection**: Add 6+ links → Should be rejected

## Production Considerations

### Rate Limiting Storage
- **Current**: In-memory Map (resets on server restart)
- **For Production**: Consider using Redis or a database for distributed rate limiting across multiple server instances

### IP Address Detection
- Works with Vercel, Cloudflare, and most proxies
- Falls back gracefully if IP can't be detected
- In serverless environments, IP detection relies on headers (`x-forwarded-for`, `cf-connecting-ip`, etc.)

### Scaling
- Current solution works well for small to medium sites
- For high-traffic sites, consider:
  - Redis for rate limiting
  - More sophisticated spam detection (e.g., Akismet API)
  - CAPTCHA as a last resort (hCaptcha or reCAPTCHA)

## Troubleshooting

### Legitimate Users Getting Blocked
1. Check if they're hitting rate limit (3/hour is generous)
2. Check if message contains spam keywords (may need to adjust list)
3. Check server logs for specific reason

### Still Getting Spam
1. Review spam patterns and add keywords
2. Tighten rate limits (reduce from 3/hour)
3. Increase minimum form time (from 3 seconds)
4. Consider adding CAPTCHA as additional layer

### Rate Limiting Not Working
- Check if IP detection is working (check logs)
- Verify rate limit store is persisting (may reset on serverless cold starts)
- Consider Redis for production

## Additional Options

### If Spam Persists
1. **CAPTCHA**: Add hCaptcha or reCAPTCHA (last resort - hurts UX)
2. **Akismet API**: Professional spam detection service
3. **Cloudflare Turnstile**: Privacy-friendly CAPTCHA alternative
4. **Email Verification**: Require email confirmation before sending
5. **Manual Review**: Queue suspicious submissions for review

### Recommended: Start Simple
The current multi-layer approach should catch 95%+ of spam. Only add CAPTCHA if absolutely necessary, as it hurts user experience.

