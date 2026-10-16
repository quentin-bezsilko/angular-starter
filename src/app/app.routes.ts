import type { Routes } from "@angular/router";
import { authChildGuard } from "./auth/auth-guard";

export const routes: Routes = [
  {
    path: "login",
    loadComponent: () => import("./login/login").then((m) => m.Login),
  },

  {
    path: "",
    canActivateChild: [authChildGuard],
    children: [
      {
        path: "samples",
        loadComponent: () =>
          import("./samples/pages/sample-list/sample-list").then(
            (m) => m.SampleList,
          ),
      },
      {
        path: "samples/new",
        loadComponent: () =>
          import("./samples/components/sample-create/sample-create").then(
            (m) => m.SampleCreate,
          ),
      },
      {
        path: "samples/dashboard",
        loadComponent: () =>
          import("./samples/pages/sample-dashboard/sample-dashboard").then(
            (m) => m.SampleDashboard,
          ),
      },
      {
        path: "samples/:id/edit",
        loadComponent: () =>
          import("./samples/components/sample-edit/sample-edit").then(
            (m) => m.SampleEdit,
          ),
      },
      {
        path: "samples/favorites",
        loadComponent: () =>
          import("./samples/pages/sample-favorites/sample-favorites").then(
            (m) => m.SampleFavorites,
          ),
      },
      {
        path: "samples/trash",
        loadComponent: () =>
          import("./samples/pages/sample-trash/sample-trash").then(
            (m) => m.SampleTrash,
          ),
      },
      {
        path: "samples/:id",
        loadComponent: () =>
          import("./samples/pages/sample-detail/sample-detail").then(
            (m) => m.SampleDetail,
          ),
      },
      {
        path: "",
        pathMatch: "full",
        redirectTo: "samples",
      },
    ],
  },

  {
    path: "403",
    loadComponent: () =>
      import("./pages/forbidden/forbidden").then((m) => m.Forbidden),
  },

  {
    path: "404",
    loadComponent: () =>
      import("./pages/not-found/not-found").then((m) => m.NotFound),
  },

  {
    path: "**",
    redirectTo: "404",
  },
];
