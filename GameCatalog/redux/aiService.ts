// services/aiService.ts
export const fetchAIRecommendations = async (prompt: string) => {
    console.log('Fetching AI Recommendations with prompt:', prompt);
  
    // Mock API call to the AI model
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, name: 'Recommended Game 1', released: '2023-01-01', cover: null },
          { id: 2, name: 'Recommended Game 2', released: '2023-05-15', cover: null },
          // More mock recommendations
        ]);
      }, 2000); // Mock API response delay
    });
  };
  