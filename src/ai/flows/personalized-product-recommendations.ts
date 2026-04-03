'use server';
/**
 * @fileOverview A Genkit flow for generating personalized product recommendations.
 *
 * - personalizedProductRecommendations - A function that generates product recommendations based on user behavior.
 * - PersonalizedProductRecommendationsInput - The input type for the personalizedProductRecommendations function.
 * - PersonalizedProductRecommendationsOutput - The return type for the personalizedProductRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedProductRecommendationsInputSchema = z.object({
  userId: z.string().describe('The ID of the user for whom recommendations are being generated.'),
  browsingHistory: z
    .array(z.string())
    .describe('A list of product IDs or names that the user has recently viewed.'),
  pastPurchases: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number(),
        purchaseDate: z.string().describe('Purchase date in YYYY-MM-DD format.'),
      })
    )
    .describe(
      'A list of products previously purchased by the user, including product ID, quantity, and purchase date.'
    ),
  availableProducts: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        category: z.string(),
        price: z.number(),
      })
    )
    .describe(
      'A comprehensive list of all available products in the catalog, including their ID, name, description, category, and price.'
    ),
});
export type PersonalizedProductRecommendationsInput = z.infer<
  typeof PersonalizedProductRecommendationsInputSchema
>;

const PersonalizedProductRecommendationsOutputSchema = z.object({
  recommendedProducts: z
    .array(
      z.object({
        productId: z.string(),
        productName: z.string(),
        reason: z.string().describe('A brief explanation of why the product is recommended.'),
      })
    )
    .describe(
      'A list of recommended products, each with its ID, name, and a brief explanation of why it is recommended.'
    ),
});
export type PersonalizedProductRecommendationsOutput = z.infer<
  typeof PersonalizedProductRecommendationsOutputSchema
>;

export async function personalizedProductRecommendations(
  input: PersonalizedProductRecommendationsInput
): Promise<PersonalizedProductRecommendationsOutput> {
  return personalizedProductRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedProductRecommendationsPrompt',
  input: {schema: PersonalizedProductRecommendationsInputSchema},
  output: {schema: PersonalizedProductRecommendationsOutputSchema},
  prompt: `You are an intelligent product recommendation engine for a premium dates (tamr) packaging and sales business. Your goal is to suggest personalized date products and packaging combinations to a user based on their past interactions and available products.

Consider the user's browsing history and past purchases to understand their preferences.
Then, recommend up to 3 products from the available product catalog that you believe the user would be most interested in.
For each recommendation, provide the product ID, its name, and a concise reason for the recommendation.

User's Browsing History:
{{#if browsingHistory}}
  {{#each browsingHistory}}
    - {{this}}
  {{/each}}
{{else}}
  No browsing history available.
{{/if}}

User's Past Purchases:
{{#if pastPurchases}}
  {{#each pastPurchases}}
    - Product ID: {{this.productId}}, Quantity: {{this.quantity}}, Purchased on: {{this.purchaseDate}}
  {{/each}}
{{else}}
  No past purchases available.
{{/if}}

Available Products Catalog:
{{#each availableProducts}}
  - ID: {{this.id}}, Name: {{this.name}}, Description: {{this.description}}, Category: {{this.category}}, Price: $\{{this.price}}
{{/each}}

Please provide your recommendations in a JSON array format, matching the output schema.`,
});

const personalizedProductRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedProductRecommendationsFlow',
    inputSchema: PersonalizedProductRecommendationsInputSchema,
    outputSchema: PersonalizedProductRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
