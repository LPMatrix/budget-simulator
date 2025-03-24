const MISTRAL_API_KEY = import.meta.env.VITE_MISTRAL_API_KEY;

if (!MISTRAL_API_KEY) {
  throw new Error('MISTRAL_API_KEY is not defined. Please set it in your .env file.');
}

const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

/**
 * Generate a description for a movie budget allocation
 * @param {Object} allocations - Budget allocations for different categories
 * @param {Number} totalBudget - Total budget in dollars
 * @returns {Promise<string>} - The generated description
 */
export async function generateMovieDescription(allocations, totalBudget) {
    const budgetInMillions = totalBudget / 1000000;
    
    // Calculate percentages for each category
    const percentages = {};
    Object.keys(allocations).forEach(key => {
      percentages[key] = Math.round((allocations[key] / totalBudget) * 100);
    });
    
    const prompt = `
  You are a witty Hollywood insider analyzing a movie budget. 
  Total budget: $${budgetInMillions} million.
  
  Budget breakdown:
  - Actors & Cast: ${percentages.actors}%
  - Visual Effects: ${percentages.visualEffects}%
  - Production & Sets: ${percentages.production}%
  - Marketing: ${percentages.marketing}%
  - Script & Writing: ${percentages.writing}%
  - Music & Sound: ${percentages.music}%
  
  Give a humorous 2-paragraph description of what this movie would be like based on this budget allocation.
  Focus on what would be great and what would be hilariously terrible.
  Include a punchy title for this movie in quotation marks.
  Keep your response under 300 characters.
    `;
    
    return callMistralAPI(prompt);
  }
  
  /**
   * Generate a description for a wedding budget allocation
   * @param {Object} allocations - Budget allocations for different categories
   * @param {Number} totalBudget - Total budget in Naira
   * @returns {Promise<string>} - The generated description
   */
  export async function generateWeddingDescription(allocations, totalBudget) {
    // Calculate percentages for each category
    const percentages = {};
    Object.keys(allocations).forEach(key => {
      percentages[key] = Math.round((allocations[key] / totalBudget) * 100);
    });
    
    const budgetInMillions = totalBudget / 1000000;
    
    const prompt = `
  You are a witty Nigerian wedding planner analyzing a wedding budget.
  Total budget: ₦${budgetInMillions.toFixed(1)} million.
  
  Budget breakdown:
  - Venue & Rentals: ${percentages.venue}%
  - Catering & Drinks: ${percentages.catering}%
  - Attire & Rings: ${percentages.attire}%
  - Photography & Video: ${percentages.photography}%
  - Entertainment: ${percentages.entertainment}%
  - Decorations & Flowers: ${percentages.decorations}%
  
  Give a humorous 2-paragraph description of what this Nigerian wedding would be like based on this budget allocation.
  Focus on what would be great and what would be hilariously mismatched.
  Include a punchy tagline for this wedding in quotation marks.
  Keep your response under 300 characters.
    `;
    
    return callMistralAPI(prompt);
  }
  
  /**
   * Generate a description for a startup budget allocation
   * @param {Object} allocations - Budget allocations for different categories
   * @param {Number} totalBudget - Total budget in dollars
   * @returns {Promise<string>} - The generated description
   */
  export async function generateStartupDescription(allocations, totalBudget) {
    // Calculate percentages for each category
    const percentages = {};
    Object.keys(allocations).forEach(key => {
      percentages[key] = Math.round((allocations[key] / totalBudget) * 100);
    });
    
    const prompt = `
  You are a witty venture capitalist analyzing a startup's budget allocation.
  Total funding: $${totalBudget.toLocaleString()}.
  
  Budget breakdown:
  - Product Development: ${percentages.development}%
  - Marketing & Sales: ${percentages.marketing}%
  - Hiring & Team: ${percentages.hiring}%
  - Office & Equipment: ${percentages.office}%
  - Legal & Administration: ${percentages.legal}%
  - Operations: ${percentages.operations}%
  
  Give a humorous 2-paragraph description of how this startup would fare based on this budget allocation.
  Include whether it would succeed or fail and why.
  Include a punchy company slogan in quotation marks.
  Keep your response under 300 characters.
    `;
    
    return callMistralAPI(prompt);
  }
  
  /**
   * Call the Mistral API to generate a text completion
   * @param {string} prompt - The prompt to send to the API
   * @returns {Promise<string>} - The generated text
   */
  async function callMistralAPI(prompt) {
    try {
      // For development/demo purposes, return mock responses
      // In production, uncomment the API call below
    //   return mockMistralResponse(prompt);
      
      
      const response = await fetch(MISTRAL_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MISTRAL_API_KEY}`
        },
        body: JSON.stringify({
          model: 'mistral-large-latest',
          messages: [
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 300
        })
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const data = await response.json();
      return data.choices[0].message.content.trim();
      
    } catch (error) {
      console.error('Error calling Mistral API:', error);
      return "Sorry, I couldn't generate a description at this time. Please try again later.";
    }
  }
  
  /**
   * Generate mock responses for demo/development
   * Replace with actual API calls in production
   */
  function mockMistralResponse(prompt) {
    if (prompt.includes('movie budget')) {
      return '"WIRED FOR DISASTER": Your $100M blockbuster features A-list celebrities performing in cardboard sets with Windows Movie Maker-level effects. Critics will praise the acting while wondering if the explosions were drawn with crayons. At least the soundtrack slaps!';
    } else if (prompt.includes('Nigerian wedding')) {
      return '"OWAMBE GRANDEUR, BUDGET REALITY": Your ₦30M Nigerian wedding features Jollof that would make Aunties weep with joy, served in a hastily-decorated hall with plastic chairs. The photographer is world-class, but the DJ only knows five songs including "Decale Gwada" on repeat!';
    } else if (prompt.includes('startup')) {
      return '"Revolutionary Ideas, Evolutionary Funding": Your startup has an amazing product with zero marketing—enjoy your 12 very enthusiastic users! Your developers are coding on laptops from 2010 in a fancy WeWork while legal issues pile up unaddressed. Prepare for acquisition... of your office furniture when you shut down.';
    }
    
    return "Something went wrong with the simulation. Please try again!";
  }