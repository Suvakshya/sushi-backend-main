// import Stripe from 'stripe';
// import Order from '../models/orderModel.js';
// import Cart from '../models/cartModel.js';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// // Create Stripe payment intent
// export const createPaymentIntent = async (req, res) => {
//   try {
//     const { amount, currency = 'usd', orderId } = req.body;

//     if (!amount || !orderId) {
//       return res.status(400).json({
//         success: false,
//         message: 'Amount and order ID are required'
//       });
//     }

//     // Create a PaymentIntent with the order amount and currency
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Math.round(amount * 100), // Convert to cents
//       currency: currency,
//       metadata: {
//         order_id: orderId
//       },
//       automatic_payment_methods: {
//         enabled: true,
//       },
//     });

//     res.json({
//       success: true,
//       clientSecret: paymentIntent.client_secret,
//       paymentIntentId: paymentIntent.id
//     });

//   } catch (error) {
//     console.error('Error creating payment intent:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to create payment intent',
//       error: error.message
//     });
//   }
// };

// // Confirm payment and update order
// export const confirmPayment = async (req, res) => {
//   try {
//     const { paymentIntentId, orderId } = req.body;

//     if (!paymentIntentId || !orderId) {
//       return res.status(400).json({
//         success: false,
//         message: 'Payment intent ID and order ID are required'
//       });
//     }

//     // Retrieve payment intent from Stripe
//     const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

//     if (paymentIntent.status === 'succeeded') {
//       // Update order status to indicate payment is completed
//       const updatedOrder = await Order.findByIdAndUpdate(
//         orderId,
//         { 
//           status: 'Preparing',
//           payment_status: 'paid'
//         },
//         { new: true }
//       );

//       // Clear user's cart after successful payment
//       const user = await Cart.findOne({ user_id: updatedOrder.user_id });
//       if (user) {
//         user.items = [];
//         await user.save();
//       }

//       res.json({
//         success: true,
//         message: 'Payment confirmed successfully',
//         data: updatedOrder
//       });
//     } else {
//       res.status(400).json({
//         success: false,
//         message: 'Payment not completed',
//         paymentStatus: paymentIntent.status
//       });
//     }

//   } catch (error) {
//     console.error('Error confirming payment:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to confirm payment',
//       error: error.message
//     });
//   }
// };

// // Webhook handler for Stripe events
// export const handleWebhook = async (req, res) => {
//   const sig = req.headers['stripe-signature'];
//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
//   } catch (err) {
//     console.error(`Webhook signature verification failed.`, err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   // Handle the event
//   switch (event.type) {
//     case 'payment_intent.succeeded':
//       const paymentIntent = event.data.object;
//       console.log('PaymentIntent was successful!');
      
//       // Update order status in your database
//       try {
//         await Order.findByIdAndUpdate(
//           paymentIntent.metadata.order_id,
//           { 
//             status: 'Preparing',
//             payment_status: 'paid'
//           }
//         );
//       } catch (error) {
//         console.error('Error updating order after payment:', error);
//       }
//       break;
    
//     case 'payment_intent.payment_failed':
//       const failedPaymentIntent = event.data.object;
//       console.log('PaymentIntent failed!');
      
//       // Update order status to indicate payment failure
//       try {
//         await Order.findByIdAndUpdate(
//           failedPaymentIntent.metadata.order_id,
//           { 
//             status: 'Cancelled',
//             payment_status: 'failed'
//           }
//         );
//       } catch (error) {
//         console.error('Error updating order after failed payment:', error);
//       }
//       break;
    
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   res.json({ received: true });
// };

import Stripe from 'stripe';
import Order from '../models/orderModel.js';
import Cart from '../models/cartModel.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


// Create Stripe Checkout Session
export const createCheckoutSession = async (req, res) => {
  try {
    const { amount, orderId, successUrl, cancelUrl } = req.body;

    if (!amount || !orderId || !successUrl || !cancelUrl) {
      return res.status(400).json({
        success: false,
        message: 'Amount, order ID, success URL, and cancel URL are required'
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Sushi Order',
              description: `Order #${orderId}`,
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        order_id: orderId
      },
    });

    res.json({
      success: true,
      url: session.url,
      sessionId: session.id
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create checkout session',
      error: error.message
    });
  }
};

// Create Stripe payment intent
export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'usd', orderId } = req.body;

    if (!amount || !orderId) {
      return res.status(400).json({
        success: false,
        message: 'Amount and order ID are required'
      });
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency,
      metadata: {
        order_id: orderId
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent',
      error: error.message
    });
  }
};

// Confirm payment and update order
export const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body;

    if (!paymentIntentId || !orderId) {
      return res.status(400).json({
        success: false,
        message: 'Payment intent ID and order ID are required'
      });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Update order status to indicate payment is completed
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { 
          status: 'Preparing',
          payment_status: 'paid',
          stripe_payment_intent_id: paymentIntentId
        },
        { new: true }
      );

      // Clear user's cart after successful payment
      const userCart = await Cart.findOne({ user_id: updatedOrder.user_id });
      if (userCart) {
        userCart.items = [];
        await userCart.save();
      }

      res.json({
        success: true,
        message: 'Payment confirmed successfully',
        data: updatedOrder
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not completed',
        paymentStatus: paymentIntent.status
      });
    }

  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm payment',
      error: error.message
    });
  }
};

// Webhook handler for Stripe events (OPTIONAL)
export const handleWebhook = async (req, res) => {
  // Check if webhook secret is configured
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.log('Webhook secret not configured, skipping webhook verification');
    // Process without verification for development
    const event = req.body;
    return await processWebhookEvent(event, res);
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    await processWebhookEvent(event, res);
  } catch (err) {
    console.error(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

// Process webhook events
const processWebhookEvent = async (event, res) => {
  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful!');
      
      // Update order status in your database
      try {
        await Order.findByIdAndUpdate(
          paymentIntent.metadata.order_id,
          { 
            status: 'Preparing',
            payment_status: 'paid',
            stripe_payment_intent_id: paymentIntent.id
          }
        );
        
        // Clear user's cart
        const order = await Order.findById(paymentIntent.metadata.order_id);
        if (order) {
          const userCart = await Cart.findOne({ user_id: order.user_id });
          if (userCart) {
            userCart.items = [];
            await userCart.save();
          }
        }
      } catch (error) {
        console.error('Error updating order after payment:', error);
      }
      break;
    
    case 'payment_intent.payment_failed':
      const failedPaymentIntent = event.data.object;
      console.log('PaymentIntent failed!');
      
      // Update order status to indicate payment failure
      try {
        await Order.findByIdAndUpdate(
          failedPaymentIntent.metadata.order_id,
          { 
            status: 'Cancelled',
            payment_status: 'failed'
          }
        );
      } catch (error) {
        console.error('Error updating order after failed payment:', error);
      }
      break;
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};