import prisma from "@/prisma/db"
import { redirect } from 'next/navigation'

export async function search(query: string){
   return redirect(`/search/${query}`)
}