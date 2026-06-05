// sanity/lib/client.ts
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'


export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,         // يفضل false للكتابة
  token: process.env.SANITY_API_WRITE_TOKEN, // يجب إضافة هذا المتغير
})
// Client خاص بالكتابة (يُستخدم فقط في API routes)
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,         // يفضل false للكتابة
  token: process.env.SANITY_API_WRITE_TOKEN, // يجب إضافة هذا المتغير
})