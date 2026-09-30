# LeadSetu: AI Buyer–Supplier Matching Agent for B2B Marketplaces

**Author:** Rutul Narendra Warghade
**Programme:** MBA (1st Year), SVKM's Narsee Monjee Institute of Management Studies (NMIMS), Mumbai
**Live demo:** https://claude.ai/artifact/Uznm7n8PCGG5NznzoJrATk

## Problem
On B2B marketplaces, buyers post requirements that are short, informal and often in Hinglish ("2 inch GI pipe chahiye Pune"). Suppliers receive leads that are vague or poorly matched, which wastes their time and lowers response rates. Buyers, in turn, wait longer for relevant quotes.

## Solution
LeadSetu is an AI agent that takes one raw buyer requirement and:
1. **Structures it** into product, category, quantity, specs, city, timeline and budget (unstated fields stay null rather than guessed).
2. **Retrieves suppliers** by calling a search tool itself (RAG), with Hinglish word expansion and a same-city / same-state boost.
3. **Judges fit honestly**, marking related-but-different products as medium fit and explaining the difference.
4. **Scores lead quality (0–100)** with a transparent rubric and lists missing information.
5. **Asks clarifying questions** and **drafts a reply** in the buyer's own language style.
6. **Verifies its own output:** a code-based guardrail removes any supplier ID that is not in the catalog or in this run's search results.

## How I tested it
An evaluation set of 8 cases (`data/eval_test_cases.csv`) checks extraction accuracy (category, city, quantity), whether suppliers are returned when they should be, and whether any supplier IDs were invented. Two cases are deliberately hard: a vague request ("need some stuff urgently") that should score low, and a product not in the catalog (a Boeing engine) that should return no matches. The tests can be run from the Evaluation tab of the live demo.

## Product thinking (PRD summary)
- **Users:** buyers (faster, relevant quotes) and suppliers (fewer junk leads).
- **Success metrics I would track:** supplier response rate per lead, time to first quote, share of leads needing clarification, match acceptance rate, and cost/latency per lead.
- **What I chose not to build:** automatic sending of replies (a human should approve in v1), price negotiation, and supplier-side ranking changes, since each carries business risk and needs data first.
- **Trade-offs:** BM25 keyword retrieval instead of embeddings (transparent and free at 48 rows, but misses meaning-based matches at scale); fast vs balanced model (latency and token cost vs reasoning quality); deterministic guardrail in code instead of trusting the LLM.
- **Risks:** hallucinated suppliers (mitigated by the guardrail), prompt injection through buyer text (mitigated with delimiters and an explicit rule), and wrong quantity or unit extraction (measured by the eval set).

## Tech stack
LLM with tool calling (Claude) · prompt engineering (role, step-by-step instructions, rubric, few-shot example, JSON schema) · BM25 retrieval in JavaScript · code-based guardrail · evaluation harness · HTML/CSS

## Files
| Path | What it is |
|---|---|
| `app/index.html` | The complete app (open inside Claude for AI features; retrieval works anywhere) |
| `app/retriever.js` | The BM25 search engine with Hinglish synonyms |
| `prompts/agent_prompt.md` | The full agent prompt, with the techniques used |
| `data/supplier_catalog.csv` | 48 synthetic suppliers across 12 categories and 16 cities |
| `data/eval_test_cases.csv` | 8 test cases with expected answers |
| `docs/rebuild_in_dify.md` | Step-by-step no-code rebuild using Dify |
| `docs/interview_prep.md` | Concepts from the job description, explained through this project |

## Limitations
The supplier catalog is synthetic sample data created for this project, not real marketplace data. Prices and ratings are illustrative. The retrieval is keyword-based; a production version would use embeddings and a vector database.
