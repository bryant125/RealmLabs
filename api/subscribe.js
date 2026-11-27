// Vercel serverless function: adds an email to MailerLite (server-side, so the
// API token is never exposed to the browser). Called by the calculator form.
// mamabee.app is a separate Vercel project, so its forms POST here cross-origin.
const ALLOWED_ORIGINS = new Set(['https://mamabee.app', 'https://www.mamabee.app'])

export default async function handler(req, res) {
  const origin = req.headers?.origin
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.setHeader('Access-Control-Max-Age', '86400')
  }
  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }
  if (req.method !== 'POST') {
    res.status(405).json({error: 'Method not allowed'})
    return
  }
  let email, source, name
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    email = body?.email
    source = typeof body?.source === 'string' ? body.source.slice(0, 60) : 'unknown'
    name = typeof body?.name === 'string' ? body.name.trim().slice(0, 60) : ''
  } catch {
    /* fall through to validation */
  }
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    res.status(400).json({error: 'Please enter a valid email address.'})
    return
  }
  const token = process.env.MAILERLITE_API_TOKEN
  if (!token) {
    res.status(500).json({error: 'Email signup isn’t configured yet. Please try again later.'})
    return
  }
  try {
    const r = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email,
        groups: ['193315157946926539'], // MamaBee Sleep Tips
        fields: {signup_source: source || 'unknown', ...(name ? {name} : {})},
      }),
    })
    if (!r.ok && r.status !== 422) {
      res.status(502).json({error: 'Something went wrong. Please try again.'})
      return
    }
    res.status(200).json({ok: true})
  } catch {
    res.status(502).json({error: 'Something went wrong. Please try again.'})
  }
}
