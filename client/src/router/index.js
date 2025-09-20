import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth-store";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
      beforeEnter() {
        document.title = "Главная – DemoBlog";
      },
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
          document.title = "Вход – DemoBlog";
          return true;
        }
      },
    },
    {
      path: "/admin",
      name: "admin",
      component: () => import("../views/AdminView.vue"),
      beforeEnter() {
        document.title = "Админ-панель – DemoBlog";
      },
      children: [
        {
          path: "manage-users",
          name: "manage-users",
          component: () => import("../views/ManageUsersView.vue"),
          beforeEnter() {
            document.title = "Управление пользователями – DemoBlog";
          },
        },
        {
          path: "manage-roles",
          name: "manage-roles",
          component: () => import("../views/ManageRolesView.vue"),
          beforeEnter() {
            document.title = "Управление группами – DemoBlog";
          },
        },
      ],
    },
    {
      path: "/users/:nicknameSlug/blogs",
      name: "user-blogs",
      component: () => import("../views/UserBlogsView.vue"),
      beforeEnter(to) {
        document.title = `Блоги ${to.params.nicknameSlug || ""} – DemoBlog`;
      },
    },
    {
      path: "/users/:nicknameSlug/blogs/:blogSlug",
      name: "user-blog",
      component: () => import("../views/UserBlogView.vue"),
      beforeEnter(to) {
        document.title = `Блог ${to.params.blogSlug || ""} – DemoBlog`;
      },
    },
    {
      path: "/users/:nicknameSlug/blogs/:blogSlug/posts/:postSlug",
      name: "blog-post",
      component: () => import("../views/BlogPostView.vue"),
      beforeEnter(to) {
        document.title = `Пост ${to.params.postSlug || ""} – DemoBlog`;
      },
    },
    {
      path: "/users/:nicknameSlug",
      name: "profile",
      component: () => import("../views/ProfileView.vue"),
      beforeEnter(to) {
        document.title = `Профиль ${to.params.nicknameSlug || ""} – DemoBlog`;
      },
    },
    {
      path: "/terms",
      name: "terms",
      component: () => import("../views/TermsView.vue"),
      beforeEnter() {
        document.title = "Пользовательское соглашение – DemoBlog";
      },
    },
    {
      path: "/privacy",
      name: "privacy",
      component: () => import("../views/PrivacyView.vue"),
      beforeEnter() {
        document.title = "Политика конфиденциальности – DemoBlog";
      },
    },
    {
      path: "/:pathmatch(.*)",
      name: "404",
      component: () => import("../views/NotFound.vue"),
      beforeEnter() {
        document.title = "404 – DemoBlog";
      },
    },
  ],
});

export default router;
