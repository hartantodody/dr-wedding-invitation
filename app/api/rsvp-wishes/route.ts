import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { containsProfanity } from '@/constant/profanity'
import {
  createRsvpWish,
  ensureRsvpWishesSchema,
  listRsvpWishes,
  type AttendanceStatus
} from '@/lib/rsvpWishesStore'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_NAME_CHARS = 60
const MIN_NAME_CHARS = 2
const MAX_WISH_CHARS = 320
const MIN_WISH_CHARS = 5

function normalizeText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function isAttendanceStatus(value: unknown): value is AttendanceStatus {
  return value === 'attending' || value === 'not-attending'
}

export async function GET() {
  try {
    await ensureRsvpWishesSchema()
    const entries = await listRsvpWishes(200)

    return NextResponse.json(
      { entries },
      {
        headers: { 'Cache-Control': 'no-store' }
      }
    )
  } catch (error) {
    console.error('Failed to load RSVP wishes.', error)

    return NextResponse.json(
      { error: 'Failed to load guest messages.' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await ensureRsvpWishesSchema()

    const body = (await request.json().catch(() => null)) as
      | {
          name?: unknown
          attendance?: unknown
          message?: unknown
        }
      | null

    const name = normalizeText(body?.name).slice(0, MAX_NAME_CHARS)
    const message = normalizeText(body?.message).slice(0, MAX_WISH_CHARS)
    const attendance = body?.attendance

    if (
      name.length < MIN_NAME_CHARS ||
      message.length < MIN_WISH_CHARS ||
      !isAttendanceStatus(attendance)
    ) {
      return NextResponse.json(
        { error: 'Invalid input. Please check your data.' },
        { status: 400 }
      )
    }

    if (containsProfanity(name) || containsProfanity(message)) {
      return NextResponse.json(
        { error: 'Please use respectful language without profanity.' },
        { status: 400 }
      )
    }

    const entry = await createRsvpWish({
      id: randomUUID(),
      name,
      attendance,
      message
    })

    return NextResponse.json({ entry }, { status: 201 })
  } catch (error) {
    console.error('Failed to save RSVP wish.', error)

    return NextResponse.json(
      { error: 'Failed to save your message.' },
      { status: 500 }
    )
  }
}

