// import express from 'express';
// import {
//   createPaymentIntent,
//   confirmPayment,
//   handleWebhook
// } from '../controllers/stripeController.js';

// const router = express.Router();

// // Webhook route (must be before express.json() middleware)
// router.post('/webhook', express.raw({type: 'application/json'}), handleWebhook);

// // Regular routes
// router.post('/create-payment-intent', createPaymentIntent);
// router.post('/confirm-payment', confirmPayment);

// export default router;

import express from 'express';
import {
  createPaymentIntent,
  confirmPayment,
  handleWebhook,
  createCheckoutSession
} from '../controllers/stripeController.js';

const router = express.Router();

// Webhook route (must be before express.json() middleware)
router.post('/webhook', express.raw({type: 'application/json'}), handleWebhook);

// Regular routes
router.post('/create-payment-intent', createPaymentIntent);
router.post('/confirm-payment', confirmPayment);
router.post('/create-checkout-session', createCheckoutSession);

export default router;