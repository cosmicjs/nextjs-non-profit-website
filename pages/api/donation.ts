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
        write_key: process.env.WRITE_KEY,
      })

      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            price: 'price_1KeP5WFi6eQznQn91h8mI33G',
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.referer}/?success=true`,
        cancel_url: `${req.headers.referer}/?canceled=true`,
      });

      const customer = await stripe.customers.list({
        limit: 1,
      })

      const student = req.headers.referer?.split('/')[4].split('-')
      const studentFirstName = student != undefined ? student[0][0].toUpperCase() + student[0].slice(1) : ''
      const studentLastName = student != undefined ? student[1][0].toUpperCase() + student[1].slice(1) : ''

      const studentName = `${studentFirstName} ${studentLastName}`

      const donorParams = {
        title: customer.data[0].name,
        type: 'donors',
        metafields: [
            {
                title: 'Name',
                type: 'text',
                value: customer.data[0].name,
                key: 'name',
            },
            {
                title: 'Student',
                type: 'text',
                value: studentName,
                key: 'student',
            },
            {
                title: 'Amount',
                type: 'number',
                value: 2950,
                key: 'amount',
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
