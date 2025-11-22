const OpenAI = require("openai");

// Initialize OpenAI with API key from environment
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

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

    const result = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    const text = result.choices[0].message.content;

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

    const result = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    const text = result.choices[0].message.content;

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

    const result = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const text = result.choices[0].message.content;

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

    const result = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const text = result.choices[0].message.content;

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

    const result = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const text = result.choices[0].message.content;

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

/**
 * Generate an assessment based on job listing information using AI
 *
 * @param {string} roleTitle - Job title
 * @param {string} roleDescription - Job description
 * @param {Array<string>} requiredSkills - Required skills
 * @param {Array<string>} responsibilities - Key responsibilities
 * @param {string} assessmentType - Type of assessment (coding, technical_quiz, case_study)
 * @returns {Promise<Object>} Generated assessment data
 */
async function generateAssessment(roleTitle, roleDescription, requiredSkills = [], responsibilities = []) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured in environment variables');
    }

    const skillsContext = requiredSkills.length > 0
      ? `\n\nRequired Skills:\n${requiredSkills.join(', ')}`
      : '';

    const respContext = responsibilities.length > 0
      ? `\n\nKey Responsibilities:\n${responsibilities.map((r, i) => `${i + 1}. ${r}`).join('\n')}`
      : '';

    let prompt = '';

    // Always generate coding assessments (ignoring assessmentType parameter)
    prompt = `Generate a UNIQUE and DISTINCT coding assessment for a ${roleTitle} position.

Job Description: ${roleDescription}${skillsContext}${respContext}

IMPORTANT REQUIREMENTS:
1. Create a practical coding challenge that is DIFFERENT from typical algorithm problems
2. Focus on real-world scenarios relevant to this specific role
3. Make it test actual job responsibilities, not just generic coding skills
4. Ensure the project is comprehensive and tests multiple competencies

Return a JSON object with these fields:

{
  "assessmentType": "coding",
  "title": "Clear, descriptive title for the assessment (be specific, not generic)",
  "description": "A detailed 3-4 sentence description explaining what the candidate will build and why it matters for this role",
  "whyCurated": "A comprehensive explanation (4-5 sentences) of WHY this specific assessment was chosen for this role. Explain what competencies it tests, how it relates to actual job responsibilities, and what makes it particularly relevant for evaluating ${roleTitle} candidates.",
  "problemStatement": "Detailed problem statement with real-world context, background, and requirements (3-4 paragraphs)",
  "requirements": ["Specific requirement 1", "Specific requirement 2", ...], // 6-10 detailed technical requirements
  "acceptanceCriteria": ["Criterion 1", "Criterion 2", ...], // 4-6 criteria for what constitutes a passing solution
  "evaluationCriteria": ["Code quality and organization", "Problem-solving approach", "Completeness", "Performance considerations"], // How the submission will be graded
  "starterCode": "Optional starter code template if applicable (leave empty string if not needed)",
  "testCases": [
    {
      "name": "Test case name",
      "description": "What this test validates",
      "input": "Example input",
      "expectedOutput": "Expected result",
      "isHidden": false
    }
  ], // 5-8 test cases (mix of visible and hidden tests)
  "allowedLanguages": ["JavaScript", "Python", "Java", "TypeScript"], // Languages relevant to the role
  "difficulty": "easy" | "medium" | "hard", // Vary this - don't always use medium
  "timeLimit": 180, // Time in minutes - should be realistic (90-240 minutes based on difficulty)
  "estimatedTime": 120 // Realistic estimated completion time in minutes
}

DIFFICULTY GUIDELINES:
- easy: Simple implementation, clear requirements, 90-120 minutes
- medium: Moderate complexity, requires some design decisions, 120-180 minutes
- hard: Complex system, multiple components, architectural decisions, 180-240 minutes

Make the assessment realistic, role-specific, and truly evaluative of real job skills. Each assessment should feel like actual work they'd do on the job. Return ONLY valid JSON with no additional text or markdown formatting.`;

    const result = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const text = result.choices[0].message.content;

    // Parse JSON response
    let assessmentData;
    console.log('AI Assessment Response:', text);
    try {
      assessmentData = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', text);
      throw new Error('AI returned invalid JSON format');
    }

    return assessmentData;

  } catch (error) {
    console.error('Error in generateAssessment:', error);
    throw new Error(`Failed to generate assessment: ${error.message}`);
  }
}

/**
 * Generate 3 distinct coding assessment concepts with varying difficulty
 * This uses a two-phase approach: first generate concepts, then elaborate
 *
 * @param {string} roleTitle - Job title
 * @param {string} roleDescription - Job description
 * @param {Array<string>} requiredSkills - Required skills
 * @param {Array<string>} responsibilities - Key responsibilities
 * @returns {Promise<Array>} Array of 3 elaborated assessment objects
 */
