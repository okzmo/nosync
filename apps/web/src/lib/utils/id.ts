import { init } from "@paralleldrive/cuid2";

export const cuid = init({
  random: Math.random,
  length: 24,
  fingerprint: 'front'
})
