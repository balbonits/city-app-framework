// Did the agent's final message lay out alternatives for the human to choose from?
// Needs both: an enumerated list with at least two items, and a choice marker
// (a pick, a recommendation, or a question). Wording-neutral on purpose: an earlier
// version matched "recommend" and missed replies that said "My pick".
const ITEM = /^\s*(?:[-*]\s+)?(?:\d+[.)]|\*\*[A-C][).:]|[A-C][).:]|\*\*Option\b)/i;
const CHOICE = /\b(my pick|pick(?:ed)?:|recommend\w*|i'?d (?:go with|pick|suggest|lean)|suggest\w*|prefer\w*|lean(?:ing)? toward|would you like|want me to|should i|which (?:one|option|approach|do you want))\b|\?\s*$/im;

export function offersOptions(reply = '') {
  const items = reply.split('\n').filter((line) => ITEM.test(line)).length;
  return items >= 2 && CHOICE.test(reply);
}
