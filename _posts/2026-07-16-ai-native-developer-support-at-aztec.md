---
layout: post
title: Building AI-Native Developer Support at Aztec
subtitle: What I learned building systems for developer education, support, and agent-assisted software development
description: How versioned knowledge, agent-readable documentation, and execution environments changed developer support at Aztec.
---

Software development is becoming a collaboration between people and agents. That changes how developers discover a technology, form a mental model of it, troubleshoot problems, and decide whether it is worth adopting.

At Aztec, I built AI systems that answered technical questions, maintained documentation, validated tutorials, reproduced bugs, and helped us understand where developers struggled. The work led me toward a practical definition of AI-native developer relations: give developers and their agents reliable context, let them test that context against real software, and use what goes wrong to improve the product.

This post covers the first two parts of that system: knowledge and execution. A [companion post](/posts/developer-relations-as-a-learning-system/) covers the feedback loop that connected support, evaluation, documentation, and product work.

## Aztec as a test case

[Aztec](https://aztec.network/) is a privacy-focused layer 2 network. Developers use it to build applications with private state and private execution while using Ethereum for settlement.

It is a difficult system to learn. A developer may need to understand zero-knowledge proofs, a new programming model, the [Noir language](https://noir-lang.org/), Aztec's smart contract framework, SDKs and command-line tools, and the differences among local environments, testnets, and mainnet.

The stack also changed quickly. Releases could contain breaking changes, and different networks sometimes ran different versions. A technically correct answer for the wrong version could send a developer in exactly the wrong direction.

Working on Aztec made a new DevRel problem concrete for me: the same material had to serve human developers and the agents working on their behalf. Both needed clear explanations, precise references, and working examples. A person might notice ambiguity and ask a follow-up question. An agent might turn mismatched context into plausible-looking code. Both needed a way to check their understanding against a real system.

## From a question to working code

I initially treated this mostly as a knowledge problem. Help a developer form a mental map, give their agent the right source material, and better code should follow.

In practice, useful support kept pushing beyond retrieval. The developer needed to understand enough to direct the agent. Then the result had to survive tests, deployments, and comparison with the documentation. Whatever failed should make the next attempt easier.

That experience changed the shape of the system. Honk AI helped with the mental map. Agent-readable documentation supplied context for building. Isolated environments let agents run what they produced. Support interactions showed us where the whole path broke down.

## Honk AI: a grounded interface to Aztec knowledge

Honk AI was a retrieval-augmented generation assistant for the Aztec ecosystem, available through the documentation site, Discord, Slack, and an MCP interface.

It began with [DocsGPT](https://github.com/arc53/DocsGPT) and grew into a highly customized Flask application, built with plenty of help from Claude Opus and the Codex CLI. A question triggered retrieval from an embedded corpus, and the model answered from those sources with citations.

RAG suited a source base that changed frequently. We could index material for a new Aztec release without training another model. Citations also gave developers a way to inspect the source and decide whether it applied to their environment.

Version changes quickly exposed the weakness of a single corpus. Honk initially served a period when mainnet and testnet ran the same Aztec version. After testnet upgraded to v5 while mainnet remained on the previous version, it began giving testnet users outdated answers. We created a separate v5 corpus and added a step for identifying the relevant network and version before retrieval.

That incident changed how I thought about grounded answers. Citations did not help if retrieval started from the wrong generation of the software. Version selection had to happen before the model saw the sources.

The corpus extended beyond narrative documentation. It included API and CLI references, framework and standard-library code, tests, starter projects, working applications, and governance repositories. Each kind of source answered a different question: documentation explained why something worked, references and source showed how, and tests revealed which combinations actually worked together.

Open-source infrastructure made this much more useful. When an abstraction leaked, an agent could inspect implementation code, tests, issues, and examples instead of relying on a polished documentation layer.

I also maintained a tool that let Honk query current Aztec and Ethereum activity. Static sources could explain expected behavior; the tool could inspect network status, public transactions, contracts, and gas conditions. That small shift moved the assistant from describing operations toward investigating them.

## Preparing documentation for any agent

Most developers encounter Aztec through their own tools: ChatGPT, Claude, Cursor, the Codex CLI, or another coding harness. They may never install an official bot, skill, plugin, or MCP server. The open web therefore needs to be legible to agents by default.

We used a Docusaurus [plugin](https://github.com/rachfop/docusaurus-plugin-llms) to generate `llms.txt`, link framework and TypeScript API references, and serve Markdown versions of documentation pages. As the root file grew, we moved toward a hub-and-spoke structure: a concise index directed agents to more specific bodies of knowledge.

This resembled search engine optimization, but the useful unit was different. Finding a page was only the beginning. An agent needed the correct version of a fact, enough surrounding context to interpret it, and a way to turn it into a valid action.

Explicit versioning, stable URLs, descriptive headings, complete examples, prerequisites, and documented failure conditions all helped. These were already qualities of good human documentation. Designing for agents made existing ambiguities easier to see: assumptions a person might infer from context became obvious when an agent skipped them and produced the wrong result.

## High-signal, versioned context through MCP

For deeper integration, we published the [`@aztec/mcp-server`](https://www.npmjs.com/package/@aztec/mcp-server) package. It gave agents local access to selected repositories and documentation, preserved version context, and provided semantic search across the knowledge base.

Version control was central to its design. “The Aztec API” changed across releases, branches, and networks. Extra context could make an answer worse if it quietly mixed incompatible generations of the stack.

I learned to care more about compatibility than volume. Aztec application developers, node operators, and infrastructure providers often used similar terms while asking different questions. Retrieval worked best when it assembled a small set of sources that belonged to the same task, audience, and software version.

I had expected more developers to use Honk's own tools. Instead, many appeared to prefer coding agents with rich local context and tools they already knew. That changed how I saw the MCP server and agent-readable documentation: they were useful surfaces in their own right, rather than paths into one official assistant.

## When the agent needs to act

Some support problems require more than another paragraph of documentation. The agent has to run the software.

I used persistent agent sessions that I could reach remotely, including through Telegram. Their host environments had the relevant Aztec tooling and network access. With scoped credentials and permissions, an agent could deploy an account contract, move test funds, send a transaction, inspect public state, or reproduce a bug report.

That made support more concrete. Given a GitHub issue, I could ask an agent to reproduce the behavior, collect the exact failure, compare it with the relevant source and documentation, and prepare a useful report for an engineer.

I applied the same approach to releases. Before publishing a new documentation version, I directed an agent to run through tutorials and Aztec.js examples, execute the snippets, and report assumptions that no longer held. This kind of broad, repetitive verification is difficult to perform manually on every release.

Execution also raised the stakes. An agent that can transact, deploy, or modify a repository needs stronger boundaries than a search interface. I kept credentials and test funds scoped to the environment, logged operations, and required approval before an agent crossed from inspection into a transaction.

Taken together, these systems shortened the distance between a developer's question and observable behavior on a real network. A support interaction could end with evidence instead of speculation.

They also left behind something I had not set out to build: a record of recurring failures. In a [companion post](/posts/developer-relations-as-a-learning-system/), I describe how those signals fed back into documentation, tooling, and product work.
