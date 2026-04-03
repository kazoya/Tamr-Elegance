
'use server';
/**
 * @fileOverview معالجة الطلب الصوتي وتحويله لرسالة واتساب مرتبة.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VoiceOrderInputSchema = z.object({
  transcript: z.string().describe('نص الطلب الصوتي الذي قاله العميل'),
});

const VoiceOrderOutputSchema = z.object({
  formattedMessage: z.string().describe('رسالة مرتبة جاهزة للإرسال لواتساب'),
  summary: z.string().describe('ملخص الطلب'),
});

export async function processVoiceOrder(input: { transcript: string }) {
  return processVoiceOrderFlow(input);
}

const processVoiceOrderFlow = ai.defineFlow(
  {
    name: 'processVoiceOrderFlow',
    inputSchema: VoiceOrderInputSchema,
    outputSchema: VoiceOrderOutputSchema,
  },
  async input => {
    const {output} = await ai.generate({
      prompt: `أنت مساعد مبيعات ذكي لشركة "تمور السلامات". 
استلمت الطلب الصوتي التالي من عميل: "${input.transcript}"

قم بتحويله إلى رسالة واتساب رسمية وفخمة موجهة لصاحب المحل. 
يجب أن تحتوي الرسالة على:
1. تحية فخمة.
2. تفاصيل المنتجات المطلوبة بشكل واضح.
3. طلب تأكيد الطلب.

اللغة: العربية (بأسلوب راقٍ).`,
      output: {schema: VoiceOrderOutputSchema},
    });
    return output!;
  }
);
