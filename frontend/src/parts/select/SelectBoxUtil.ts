export type Options<V = string> = {
  value:V,
  label:string
}
export function parseOptionObjects<T, V extends keyof T, L extends keyof T>(
  arr:T[],
  valueKey:V,
  labelKey:L
): Options<T[V]>[]{
  return arr.map(item => ({
    value:item[valueKey],
    label:String(item[labelKey])
  }))
}