import hslRegex from 'hsl-regex'
import hslaRegex from 'hsla-regex'
import rgbRegex from 'rgb-regex'
import rgbaRegex from 'rgba-regex'
import rgbHex from 'rgb-hex'
import hexRgb from 'hex-rgb'
import hslRgb from 'hsl-to-rgb-for-reals'
import hexHsl from 'hex-to-hsl'

const rgbHsl = function(color) {
  // the npm package for this was kind of crappy.
  // it's easier and more reliable to convert this ourselves.
  let hex = rgbHex(color)
  return hexHsl(hex)
}

const rgbaHsla = function(color) {
  // alpha stuff gets kinda tricky here. extracting the logic.
  // eslint-disable-next-line
  let [_, red, green, blue, alpha] = rgbaRegex({ exact: true }).exec(color)
  let [h, s, l] = rgbHsl(`rgb(${red}, ${green}, ${blue})`)
  return `hsla(${h}, ${s}%, ${l}%, ${alpha})`
}

// hsl <-> hex

// the HSL to HEX package on npm simply converts HSL to RGB, then RGB to HEX.
// we can do that here ourselves:
const hslHex = function(hslInput) {
  let rgb = convertHslRgb(hslInput)
  let result = rgbHex(rgb)
  return `#${result}`
}

// ==================================
// helper functions
// ==================================

function isHex(str) {
  // optional # at beginning
  // matches a-f, A-F, 0-9 exactly 6 or 3 times
  let hexRegex = /^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/
  return hexRegex.test(str)
}

function isHexa(str) {
  // optional # at beginning
  // matches a-f, A-F, 0-9 exactly 8 times
  let hexaRegex = /^#?[0-9a-fA-F]{8}$/
  return hexaRegex.test(str)
}

function isRgb(str) {
  return rgbRegex({ exact: true }).test(str)
}

function isRgba(str) {
  return rgbaRegex({ exact: true }).test(str)
}

function isHsl(str) {
  return hslRegex({ exact: true }).test(str)
}

function isHsla(str) {
  return hslaRegex({ exact: true }).test(str)
}

function isValidColor(str) {
  return isHex(str) || isHexa(str) || isRgb(str) || isRgba(str) || isHsl(str) || isHsla(str)
}

function parseHsl(hslString) {
  // eslint-disable-next-line
  const [_, hue, saturation, lightness] = hslRegex({ exact: true }).exec(hslString)
  return { hue, saturation, lightness }
}

function parseHsla(hslaString) {
  // eslint-disable-next-line
  const [_, hue, saturation, lightness, alpha] = hslaRegex({ exact: true }).exec(hslaString)
  return { hue, saturation, lightness, alpha }
}

// ==================================
// logic functions
// ==================================

function convertHslRgb(hslInput) {
  let parsed, hue, saturation, lightness, alpha
  if (isHsl(hslInput)) {
    parsed = parseHsl(hslInput)
  } else if (isHsla(hslInput)) {
    parsed = parseHsla(hslInput)
  } else {
    return
  }

  hue = parseInt(parsed.hue)
  saturation = parseFloat(parsed.saturation.replace('%', '')) / 100
  lightness = parseFloat(parsed.lightness.replace('%', '')) / 100
  alpha = parsed.alpha

  const [red, green, blue] = hslRgb(hue, saturation, lightness)

  if (isHsla(hslInput)) {
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`
  }
  return `rgb(${red}, ${green}, ${blue})`
}

function convertColor(color, outputType) {
  if (!isValidColor(color)) return

  if (isHex(color)) {
    // possible options are rgb or hsl
    if (outputType === 'rgb') {
      let { red, green, blue } = hexRgb(color)
      return `rgb(${red}, ${green}, ${blue})`
    } else if (outputType === 'hsl') {
      let [h, s, l] = hexHsl(color)
      return `hsl(${h}, ${s}%, ${l}%)`
    }
  } else if (isHexa(color)) {
    // possible options are rgba or hsla
    if (outputType === 'rgba') {
      let { red, green, blue, alpha } = hexRgb(color)

      alpha = parseFloat(alpha).toFixed(2)
      if (alpha.endsWith(0)) {
        alpha = parseFloat(alpha).toFixed(1)
      }

      return `rgba(${red}, ${green}, ${blue}, ${alpha})`
    } else if (outputType === 'hsla') {
      const hexWithoutAlpha = color.slice(0, -2)
      const [h, s, l] = hexHsl(hexWithoutAlpha)
      let { alpha } = hexRgb(color)
      alpha = parseFloat(alpha).toFixed(2)
      if (alpha.endsWith(0)) {
        alpha = parseFloat(alpha).toFixed(1)
      }

      return `hsla(${h}, ${s}%, ${l}%, ${alpha})`
    }
  } else if (isRgb(color)) {
    // possible options are hex or hsl
    if (outputType === 'hex') {
      let result = rgbHex(color)
      return `#${result}`
    } else if (outputType === 'hsl') {
      let [h, s, l] = rgbHsl(color)
      return `hsl(${h}, ${s}%, ${l}%)`
    }
  } else if (isRgba(color)) {
    // possible options are hexa or hsla
    if (outputType === 'hexa') {
      let result = rgbHex(color)
      return `#${result}`
    } else if (outputType === 'hsla') {
      return rgbaHsla(color)
    }
  } else if (isHsl(color)) {
    // possible options are rgb or hex
    if (outputType === 'hex') {
      return hslHex(color)
    } else if (outputType === 'rgb') {
      return convertHslRgb(color)
    }
  } else if (isHsla(color)) {
    // possible options are rgba or hexa
    if (outputType === 'hexa') {
      return hslHex(color)
    } else if (outputType === 'rgba') {
      return convertHslRgb(color)
    }
  }
}

// ==================================
// Our exports go here
// ==================================

const converter = {
  isHex(str) {
    return isHex(str)
  },
  getConversionOptionsFromColor(color) {
    let result
    if (isHex(color)) {
      result = [
        { label: 'RGB', value: 'rgb' },
        { label: 'HSL', value: 'hsl' }
      ]
    } else if (isHexa(color)) {
      result = [
        { label: 'RGBA', value: 'rgba' },
        { label: 'HSLA', value: 'hsla' }
      ]
    } else if (isRgb(color)) {
      result = [
        { label: 'HEX', value: 'hex' },
        { label: 'HSL', value: 'hsl' }
      ]
    } else if (isRgba(color)) {
      result = [
        { label: 'HEX', value: 'hexa' },
        { label: 'HSLA', value: 'hsla' }
      ]
    } else if (isHsl(color)) {
      result = [
        { label: 'HEX', value: 'hex' },
        { label: 'RGB', value: 'rgb' }
      ]
    } else if (isHsla(color)) {
      result = [
        { label: 'HEX', value: 'hexa' },
        { label: 'RGBA', value: 'rgba' }
      ]
    }

    return result
  },
  isValidColor(color) {
    return isValidColor(color)
  },
  convertColor(color, outputType) {
    return convertColor(color, outputType)
  }
}

export default converter