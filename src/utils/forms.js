export function onlyDigits(value, maxLength = 10) {
  return String(value || '').replace(/\D/g, '').slice(0, maxLength)
}

export function phoneInputProps() {
  return {
    type: 'tel',
    inputMode: 'numeric',
    autoComplete: 'tel',
    pattern: '[0-9]{10}',
    maxLength: 10,
    placeholder: '10 dígitos',
  }
}

export function postalCodeInputProps() {
  return {
    inputMode: 'numeric',
    pattern: '[0-9]{5}',
    maxLength: 5,
    placeholder: '5 dígitos',
  }
}
