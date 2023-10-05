
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google";

const providers: NextAuthOptions['providers'] = [
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
    })
]

const callbacks: NextAuthOptions['callbacks'] = {
    'signIn': async (params) => {
        const { user, account } = params;
        if (!account) {
            return false;
        }

        if (account.provider === 'google') {    
            const googleUser = {
                id: "",
                login: "",
                name: "",
                avatar: user.image
            }
        
            const accessToken = await getTokenFromYourAPIServer('google', googleUser);
            Object.assign(user, { accessToken });

            return true
        }
    
        return false;
    },
    'session': async ({ session, user }) => {
        if (!user || !("accessToken" in user)) {
            return session;
        }

        const accessToken = user.accessToken;
        Object.assign(session, { accessToken });

        const userFromDB = getUserFromTheAPIServer(accessToken);
        Object.assign(session, { user: userFromDB });

        return session
    },
    'jwt': async ({ token, user }) => {
        if (user && "accessToken" in user) {
            const accessToken = user.accessToken;
            token = { accessToken }
        }
    
        return token
    }

};

const handler = (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, { 
    callbacks, 
    providers,
});

export {
    handler as GET,
    handler as POST
}

const getTokenFromYourAPIServer = async (provider: string, user: any) => {
    return "token-af"
}

const getUserFromTheAPIServer = async (accessToken: string) => {
    return "yee-haw-user"

}