---
layout: post
title: Building AI-Native Developer Support at Aztec
subtitle: What I learned building systems for developer education, support, and agent-assisted software development
description: How versioned knowledge, agent-readable documentation, and execution environments changed developer support at Aztec.
---

Software development is becoming a collaboration between people and agents. That changes how developers discover a technology, form mental models, troubleshoot problems, and decide whether it is worth adopting.

At Aztec, I built systems that answered technical questions, maintained documentation, validated tutorials, reproduced bugs, and showed us where developers struggled. The work led me to a working definition of AI-native developer relations: give developers and their agents reliable context, let them test that context against real software, and let what breaks feed the next attempt.

This post covers the first two parts of that system, knowledge and execution. A [companion post](/posts/developer-relations-as-a-learning-system/) covers the feedback loop that connected support, evaluation, documentation, and product work.

## The stack wouldn't hold still

[Aztec](https://aztec.network/) is a privacy-focused layer 2 network. Developers use it to build applications with private state and private execution while using Ethereum for settlement.

It is hard to learn. A developer needs working knowledge of zero-knowledge proofs, a new programming model, the [Noir language](https://noir-lang.org/), Aztec's smart contract framework, SDKs and command-line tools, and the differences among local environments, testnets, and mainnet.

The stack also moved fast. Releases shipped breaking changes, and different networks ran different versions. A technically correct answer for the wrong version sent a developer in the wrong direction.

So the same material had to serve different readers, a human developer and the agent working on their behalf. A person notices ambiguity and asks a follow-up whereas agents turn mismatched context into plausible-looking code. Neither can be trusted until the answer touches the software.

Any answer was a bet on the version.

## Knowledge was the wrong frame

The goal is to give a developer a mental map, give their agent the right source material, and better code should follow.

Developers had to understand enough to direct their agent, whose result had to survive tests, deployments, and comparison with the documentation. And whatever failed had to make the next attempt easier.

That changed the shape of the system. Honk AI carried the mental map, agent-readable documentation supplied the context and support interactions showed us where the path broke.

Without running the output, we couldn't evaluate it.

## Honk AI: Right answer, wrong version

Honk AI was a retrieval-augmented generation assistant for the Aztec ecosystem, available through the documentation site, Discord, Slack, and an MCP interface.

It began with [DocsGPT](https://github.com/arc53/DocsGPT) and became a heavily customized Flask application, built with a lot of help from Claude Opus and the Codex CLI. A question triggered retrieval from an embedded corpus, and the model answered from those sources with citations.

RAG fit a source base that changed often. We could index a new Aztec release without training another model. Citations also let developers inspect the source and judge whether it applied to their environment.

Version changes exposed the weak point in a single corpus. Honk served a period when mainnet and testnet ran the same Aztec version. After testnet upgraded to v5 and mainnet did not, it started giving testnet users outdated answers. We built a separate v5 corpus for testnet and added a step that identified the network and version before retrieval.

The corpus included API and CLI references, framework and standard-library code, tests, starter projects, working applications, governance repositories. Each kind of source answered different questions. Documentation explained why something worked. References and source showed how, alongside best practices. Tests revealed common data flows and which combinations worked together.

Open-source infrastructure made that far more useful. When an abstraction leaked, an agent could read the implementation, the tests, the issues, and the examples instead of trusting a polished documentation layer.

I also maintained an MCP integration that let Honk query live Aztec and Ethereum activity (e.g. network status, public transactions, contracts, gas conditions). The tool could inspect actual behavior of a running application. That shift moved the assistant from describing operations to investigating them and validating its knowledge.

## Legible by default

Most developers meet Aztec through their own tools: ChatGPT, Claude, Cursor, the Codex CLI, or another coding harness. They infrequently install an official bot, skill, plugin, or MCP server. The open web has to be legible to agents by default.

We used a Docusaurus [plugin](https://github.com/rachfop/docusaurus-plugin-llms) to generate `llms.txt`, link framework and TypeScript API references, and serve Markdown versions of documentation pages. As the root file grew, we moved to a concise index that pointed agents at more specific bodies of knowledge.

This resembled search engine optimization, but the useful unit was different. Finding a page is the beginning, not the answer. An agent needs the correct version of a fact, enough context to interpret it, and a way to turn it into a valid action.

Explicit versioning, stable URLs, descriptive headings, complete examples, prerequisites, and documented failure conditions all helped. These are already the marks of good human documentation.

The web was already the interface, agents just read it differently.

## Compatibility beats volume

For deeper integration we published the [`@aztec/mcp-server`](https://www.npmjs.com/package/@aztec/mcp-server) package. It gave agents local access to selected repositories and documentation, preserved version context, and provided semantic search across the knowledge base.

Version control was the design, not a feature. "The Aztec API" changed across releases, branches, and networks, and extra context made answers worse when it quietly mixed incompatible generations of the stack.

I stopped optimizing for volume. Aztec application developers, node operators, and infrastructure providers used similar words for different questions. Retrieval worked best when it assembled a small set of sources from the same task, audience, and software version.

I expected developers to route through Honk's own tools. Many preferred coding agents with rich local context and tools they already knew. That reframed the MCP server and agent-readable documentation as useful surfaces in their own right, not doorways into one official assistant.

A small corpus from the right generation beats a large one from everywhere.

## When the answer has to run

Some support problems need more than another paragraph. The agent has to run the software.

I used persistent agent sessions I could reach remotely, including through Telegram. Their host environments had the relevant Aztec tooling and network access. With scoped credentials and permissions, an agent could deploy an account contract, move test funds, send a transaction, inspect public state, or reproduce a bug report.

That made support concrete. Given a GitHub issue, I could ask an agent to reproduce the behavior, collect the exact failure, compare it with the relevant source and documentation, and prepare a report an engineer could use.

I applied the same approach to releases. Before publishing a documentation version, I sent an agent through the tutorials and Aztec.js examples, ran the snippets, and collected the assumptions that no longer held. That kind of broad, repetitive verification is close to impossible to do by hand on every release.

Execution also raises the stakes. An agent that can transact, deploy, or modify a repository needs tighter boundaries than a search interface. I kept credentials and test funds scoped to the environment, logged operations, and required approval before an agent crossed from inspection into a transaction.

## Failure was the useful output

Together, these systems shortened the distance between a developer's question and observable behavior on a real network. A support interaction could end with evidence instead of speculation.

They also left something I had not set out to build: a record of recurring failures. In the [companion post](/posts/developer-relations-as-a-learning-system/), I describe how those signals fed back into documentation, tooling, and product work.

Reliable context is not something you write once. It is something the software keeps confirming.
