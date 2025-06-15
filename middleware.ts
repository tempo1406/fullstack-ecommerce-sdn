import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect product creation/modification routes
        if (req.nextUrl.pathname.startsWith("/products/new")) {
          return !!token
        }
        if (req.nextUrl.pathname.includes("/edit")) {
          return !!token
        }
        if (req.nextUrl.pathname.startsWith("/api/products") && 
            (req.method === "POST" || req.method === "PUT" || req.method === "DELETE")) {
          return !!token
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    "/products/new",
    "/products/:path*/edit",
    "/api/products/:path*"
  ]
}
