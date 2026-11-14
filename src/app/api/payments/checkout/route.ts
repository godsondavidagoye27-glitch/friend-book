import { NextRequest, NextResponse } from 'next/server';
import { getStripeClient } from '@/lib/stripe';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const amount = Number(body.amount ?? body.totalCents ?? 0);
    const bookingId = String(body.bookingId ?? crypto.randomUUID());
    const hostName = String(body.hostName ?? 'FriendBook host');
    const bookingDate = String(body.date ?? 'Today');
    const bookingTime = String(body.time ?? '6:30 PM');
    const duration = Number(body.duration ?? 2);
    const place = String(body.place ?? 'Café Luna');

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'A valid payment amount is required.' }, { status: 400 });
    }

    const stripe = getStripeClient();
    const origin = request.headers.get('origin') ?? 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(amount * 100),
            product_data: {
              name: `${hostName} booking`,
              description: 'FriendBook host booking payment',
            },
          },
        },
      ],
      metadata: {
        bookingId,
        hostName,
        bookingDate,
        bookingTime,
        duration: String(duration),
        place,
      },
      success_url: `${origin}/bookings?checkout=success&booking_id=${encodeURIComponent(bookingId)}&hostName=${encodeURIComponent(hostName)}&date=${encodeURIComponent(bookingDate)}&time=${encodeURIComponent(bookingTime)}&duration=${encodeURIComponent(String(duration))}&place=${encodeURIComponent(place)}&total=${encodeURIComponent(String(amount))}`,
      cancel_url: `${origin}/map?checkout=cancelled`,
      automatic_tax: { enabled: false },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      bookingId,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unable to create a Stripe checkout session.',
      },
      { status: 500 },
    );
  }
}
