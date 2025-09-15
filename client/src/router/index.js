import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth-store";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/auth",
      name: "auth",
      component: () => import("../views/AuthView.vue"),
      async beforeEnter() {
        const authStore = useAuthStore();

        if (typeof authStore.isAuth == "object") {
          await authStore.isAuth;
        }

        if (authStore.isAuth) {
          return false;
        } else {
          return true;
        }
      },
    },
    {
      path: "/admin",
      name: "admin",
      component: () => import("../views/AdminView.vue"),
      children: [
        {
          path: "manage-users",
          name: "manage-users",
          component: () => import("../views/ManageUsersView.vue"),
        },
        {
          path: "manage-roles",
          name: "manage-roles",
          component: () => import("../views/ManageRolesView.vue"),
        },
      ],
    },
    {
      path: "/users/:nicknameSlug/blogs",
      name: "user-blogs",
      component: () => import("../views/UserBlogsView.vue"),
    },
    {
      path: "/users/:nicknameSlug/blogs/:blogSlug",
      name: "user-blog",
      component: () => import("../views/UserBlogView.vue"),
    },
    {
      path: "/users/:nicknameSlug/blogs/:blogSlug/posts/:postSlug",
      name: "blog-post",
      component: () => import("../views/BlogPostView.vue"),
    },
    {
      path: "/users/:nicknameSlug",
      name: "profile",
      component: () => import("../views/ProfileView.vue"),
    },
    {
      path: "/terms",
      name: "terms",
      component: () => import("../views/TermsView.vue"),
    },
    {
      path: "/privacy",
      name: "privacy",
      component: () => import("../views/PrivacyView.vue"),
    },
    {
      path: "/:pathmatch(.*)",
      name: "404",
      component: () => import("../views/NotFound.vue"),
    },
  ],
});

export default router;
