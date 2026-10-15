/**
 * Bayon pinta sus mayúsculas acentuadas (Á, Í, Ñ…) más gruesas y anchas que el
 * resto, y en titulares gigantes se nota. Se separa cada letra de su tilde
 * para dibujar la tilde aparte, sobre la letra base de Bayon.
 */
const MARKS: Record<string, string> = { '́': '´', '̀': '`', '̃': '˜', '̈': '¨', '̂': 'ˆ' }

export interface DisplayPart {
  text: string
  mark: string
}

/** Palabras separadas en tramos: cada palabra se mantiene unida al partir líneas. */
export function splitWords(text: string): DisplayPart[][] {
  return text.split(/\s+/).filter(Boolean).map(splitAccents)
}

export function splitAccents(text: string): DisplayPart[] {
  const parts: DisplayPart[] = []
  let plain = ''
  for (const char of text.toUpperCase()) {
    const [base = char, accent] = char.normalize('NFD')
    const mark = accent ? MARKS[accent] : undefined
    if (mark) {
      if (plain) parts.push({ text: plain, mark: '' })
      parts.push({ text: base, mark })
      plain = ''
    } else {
      plain += char
    }
  }
  if (plain) parts.push({ text: plain, mark: '' })
  return parts
}
