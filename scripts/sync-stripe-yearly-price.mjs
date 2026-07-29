import Stripe from "stripe";

const TARGET_YEARLY_AMOUNT = 9999;
const TARGET_MONTHLY_AMOUNT = 1999;
const APPLY = process.argv.includes("--apply");
const MIGRATABLE_STATUSES = new Set([
  "active",
  "trialing",
  "past_due",
  "unpaid",
]);

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

async function listSubscriptionsForPrice(stripe, priceId) {
  const subscriptions = [];
  let startingAfter;

  do {
    const page = await stripe.subscriptions.list({
      price: priceId,
      status: "all",
      limit: 100,
      ...(startingAfter ? { starting_after: startingAfter } : {}),
    });
    subscriptions.push(...page.data);
    startingAfter = page.has_more ? page.data.at(-1)?.id : undefined;
  } while (startingAfter);

  return subscriptions;
}

function subscriptionItemForPrice(subscription, priceId) {
  return subscription.items.data.find((item) => item.price?.id === priceId);
}

const stripe = new Stripe(requireEnv("STRIPE_SECRET_KEY"));
const currentYearlyId = requireEnv("STRIPE_PRICE_PREMIUM_YEARLY");
const currentMonthlyId = requireEnv("STRIPE_PRICE_PREMIUM_MONTHLY");

const [currentYearly, currentMonthly] = await Promise.all([
  stripe.prices.retrieve(currentYearlyId),
  stripe.prices.retrieve(currentMonthlyId),
]);

if (
  currentMonthly.unit_amount !== TARGET_MONTHLY_AMOUNT ||
  currentMonthly.recurring?.interval !== "month"
) {
  throw new Error(
    "The configured monthly Stripe price is not $19.99 per month; refusing to continue.",
  );
}

const productId =
  typeof currentYearly.product === "string"
    ? currentYearly.product
    : currentYearly.product.id;

const productPrices = await stripe.prices.list({
  product: productId,
  active: true,
  type: "recurring",
  limit: 100,
});

let targetYearly = productPrices.data.find(
  (price) =>
    price.currency === currentYearly.currency &&
    price.unit_amount === TARGET_YEARLY_AMOUNT &&
    price.recurring?.interval === "year" &&
    price.recurring?.interval_count === 1,
);

const existingSubscriptions = await listSubscriptionsForPrice(
  stripe,
  currentYearlyId,
);
const subscriptionsToMigrate = existingSubscriptions.filter(
  (subscription) =>
    MIGRATABLE_STATUSES.has(subscription.status) &&
    Boolean(subscriptionItemForPrice(subscription, currentYearlyId)),
);

if (APPLY && !targetYearly) {
  targetYearly = await stripe.prices.create({
    product: productId,
    currency: currentYearly.currency,
    unit_amount: TARGET_YEARLY_AMOUNT,
    recurring: {
      interval: "year",
      interval_count: 1,
    },
    nickname: "RBTGenius Pro Annual — $99.99",
    metadata: {
      plan: "premium_yearly",
      source: "rbtgenius-pricing-2026-07-29",
    },
  });
}

let migrated = 0;
if (APPLY && targetYearly && targetYearly.id !== currentYearlyId) {
  for (const subscription of subscriptionsToMigrate) {
    const item = subscriptionItemForPrice(subscription, currentYearlyId);
    await stripe.subscriptions.update(subscription.id, {
      items: [{ id: item.id, price: targetYearly.id }],
      proration_behavior: "none",
    });
    migrated += 1;
  }
}

console.log(
  JSON.stringify(
    {
      mode: APPLY ? "apply" : "audit",
      monthly_price_verified: true,
      current_yearly_amount: currentYearly.unit_amount,
      target_yearly_amount: TARGET_YEARLY_AMOUNT,
      target_price_exists: Boolean(targetYearly),
      target_price_id: targetYearly?.id || null,
      subscriptions_on_previous_price: existingSubscriptions.length,
      subscriptions_eligible_for_migration: subscriptionsToMigrate.length,
      subscriptions_migrated: migrated,
    },
    null,
    2,
  ),
);
