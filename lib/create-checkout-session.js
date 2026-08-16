const stripe = require('./stripe');
const { getTicket, isValidTicketId } = require('./tickets');

// Standard Vercel serverless function — JSON body parsing is fine here
// (only the webhook needs the raw body).
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body || {};

    // Accept either a single ticket: { ticketId, quantity }
    // or a cart of several ticket types: { items: [{ ticketId, quantity }] }
    // The frontend cart supports mixed ticket types, so we normalize to a list.
    const rawItems = Array.isArray(body.items)
      ? body.items
      : body.ticketId
      ? [{ ticketId: body.ticketId, quantity: body.quantity }]
      : [];

    if (rawItems.length === 0) {
      return res.status(400).json({ error: 'No tickets provided.' });
    }

    const line_items = [];
    const metadataLines = [];

    for (const rawItem of rawItems) {
      const ticketId = String(rawItem.ticketId || '');
      const quantity = Number.parseInt(rawItem.quantity, 10);

      if (!isValidTicketId(ticketId)) {
        return res.status(400).json({ error: `Invalid ticket type: "${ticketId}"` });
      }
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
        return res.status(400).json({ error: `Invalid quantity for "${ticketId}".` });
      }

      // Price is looked up server-side from lib/tickets.js — never
      // trusted from the request body.
      const ticket = getTicket(ticketId);

      line_items.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: ticket.name,
            description: ticket.description,
          },
          unit_amount: ticket.priceCents,
        },
        quantity,
      });

      metadataLines.push(`${ticketId}:${quantity}`);
    }

    // Build absolute success/cancel URLs from the deployed Vercel domain
    // rather than hard-coding localhost. VERCEL_URL is provided
    // automatically by Vercel; SITE_URL lets you override it (e.g. for a
    // custom domain) via an environment variable.
    const origin =
      process.env.SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
      `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      // Collects name + address in addition to Checkout's built-in email
      // and card fields.
      billing_address_collection: 'required',
      success_url: `${origin}/payment-success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment-cancelled.html`,
      metadata: {
        tickets: metadataLines.join(','),
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('[create-checkout-session] error:', err.message);
    
    // Provide helpful error messages
    if (err.message.includes('API key') || err.message.includes('authentication')) {
      return res.status(500).json({ 
        error: 'Stripe API key not configured. Please check your .env file and set STRIPE_SECRET_KEY.' 
      });
    }
    
    return res.status(500).json({ error: 'Unable to start checkout. Please try again.' });
  }
};
