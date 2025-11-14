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

/**
 * Import job listing from URL using AI with web search
 *
 * @param {string} url - URL of the job listing
 * @returns {Promise<Object>} Extracted job listing data
 */
async function importJobListingFromUrl(url) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured in environment variables');
    }

    const prompt = `Extract job listing information from this URL: ${url}

Use web search to access and analyze the job listing page. Extract all available information and return a JSON object with these fields:

- title: Job title/role name
- description: Full job description
- responsibilities: Array of key responsibilities/duties (extract all bullet points or paragraphs)
- qualifications: Array of qualifications/requirements (extract all bullet points or requirements)
- skills: Array of required skills mentioned (technical skills, soft skills, tools, languages)
- locationType: "remote", "hybrid", or "in_person" (infer from the listing)
- location: Office location as "City, State" format if mentioned
- startDate: Start date if mentioned (in YYYY-MM-DD format)
- hoursPerWeek: Hours per week as string like "30-40" if mentioned
- compensationType: "paid", "unpaid", "for_credit", or "stipend" (infer from listing)
- compensation: Salary/compensation amount if mentioned (just the number)
- salaryPeriod: "hour", "month", or "year" if compensation is mentioned
- equity: Equity percentage if mentioned
- department: Department name if mentioned

Return ONLY valid JSON with no additional text or markdown formatting. If a field cannot be found, use null for that field.`;

    const result = await genAI.responses.create({
      model: "gpt-4o-mini",
      tools: [
        { type: "web_search" },
      ],
      input: prompt,
    });

    const text = result.output_text;

    // Parse JSON response
    let jobData;
    console.log('AI Response:', text);
    try {
      jobData = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', text);
      throw new Error('AI returned invalid JSON format');
    }

    return jobData;

  } catch (error) {
    console.error('Error in importJobListingFromUrl:', error);
    throw new Error(`Failed to import job listing: ${error.message}`);
  }
}

/**
 * Generate responsibilities for a job role using AI
 *
 * @param {string} roleTitle - Job title
 * @param {string} roleDescription - Job description
 * @param {string} department - Department (optional)
 * @returns {Promise<Array<string>>} Array of responsibilities
 */
async function generateResponsibilities(roleTitle, roleDescription, department = '') {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured in environment variables');
    }

    const deptContext = department ? ` in the ${department} department` : '';
    const prompt = `Generate 5-8 key responsibilities for a ${roleTitle} position${deptContext}.

Job Description: ${roleDescription}

Return a JSON object with a single field "responsibilities" containing an array of strings. Each responsibility should be:
- Specific and actionable
- Start with an action verb
- Be concise (1-2 sentences max)
- Relevant to the role and description provided

Example format:
{
  "responsibilities": [
    "Design and implement scalable backend systems using Node.js and Express",
    "Collaborate with frontend developers to integrate APIs and services"
  ]
}

Return ONLY valid JSON with no additional text or markdown formatting.`;

    const result = await genAI.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
    });

    const text = result.output_text;

    // Parse JSON response
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', text);
      throw new Error('AI returned invalid JSON format');
    }

    return data.responsibilities || [];

  } catch (error) {
    console.error('Error in generateResponsibilities:', error);
    throw new Error(`Failed to generate responsibilities: ${error.message}`);
  }
}

/**
 * Generate qualifications for a job role using AI
 *
 * @param {string} roleTitle - Job title
 * @param {string} roleDescription - Job description
 * @param {Array<string>} responsibilities - Key responsibilities
 * @returns {Promise<Array<string>>} Array of qualifications
 */
async function generateQualifications(roleTitle, roleDescription, responsibilities = []) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured in environment variables');
    }

    const respContext = responsibilities.length > 0
      ? `\n\nKey Responsibilities:\n${responsibilities.map((r, i) => `${i + 1}. ${r}`).join('\n')}`
      : '';

    const prompt = `Generate 5-8 qualifications/requirements for a ${roleTitle} position.

Job Description: ${roleDescription}${respContext}

Return a JSON object with a single field "qualifications" containing an array of strings. Each qualification should be:
- Specific and measurable when possible
- Mix of required education, experience, technical skills, and soft skills
- Realistic and relevant to the role
- Concise (1-2 sentences max)

Example format:
{
  "qualifications": [
    "Bachelor's degree in Computer Science or related field, or equivalent experience",
    "3+ years of experience with JavaScript and modern web frameworks"
  ]
}

Return ONLY valid JSON with no additional text or markdown formatting.`;

    const result = await genAI.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
    });

    const text = result.output_text;

    // Parse JSON response
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', text);
      throw new Error('AI returned invalid JSON format');
    }

    return data.qualifications || [];

  } catch (error) {
    console.error('Error in generateQualifications:', error);
    throw new Error(`Failed to generate qualifications: ${error.message}`);
  }
}

/**
 * Generate skills for a job role using AI
 *
 * @param {string} roleTitle - Job title
 * @param {string} roleDescription - Job description
 * @param {Array<string>} responsibilities - Key responsibilities
 * @returns {Promise<Array<string>>} Array of skills
 */
async function generateSkills(roleTitle, roleDescription, responsibilities = []) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured in environment variables');
    }

    const respContext = responsibilities.length > 0
      ? `\n\nKey Responsibilities:\n${responsibilities.map((r, i) => `${i + 1}. ${r}`).join('\n')}`
      : '';

    const prompt = `Generate 5-10 key skills for a ${roleTitle} position.

Job Description: ${roleDescription}${respContext}

Return a JSON object with a single field "skills" containing an array of strings. Include:
- Technical skills (programming languages, frameworks, tools)
- Soft skills (communication, leadership, problem-solving)
- Domain knowledge
- Keep each skill concise (1-4 words)

Example format:
{
  "skills": [
    "JavaScript",
    "React",
    "Node.js",
    "Problem Solving",
    "Team Collaboration"
  ]
}

Return ONLY valid JSON with no additional text or markdown formatting.`;

    const result = await genAI.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
    });

    const text = result.output_text;

    // Parse JSON response
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', text);
      throw new Error('AI returned invalid JSON format');
    }

    return data.skills || [];

  } catch (error) {
    console.error('Error in generateSkills:', error);
    throw new Error(`Failed to generate skills: ${error.message}`);
  }
}

module.exports = {
  generateCompanyProfile,
  importJobListingFromUrl,
  generateResponsibilities,
  generateQualifications,
  generateSkills
};
