"use strict";
function parse(str) { }
function wind(str) {
    let style = new Wind(str);
    return style;
}
class Wind {
    constructor(str = "") {
        this.str = str;
    }
    add(str) {
        this.str += ` ${str}`;
    }
    remove(str) {
        this.str = this.str.replace(` ${str}`, "");
    }
    replace(removeStr, addStr) {
        this.remove(removeStr);
        this.add(addStr);
    }
    prepend(str) {
        let tokens = str.split(" ");
        for (let token of tokens) {
            if (this.has(token)) {
                this.remove(token);
            }
            this.add(token);
        }
    }
    append(str) {
        let tokens = str.split(" ");
        for (let token of tokens) {
            if (!this.has(token)) {
                this.add(token);
            }
        }
    }
    has(str) {
        let selector = str.split('-')[0];
        let regex = new RegExp(`${selector}[-\\s]+`);
        return regex.test(this.str);
    }
    log() {
        console.log(this.str);
    }
}
// possibly add color manipulation feature
let style = wind('bg-red text-sm');
style.log();
style.add('font-medium');
style.log();
style.remove('text-sm');
style.log();
style.append('bg-green text-lg');
style.log();
style.prepend('bg-blue rounded');
style.log();
