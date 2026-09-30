# Rebuild LeadSetu yourself in Dify (no coding)

Rebuilding the project with your own hands matters: interviewers for AI product roles often ask you to demo or explain what you built. This takes about 2–3 hours. Dify's interface changes often, so button names may differ slightly from these steps.

## Step 1: Set up
Sign up at dify.ai (the cloud version has free trial credits). You'll also need access to an LLM, which Dify's trial credits usually cover.

## Step 2: Create the knowledge base (this is the RAG part)
1. Go to **Knowledge**, then create a new knowledge base.
2. Upload `data/supplier_catalog.csv`.
3. Choose **high-quality** indexing. This converts each supplier row into an **embedding** (a list of numbers that captures meaning) and stores it in a **vector database**.
4. Choose **hybrid search** (keyword plus vector). This combines the BM25 approach used in the demo with meaning-based search, so "pani saaf karne ki machine" can match "RO plant".

## Step 3: Build the workflow
Create a new **Chatflow** (or Workflow) app and connect these nodes:
1. **Start**: an input variable `buyer_requirement`.
2. **LLM node, "Extract"**: ask it to return the requirement JSON (product, category, quantity, unit, specs, city, timeline, budget). Reuse steps 1 and 4 from `prompts/agent_prompt.md`.
3. **Knowledge Retrieval node**: query the knowledge base with the extracted product plus city. Set top-K to 6.
4. **LLM node, "Match and reply"**: give it the requirement JSON plus the retrieved suppliers, and use the rest of the prompt (fit rules, clarifying questions, reply draft, JSON output).
5. **Answer / End node**: show the result.

For extra credit, use Dify's **Agent** mode instead, giving the knowledge base as a tool so the model decides when to search. That is the "agent" version of the same design.

## Step 4: Test it like a product manager
Run all 8 inputs in `data/eval_test_cases.csv`. Record each result in a spreadsheet (pass/fail per check). Then change one thing, such as the model, the prompt, or the top-K, and compare the results. Save one before/after comparison: it makes a strong interview story.

## Step 5: Publish and link
Publish the Dify app to get a public web-app link, which you can add to your resume next to the demo link. Upload this folder to a public GitHub repo named `leadsetu`, with screenshots of your Dify workflow in the README.

## Alternative tools
The same design works in **n8n** (Webhook → AI Agent node with a vector-store tool) or **LangFlow**. Both are named in the job description, so if you have time, building one small piece in n8n is a useful second talking point.
