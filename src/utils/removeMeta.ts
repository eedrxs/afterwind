import isObject from './isObject'

export default function removeMeta(obj: any): any {
  let result: any = {}
  for (let key in obj) {
    if (key.substr(0, 2) === '__') continue
    if (isObject(obj[key])) {
      result[key] = removeMeta(obj[key])
    } else {
      result[key] = obj[key]
    }
  }
  return result
}
