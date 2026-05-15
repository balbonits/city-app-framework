# Testing AI-Built Code

How to test code that AI agents wrote. Evidence-based — what the published literature actually says, with primary-source citations.

The core finding from the 2025-2026 literature: **AI generates plausible-but-wrong code more often than crashing-code, and AI-generated tests share the same blind spots as AI-generated implementations.** Coverage looks high. Mutation tests reveal the gap.

```mermaid
flowchart BT
    classDef unit fill:#065f46,stroke:#064e3b,color:#ffffff,stroke-width:2px
    classDef prop fill:#3730a3,stroke:#312e81,color:#ffffff,stroke-width:2px
    classDef integ fill:#1e40af,stroke:#1e3a8a,color:#ffffff,stroke-width:2px
    classDef e2e fill:#7c2d12,stroke:#9a3412,color:#ffffff,stroke-width:2px
    classDef gate fill:#854d0e,stroke:#713f12,color:#ffffff,stroke-width:2px

    U["fa:fa-cubes  Unit tests<br/><i>~70% — fast, isolated</i>"]:::unit
    P["fa:fa-shuffle  Property-based tests<br/><i>cross-cuts the pyramid</i>"]:::prop
    I["fa:fa-link  Integration tests<br/><i>~20% — real contracts</i>"]:::integ
    E["fa:fa-user-check  E2E tests<br/><i>~10% — user-visible flows</i>"]:::e2e
    M["fa:fa-flask  Mutation testing<br/><i>quality gate, not pyramid layer</i>"]:::gate

    U --> I --> E
    P -.->|finds blind spots| U
    P -.-> I
    M -.->|validates tests| U
    M -.-> I
```

---

## What AI generates badly (where tests are load-bearing)

Five documented failure modes from the 2025-2026 literature:

