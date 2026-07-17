---
layout: post
title: Developer Relations as a Learning System
subtitle: How agent workflows turned developer questions and failures into changes to documentation, tooling, and product development
description: How agent workflows turned developer questions and failures into changes to documentation, tooling, and product development at Aztec.
---

While working on AI-assisted developer support at Aztec, I became less interested in the chatbot itself and more interested in what happened after it gave a bad answer.

A support system sees recurring confusion, failed deployments, missing examples, and version mismatches. If those signals only produce another support reply, most of their value disappears. I wanted the system to help us reproduce the problem, decide what mattered, make a change, and check whether that change helped.

That feedback loop became my working model for AI-native developer relations. A [companion post](/posts/ai-native-developer-support-at-aztec/) describes the knowledge and execution tools that fed it. This post is about the operating loop behind them.

## Claudebox and the internal engineering loop

Claudebox was Aztec's environment for running Claude Code and Codex CLI agents autonomously in isolated containers. It enforced budgets, isolated credentials, and provided a live interface. Teams used it for engineering work and continuous security audits across Aztec repositories.

For my work, its value came from connecting user feedback to a repeatable production process. A typical Honk AI improvement cycle looked like this:

1. Review recent conversations and operational errors.
2. Identify bad answers, missing sources, and recurring failure modes.
3. Ask one model to analyze the failures and propose a change.
4. Use another model to challenge the plan.
5. Have an agent implement the chosen solution and review the result.
6. Open a pull request, run CI, and complete human review.
7. Deploy the change and test it through the same interfaces developers used.
8. Return to the interaction logs and look for the failure pattern again.

Multiple models did not make the process objective. They often shared blind spots. Separating proposal, critique, implementation, and review simply created more opportunities to catch a questionable assumption before deployment. I skipped that machinery for simple changes and used it when complexity or risk justified the cost.

My role was to choose which failures mattered, judge whether a proposal would help developers, review the implementation, and decide when the evidence supported a release. Agents expanded how much ground I could cover; accountability stayed with the people operating the system.

## Choosing models from real support work

The most capable model was rarely the right choice for every interface. Public support made latency and cost part of answer quality. A strong answer that arrived too slowly could be less useful than a quick, adequate one. A cheap model that confidently mixed software versions created extra support work.

I used OpenRouter to compare intelligence, speed, and cost, with particular attention to open models. Real conversations showed that most questions were conceptual, navigational, or operational rather than requests to generate code. Generic coding benchmarks said little about that mix.

Claude Opus helped compare answers from less expensive models, after which I manually reviewed the important differences. Cheaper models handled direct questions well when retrieval placed a clear source in context. They struggled when they had to reconcile several sources, identify a version, or maintain context through a long conversation.[^model]

