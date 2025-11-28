const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { admin, db } = require('./config/firebase');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Membership Plans (Must match frontend/database)
const MEMBERSHIP_PLANS = {
    'one-year': {
        price: 358, // Total amount
        name: '1-Year Executive Membership',
        duration: '1 Year'
    },
    'two-year': {
        price: 664,
        name: '2-Year Executive Membership',
        duration: '2 Years'
    },
    'three-year': {
        price: 919,
        name: '3-Year Executive Membership',
        duration: '3 Years'
    }
};

// Create Order Endpoint
app.post('/create-order', async (req, res) => {
    try {
        const { planId, userId } = req.body;

        if (!planId || !MEMBERSHIP_PLANS[planId]) {
            return res.status(400).json({ error: 'Invalid plan selected' });
        }

        const plan = MEMBERSHIP_PLANS[planId];
        const amount = plan.price * 100; // Amount in paise

        const options = {
            amount: amount,
            currency: 'INR',
            receipt: `order_${Date.now()}`,
            notes: {
                userId: userId,
                planId: planId,
                planName: plan.name
            }
        };

        const order = await razorpay.orders.create(options);

        res.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Verify Payment Endpoint
app.post('/verify-payment', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            res.json({ verified: true });
        } else {
            res.status(400).json({ verified: false, error: 'Invalid signature' });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ error: 'Verification failed' });
    }
});

// Webhook Endpoint
app.post('/webhook', async (req, res) => {
    const secret = process.env.WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];

    if (!signature) {
        return res.status(400).json({ error: 'Missing signature' });
    }

    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    if (digest === signature) {
        console.log('Webhook verified');
        const event = req.body.event;
        const payload = req.body.payload;

        if (event === 'payment.captured') {
            const payment = payload.payment.entity;
            const userId = payment.notes.userId;
            const planId = payment.notes.planId;

            if (userId && planId) {
                try {
                    // Update user in Firestore
                    const userRef = db.collection('users').doc(userId);

                    await userRef.set({
                        membership: {
                            status: 'active',
                            planId: planId,
                            startDate: admin.firestore.FieldValue.serverTimestamp(),
                            // Calculate end date based on plan duration (simplified)
                            expiryDate: admin.firestore.Timestamp.fromDate(
                                new Date(Date.now() + (planId === 'one-year' ? 365 : planId === 'two-year' ? 730 : 1095) * 24 * 60 * 60 * 1000)
                            )
                        },
                        role: 'EXECUTIVE MEMBER', // Or whatever role is appropriate
                        updatedAt: admin.firestore.FieldValue.serverTimestamp()
                    }, { merge: true });

                    // Log payment transaction
                    await db.collection('payments').add({
                        userId,
                        paymentId: payment.id,
                        orderId: payment.order_id,
                        amount: payment.amount / 100,
                        currency: payment.currency,
                        status: 'success',
                        planId,
                        createdAt: admin.firestore.FieldValue.serverTimestamp()
                    });

                    console.log(`User ${userId} upgraded to ${planId}`);
                } catch (error) {
                    console.error('Error updating user/payment:', error);
                    return res.status(500).json({ error: 'Database update failed' });
                }
            }
        }

        res.json({ status: 'ok' });
    } else {
        console.error('Invalid signature');
        res.status(400).json({ error: 'Invalid signature' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