1. **Package and API hallucinations.** A 2025 USENIX Security paper studying 16 LLMs across 576k samples: commercial models hallucinate non-existent packages in 5.2% of generations; open-source models hit 21.7%; 205k unique fake package names ([Spracklen et al., 2025](https://arxiv.org/abs/2406.10279)). For low-frequency APIs, GPT-4o produced valid invocations only 38.58% of the time ([Liu et al., 2024](https://arxiv.org/abs/2407.09726)).

2. **Security defects.** 29.5% of AI-generated Python and 24.2% of JavaScript contained security weaknesses across 38 CWE categories ([Fu et al., TOSEM 2024](https://dl.acm.org/doi/10.1145/3716848)). Earlier work: 40% of Copilot suggestions in security-sensitive contexts had bugs ([Pearce et al., S&P 2022](https://gangw.cs.illinois.edu/class/cs562/papers/copilot-sp22.pdf)).

3. **Silent failure mode.** AI code "fails correctly-looking" — removes safety checks, fakes output formats, produces plausible-but-wrong results that pass functional tests but break on edge cases, timing, load, or state transitions ([IEEE Spectrum, 2025](https://spectrum.ieee.org/ai-coding-degrades); [Survey of Bugs in AI-Generated Code, arXiv 2512.05239](https://arxiv.org/html/2512.05239v1)).

4. **Race conditions.** Underrepresented in training data, frequently slip through ([DR.FIX, ACM 2025](https://dl.acm.org/doi/pdf/10.1145/3729265)).

5. **Hallucination taxonomy.** Liu et al. formalized three categories — Task Requirement Conflicts, Factual Knowledge Conflicts, Project Context Conflicts — splitting into eight subtypes ([Liu et al., ACM 2025](https://dl.acm.org/doi/abs/10.1145/3728894)).

**Implication:** edge cases, boundary inputs, error paths, type contracts at module boundaries, and concurrency need explicit tests. Trivial happy-path coverage gives false confidence.

---

## What AI generates well (lean on it)

Delegate freely:

- **Test scaffolding and fixture construction.** Boilerplate-heavy, well-defined.
- **Parameterized test cases.** AI is good at enumerating the obvious cases.
- **Snapshot baselines** for deterministic outputs (formatters, codegen, serialization).
- **Behavioral test naming.** AI writes good `describe`/`it` strings if it understands the code.

Reserve human attention for: invariants, contracts, edge cases, the *what should never happen* tests.

---

## The test pyramid for AI-built code

**The published consensus: same pyramid, more rigor at each level.**

Martin Fowler's pyramid still anchors guidance ([Fowler — TestPyramid](https://martinfowler.com/bliki/TestPyramid.html); [Fowler — Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)). The 2025 "Test Pyramid 2.0" paper explicitly preserves the ratio: "test execute speed and volume stays the same" ([Frontiers in AI, 2025](https://www.frontiersin.org/journals/artificial-intelligence/articles/10.3389/frai.2025.1695965/full)). What changes is *what AI does at each layer*, not the proportions.

Practitioner blogs argue for more integration tests in AI codebases — unit tests are most likely to be tautological under AI authorship; integration tests exercise real contracts ([minware, 2025](https://www.minware.com/blog/test-pyramid-ai-assisted-development); [Augment Code, 2025](https://www.augmentcode.com/guides/debugging-ai-generated-code-8-failure-patterns-and-fixes)). **No peer-reviewed paper backs a shifted ratio as of May 2026.**

Google's *Software Engineering at Google* still uses the small/medium/large taxonomy and 80/15/5 ratio for AI code review ([Google Cloud, 2025](https://cloud.google.com/blog/products/ai-machine-learning/gemini-code-assist-and-github-ai-code-reviews)).

**For this framework:** keep the classic pyramid. Add property-based testing (next section) as a cross-cutting layer, mutation testing as a quality gate.

---

## Property-based testing — the strongest evidence in the literature

This is where Anthropic, peer-reviewed academic work, and named practitioners converge.

**Anthropic Red Team's case study** used Claude Opus 4.1 + Hypothesis to find bugs in NumPy (Wald distribution negative values), AWS Lambda Powertools (iterator off-by-one), and Huggingface Tokenizers ([Anthropic Red, 2026](https://red.anthropic.com/2026/property-based-testing/)). Across 100 Python packages, 933 modules: 56% bug-report validity, rising to 86% with severity ranking ([arXiv 2510.09907, 2025](https://arxiv.org/html/2510.09907v1)). Cost: ~$9.93 per valid bug.

**Kiro's canonical "PBT catches what AI misses" case** ([Kiro Engineering, 2025](https://kiro.dev/blog/property-based-testing-fixed-security-bug/)): fast-check generated `"__proto__"` as input on trial 75 of 100, surfacing a prototype-pollution vulnerability in AI-written JavaScript that AI-generated unit tests had cleared. The argument: **"developers and LLMs share similar biases about what inputs to test."**

John Hughes (QuickCheck co-author) presented five property-strategy classes ([InfoQ, 2020](https://www.infoq.com/news/2020/02/property-based-testing-guide/)) — metamorphic and model-based properties show the highest bug-finding rates. Hillel Wayne has extended essays on writing useful properties ([Wayne — Finding Property Tests](https://www.hillelwayne.com/post/contract-examples/)).

**Recommended tools:**

| Language | Library |
| --- | --- |
| TypeScript / JavaScript | [fast-check](https://github.com/dubzzz/fast-check) |
| Python | [Hypothesis](https://hypothesis.readthedocs.io) |
| Rust | [proptest](https://github.com/proptest-rs/proptest), [quickcheck](https://github.com/BurntSushi/quickcheck) |
| Go | [Gopter](https://github.com/leanovate/gopter), `testing/quick` |

**When to write properties (per Hughes, Wayne):**

- **Idempotence** — `f(f(x)) == f(x)` for things that should be (sort, normalize, deduplicate).
- **Roundtrip** — `decode(encode(x)) == x` for codecs, serialization.
- **Metamorphic** — `f(g(x)) == h(f(x))` for known transformations.
- **Model-based** — your implementation matches a simpler reference.
- **Invariants** — properties that should hold over all valid inputs (no negative balances after settlement).

---

## Mutation testing — the quality gate for AI-built code

**The strongest single recommendation if you want one quality gate beyond coverage.**

Documented gap between coverage and mutation score for AI-generated tests:
- 30-40% mutation score with 90%+ coverage ([OutSight AI, 2025](https://medium.com/@outsightai/the-truth-about-ai-generated-unit-tests-why-coverage-lies-and-mutations-dont-fcd5b5f6a267); [twocents.software, 2026](https://www.twocents.software/blog/how-to-test-ai-generated-code-the-right-way/))
- Survival rates 15-25% higher on AI-generated code at equivalent coverage. *These specific numbers come from secondary sources; treat as directional.*

**Meta's ACH (Automated Compliance Hardening) is the strongest primary source** ([Meta Engineering, Sept 2025](https://engineering.fb.com/2025/09/30/security/llms-are-the-key-to-mutation-testing-and-better-compliance/)). LLM-driven mutation testing across Facebook, Instagram, WhatsApp, wearables. Privacy engineers accepted 73% of generated tests; 36% judged privacy-relevant; equivalence detection at 0.95 precision after preprocessing. Meta's framing: mutation testing was historically too expensive; LLMs make it tractable as a real safety net.

| Language | Tool |
| --- | --- |
| JavaScript / TypeScript | [Stryker](https://stryker-mutator.io/) |
| Python | [Mutmut](https://github.com/boxed/mutmut), MutPy |
| Java | [PIT](https://pitest.org/) |
| .NET | [Stryker.NET](https://learn.microsoft.com/en-us/dotnet/core/testing/mutation-testing) |

**Run mutation testing on critical paths only.** Full-suite mutation testing is slow; targeted is tractable.

---

## Test smells specific to AI

Five documented patterns AI defaults to. Each has a primary source.

### 1. Tautological tests

AI asserts on values constructed inside the test, not externally observable effects ([Adamo, 2025](https://davidadamojr.com/ai-generated-tests-are-lying-to-you/)). The canonical example: `divide(10, 0) == 0` — code wrongly returns 0 on divide-by-zero, AI generates a test asserting that wrong value, test passes, bug ships.

### 2. Ceremony tests

Mark Seemann's critique: AI-generated tests skip the scientific method because you never see them fail ([Seemann, Jan 2026](https://blog.ploeh.dk/2026/01/26/ai-generated-tests-as-ceremony/)). Recommended sabotage-and-revert validation: temporarily break the implementation, confirm the test fails, revert. If the test doesn't fail when sabotaged, it doesn't test anything.

### 3. Excessive mocking

Tests that mock the dependency, then assert the function returns the mocked payload. Validates the mock setup, not the contract ([dev.to postmortem, 2025](https://dev.to/jamesdev4123/when-ai-generated-tests-pass-but-miss-the-bug-a-postmortem-on-tautological-unit-tests-2ajp)).

### 4. "AI deletes tests to make them pass"

Documented in two named incidents:

1. Kent Beck explicitly discusses agents deleting tests to satisfy pass criteria ([Pragmatic Engineer, June 2025](https://newsletter.pragmaticengineer.com/p/tdd-ai-agents-and-coding-with-kent)).
2. The **typia port** postmortem documents three escalating evasions: 70% test deletion, lookup-table memorization (8B tokens consumed), and CI workflow editing to exclude failing test categories ([samchon, dev.to, 2025](https://dev.to/samchon/ai-deleted-my-tests-and-said-all-tests-pass-a-horror-story-from-porting-typia-from-typescript-2bmf)).

**The pattern:** when given a single signal (`pnpm test` is green), agents optimize for appearing to pass.

### 5. Smell-detector blind spots

Palomba et al.'s 2020 study found existing test-smell detection tools misclassified over 70% of smells in automatically-generated test suites ([Palomba et al., ACM 2020](https://dl.acm.org/doi/10.1145/3422392.3422412)). Heuristic detectors aren't reliable on AI-generated tests.

---

## TDD with AI agents

**Kent Beck is the most-cited authority.** Position: TDD is a "superpower" with AI agents — but agents will try to delete tests to make them pass, so humans must protect the suite ([Pragmatic Engineer, June 2025](https://newsletter.pragmaticengineer.com/p/tdd-ai-agents-and-coding-with-kent); [Heavybit O11ycast, 2025](https://www.heavybit.com/library/podcasts/o11ycast/ep-80-augmented-coding-with-kent-beck)). His "unpredictable genie" mental model is widely quoted.

**Mark Seemann's recommendation:** write tests by hand, let AI implement ([Seemann, 2026](https://blog.ploeh.dk/2026/01/26/ai-generated-tests-as-ceremony/)). Inverts the default workflow.

**Workflow primitives:** the growing community pattern is to enforce Red-Green-Refactor at the convention layer by putting TDD instructions at the top of `CLAUDE.md` / `AGENTS.md`, where AI weights early content higher ([alexop.dev, 2025](https://alexop.dev/posts/custom-tdd-workflow-claude-code-vue/); [Tweag agentic-coding-handbook, 2025](https://tweag.github.io/agentic-coding-handbook/WORKFLOW_TDD/)).

---

## Adversarial separation

**The strongest counter to test-gaming:** isolate the implementing agent from the test agent.

Codecentric's "Isolated Specification Testing" pattern ([Codecentric, 2025](https://www.codecentric.de/en/knowledge-hub/blog/dont-let-your-ai-cheat-isolated-specification-testing-with-claude-code)) uses `.claudeignore` and separate `CLAUDE.md` files so the implementation agent never reads test scenarios, while a separate black-box testing agent observes only via Playwright. Single-agent setups create optimization pressure to game tests.

**For this framework:** if you have repeated AI-test-gaming incidents, formalize the separation. A custom subagent for testing that has read-only access to specs and `Bash` for running tests, but cannot edit implementation files, fits cleanly.

---

## What other AI frameworks say about testing

State of practice is uneven; most documentation focuses on *how to invoke tests*, not *what makes tests good*.

- **OpenAI Codex's AGENTS.md** mandates deep-equality assertions, `pretty_assertions::assert_eq`, Insta snapshot coverage for UI changes with explicit `cargo insta accept`, no `env::set_var` in integration tests ([OpenAI Codex AGENTS.md](https://github.com/openai/codex/blob/main/AGENTS.md)).
- **OpenHands AGENTS.md** specifies test commands and 90%+ coverage targets on enterprise modules — procedural, not conceptual ([OpenHands AGENTS.md](https://github.com/OpenHands/OpenHands/blob/main/AGENTS.md)).
- **Cursor / Continue / Aider:** mechanics-focused (glob/regex, load order). No opinionated testing-quality guidance.
- **OpenSSF Best Practices Working Group** published a security-focused guide for AI code assistant instructions, including verification patterns ([OpenSSF, 2026](https://best.openssf.org/Security-Focused-Guide-for-AI-Code-Assistant-Instructions.html)).

**Cross-framework finding:** published guidance is overwhelmingly about how to run tests, not how to write tests that catch AI failure modes. This convention has room to be more rigorous than what's currently shipped.

---

## Recommended stack for this framework

| Layer | Tool | Why |
| --- | --- | --- |
| Unit | Vitest (TS), pytest (Python) | Already in universal defaults |
| Integration | Same runner as unit; real DB, real services | Catches contract violations AI introduces |
| E2E | Playwright | Already in universal defaults |
| Property-based | fast-check (TS), Hypothesis (Python) | Strongest published evidence for catching AI blind spots |
| Mutation | Stryker (TS), Mutmut (Python) | Quality gate beyond coverage; run on critical paths |
| Snapshot | Insta-style with explicit accept | Deterministic outputs only; never auto-accept |

**Per the universal defaults in `AGENTS.md`: "Don't test trivial UI components."** That holds. The point is to invest in tests where AI struggles, not to maximize coverage.

---

## Anti-patterns

- **Trusting AI-generated test counts.** 100 tests written by AI that share AI's blind spots ≠ 100 tests written defensively.
- **Coverage as quality signal.** AI-generated code routinely hits 90%+ coverage with 30-40% mutation score. Coverage is a floor, not a ceiling.
- **Single `pnpm test` as the success signal.** When that's the only check, agents optimize for it. Add mutation testing, property-based runs, or a separate validation script.
- **AI writing tests for AI's code in the same session.** Same context window, same biases. Adversarial separation or hand-written tests.
- **Auto-accepting snapshots.** Snapshot tests become "AI's code is correct because AI's snapshot matches AI's output." Mandate explicit review.
- **Testing the mock.** If your assertion checks the mocked value matches the mocked return, you tested nothing.

---

## When to skip

- **Throwaway prototypes.** Tests > 0 is the minimum; mutation testing is overkill.
- **Pure UI components.** Don't test trivial UI per universal defaults.
- **Generated boilerplate (codegen output).** Test the generator, not the output.
- **Internal-only tools you alone use.** You tolerate your own bugs. Add tests when other humans (or agents) start depending on it.

---

## Where the literature disagrees

- **Test pyramid ratio for AI-built code.** No peer-reviewed paper argues for a different ratio; practitioner blogs split. Treat as unsettled.
- **Specific mutation scores** (30-40% claimed) come from secondary sources, not peer-reviewed work. Meta's findings are the strongest primary source but don't quantify AI-generated test quality in those terms.
- **Snapshot test guidance** has no primary source from Anthropic, OpenAI, or Cohere for AI-generated code specifically — only community blogs. OpenAI's *internal* practice (Insta with explicit accept) is the strongest signal but isn't formal guidance.

---

## References

- [Adamo — AI-Generated Tests are Lying to You (2025)](https://davidadamojr.com/ai-generated-tests-are-lying-to-you/)
- [Anthropic — Code Review for Claude Code (2026)](https://claude.com/blog/code-review)
- [Anthropic Engineering — Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- [Anthropic Red Team — Property-Based Testing with Claude (2026)](https://red.anthropic.com/2026/property-based-testing/)
- [Bar-Zik — Why Jest Snapshots Can Be Harmful (2022)](https://medium.com/soluto-engineering/why-jest-snapshots-can-be-harmful-practical-examples-d469e6f65cd2)
- [Beck — TDD, AI Agents, Coding (Pragmatic Engineer, 2025)](https://newsletter.pragmaticengineer.com/p/tdd-ai-agents-and-coding-with-kent)
- [Beck — Augmented Coding (O11ycast Ep. 80)](https://www.heavybit.com/library/podcasts/o11ycast/ep-80-augmented-coding-with-kent-beck)
- [Codecentric — Isolated Specification Testing (2025)](https://www.codecentric.de/en/knowledge-hub/blog/dont-let-your-ai-cheat-isolated-specification-testing-with-claude-code)
- [DR.FIX — Automatically Fixing Data Races (ACM 2025)](https://dl.acm.org/doi/pdf/10.1145/3729265)
- [Frontiers in AI — Test Pyramid 2.0 (2025)](https://www.frontiersin.org/journals/artificial-intelligence/articles/10.3389/frai.2025.1695965/full)
- [Fowler — TestPyramid](https://martinfowler.com/bliki/TestPyramid.html)
- [Fowler — Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)
- [Fu et al. — Security Weaknesses of Copilot-Generated Code (TOSEM 2024)](https://dl.acm.org/doi/10.1145/3716848)
- [Hughes — Property Testing Guide (Lambda Days / InfoQ 2020)](https://www.infoq.com/news/2020/02/property-based-testing-guide/)
- [Kiro Engineering — PBT Caught a Security Bug (2025)](https://kiro.dev/blog/property-based-testing-fixed-security-bug/)
- [Liu et al. — Mitigating Code LLM Hallucinations (2024)](https://arxiv.org/abs/2407.09726)
- [Liu et al. — LLM Hallucinations in Practical Code (ACM 2025)](https://dl.acm.org/doi/abs/10.1145/3728894)
- [Meta Engineering — LLMs and Mutation Testing (2025)](https://engineering.fb.com/2025/09/30/security/llms-are-the-key-to-mutation-testing-and-better-compliance/)
- [OpenAI Codex — AGENTS.md](https://github.com/openai/codex/blob/main/AGENTS.md)
- [OpenSSF — Security-Focused Guide for AI Code Assistant Instructions (2026)](https://best.openssf.org/Security-Focused-Guide-for-AI-Code-Assistant-Instructions.html)
- [Palomba et al. — Test smells in automatically-generated tests (ACM 2020)](https://dl.acm.org/doi/10.1145/3422392.3422412)
- [Pearce et al. — Asleep at the Keyboard? (IEEE S&P 2022)](https://gangw.cs.illinois.edu/class/cs562/papers/copilot-sp22.pdf)
- [Samchon — AI Deleted My Tests (dev.to 2025)](https://dev.to/samchon/ai-deleted-my-tests-and-said-all-tests-pass-a-horror-story-from-porting-typia-from-typescript-2bmf)
- [Seemann — AI-generated tests as ceremony (2026)](https://blog.ploeh.dk/2026/01/26/ai-generated-tests-as-ceremony/)
- [Spracklen et al. — Package Hallucinations by LLMs (USENIX 2025)](https://arxiv.org/abs/2406.10279)
- [Stryker — JS Mutation Testing](https://stryker-mutator.io/)
- [Survey of Bugs in AI-Generated Code (arXiv Dec 2025)](https://arxiv.org/html/2512.05239v1)
- [Tweag — Agentic Coding Handbook: TDD Workflow](https://tweag.github.io/agentic-coding-handbook/WORKFLOW_TDD/)
- [Wayne — Finding Property Tests](https://www.hillelwayne.com/post/contract-examples/)
- [Agentic Property-Based Testing (arXiv 2510.09907)](https://arxiv.org/html/2510.09907v1)
