// ==============================
// Split text into chunks for better AI processing
// ==============================
export const chunkText = (text, chunkSize = 1000, overlap = 50) => {
    if (typeof text !== 'string' || text.trim().length === 0) return [];

    // Clean text
    const cleanText = text
        .replace(/\r\n/g, '\n')
        .replace(/\s+/g, ' ')
        .replace(/ \n/g, '\n')
        .replace(/\n /g, '\n')
        .trim();

    const paragraphs = cleanText
        .split(/\n+/)
        .filter(p => p.trim().length > 0);

    const chunks = [];
    let currentChunk = [];
    let currentWordCount = 0;
    let chunkIndex = 0;

    for (const paragraph of paragraphs) {
        const safeParagraph = paragraph.trim();
        if (!safeParagraph) continue;

        const paragraphWords = safeParagraph.split(/\s+/);
        const paragraphWordCount = paragraphWords.length;

        // Very large paragraph
        if (paragraphWordCount > chunkSize) {
            if (currentChunk.length > 0) {
                chunks.push({
                    content: currentChunk.join('\n\n'),
                    chunkIndex: chunkIndex++,
                    pageNumber: 0
                });
                currentChunk = [];
                currentWordCount = 0;
            }

            for (let i = 0; i < paragraphWordCount; i += (chunkSize - overlap)) {
                const wordChunk = paragraphWords.slice(i, i + chunkSize);

                chunks.push({
                    content: wordChunk.join(' '),
                    chunkIndex: chunkIndex++,
                    pageNumber: 0
                });

                if (i + chunkSize >= paragraphWordCount) break;
            }
            continue;
        }

        // Exceeds chunk size
        if (
            currentWordCount + paragraphWordCount > chunkSize &&
            currentChunk.length > 0
        ) {
            chunks.push({
                content: currentChunk.join('\n\n'),
                chunkIndex: chunkIndex++,
                pageNumber: 0
            });

            const prevWords = currentChunk.join(' ').split(/\s+/);
            const overlapWords = prevWords
                .slice(-Math.min(overlap, prevWords.length))
                .join(' ');

            currentChunk = overlapWords ? [overlapWords, safeParagraph] : [safeParagraph];
            currentWordCount =
                (overlapWords ? overlapWords.split(/\s+/).length : 0) +
                paragraphWordCount;
        } else {
            currentChunk.push(safeParagraph);
            currentWordCount += paragraphWordCount;
        }
    }

    if (currentChunk.length > 0) {
        chunks.push({
            content: currentChunk.join('\n\n'),
            chunkIndex: chunkIndex++,
            pageNumber: 0
        });
    }

    // Fallback
    if (chunks.length === 0 && cleanText.length > 0) {
        const words = cleanText.split(/\s+/);

        for (let i = 0; i < words.length; i += (chunkSize - overlap)) {
            chunks.push({
                content: words.slice(i, i + chunkSize).join(' '),
                chunkIndex: chunkIndex++,
                pageNumber: 0
            });

            if (i + chunkSize >= words.length) break;
        }
    }

    return chunks;
};

// ==============================
// Find relevant chunks based on keyword matches
// ==============================
export const findRelevantChunks = (chunks, query, maxChunks = 3) => {
  if (!Array.isArray(chunks) || !chunks.length || !query) return [];

  const normalize = (text = '') =>
    String(text)
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const stopWords = new Set([
    'the','is','in','and','to','a','of','that','it','on','for','with',
    'as','was','at','by','an','be','this','from','or','are','but','not',
    'what','so','if','how','why','when'
  ]);

  const queryWords = normalize(query)
    .split(' ')
    .filter(w => w.length > 1 && !stopWords.has(w));

  if (!queryWords.length) return [];

  const scoredChunks = chunks.map((chunk, index) => {
    const contentWords = normalize(chunk?.content).split(' ');

    let score = 0;
    queryWords.forEach(word => {
      if (contentWords.includes(word)) score++;
    });

    return {
      content: chunk?.content ?? '',
      chunkIndex: chunk?.chunkIndex ?? index,
      pageNumber: chunk?.pageNumber ?? 0,
      score
    };
  });

  return scoredChunks
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxChunks);
};
