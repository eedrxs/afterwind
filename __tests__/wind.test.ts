import wind, {Wind} from "../index"
import { twMerge } from "tailwind-merge"
import { overrideTailwindClasses } from "tailwind-override"

const classStr =
  "[@supports(display:grid)]:hover:grid [@media(any-hover:hover){&:hover}]:opacity-100 dark:md:group-hover:-px-5 md:peer-focus:text-[2rem] [&:nth-child(3)]:hover:underline hover:[&:nth-child(3)]:text-[length:var(--my-var)] [mask-type:luminance] hover:[mask-type:alpha] [--scroll-offset:56px] lg:[--scroll-offset:44px]"

test("reproducibility", () => {
  const style = wind(classStr)

  expect(style.toString()).toBe(classStr)
  expect(twMerge(classStr)).toBe(classStr)
  expect(overrideTailwindClasses(classStr)).toBe(classStr)
})

test("extensibility", function() {
  const style = wind(classStr)
  const newClassStr = "border border-white border-dashed"
  const extClassStr = classStr + " " + newClassStr

  expect(style.add(newClassStr).toString()).toBe(extClassStr)
  expect(twMerge(classStr, newClassStr)).toBe(extClassStr)
  expect(overrideTailwindClasses(classStr + " " + newClassStr)).toBe(extClassStr)
})

test('overridability', () => {
  const classStr = "p-3 px-4 border-white text-[3em]"
  const newClassStr = "pl-2 border-[#FFF] text-lg"
  const expectedStr = "p-3 px-4 pl-2 border-[#FFF] text-lg"
  const style = wind(classStr)

  expect(style.add(newClassStr).toString()).toBe(expectedStr)
  expect(twMerge(classStr, newClassStr)).toBe(expectedStr)
  expect(overrideTailwindClasses(classStr + " " + newClassStr)).toBe(expectedStr)
})

test('reducability', () => {
  const classStr = "p-3 px-4 border-white text-[3em]"
  const newClassStr = "pl-2 border-[#FFF] text-lg"
  const expectedStr = "p-3 px-4 pl-2 border-[#FFF] text-lg"
  const style = wind(classStr)

  expect(style.add(newClassStr).toString()).toBe(expectedStr)
  expect(twMerge(classStr, newClassStr)).toBe(expectedStr)
  expect(overrideTailwindClasses(classStr + " " + newClassStr)).toBe(expectedStr)
})
