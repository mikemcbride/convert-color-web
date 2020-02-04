import hexRgb from 'hex-rgb'

const VALID_HEX_REGEX = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

function isValidHex(str) {
  return VALID_HEX_REGEX.test(str)
}

const getRating = function(contrast) {
  if (contrast < 3) {
    return 'Fails AA'
  } else if (contrast < 4.5) {
    return 'Passes AA with large (>= 18px) or bold font'
  } else if (contrast < 7) {
    return 'Passes AA'
  } else {
    return 'Passes AAA'
  }
}

// http://www.w3.org/WAI/GL/wiki/Relative_luminance
function relativeLuminance({ red, green, blue }) {
  let [r, g, b] = [red, green, blue].map(c => {
    c = c / 255

    if (c <= 0.03928) {
      return c / 12.92
    }

    return Math.pow((c + 0.055) / 1.055, 2.4)
  })

  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

// http://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html#key-terms
const getContrast = function(str1, str2) {
  const L1 = relativeLuminance(hexRgb(str1))
  const L2 = relativeLuminance(hexRgb(str2))

  if (L1 < L2) {
    return (L2 + 0.05) / (L1 + 0.05)
  }

  return (L1 + 0.05) / (L2 + 0.05)
}

export { getContrast, isValidHex, getRating }

export default {
  getContrast,
  isValidHex,
  getRating
}