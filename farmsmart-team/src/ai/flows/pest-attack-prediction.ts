'use server';

/**
 * @fileOverview Predicts pest attacks for specific crops and locations, providing farmers with proactive preventive measures.
 *
 * - predictPestAttack - A function that handles the pest attack prediction process.
 * - PredictPestAttackInput - The input type for the predictPestAttack function.
 * - PredictPestAttackOutput - The return type for the predictPestAttack function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictPestAttackInputSchema = z.object({
  cropType: z.string().describe('The type of crop.'),
  location: z.string().describe('The geographic location of the farm.'),
  weatherData: z.string().describe('Current weather data for the location.'),
  historicalPestData: z.string().describe('Historical pest outbreak data for the region.'),
});
export type PredictPestAttackInput = z.infer<typeof PredictPestAttackInputSchema>;

const PredictPestAttackOutputSchema = z.object({
  pestRiskLevel: z.string().describe('The predicted risk level of pest attack (low, medium, high).'),
  pestTypes: z.array(z.string()).describe('The predicted types of pests that may attack the crop.'),
  preventiveMeasures: z.string().describe('Recommended preventive measures to protect the crop.'),
});
export type PredictPestAttackOutput = z.infer<typeof PredictPestAttackOutputSchema>;

export async function predictPestAttack(input: PredictPestAttackInput): Promise<PredictPestAttackOutput> {
  return predictPestAttackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'pestAttackPredictionPrompt',
  input: {schema: PredictPestAttackInputSchema},
  output: {schema: PredictPestAttackOutputSchema},
  prompt: `You are an expert agricultural advisor. Based on the provided information, predict potential pest attacks and suggest preventive measures.

Crop Type: {{{cropType}}}
Location: {{{location}}}
Weather Data: {{{weatherData}}}
Historical Pest Data: {{{historicalPestData}}}

Consider regional data to tailor the output to specific geographic factors.

Pest Risk Level (low, medium, high):
Pest Types:
Preventive Measures:`,
});

const predictPestAttackFlow = ai.defineFlow(
  {
    name: 'predictPestAttackFlow',
    inputSchema: PredictPestAttackInputSchema,
    outputSchema: PredictPestAttackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
