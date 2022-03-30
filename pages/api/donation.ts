// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Cosmic from 'cosmicjs'
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const api = Cosmic()

      const bucket = api.bucket({
        slug: process.env.BUCKET_SLUG,
        read_key: process.env.READ_KEY,
        write_key: process.env.WRITE_KEY,
      })
      const { student_id, amount, name, message } = req.body;

      const student = (await bucket.getObject({id: student_id, props: 'title'})).object;
      
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            amount: amount*100, // Cents
            currency: 'usd',
            quantity: 1,
            name: `Donation - ${student.title}`
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.referer}/?success=true`,
        cancel_url: `${req.headers.referer}/?canceled=true`,
      });

      const customer = await stripe.customers.list({ // TODO Fix this
        limit: 1,
      })

      const donorParams = {
        title: customer.data[0].name,
        type: 'donors',
        metafields: [
            {
                title: 'Name',
                type: 'text',
                value: name,
                key: 'name',
            },
            {
                title: 'Student',
                type: 'text',
                value: student.title,
                key: 'student',
            },
            {
                title: 'Amount',
                type: 'number',
                value: Number(amount),
                key: 'amount',
            },
            {
              title: 'Message',
              type: 'text',
              value: message,
              key: 'message',
            }
        ]
    }

    await bucket.addObject(donorParams)

      res.redirect(303, session.url);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
