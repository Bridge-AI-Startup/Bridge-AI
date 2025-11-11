const OpenAI = require("openai");

// Initialize Gemini AI with API key from environment
const genAI = new OpenAI();

/**
 * Generate company profile using Gemini 1.5 Flash with Google Search Grounding
 *
 * @param {string} companyName - Name of the company
 * @param {string} website - Company website URL
 * @returns {Promise<Object>} Company profile data
 */
async function generateCompanyProfile(companyName, website) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured in environment variables');
    }

    const prompt = `Research ${companyName} (website: ${website}) using web search and return a JSON object with the following fields:

- pitch: One compelling sentence (max 150 characters) describing what the company does
- description: 2-3 sentences (max 300 characters) about the company's mission, products, or services
- headquarters: City, State/Country format (e.g., "San Francisco, CA" or "London, UK")
- companySize: Choose the most accurate from: "1-10", "11-50", "51-200", "201-500", "501+"
- industry: Choose the most relevant from: "technology", "fintech", "healthcare", "ecommerce", "biotech", "edtech", "ai-ml", "robotics", "saas", "consumer", "climate", "other"
- fundingStage: Choose from: "bootstrapped", "pre-seed", "seed", "series-a", "series-b", "series-c+", "public"
- foundedYear: Year as string (e.g., "2020")

Search across the company website, LinkedIn, Crunchbase, news articles, tech blogs, and other reliable sources to get the most accurate and current information. If information cannot be found with high confidence, use "unknown" or make an educated guess based on available data.

Return ONLY valid JSON with no additional text or markdown formatting.`;

    const result = await genAI.responses.create({
      model: "gpt-4o-mini",
      tools: [
          { type: "web_search" },
      ],
      input:prompt,
    });


    // const result = await model.generateContent({
    //   contents: [{
    //     role: 'user',
    //     parts: [{ text: prompt }]
    //   }],
    //   tools: [{googleSearch: {}}],
    //   generationConfig: {
    //     responseMimeType: 'application/json',
    //     temperature: 0.2, // Lower temperature for more consistent extraction
    //     maxOutputTokens: 1024
    //   }
    // });


    const text = result.output_text;

    // Parse JSON response
    let companyData;
    console.log(text);
    try {
      companyData = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', text);
      throw new Error('AI returned invalid JSON format');
    }

    // Validate required fields
    const requiredFields = ['pitch', 'description', 'headquarters', 'companySize', 'industry'];
    const missingFields = requiredFields.filter(field => !companyData[field]);

    if (missingFields.length > 0) {
      throw new Error(`AI response missing required fields: ${missingFields.join(', ')}`);
    }

    // Return structured data
    
    return {
      pitch: companyData.pitch || '',
      description: companyData.description || '',
      headquarters: companyData.headquarters || 'Unknown',
      companySize: companyData.companySize || '1-10',
      industry: companyData.industry || 'technology',
      fundingStage: companyData.fundingStage || 'bootstrapped',
      foundedYear: companyData.foundedYear || new Date().getFullYear().toString()
    };

  } catch (error) {
    console.error('Error in generateCompanyProfile:', error);

    // Provide more specific error messages
    if (error.message?.includes('API_KEY')) {
      throw new Error('Google AI API key not configured. Please add GOOGLE_AI_API_KEY to your environment variables.');
    }

    if (error.message?.includes('quota')) {
      throw new Error('Google AI API quota exceeded. You may have reached the free tier limit of 1,500 requests/day.');
    }

    throw new Error(`Failed to generate company profile: ${error.message}`);
  }
}

module.exports = {
  generateCompanyProfile
};
