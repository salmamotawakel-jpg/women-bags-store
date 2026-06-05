import { sanityClient } from '../../../sanity/lib/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Webhook received body:', JSON.stringify(body, null, 2));

    if (body._type !== 'order') {
      console.log('Not an order, ignoring');
      return NextResponse.json({ message: 'Not an order' });
    }

    const products = body.products || [];
    console.log('Products in order:', products.length);

    if (products.length === 0) {
      return NextResponse.json({ message: 'No products' });
    }

    const transaction = sanityClient.transaction();

    for (const item of products) {
      // تأكد من وجود product._ref
      const productRef = item.product?._ref;
      const quantity = item.quantity;
      console.log(`Processing product ref: ${productRef}, quantity: ${quantity}`);
      if (!productRef) {
        console.error('Missing product reference for item:', item);
        continue;
      }
      transaction.patch(productRef, (patch) => patch.inc({ stock: -quantity }));
    }

    const result = await transaction.commit();
    console.log('Transaction successful:', result);
    return NextResponse.json({ success: true });
  } catch (error) {
  console.error('Webhook error:', error);

  if (error instanceof Error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
}};