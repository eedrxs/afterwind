import * as jit from "./jit"
import { equal } from "./array"
import { getClassNameDecls } from "./getClassNameDecls"
import { getClassNameMeta } from "./getClassNameMeta"
import { AtRule, Node, Rule } from "postcss"
import { State } from "./state"

function isAtRule(node: Node): node is AtRule {
  return node.type === "atrule"
}

function isKeyframes(rule: Rule): boolean {
  let parent = rule.parent
  if (!parent) {
    return false
  }
  if (isAtRule(parent) && parent.name === "keyframes") {
    return true
  }
  return false
}

function getRuleProperties(rule: Rule): string[] {
  let properties: string[] = []
  rule.walkDecls(({ prop }) => {
    properties.push(prop)
  })
  // if (properties.findIndex((p) => !isCustomProperty(p)) > -1) {
  //   properties = properties.filter((p) => !isCustomProperty(p))
  // }
  return properties
}

export default function cssConflict(classNames: string[]): boolean {
  const conflictingClassName = classNames.find((className, index) => {
    // if (state.jit) {
    //   let { rules } = jit.generateRules(
    //     state,
    //     [className],
    //     (rule) => !isKeyframes(rule)
    //   )
    //   if (rules.length === 0) {
    //     return
    //   }

    //   let info: Array<{ context: string[]; properties: string[] }> = rules.map(
    //     (rule) => {
    //       let properties = getRuleProperties(rule)
    //       let context = jit.getRuleContext(state, rule, className)
    //       return { context, properties }
    //     }
    //   )

    //   let otherClassNames = classNames.filter((_className, i) => i !== index)

    //   let conflictingClassName = otherClassNames.find((otherClassName) => {
    //     let { rules: otherRules } = jit.generateRules(
    //       state,
    //       [otherClassName],
    //       (rule) => !isKeyframes(rule)
    //     )
    //     if (otherRules.length !== rules.length) {
    //       return false
    //     }

    //     let propertiesAreComparable = false

    //     for (let i = 0; i < otherRules.length; i++) {
    //       let otherRule = otherRules[i]
    //       let properties = getRuleProperties(otherRule)
    //       if (info[i].properties.length > 0 && properties.length > 0) {
    //         propertiesAreComparable = true
    //       }
    //       if (!equal(info[i].properties, properties)) {
    //         return false
    //       }
    //       let context = jit.getRuleContext(
    //         state,
    //         otherRule,
    //         otherClassName
    //       )
    //       if (!equal(info[i].context, context)) {
    //         return false
    //       }
    //     }

    //     if (!propertiesAreComparable) {
    //       return false
    //     }

    //     return true
    //   })

    //   return conflictingClassName ? true : false
    // }

    let decls = getClassNameDecls(state, className)
    if (!decls) return

    let properties = Object.keys(decls)
    let meta = getClassNameMeta(state, className)

    let otherClassNames = classNames.filter((_className, i) => i !== index)

    let conflictingClassName = otherClassNames.find((otherClassName) => {
      let otherDecls = getClassNameDecls(state, otherClassName)
      if (!otherDecls) return false

      let otherMeta = getClassNameMeta(state, otherClassName)

      return (
        otherMeta &&
        meta &&
        equal(properties, Object.keys(otherDecls)) &&
        !Array.isArray(meta) &&
        !Array.isArray(otherMeta) &&
        equal(meta.context, otherMeta.context) &&
        equal(meta.pseudo, otherMeta.pseudo) &&
        meta.scope === otherMeta.scope
      )
    })

    return conflictingClassName ? true : false
  })

  return conflictingClassName ? true : false
}

const state: State = {
  enabled: true,
  classNames: {
    context: {},
    classNames: {},
  },
  separator: "",
}