I began exploring more rigorous evaluation through the [Aztec Agent Builder Bench](https://github.com/critesjosh/aztec-agent-builder-bench). Its tasks reflected work developers actually attempted: explain an architectural tradeoff, identify a versioned API, build a small application, recover from an error, and validate a deployment.

That produced a more useful evaluation question than “Which model is best?” I wanted to know which combination of model, context, tools, and permissions could complete a specific developer task within acceptable limits for cost and latency.

## Documentation as executable infrastructure

Some documentation work was already automated without generative AI. The [`include_code`](https://www.npmjs.com/package/include_code) package pulled tested source into documentation, while API and CLI references were generated from the implementation.

We extended the idea by adding source-file references to documentation front matter. When relevant code changed, the DevRel team received a notification. The obvious next step was an agent that could inspect the diff, update the affected page, run its examples, and open a pull request for review.

We also encoded recurring editorial and release procedures as skills, including a [`release-docs` skill](https://github.com/AztecProtocol/aztec-packages/blob/next/.claude/skills/release-docs/SKILL.md). It captured source locations, versioning rules, required checks, expected artifacts, and the points where a person needed to make a decision.

This made documentation feel like infrastructure connected to the codebase. Agents were useful for comparing code with prose, testing examples, and carrying out mechanical migrations. People still decided what a new developer needed to understand and which conceptual framing would transfer beyond one release.

## Seeing where developers struggled

Honk operated across Discord, Slack, and the documentation site. It reduced response times and added support inside the docs, where no person had been continuously available. Developers could still tag the DevRel team when an answer needed human validation.

The system changed the shape of my support work. I spent less time composing the same reply and more time reviewing conversations, validating bugs, and filling knowledge gaps that affected every interface. One change could help many developers, although it did not always reduce the total amount of work.

We used Matomo across the Aztec website and the Aztec and Noir documentation. An internal agent could query those properties together without requiring me to assemble dashboards by hand. We also drew signals from documentation search, Discord, the Honk widget, and the tools the assistant invoked.

Those sources offered an incomplete view of the developer journey: what brought someone in, what they tried to understand, and where they became stuck. I wanted enough information to identify aggregate friction without reconstructing individual behavior. For a privacy project, that boundary mattered. Data minimization and meaningful consent were requirements, even when more tracking promised cleaner attribution.

De-identified patterns were often enough. Repeated questions pointed to documentation or product problems. Retrieval of the wrong version exposed a knowledge-system problem. If developers understood a concept but repeatedly failed at the same implementation step, the answer might be a better tool instead of another tutorial.

Node-operator conversations made this concrete. Setup questions exposed gaps in both the public docs and Honk's corpus. An agent could review a conversation, locate the relevant repository material, and help draft documentation for the next operator.

## Where the system struggled

Three unresolved problems kept appearing.

Versioning affected everything: retrieval, examples, CLI tools, live networks, and evaluation tasks. Without explicit version context, an answer could look convincing while combining incompatible parts of the stack.

Audience boundaries were equally difficult. Application developers, node operators, infrastructure teams, researchers, and newcomers sometimes used the same language for different needs. Serving them well required inferring the task and level of expertise, then retrieving from an appropriate subset of sources.

The work itself also kept changing. Agent capabilities, internal workflows, and developers' tool choices evolved while we built systems to support them. Analytics could only show part of that movement. Some of the best research was qualitative: watching developers work, reading agent transcripts they chose to share, and studying specific failures with them.

These problems resisted a universal assistant or a single exhaustive corpus. They pushed the system toward smaller, versioned bodies of knowledge and more direct observation of real development work.

## What I would build next: architectural assistance

The systems above were built around real support and engineering work. The next area I wanted to explore was architectural assistance for private applications.

An API example cannot decide which state should be private, what should be disclosed, where computation should happen, or what an application leaks through metadata and behavior. Those decisions involve tradeoffs among privacy, composability, performance, and user experience.

Agents would need a library of privacy patterns, anti-patterns, threat models, and worked tradeoffs. Each pattern should connect to an executable reference application and an evaluation that tests whether an agent can recognize when the pattern applies.

Other useful extensions followed from the same idea: version-aware evaluations against development branches and live networks, documentation pull requests triggered by source changes, and channels where developers could contribute failed agent traces or minimal reproductions. Each would make the loop more sensitive to real failures.

## What changed in my understanding of DevRel

I began with a fairly narrow idea of AI-native DevRel: answer questions faster, keep documentation current, and help one person cover more support surfaces. Building these systems changed my view. Generating an answer was often the easy part. The harder work was deciding which failures mattered and carrying evidence from a support interaction into the product.

A chat log became useful when it exposed a bad source or a missing abstraction. An evaluation mattered when it reproduced something developers were actually trying to do. Documentation automation mattered when the resulting page remained accurate through the next release. I came to see these as parts of the same DevRel responsibility rather than separate content, support, and tooling projects.

That shifted my attention from the number of answers or published pages to the path from curiosity to successful creation. The useful question became: where did a developer fall off that path, and what could we change so the next person did not fail in the same place?

AI gave me broader coverage of that path. The DevRel work remained a matter of judgment: making the technology legible, recognizing patterns across failures, and choosing which changes were worth making. The most promising result was seeing that work become more continuous and more closely connected to how the product evolved.

[^model]: At the time of writing, Honk AI used [Qwen3.6 Flash](https://openrouter.ai/qwen/qwen3.6-flash) without reasoning to prioritize fast responses. Model choice was operational and expected to change with the available models and usage patterns.
