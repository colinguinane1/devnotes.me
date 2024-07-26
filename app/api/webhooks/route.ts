import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import prisma from '@/prisma/db'

export async function POST(req: Request) {

  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400
    })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred', {
      status: 400
    })
  }
  function generateUsername(firstName: string, lastName: string): string {
  const randomNumbers = Math.floor(100 + Math.random() * 900); // Generate two random numbers
  const username = `${firstName.toLowerCase()}_${lastName.toLowerCase()}${randomNumbers}`;
  return username;
}


  if (evt.type === 'user.created') {
    const { id, first_name, last_name, image_url, last_sign_in_at, created_at, updated_at } = evt.data;

    const parseDate = (date: number | string | null): Date | null => {
      if (date === null) return null;
      if (typeof date === 'number') return new Date(date);
      if (typeof date === 'string') return new Date(date);
      return null;
    }
    

    try {
      await prisma.user.create({
        data: {   
          id: id,
          first_name: first_name || '',
          last_name: last_name || '',
          image_url: image_url || null,
          last_sign_in_at: parseDate(last_sign_in_at),
          username: generateUsername(first_name || '', last_name || ''),
        }
      });
      console.log('User created:', id);
    } catch (error) {
      console.error('Error creating user in database:', error);
      return new Response('Error occurred while creating user', {
        status: 500
      });
    }
  }

  return new Response('', { status: 200 })
}
