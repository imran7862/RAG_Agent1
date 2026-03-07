## 🧠 RAG Agent – High-Level Architecture Diagram

```mermaid
flowchart LR

%% =====================================================
%% INDEXING PHASE
%% =====================================================

subgraph Indexing Phase
    A[PDF Document Node.pdf]
    B[PDFLoader]
    C[Text Splitter RecursiveCharacterTextSplitter]
    D[Gemini Embedding Model]
    E[(Pinecone Vector Database)]

    A --> B
    B --> C
    C --> D
    D --> E
end

%% =====================================================
%% QUERY PHASE
%% =====================================================

subgraph Query Phase
    F[User Question CLI]
    G[Query Embedding]
    H[Vector Similarity Search TopK]
    I[Context Builder]
    J[Prompt Template]
    K[Gemini LLM gemini-2.5-flash]
    L[Final Answer]

    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L
end

%% =====================================================
%% CROSS CONNECTION
%% =====================================================

E --> H

%% =====================================================
%% STYLING
%% =====================================================

classDef indexing fill:#ede9fe,stroke:#7c3aed,stroke-width:2px,color:#4c1d95;
classDef query fill:#dbeafe,stroke:#2563eb,stroke-width:2px,color:#1e3a8a;
classDef embed fill:#dcfce7,stroke:#16a34a,stroke-width:2px,color:#14532d;
classDef vector fill:#fef3c7,stroke:#f59e0b,stroke-width:2px,color:#78350f;
classDef llm fill:#fee2e2,stroke:#ef4444,stroke-width:2px,color:#7f1d1d;

class A,B,C indexing;
class F,I,J query;
class D,G embed;
class E,H vector;
class K,L llm;
```
## 🧠 Multi-Document Multi-Namespace RAG Architecture

```mermaid
flowchart LR

%% =====================================================
%% INDEXING PHASE
%% =====================================================

subgraph Indexing Phase
    A1[PDF 1 Node Guide]
    A2[PDF 2 React Docs]
    A3[PDF 3 System Design Notes]

    B[PDF Loader]
    C[Text Splitter Chunking]
    D[Gemini Embedding Model]

    A1 --> B
    A2 --> B
    A3 --> B
    B --> C
    C --> D

    D --> N1[(Pinecone Namespace node_docs)]
    D --> N2[(Pinecone Namespace react_docs)]
    D --> N3[(Pinecone Namespace system_design)]
end


%% =====================================================
%% QUERY PHASE
%% =====================================================

subgraph Query Phase
    Q1[User Question CLI]
    Q2[Query Embedding]
    Q3{Namespace Router}
    Q4[Vector Similarity Search TopK]
    Q5[Context Aggregator]
    Q6[Prompt Template]
    Q7[Gemini LLM gemini-2.5-flash]
    Q8[Grounded Final Answer]

    Q1 --> Q2
    Q2 --> Q3

    Q3 -->|Route to node_docs| N1
    Q3 -->|Route to react_docs| N2
    Q3 -->|Route to system_design| N3

    N1 --> Q4
    N2 --> Q4
    N3 --> Q4

    Q4 --> Q5
    Q5 --> Q6
    Q6 --> Q7
    Q7 --> Q8
end


%% =====================================================
%% STYLING
%% =====================================================

classDef indexing fill:#ede9fe,stroke:#7c3aed,stroke-width:2px,color:#4c1d95;
classDef namespace fill:#fef3c7,stroke:#f59e0b,stroke-width:2px,color:#78350f;
classDef query fill:#dbeafe,stroke:#2563eb,stroke-width:2px,color:#1e3a8a;
classDef embed fill:#dcfce7,stroke:#16a34a,stroke-width:2px,color:#14532d;
classDef llm fill:#fee2e2,stroke:#ef4444,stroke-width:2px,color:#7f1d1d;

class A1,A2,A3,B,C indexing;
class D,Q2 embed;
class N1,N2,N3,Q4 namespace;
class Q1,Q3,Q5,Q6 query;
class Q7,Q8 llm;
```
### 🔎 Architecture Pattern

This project implements a Retrieval-Augmented Generation (RAG) architecture:

Indexing Phase:
Document → Chunking → Embeddings → Vector Database

Query Phase:
User Question → Query Embedding → Vector Search → Context Injection → LLM → Answer

The system ensures:
- Grounded answers
- Reduced hallucination
- Context-aware generation
- Scalable knowledge retrieval
