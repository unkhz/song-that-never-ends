// Words for powers of a thousand from one thousand (10^3) up to one nonillion (10^30)
const scales: string[] = [
  '',
  'thousand',
  'million',
  'billion',
  'trillion',
  'quadrillion',
  'quintillion',
  'sextillion',
  'septillion',
  'octillion',
  'nonillion',
  // Feel free add more scales, if you're still running the program. The
  // estimated time for "nonillion" iterations of the song would be many orders
  // of magnitude longer than the current estimated age of the universe, which
  // is about 13.8 billion years.
]

// Words for numbers from zero to nineteen
const unitsAndTeens = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
]

// Words for multiples of ten from twenty to ninety
const tens = [
  '',
  '',
  'twenty',
  'thirty',
  'forty',
  'fifty',
  'sixty',
  'seventy',
  'eighty',
  'ninety',
]

function isExactMultiple(num: number, divisor: number): boolean {
  return num % divisor === 0
}

export function numberToWords(num: number): string {
  if (num < 20) {
    return unitsAndTeens[num]
  } else if (num < 100) {
    const tensWord = tens[Math.floor(num / 10)]
    return isExactMultiple(num, 10)
      ? tensWord
      : `${tensWord}-${unitsAndTeens[num % 10]}`
  } else if (num < 1000) {
    const hundreds = unitsAndTeens[Math.floor(num / 100)]
    return isExactMultiple(num, 100)
      ? `${hundreds} hundred`
      : `${hundreds} hundred and ${numberToWords(num % 100)}`
  } else {
    let scaleIndex = 0
    let scaleValue = 1000
    while (scaleValue <= num) {
      scaleIndex++
      scaleValue *= 1000
    }
    const scaleWord = scales[scaleIndex]
    const scaleMultiplier = Math.pow(1000, scaleIndex)
    const scaleNumber = Math.floor(num / scaleMultiplier)
    return isExactMultiple(num, scaleMultiplier)
      ? `${numberToWords(scaleNumber)} ${scaleWord}`
      : `${numberToWords(scaleNumber)} ${scaleWord}, ${numberToWords(
          num % scaleMultiplier
        )}`
  }
}
