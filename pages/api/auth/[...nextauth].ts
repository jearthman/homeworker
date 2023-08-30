import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Google OAuth environment variables are missing!");
}

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  // callbacks: {
  //   async session({session, user}) {
  //     // check if the user email exhist is prisma db
  //     const userExists = await prisma.user.findUnique({
  //       where: {
  //         email: user.email,
  //       },
  //     });

  //     return session;
  //   },
  // },
});
