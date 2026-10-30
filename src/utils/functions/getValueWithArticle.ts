export const getValueWithArticle = (value: string): string => {
  if (!value) return ''

  const vowels = ['a', 'e', 'i', 'o', 'u']
  const firstLetter = value.charAt(0).toLowerCase()

  const article = vowels.includes(firstLetter) ? 'an' : 'a'
  return `${article} ${value}`
}

export const toProperCase = (text: string | undefined): string => {
  if (!text) return ''
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
