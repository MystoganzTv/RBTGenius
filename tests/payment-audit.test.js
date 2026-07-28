import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getPaymentAuditRows,
  getPaymentProviderUrl,
  getPaymentReference,
  getPaymentSourceLabel,
} from '../src/lib/payment-audit.js';

const revenueCatPayment = {
  id: 'pay_rc_1570000025466494',
  user_id: 'user_1779228191783_nb7lz3',
  provider: 'revenuecat',
  provider_label: 'Apple App Store',
  metadata: {
    revenuecat_event_id: 'B02D715C-5263-4411-AD3C-37E8920E4EFE',
    transaction_id: '1570000025466494',
    original_transaction_id: '1570000025466494',
    product_id: 'com.rbtgenius.monthly',
    store: 'APP_STORE',
    environment: 'PRODUCTION',
  },
};

test('RevenueCat payments expose stable references and a direct event URL', () => {
  assert.equal(getPaymentReference(revenueCatPayment), '1570000025466494');
  assert.equal(getPaymentSourceLabel(revenueCatPayment), 'RevenueCat webhook');
  assert.equal(
    getPaymentProviderUrl(revenueCatPayment),
    'https://app.revenuecat.com/projects/bfdfc79b/customers/user_1779228191783_nb7lz3/event/b02d715c-5263-4411-ad3c-37e8920e4efe',
  );

  const rows = getPaymentAuditRows(revenueCatPayment);
  assert.deepEqual(rows.slice(0, 4), [
    { label: 'Internal payment ID', value: 'pay_rc_1570000025466494' },
    { label: 'Provider reference', value: '1570000025466494' },
    {
      label: 'RevenueCat event ID',
      value: 'B02D715C-5263-4411-AD3C-37E8920E4EFE',
    },
    { label: 'Original transaction ID', value: '1570000025466494' },
  ]);
});

test('Stripe payments link to a dashboard search using their invoice reference', () => {
  const payment = {
    id: 'pay_stripe_invoice_in_123',
    provider: 'stripe',
    stripe_invoice_id: 'in_123',
    stripe_customer_id: 'cus_123',
  };

  assert.equal(getPaymentReference(payment), 'in_123');
  assert.equal(getPaymentSourceLabel(payment), 'Stripe webhook / checkout');
  assert.equal(
    getPaymentProviderUrl(payment),
    'https://dashboard.stripe.com/search?query=in_123',
  );
});
