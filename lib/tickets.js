/**
 * Server-side ticket catalog.
 *
 * This is the ONLY place ticket prices are defined. The frontend never
 * sends a price — it only sends a ticketId, and the server looks up the
 * price here. This prevents a malicious client from tampering with the
 * amount charged.
 *
 * Prices are in cents (Stripe's smallest currency unit) and were taken
 * directly from the existing onam-tickets.html catalog:
 *   Family Admit Four -> $100 (4 guests)
 *   Admit Two          -> $50  (2 guests)
 *   Admit One          -> $30  (1 guest)
 */

const TICKETS = {
  'family-four': {
    name: 'Family Admit Four',
    description: 'Onam Celebration 2026 — seats 4 guests',
    priceCents: 10000,
    guests: 4,
  },
  'admit-two': {
    name: 'Admit Two',
    description: 'Onam Celebration 2026 — seats 2 guests',
    priceCents: 5000,
    guests: 2,
  },
  'admit-one': {
    name: 'Admit One',
    description: 'Onam Celebration 2026 — seats 1 guest',
    priceCents: 3000,
    guests: 1,
  },
};

function getTicket(ticketId) {
  return TICKETS[ticketId] || null;
}

function isValidTicketId(ticketId) {
  return Object.prototype.hasOwnProperty.call(TICKETS, ticketId);
}

module.exports = { TICKETS, getTicket, isValidTicketId };
