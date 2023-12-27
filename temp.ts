function parse(str: string) {}

function wind(str: string) {
  let style = new Wind(str)
  return style
}

class Wind {
  constructor(public str = "") {}

  add(str: string) {
    this.str += ` ${str}`
  }

  remove(str: string) {
    this.str = this.str.replace(` ${str}`, "")
  }

  replace(removeStr: string, addStr: string) {
    this.remove(removeStr)
    this.add(addStr)
  }

  prepend(str: string) {
    let tokens = str.split(" ")
    for (let token of tokens) {
      if (this.has(token)) {
        this.remove(token)
      }

      this.add(token)
    }
  }

  append(str: string) {
    let tokens = str.split(" ")
    for (let token of tokens) {
      if (!this.has(token)) {
        this.add(token)
      }
    }
  }

  has(str: string) {
    let selector = str.split('-')[0]
    let regex = new RegExp(`${selector}[-\\s]+`)
    return regex.test(this.str)
  }

  log() {
    console.log(this.str)
  }
}

// possibly add color manipulation feature
let style = wind('bg-red text-sm')
style.log()

style.add('font-medium')
style.log()

style.remove('text-sm')
style.log()

style.append('bg-green text-lg')
style.log()

style.prepend('bg-blue rounded')
style.log()