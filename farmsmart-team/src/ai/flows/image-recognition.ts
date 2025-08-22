// 'use server';

/**
 * @fileOverview Image recognition flow for pest and disease detection.
 *
 * - imageRecognition - A function that handles the image recognition process.
 * - ImageRecognitionInput - The input type for the imageRecognition function.
 * - ImageRecognitionOutput - The return type for the imageRecognition function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImageRecognitionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ImageRecognitionInput = z.infer<typeof ImageRecognitionInputSchema>;

const RecognitionResultSchema = z.object({
  label: z.string().describe('The identified pest, disease, or "Healthy".'),
  confidence: z
    .number()
    .describe('The confidence level of the identification (0-1).'),
});

const ImageRecognitionOutputSchema = z.object({
  results: z
    .array(RecognitionResultSchema)
    .describe(
      'An array of possible identifications and their confidence scores. The sum of confidences should be 1.'
    ),
});
export type ImageRecognitionOutput = z.infer<typeof ImageRecognitionOutputSchema>;

export async function imageRecognition(input: ImageRecognitionInput): Promise<ImageRecognitionOutput> {
  return imageRecognitionFlow(input);
}

const imageRecognitionPrompt = ai.definePrompt({
  name: 'imageRecognitionPrompt',
  input: {schema: ImageRecognitionInputSchema},
  output: {schema: ImageRecognitionOutputSchema},
  prompt: `You are an expert in plant pathology. Analyze the image of the plant and determine if any pests or diseases are present.

  Based on the image, provide a list of possible identifications (including "Healthy" if applicable) and their corresponding confidence scores. The scores should sum up to 1.

  Return an array of objects in the 'results' field, where each object has a 'label' and a 'confidence'.

  Analyze the following image: {{media url=photoDataUri}}`,
});

const imageRecognitionFlow = ai.defineFlow(
  {
    name: 'imageRecognitionFlow',
    inputSchema: ImageRecognitionInputSchema,
    outputSchema: ImageRecognitionOutputSchema,
  },
  async input => {
    const {output} = await imageRecognitionPrompt(input);
    return output!;
  }
);
