import 'server-only'

import { Pool } from 'pg'

export type AttendanceStatus = 'attending' | 'not-attending'

export type RsvpWishEntry = {
  id: string
  name: string
  attendance: AttendanceStatus
  message: string
  createdAt: string
}

type RsvpWishRow = {
  id: string
  name: string
  attendance: AttendanceStatus
  message: string
  created_at: string | Date
}

declare global {
  var __drWeddingPool: Pool | undefined
  var __drWeddingRsvpSchemaReady: boolean | undefined
}

function getDatabaseUrl() {
  const databaseUrl =
    process.env.DATABASE_URL_POOLER?.trim() ??
    process.env.DATABASE_URL?.trim() ??
    process.env.SUPABASE_DATABASE_URL?.trim()

  if (!databaseUrl) {
    throw new Error(
      'Database URL is not configured. Set DATABASE_URL_POOLER or DATABASE_URL.'
    )
  }

  return databaseUrl
}

function createPool() {
  const databaseUrl = getDatabaseUrl()
  const useSsl =
    !databaseUrl.includes('localhost') && !databaseUrl.includes('127.0.0.1')

  return new Pool({
    connectionString: databaseUrl,
    ssl: useSsl ? { rejectUnauthorized: false } : false,
    max: 8,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000
  })
}

function getPool() {
  if (!global.__drWeddingPool) {
    global.__drWeddingPool = createPool()
  }

  return global.__drWeddingPool
}

function toRsvpWishEntry(row: RsvpWishRow): RsvpWishEntry {
  const createdAt =
    row.created_at instanceof Date
      ? row.created_at.toISOString()
      : new Date(row.created_at).toISOString()

  return {
    id: row.id,
    name: row.name,
    attendance: row.attendance,
    message: row.message,
    createdAt
  }
}

export async function ensureRsvpWishesSchema() {
  if (global.__drWeddingRsvpSchemaReady) return

  const pool = getPool()

  await pool.query(`
    create table if not exists public.rsvp_wishes (
      id text primary key,
      name varchar(60) not null,
      attendance varchar(20) not null check (attendance in ('attending', 'not-attending')),
      message varchar(320) not null,
      created_at timestamptz not null default now()
    );
  `)

  await pool.query(`
    create index if not exists rsvp_wishes_created_at_desc_idx
      on public.rsvp_wishes (created_at desc);
  `)

  global.__drWeddingRsvpSchemaReady = true
}

export async function listRsvpWishes(limit = 200): Promise<RsvpWishEntry[]> {
  const pool = getPool()

  const { rows } = await pool.query<RsvpWishRow>(
    `
      select id, name, attendance, message, created_at
      from public.rsvp_wishes
      order by created_at desc
      limit $1;
    `,
    [limit]
  )

  return rows.map(toRsvpWishEntry)
}

export async function createRsvpWish(input: {
  id: string
  name: string
  attendance: AttendanceStatus
  message: string
}): Promise<RsvpWishEntry> {
  const pool = getPool()

  const { rows } = await pool.query<RsvpWishRow>(
    `
      insert into public.rsvp_wishes (id, name, attendance, message)
      values ($1, $2, $3, $4)
      returning id, name, attendance, message, created_at;
    `,
    [input.id, input.name, input.attendance, input.message]
  )

  return toRsvpWishEntry(rows[0])
}
