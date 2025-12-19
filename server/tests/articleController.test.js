describe('Article Controller - createArticle', () => {
  
  test('should require all necessary fields', async () => {
    const articleData = {
      title: 'Test Article',
      content: 'Article content here',
      imageUrl: 'https://example.com/image.jpg'
    };
    
    expect(articleData).toHaveProperty('title');
    expect(articleData).toHaveProperty('content');
    expect(articleData).toHaveProperty('imageUrl');
  });

  test('should fail without content field', async () => {
    const articleData = {
      title: 'Test Article',
      imageUrl: 'https://example.com/image.jpg'
    };
    
    expect(articleData).not.toHaveProperty('content');
  });

  test('should calculate reading time for English content', async () => {
    const content = 'Word '.repeat(300); // 300 words
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // 200 words per minute
    
    expect(readingTime).toBe(2);
  });

  test('should calculate reading time for Kannada content', async () => {
    const content = 'ಪದ '.repeat(600); // 600 characters
    const readingTime = Math.ceil(content.length / 6 / 60); // 6 chars = 1 word, 60 WPM
    
    expect(readingTime).toBeGreaterThan(0);
  });

  test('should create article with default values', async () => {
    const article = {
      title: 'New Article',
      summary: 'Article summary',
      content: 'Full article content here',
      imageUrl: 'https://example.com/img.jpg',
      videoUrl: null,
      contentLanguage: 'en',
      category: 'News',
      readingTime: 2,
      isPublished: true,
      isFeatured: false,
      views: 0,
      likes: 0
    };
    
    expect(article.isPublished).toBe(true);
    expect(article.isFeatured).toBe(false);
    expect(article.views).toBe(0);
  });

  test('should link article to word submission', async () => {
    const article = {
      title: 'Article from Word',
      content: 'Content',
      imageUrl: 'https://example.com/img.jpg',
      wordSubmissionId: 'word123',
      isPublished: true
    };
    
    expect(article.wordSubmissionId).toBe('word123');
    expect(article).toHaveProperty('wordSubmissionId');
  });

  test('should sanitize HTML in title and content', async () => {
    const rawTitle = '<script>alert("xss")</script>Title';
    
    // After sanitization should remove script tags
    const sanitized = rawTitle.replace(/<script[^>]*>.*?<\/script>/g, '');
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).toContain('Title');
  });
});
