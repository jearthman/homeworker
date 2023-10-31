import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    console.log(req.nextauth.token);
  },
  {
    callbacks: {
      authorized: ({ token }) => (token ? true : false),
    },
    pages: {
      signIn: "/",
    },
  },
);

export const config = { matcher: ["/portal", "/worker"] };
