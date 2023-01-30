/**
 * @arg {Array.<TokenResult>} tokens
 * @returns {Array.<TokenResult>}
 */
export const treeshake = (tokens) => {
  const maps = tokens.filter(t => t.isMap)
  const shakenDefs = tokens.filter(t => t.isDef).filter(t => maps.some(mappedToken => mappedToken.token.value === t.token.name))
  return [...shakenDefs, ...maps]
}
