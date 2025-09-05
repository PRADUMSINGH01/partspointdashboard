import { NextResponse } from 'next/server'
import { adminDb } from '@/firebase/firebase' // Firestore Admin instance

export async function POST(req) {
  try {
    const { productId, newStock } = await req.json()

    if (!productId || newStock === undefined) {
      return NextResponse.json(
        { error: 'productId and newStock are required' },
        { status: 400 }
      )
    }

    // Update stock in Firestore
    await adminDb.collection('CarModels').doc(productId).update({
      stock: newStock,
      updatedAt: new Date()
    })

    return NextResponse.json(
      { message: 'Stock updated successfully', productId, newStock },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: error?.message ?? 'Failed to update stock' },
      { status: 500 }
    )
  }
}
