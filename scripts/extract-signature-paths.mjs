import fs from 'node:fs'
import path from 'node:path'

const input = path.resolve('public/signature.svg')
const out = path.resolve('components/animation/signature/signature-paths.ts')

const svg = fs.readFileSync(input, 'utf8')

// Ambil viewBox
const viewBoxMatch = svg.match(/viewBox="([^"]+)"/i)
const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 1200 350'

// Ambil semua d="" dari <path ...>
const ds = [...svg.matchAll(/<path[^>]*\sd="([^"]+)"[^>]*>/gi)].map((m) => m[1])

if (!ds.length) {
  console.error(
    "No <path d='...'> found. Pastikan SVG sudah outline (bukan <text>)."
  )
  process.exit(1)
}

const ts = `// AUTO-GENERATED. Do not edit manually.
// Source: public/signature.svg

export const SIGNATURE_VIEWBOX = "${viewBox}" as const

export const SIGNATURE_PATHS = ${JSON.stringify(ds)} as const
`

fs.mkdirSync(path.dirname(out), { recursive: true })
fs.writeFileSync(out, ts, 'utf8')

console.log(`✅ Extracted ${ds.length} paths`)
console.log(`✅ viewBox: ${viewBox}`)
console.log(`✅ written: ${out}`)
