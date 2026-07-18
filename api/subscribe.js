// Vercel serverless function: adds an email to MailerLite (server-side, so the
// API token is never exposed to the browser). Called by the calculator form.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({error: 'Method not allowed'})
    return
  }
  let email, source
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    email = body?.email
    source = typeof body?.source === 'string' ? body.source.slice(0, 60) : 'unknown'
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
        fields: {signup_source: source || 'unknown'},
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