async function generateBatchAssessments(roleTitle, roleDescription, requiredSkills = [], responsibilities = [], previousAssessments = []) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured in environment variables');
    }

    const skillsContext = requiredSkills.length > 0
      ? `\n\nRequired Skills:\n${requiredSkills.join(', ')}`
      : '';

    const respContext = responsibilities.length > 0
      ? `\n\nKey Responsibilities:\n${responsibilities.map((r, i) => `${i + 1}. ${r}`).join('\n')}`
      : '';

    // Build exclusion context if there are previous assessments
    const exclusionContext = previousAssessments.length > 0
      ? `\n\nIMPORTANT - AVOID THESE PREVIOUS ASSESSMENTS:
The following assessments were already generated. You MUST create completely DIFFERENT assessments with DIFFERENT concepts, titles, and focus areas:

${previousAssessments.map((a, i) => `${i + 1}. "${a.title}" - Focus: ${a.primaryFocus || a.description || 'N/A'}`).join('\n')}

DO NOT create assessments similar to these. Generate completely new and different concepts.`
      : '';

    // Phase 1: Generate 3 distinct concepts
    const conceptPrompt = `Generate 3 DISTINCT and MUTUALLY EXCLUSIVE coding assessment concepts for a ${roleTitle} position.

Job Description: ${roleDescription}${skillsContext}${respContext}${exclusionContext}

CRITICAL REQUIREMENTS:
1. Each assessment must test DIFFERENT skills/competencies
2. They must be MUTUALLY EXCLUSIVE - no overlapping concepts
3. Vary difficulty: one easy, one medium, one hard
4. Focus on real-world, job-relevant scenarios
5. Avoid generic algorithm problems
${previousAssessments.length > 0 ? '6. DO NOT duplicate or create similar assessments to the ones listed above' : ''}

Return a JSON array with 3 concept objects:

[
  {
    "title": "Brief, specific title",
    "concept": "2-3 sentence description of what this assessment tests",
    "difficulty": "easy",
    "primaryFocus": "Main competency this tests (e.g., 'API integration', 'Data processing', 'UI components')",
    "estimatedMinutes": 120
  },
  {
    "title": "Different title",
    "concept": "Different focus area",
    "difficulty": "medium",
    "primaryFocus": "Different competency",
    "estimatedMinutes": 180
  },
  {
    "title": "Third distinct title",
    "concept": "Yet another focus area",
    "difficulty": "hard",
    "primaryFocus": "Third distinct competency",
    "estimatedMinutes": 240
  }
]

Ensure each concept is COMPLETELY DIFFERENT from the others. Return ONLY valid JSON.`;

    const conceptResult = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: conceptPrompt }],
      temperature: 0.8,
      response_format: { type: "json_object" }
    });

    const conceptText = conceptResult.choices[0].message.content;
    console.log('✅ AI Concepts Generated:', conceptText);

    let concepts;
    try {
      const parsed = JSON.parse(conceptText);
      concepts = parsed.concepts || parsed.assessments || parsed;
      if (!Array.isArray(concepts)) {
        concepts = [concepts];
      }
    } catch (parseError) {
      console.error('Failed to parse concepts:', conceptText);
      throw new Error('AI returned invalid concept JSON');
    }

    // Phase 2: Elaborate each concept into a full assessment
    const elaboratedAssessments = await Promise.all(
      concepts.slice(0, 3).map(async (concept) => {
        const elaboratePrompt = `Elaborate this coding assessment concept into a complete, detailed assessment for a ${roleTitle} position.

Concept:
Title: ${concept.title}
Focus: ${concept.concept}
Difficulty: ${concept.difficulty}
Primary Focus: ${concept.primaryFocus}

Job Context: ${roleDescription}${skillsContext}

Create a comprehensive assessment based on this concept. Return a JSON object:

{
  "assessmentType": "coding",
  "title": "${concept.title}",
  "description": "Detailed 3-4 sentence description of what the candidate will build",
  "whyCurated": "Comprehensive 4-5 sentence explanation of WHY this assessment was chosen. Explain what competencies it tests, how it relates to ${concept.primaryFocus}, and why it's particularly relevant for ${roleTitle} candidates.",
  "problemStatement": "Detailed problem statement with real-world context (3-4 paragraphs)",
  "requirements": ["Requirement 1", "Requirement 2", ...], // 6-10 specific technical requirements
  "acceptanceCriteria": ["Criterion 1", "Criterion 2", ...], // 4-6 passing criteria
  "evaluationCriteria": ["Code quality", "Problem-solving approach", "Completeness", "Performance"],
  "starterCode": "", // Optional starter code
  "testCases": [
    {
      "name": "Test name",
      "description": "What this validates",
      "input": "Example input",
      "expectedOutput": "Expected result",
      "isHidden": false
    }
  ], // 5-8 test cases
  "allowedLanguages": ["JavaScript", "Python", "TypeScript", "Java"],
  "difficulty": "${concept.difficulty}",
  "timeLimit": ${concept.estimatedMinutes},
  "estimatedTime": ${Math.floor(concept.estimatedMinutes * 0.75)}
}

Return ONLY valid JSON with no markdown formatting.`;

        const elaborateResult = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: elaboratePrompt }],
          temperature: 0.7,
          response_format: { type: "json_object" }
        });

        const elaborateText = elaborateResult.choices[0].message.content;
        const assessment = JSON.parse(elaborateText);

        // Normalize test cases - ensure input and expectedOutput are strings
        if (assessment.testCases && Array.isArray(assessment.testCases)) {
          assessment.testCases = assessment.testCases.map(tc => ({
            ...tc,
            input: typeof tc.input === 'object' ? JSON.stringify(tc.input) : String(tc.input),
            expectedOutput: typeof tc.expectedOutput === 'object' ? JSON.stringify(tc.expectedOutput) : String(tc.expectedOutput)
          }));
        }

        return assessment;
      })
    );

    console.log(`✅ Generated ${elaboratedAssessments.length} elaborated assessments`);
    return elaboratedAssessments;

  } catch (error) {
    console.error('Error in generateBatchAssessments:', error);
    throw new Error(`Failed to generate batch assessments: ${error.message}`);
  }
}

