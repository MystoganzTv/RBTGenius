const DEFAULT_REVENUECAT_PROJECT_ID = "bfdfc79b";

function cleanValue(value) {
  if (value === undefined || value === null || value === "") return null;
  return String(value);
}

export function getPaymentReference(payment) {
  const metadata = payment?.metadata || {};
  return (
    cleanValue(metadata.transaction_id) ||
    cleanValue(payment?.stripe_invoice_id) ||
    cleanValue(payment?.stripe_session_id) ||
    cleanValue(payment?.id) ||
    "Unknown"
  );
}

export function getPaymentSourceLabel(payment) {
  const provider = String(
    payment?.provider || payment?.metadata?.provider || "",
  ).toLowerCase();
  if (provider === "revenuecat") return "RevenueCat webhook";
  if (provider === "stripe") return "Stripe webhook / checkout";
  return payment?.provider_label || payment?.provider || "Billing record";
}

export function getPaymentProviderUrl(
  payment,
  revenueCatProjectId = DEFAULT_REVENUECAT_PROJECT_ID,
) {
  const metadata = payment?.metadata || {};
  const provider = String(
    payment?.provider || metadata.provider || "",
  ).toLowerCase();

  if (provider === "revenuecat") {
    const customerId =
      cleanValue(metadata.revenuecat_app_user_id) ||
      cleanValue(payment?.user_id);
    if (!customerId || !revenueCatProjectId) return null;

    const customerUrl =
      `https://app.revenuecat.com/projects/${encodeURIComponent(revenueCatProjectId)}` +
      `/customers/${encodeURIComponent(customerId)}`;
    const eventId = cleanValue(metadata.revenuecat_event_id);
    return eventId
      ? `${customerUrl}/event/${encodeURIComponent(eventId.toLowerCase())}`
      : customerUrl;
  }

  if (provider === "stripe") {
    const reference =
      cleanValue(payment?.stripe_invoice_id) ||
      cleanValue(payment?.stripe_session_id) ||
      cleanValue(payment?.stripe_subscription_id) ||
      cleanValue(payment?.stripe_customer_id);
    return reference
      ? `https://dashboard.stripe.com/search?query=${encodeURIComponent(reference)}`
      : null;
  }

  return null;
}

export function getPaymentAuditRows(payment) {
  const metadata = payment?.metadata || {};
  return [
    { label: "Internal payment ID", value: cleanValue(payment?.id) },
    { label: "Provider reference", value: getPaymentReference(payment) },
    {
      label: "RevenueCat event ID",
      value: cleanValue(metadata.revenuecat_event_id),
    },
    {
      label: "Original transaction ID",
      value: cleanValue(metadata.original_transaction_id),
    },
    { label: "Product ID", value: cleanValue(metadata.product_id) },
    { label: "Store", value: cleanValue(metadata.store) },
    { label: "Environment", value: cleanValue(metadata.environment) },
    { label: "Period type", value: cleanValue(metadata.period_type) },
    { label: "Renewal number", value: cleanValue(metadata.renewal_number) },
    { label: "Country", value: cleanValue(metadata.country_code) },
    {
      label: "Stripe checkout session",
      value: cleanValue(payment?.stripe_session_id),
    },
    { label: "Stripe invoice", value: cleanValue(payment?.stripe_invoice_id) },
    {
      label: "Stripe subscription",
      value: cleanValue(payment?.stripe_subscription_id),
    },
    { label: "Stripe customer", value: cleanValue(payment?.stripe_customer_id) },
  ].filter((row) => row.value);
}
