# Delight Checklist

For projects with a positive, calming, or playful tone (habit trackers, casual games, journaling apps, kid-friendly tools), explicitly look for small moments of delight. Functional-but-flat is the default failure mode for AI-built UIs.

---

## What to consider

- Micro-animation on milestones (streak hit, level up, week complete, achievement unlocked)
- Subtle sound effect on positive actions — optional, user-toggleable, off by default
- Confetti or particle burst on major wins. Tasteful — don't make it Vegas
- Encouraging empty states ("Nothing here yet — let's start your first one")
- Smooth transitions between screens, not jarring cuts
- Haptic feedback on mobile for confirmations, where supported
- Loading states that don't feel like waiting (skeletons, animated progress)
- Personality in copy. "Nice work" beats "Submission successful"

---

## Rules

- **Earned, not constant.** A celebration on every click trains the user to ignore them. Reserve animation for moments that actually matter.
- **Skippable.** Animations should respect `prefers-reduced-motion`. Sounds should default off.
- **Subtle by default.** When in doubt, dial it back.
- **Test on yourself.** If you're building a habit tracker, the feel matters more than the feature list. Use it for a week before declaring it done.
- **Ask the human for "feel" feedback.** Subjective polish is hard to automate. The human's eye is the test.

---

## When to skip

- Speed Run Mode (skip entirely)
- Internal tools, dashboards, dev utilities
- Anything serious (medical, financial, regulatory). Delight is wrong tone there. Use clarity, calm confirmations, and clean error states instead.

---

## Anti-patterns

- **Confetti everywhere.** Save it for genuine milestones.
- **Sound on by default.** Will get the app uninstalled.
- **Fade-in on every render.** It looks broken, not polished.
- **Cute copy in error states.** "Whoopsie daisy!" when the user just lost data is hostile.
- **Animation that blocks input.** If I clicked something and have to wait for an animation before I can click the next thing, the animation is a bug.