/**
 * Evaluate a code submission using AI
 *
 * @param {string} problemStatement - The original problem statement
 * @param {string} codeSubmission - The candidate's submitted code
 * @param {Array} testCases - Test cases to validate against
 * @param {Array<string>} requirements - Assessment requirements
 * @returns {Promise<Object>} Evaluation results with score and feedback
 */
async function evaluateCodeSubmission(problemStatement, codeSubmission, testCases = [], requirements = []) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured in environment variables');
    }

    const testCasesContext = testCases.length > 0
      ? `\n\nTest Cases to Validate:\n${testCases.map((tc, i) => `${i + 1}. ${tc.name}: ${tc.description}\n   Input: ${tc.input}\n   Expected: ${tc.expectedOutput}`).join('\n')}`
      : '';

    const requirementsContext = requirements.length > 0
      ? `\n\nRequirements:\n${requirements.map((r, i) => `${i + 1}. ${r}`).join('\n')}`
      : '';

    const prompt = `Evaluate this code submission for a technical assessment.

Problem Statement:
${problemStatement}${requirementsContext}${testCasesContext}

Submitted Code:
\`\`\`
${codeSubmission}
\`\`\`

Analyze the code and return a JSON object with these fields:

{
  "overallScore": 85, // Score out of 100
  "functionalCorrectness": 90, // Does it solve the problem? (0-100)
  "codeQuality": 85, // Code structure, readability, best practices (0-100)
  "problemSolving": 80, // Approach and logic (0-100)
  "efficiency": 85, // Performance and optimization (0-100)
  "testCaseResults": [
    {
      "testCaseIndex": 0,
      "passed": true,
      "actualOutput": "Result from code",
      "feedback": "Brief explanation"
    }
  ], // Results for each test case
  "strengths": ["Strength 1", "Strength 2"], // 2-4 strengths
  "weaknesses": ["Weakness 1", "Weakness 2"], // 2-4 weaknesses
  "detailedFeedback": "Comprehensive 3-5 sentence feedback on the submission",
  "suggestions": ["Suggestion 1", "Suggestion 2"], // 2-3 improvement suggestions
  "estimatedExperienceLevel": "intermediate", // beginner, intermediate, or advanced
  "recommendForInterview": true // Boolean recommendation
}

Be objective and constructive. Return ONLY valid JSON with no additional text or markdown formatting.`;

    const result = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.5,
      response_format: { type: "json_object" }
    });

    const text = result.choices[0].message.content;

    // Parse JSON response
    let evaluationData;
    console.log('AI Evaluation Response:', text);
    try {
      evaluationData = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', text);
      throw new Error('AI returned invalid JSON format');
    }

    return evaluationData;

  } catch (error) {
    console.error('Error in evaluateCodeSubmission:', error);
    throw new Error(`Failed to evaluate code submission: ${error.message}`);
  }
}

module.exports = {
  generateCompanyProfile,
  importJobListingFromUrl,
  generateResponsibilities,
  generateQualifications,
  generateSkills,
  generateAssessment,
  generateBatchAssessments,
  evaluateCodeSubmission
};
