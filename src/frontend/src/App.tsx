import { Toaster } from "@/components/ui/sonner";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { Outlet, createRootRoute, createRoute } from "@tanstack/react-router";
import { Layout } from "./components/Layout";
import CustomerChat from "./pages/CustomerChat";
import Dashboard from "./pages/Dashboard";
import LiveChats from "./pages/LiveChats";
import Orders from "./pages/Orders";

// ─── Routes ──────────────────────────────────────────────────────────────────

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "oklch(0.09 0.02 240)",
            border: "1px solid oklch(0.85 0.2 196 / 0.4)",
            color: "oklch(0.92 0.08 196)",
            fontFamily: "Geist Mono, monospace",
            fontSize: "13px",
            boxShadow: "0 0 16px oklch(0.85 0.2 196 / 0.2)",
          },
        }}
      />
    </Layout>
  ),
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Dashboard,
});

const ordersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/orders",
  component: Orders,
});

const chatsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/chats",
  component: LiveChats,
});

const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/chat",
  component: CustomerChat,
});

const routeTree = rootRoute.addChildren([
  dashboardRoute,
  ordersRoute,
  chatsRoute,
  chatRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  return <RouterProvider router={router} />;
}
