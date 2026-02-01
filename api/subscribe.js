// Contrarian Content Framework - Lead Capture API
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, industry } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    // Log submission
    console.log('=== CONTRARIAN FRAMEWORK LEAD ===');
    console.log('Email:', email);
    console.log('Industry:', industry);
    console.log('Timestamp:', new Date().toISOString());
    console.log('=================================');

    // Optional: Send to Beehiiv
    const BEEHIIV_API_KEY = process.env.BEEHIIV_API_KEY;
    const PUBLICATION_ID = process.env.BEEHIIV_PUBLICATION_ID;

    if (BEEHIIV_API_KEY && PUBLICATION_ID) {
        try {
            await fetch(
                `https://api.beehiiv.com/v2/publications/${PUBLICATION_ID}/subscriptions`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${BEEHIIV_API_KEY}`
                    },
                    body: JSON.stringify({
                        email: email,
                        reactivate_existing: true,
                        send_welcome_email: false,
                        utm_source: 'contrarian_framework',
                        utm_medium: 'lead_magnet',
                        custom_fields: [
                            { name: 'industry', value: industry || '' },
                            { name: 'lead_source', value: 'contrarian_framework' }
                        ]
                    })
                }
            );
        } catch (err) {
            console.error('Beehiiv error:', err);
        }
    }

    return res.status(200).json({ success: true });
}
