const PROFANITY_WORDS = [
  'anjing',
  'brengsek',
  'bangsat',
  'bajingan',
  'goblok',
  'kampret',
  'kontol',
  'memek',
  'sialan',
  'jancuk',
  'ngentot',
  'fuck',
  'fucking',
  'bitch',
  'bastard',
  'asshole',
  'dick',
  'pussy',
  'shit',
  'ewe',
  'seggs',
  'sex'
]

const PROFANITY_SHORTCUTS = new Set([
  'bgst',
  'bngst',
  'fk',
  'fck',
  'fuk',
  'brngsk',
  'jncuk',
  'jnck',
  'kntl'
])

const LEET_REPLACEMENTS: Record<string, string> = {
  '0': 'o',
  '1': 'i',
  '3': 'e',
  '4': 'a',
  '5': 's',
  '7': 't',
  '@': 'a',
  $: 's',
  '!': 'i'
}

function toConsonantSignature(value: string): string {
  return value.replace(/[aeiou]/g, '')
}

function normalizeInput(value: string): string {
  return value
    .toLowerCase()
    .replace(
      /[013457@$!]/g,
      (character) => LEET_REPLACEMENTS[character] ?? character
    )
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const PROFANITY_SET = new Set(PROFANITY_WORDS)
const PROFANITY_SIGNATURES = new Set(
  PROFANITY_WORDS.map(toConsonantSignature).filter(Boolean)
)

export function containsProfanity(value: string): boolean {
  const normalized = normalizeInput(value)
  if (!normalized) return false

  const collapsed = normalized.replace(/\s+/g, '')
  const tokens = normalized.split(' ')

  for (const token of tokens) {
    if (PROFANITY_SET.has(token)) return true
    if (PROFANITY_SHORTCUTS.has(token)) return true

    const signature = toConsonantSignature(token)
    if (signature.length >= 3 && PROFANITY_SIGNATURES.has(signature)) {
      return true
    }
  }

  if (PROFANITY_SHORTCUTS.has(collapsed)) return true

  const collapsedSignature = toConsonantSignature(collapsed)
  if (
    collapsedSignature.length >= 3 &&
    PROFANITY_SIGNATURES.has(collapsedSignature)
  ) {
    return true
  }

  return PROFANITY_WORDS.some((word) => collapsed.includes(word))
}
