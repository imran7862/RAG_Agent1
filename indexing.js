import * as dotenv from 'dotenv';
dotenv.config();
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';

// step 1 : Creating Indexing
async function indexing(){
    // step 1: load pdf file
    const PDF_PATH = './Node.pdf';
    const loader = new PDFLoader(PDF_PATH);
    const rawDocs = await loader.load();

    if (!Array.isArray(rawDocs) || rawDocs.length === 0) {
        throw new Error('No documents loaded from PDF, check file path or loader');
    }

    // step 2: chunking create
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });
    const chunkedDocs = await textSplitter.splitDocuments(rawDocs);

    console.log('Loaded', rawDocs.length, 'documents and split into', chunkedDocs.length, 'chunks');
    if (chunkedDocs.length === 0) {
        throw new Error('No documents were split; check PDF loading');
    }

    // embedding create
    // configure kar diya hai with the help of Gemini embedding model we create embedding/vector
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY not set in environment');
    }

    const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GEMINI_API_KEY,
        model: 'models/gemini-embedding-001',
    });

    // Test embedding to ensure it works
    const testEmbed = await embeddings.embedQuery('test');
    console.log('Test embedding dimension:', testEmbed.length);
    if (!testEmbed || testEmbed.length === 0) {
        throw new Error('Embedding returned empty result. Check GEMINI_API_KEY and model name.');
    }


    // configure pinecone
    const pinecone = new Pinecone();
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

    // single step--> ChunkedDocs-->Embedding --> Vector DB
    console.log('Upserting', chunkedDocs.length, 'documents to Pinecone...');
    await PineconeStore.fromDocuments(chunkedDocs, embeddings, {
        pineconeIndex,
        namespace: 'default',
        maxConcurrency: 5,
    });
    console.log('Successfully indexed documents to Pinecone!');
}
indexing();