/**
 * Minimal order + webhook-event storage.
 *
 * The existing project (a static HTML site) had no database of any kind,
 * so this module provides the smallest reliable mechanism needed for the
 * webhook to (a) record a paid order and (b) avoid double-processing the
 * same Stripe event.
 *
 * IMPORTANT LIMITATION:
 * Vercel serverless functions are stateless between cold starts, and a
 * deployment can run multiple function instances in parallel. In-memory
 * storage like this can be reset or "forgotten" at any time, and dedupe
 * is only guaranteed within a single warm instance.
 *
 * This is fine for wiring up and testing the payment flow end-to-end in
 * Stripe TEST MODE. Before going live, swap `saveOrder` / `hasProcessed`
 * / `markProcessed` below for a real persistence layer — e.g. Vercel KV,
 * Vercel Postgres, Supabase, or any DB you already use elsewhere. The
 * function signatures are intentionally kept tiny so that swap is a
 * one-file change.
 */

const orders = [];
const processedEventIds = new Set();

function hasProcessed(eventId) {
  return processedEventIds.has(eventId);
}

function markProcessed(eventId) {
  processedEventIds.add(eventId);
}

function saveOrder(order) {
  orders.push(order);
  // Vercel captures console.log output in the function's runtime logs,
  // which — until a real DB is wired up — is the audit trail for orders.
  console.log('[order:paid]', JSON.stringify(order));
  return order;
}

function listOrders() {
  return orders.slice();
}

module.exports = { saveOrder, listOrders, hasProcessed, markProcessed };
