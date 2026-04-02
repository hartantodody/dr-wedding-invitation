const PROFANITY_WORDS = [
  'anjing',
  'anjir',
  'anjay',
  'brengsek',
  'bangsat',
  'bajingan',
  'goblok',
  'tolol',
  'bego',
  'asu',
  'tai',
  'kampret',
  'kontol',
  'peler',
  'titit',
  'pepek',
  'memek',
  'sialan',
  'jancuk',
  'jancok',
  'cuk',
  'ngentot',
  'bitch',
  'bastard',
  'asshole',
  'dick',
  'fuck',
  'motherfucker',
  'pussy',
  'shit',
  'ewe',
  'seggs',
  'sex',
  'penis',
  'vagina',
  'cum',
  'cumming',
  'cumshot',
  'cumshots',
  'fag',
  'faggot',
  'faggots',
  'fags',
  'faggotry',
  'fagot',
  'fagots',
  'fagotry',
  'fetish',
  'fetishes',
  'fetishism',
  'fetishist',
  'fetishists',
  'fetishy',
  'fisting',
  'fistings',
  'fistingy',
  'fisty',
  'fistys',
  'fucks',
  'fucked',
  'fucker',
  'fuckers',
  'fucking',
  'motherfucking',
  'open bo',
  'openbo',
  'expo',
  'michat',
  'michats',
  'michatting',
  'lc',
  'loli',
  'nigger',
  'niggers',
  'niggerly',
  'nigga',
  'niggas',
  'niggaz',
  'niggery',
  'niggle',
  'niggles',
  'niggley',
  'nipple',
  'nipples',
  'nippley',
  'nudity',
  'nude',
  'nudes',
  'pussies',
  'pussylicking',
  'pussylicks',
  'pussylicky',
  'pussylips',
  'pussywank',
  'pussywanks',
  'pussywanky'
]

const PROFANITY_SHORTCUTS = new Set([
  'ajg',
  'anjg',
  'bgst',
  'bngst',
  'gblk',
  'fk',
  'fck',
  'fuk',
  'fkn',
  'brngsk',
  'jncuk',
  'jnck',
  'kntl',
  'mmk',
  'ngntt',
  'sln',
  'tlol'
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
