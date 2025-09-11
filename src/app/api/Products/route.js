import { NextResponse } from 'next/server'
import { adminDb } from '@/firebase/firebase' // This should be your Firestore Admin instance

export async function GET() {
  try {
    const snapshot = await adminDb.collection('Products').get()
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    return NextResponse.json({ products }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: error?.message ?? 'Failed to fetch products from Firestore' },
      { status: 500 }
    )
  }
}
