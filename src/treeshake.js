/**
 * @arg {TokenResult} tokens
 * @returns {Array.<TokenResult>}
 */
export const treeshake = (tokens) => {
  const maps = tokens.filter(t => t.isMap)
  // t.token[0] is the name of the token definition
  // mappedToken.token[1] is the destination for the mapping
  const shakenDefs = tokens.filter(t => t.isDef).filter(t => maps.some(mappedToken => mappedToken.token[1] === t.token[0]))
  return [...shakenDefs, ...maps]
}
