import { auth, currentUser } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import prismadb from '@/lib/prismadb'
import { stripe } from '@/lib/stripe'
import { absoluteUrl } from '@/lib/utils'

const settingsUrl = absoluteUrl('/dashboard')

export async function GET() {
  try {
    const { userId } = auth()
    const user = await currentUser()

    if (!userId || !user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const userSubscription = await prismadb.userSubscription.findUnique({
      where: {
        userId: userId, // replace `userId` with `id`
      },
    })

    if (userSubscription && userSubscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: userSubscription.stripeCustomerId,
        return_url: settingsUrl,
      })

      return new NextResponse(JSON.stringify({ url: stripeSession.url }))
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: settingsUrl,
      cancel_url: settingsUrl,
      payment_method_types: ['card'],
      mode: 'subscription',
      billing_address_collection: 'auto',
      customer_email: user.emailAddresses[0].emailAddress,
      line_items: [
        {
          price_data: {
            currency: 'USD',
            product_data: {
              name: 'JARVIS Plus',
              description: 'Unlimited AI Generations',
            },
            unit_amount: 2000,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
      },
    })

    return new NextResponse(JSON.stringify({ url: stripeSession.url }))
  } catch (err) {
    console.log('[STRIPE_ERROR]', err)
    return new NextResponse('Internal error', { status: 500 })
  }
}

// import { auth, currentUser } from '@clerk/nextjs'
// import { NextResponse } from 'next/server'
// import prismadb from '@/lib/prismadb'
// import { stripe } from '@/lib/stripe'
// import { absoluteUrl } from '@/lib/utils'

// const settingsUrl = absoluteUrl('/dashboard')

// export async function GET() {
//   try {
//     const { userId } = auth()
//     const user = await currentUser()

//     if (!userId || !user) {
//       return new NextResponse('Unauthorized', { status: 401 })
//     }

//     // Try to find an existing subscription for the user
//     const userSubscription = await prismadb.userSubscription.findUnique({
//       where: {
//         userId: userId,
//       },
//     })

//     if (userSubscription) {
//       // If there's already a stripeCustomerId, direct the user to the billing portal
//       if (userSubscription.stripeCustomerId) {
//         const stripeSession = await stripe.billingPortal.sessions.create({
//           customer: userSubscription.stripeCustomerId,
//           return_url: settingsUrl,
//         })

//         return new NextResponse(JSON.stringify({ url: stripeSession.url }))
//       } else {
//         // Handle case where there's a user subscription record without a stripeCustomerId
//         // This situation might require additional logic or error handling.
//         console.log(
//           'UserSubscription found without a stripeCustomerId',
//           userSubscription
//         )
//         // Implement appropriate fallback or error handling here
//       }
//     } else {
//       // If no subscription exists, create a new checkout session
//       const stripeSession = await stripe.checkout.sessions.create({
//         success_url: settingsUrl,
//         cancel_url: settingsUrl,
//         payment_method_types: ['card'],
//         mode: 'subscription',
//         billing_address_collection: 'auto',
//         customer_email: user.emailAddresses[0].emailAddress, // Ensure this is the correct way to access email
//         line_items: [
//           {
//             price_data: {
//               currency: 'USD',
//               product_data: {
//                 name: 'JARVIS Plus',
//                 description: 'Unlimited AI Generations',
//               },
//               unit_amount: 2000, // Ensure this amount is correct
//               recurring: {
//                 interval: 'month',
//               },
//             },
//             quantity: 1,
//           },
//         ],
//         metadata: {
//           userId: userId, // Pass the userId to handle it later in webhook
//         },
//       })

//       return new NextResponse(JSON.stringify({ url: stripeSession.url }))
//     }
//   } catch (err) {
//     console.error('[STRIPE_ERROR]', err)
//     return new NextResponse('Internal error', { status: 500 })
//   }
// }
