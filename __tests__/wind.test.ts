import wind from ".."
import{twMerge} from 'tailwind-merge'
import { overrideTailwindClasses } from 'tailwind-override'

const classStr =
  "[@supports(display:grid)]:hover:grid [@media(any-hover:hover){&:hover}]:opacity-100 dark:md:group-hover:-px-5 md:peer-focus:text-[2rem] [&:nth-child(3)]:hover:underline hover:[&:nth-child(3)]:text-[length:var(--my-var)] [mask-type:luminance] hover:[mask-type:alpha] [--scroll-offset:56px] lg:[--scroll-offset:44px]"

test("reproducibility", () => {
  const style = wind(classStr)

  expect(style.toString()).toBe(classStr)
  expect(twMerge(classStr)).toBe(classStr)
  expect(overrideTailwindClasses(classStr)).toBe(classStr)
})

test('extensibility', () => {
  const style = wind(classStr)
  const extClassStr = classStr + " border border-white border-dashed"

  expect(style.toString()).toBe(classStr)
  expect(twMerge(classStr)).toBe(classStr)
  expect(overrideTailwindClasses(classStr)).toBe(classStr)
})

test('compasability', () => {
  const style = wind(classStr)

  expect(style.toString()).toBe(classStr)
  expect(twMerge(classStr)).toBe(classStr)
  expect(overrideTailwindClasses(classStr)).toBe(classStr)
})

test('overridability', () => {
  const style = wind(classStr)

  expect(style.toString()).toBe(classStr)
  expect(twMerge(classStr)).toBe(classStr)
  expect(overrideTailwindClasses(classStr)).toBe(classStr)
})