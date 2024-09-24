'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/app/utils/supabase/server'
import { Provider } from '@supabase/supabase-js'
import { getURL } from '@/app/utils/helpers'
import prisma from '@/prisma/db'
import { create } from 'domain'
import { LassoSelect } from 'lucide-react'
import { time } from 'console'

let defaultAvatar = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F009%2F292%2F244%2Foriginal%2Fdefault-avatar-icon-of-social-media-user-vector.jpg&f=1&nofb=1&ipt=006767bb3b833d3cb8590d11f5c03a9e64ec2adf837953f627c67bdf8a29cf7e&ipo=images"

export async function emailLogin(formData: FormData) {
    const supabase = createClient();
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    };

    const { error } = await supabase.auth.signInWithPassword(data);
    if (error) {
        return redirect('/login?m=Invalid%20Credentials&type=error&form=login');
    }

    const { data: { user } } = await supabase.auth.getUser();
    await checkAuthorExists(user);
    revalidatePath('/', 'layout');
    redirect('/explore');
 

     
    

}


export async function checkUsernameExists(username: string) {
    const author = await prisma.author.findUnique({
        where: {
            username,
        }
    })
    if (author) {
        console.log("Username exists")
        return true

    }
     console.log("Username DOESNT exist")

    return false
}

export async function checkEmailInUse(email: string) {
    const author = await prisma.author.findUnique({
        where: {
            email,
        }
    })
    if (author) {
        console.log("Email exists")
        return true

    }
     console.log("Email DOESNT exist")

    return false
   
}

export async function signup(formData: FormData) {
    const supabase = createClient();
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const usernameExists = await checkUsernameExists(username);
    const emailInUse = await checkEmailInUse(email);

    if (usernameExists) {
        return redirect('/login?m=Username%20already%20exists&type=error&form=signup');
    }
    if (emailInUse) {
        return redirect('/login?m=Email%20already%20in%20use&type=error&form=signup');
    }

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        options: {
            data: {
                first_name: formData.get('first_name') as string,
                last_name: formData.get('last_name') as string,
                username: formData.get('username') as string,
            }
        }
    };

    const { error } = await supabase.auth.signUp(data);

    if (error) {
        return redirect('/login?m=Error%20signing%20up&type=error&form=signup');
    }revalidatePath('/', 'layout');
    return redirect('/login?m=Check%20your%20email&type=success&form=signup');

    
   
}

export async function checkAuthorExists(user: any) {
    if (!user || !user.id) {
        console.error('Invalid user object, cannot check author existence');
        return;
    }

    const author = await prisma.author.findUnique({
        where: {
            email: user.email,  // Use email for checking existence instead of id
        },
    });

    if (!author) {
        console.log("User doesn't exist, creating author...");
        await createAuthor(user);
    } else {
        console.log("User already exists in the database");
    }
}

export async function createAuthor(user: any) {
    try {
        await prisma.author.create({
            data: {
                id: user.id,
                email: user.email,
                full_name: user.user_metadata?.full_name || user.email,
                image_url: user.user_metadata?.avatar_url || defaultAvatar,
                username: user.user_metadata?.username || `user_${Date.now()}`,
            },
        });
        console.log('User created:', user.id);
    } catch (error) {
        console.error('Error creating user in database:', error);
    }
    console.log("Author created successfully" + user.id)
}


export async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    redirect('/login')
}


export async function oAuthSignIn(provider: Provider) {
    if (!provider) {
        return redirect('/login?m=No provider selected')
    }

    const supabase = createClient();
    const redirectUrl = getURL("/auth/callback")
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: redirectUrl,
            
        }
    })

    if (error) {
        return redirect('/login?m=Could not authenticate user')
    }

    console.log("here")

    return redirect(data.url)
}



export async function signInWithGithub() {
    const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
  })
}

export async function signInWithGoogle() {
    const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  })
}
