# Interview prep: JD concepts explained through LeadSetu

Practise answering each question aloud in about 60 seconds.

**What does your project do, in one line?**
It turns messy, often Hinglish, buyer requirements into structured leads, finds fitting suppliers using retrieval, scores lead quality and drafts a reply, with a guardrail that blocks invented suppliers.

**Why an agent and not just one prompt?**
The model decides when to call the search tool and can search again with broader words if the first results are poor. A single prompt would need all 48 suppliers pasted in every time, which costs more tokens and doesn't scale to millions of suppliers.

**What is RAG?**
Retrieval-Augmented Generation: fetch relevant data first, then let the LLM answer using only that data. Here, the search tool retrieves suppliers and the LLM reasons over them. This grounds answers in real data and reduces hallucination.

**Embeddings and vector search?**
An embedding turns text into a list of numbers so that similar meanings sit close together. Vector search finds the nearest ones. My demo uses BM25 keyword search, which is transparent and cheap for 48 rows. My Dify rebuild uses hybrid search (keyword plus embeddings), which catches meaning-based matches such as "RO plant" for "pani saaf karne ki machine".

**Context window?**
The maximum text a model can read at once. Retrieval keeps the prompt small: 6 suppliers instead of the full catalog.

**Hallucination: how did you handle it?**
Three layers. The prompt says to use only supplier IDs from the tool. A code guardrail removes anything else. The eval set includes a trap case (a Boeing engine) where the correct answer is "no match".

**How do you tell a good output from a confident wrong one?**
By testing against cases with known answers rather than reading outputs by eye. My eval set checks category, city, quantity, match presence and invented IDs, and reports a pass rate.

**Token cost and latency?**
The fast model answers in seconds at lower cost; the balanced model reasons better but is slower. Each tool call adds a model round trip, so I limited results to 6 small records. At marketplace scale, I'd use the fast model for easy leads and route only ambiguous ones to the larger model.

**Prompt techniques you used?**
A role, step-by-step instructions, a scoring rubric, one few-shot example, delimiters around user text to resist prompt injection, and a strict JSON schema so code can check the output.

**What would you build next, and what would you not build?**
Next: embeddings for meaning-based search, and feedback from suppliers (accepted or rejected leads) to measure match quality. Not yet: auto-sending replies to buyers, because a wrong reply damages trust, so a human should approve in v1.

**What metrics would you track?**
Supplier response rate per lead, time to first quote, share of leads needing clarification, match acceptance rate, and cost and latency per lead.

**Be honest about:** the catalog being synthetic, and which parts you built yourself (your Dify rebuild and your tests).
