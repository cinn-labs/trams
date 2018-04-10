export const objResult = (obj, pathName) => {
  const paths = splitPath(pathName)
  let result = obj

  for (let i = 0; i < paths.length; ++i) {
    result = result[paths[i]]
  }

  return result
}

export const splitPath = name => {
  return [].concat(...name.split('.').map(i => i.replace(']', '').split('[')))
}

export const ARRAY_NOTATION = '$ARRAY$'
export const splitPathWithArrayNotation = name => {
  return [].concat(...name.split('.').map(i => i.replace(']', ARRAY_NOTATION).split('[')))
}

export const hasArrayNotationOn = (array, index) => array[index].endsWith(ARRAY_NOTATION)
