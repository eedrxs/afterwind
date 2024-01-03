/**
 * The code in this file is copied from https://github.com/lukeed/clsx and modified to suit the needs of afterwind better.
 *
 * Specifically:
 * - Runtime code from https://github.com/lukeed/clsx/blob/master/src/index.js
 * - TypeScript types from https://github.com/lukeed/clsx/blob/master/clsx.d.ts
 *
 * Original code has MIT license: Copyright (c) Luke Edwards <luke.edwards05@gmail.com> (lukeed.com)
 */

import { Wind } from "../../../index";
import { ClassValue } from "./clsx";

function toVal(mix: ClassValue) {
	var k, y, str='';

	if (typeof mix === 'string' || typeof mix === 'number') {
		str += mix;
	} else if (typeof mix === 'object' && mix !== null) {
    if (mix instanceof Wind) {
      if (y = mix.toString()) {
        str && (str += ' ');
				str += y;
      }
    } else if (Array.isArray(mix)) {
			var len=mix.length;
			for (k=0; k < len; k++) {
				if (mix[k]) {
					if (y = toVal(mix[k])) {
						str && (str += ' ');
						str += y;
					}
				}
			}
		} else {
			for (y in mix) {
				if (mix[y]) {
					str && (str += ' ');
					str += y;
				}
			}
		}
	}

	return str;
}

export function clsx(...inputs: ClassValue[]) {
	var i=0, tmp, x, str='', len=inputs.length;
	for (; i < len; i++) {
		if (tmp = inputs[i]) {
			if (x = toVal(tmp)) {
				str && (str += ' ');
				str += x
			}
		}
	}
	return str;
}

export default clsx;