<script setup>
  import { ref, onMounted } from "vue";
  import { useAuthStore } from "@/stores/auth-store";
  import { useRoute, useRouter, onBeforeRouteUpdate } from "vue-router";
  import blogService from "@/services/blog-service";
  import ButtonAddNew from "@/components/UI/ButtonAddNew.vue";
  import UserBlog from "@/components/UserBlog.vue";
  import BlogEdit from "@/components/BlogEdit.vue";
  import ModalMain from "@/components/ModalMain.vue";
  import handleAxiosError from "@/utils/handle-axios-error";
  import BlogCreate from "@/components/BlogCreate.vue";
  import { useGlobalNotificationStore } from "@/stores/global-notification-store";

  const route = useRoute();
  const router = useRouter();

  const authStore = useAuthStore();
  const globalNotificationStore = useGlobalNotificationStore();

  const userBlogs = ref({});
  const isMyBlogs = ref(false);
  const blog = ref("");
  const isBlogsLoaded = ref(false);

  const isBlogEditing = ref(false);
  const isBlogCreating = ref(false);

  function startBlogEdit(thisBlog) {
    blog.value = thisBlog;
    isBlogEditing.value = true;
  }

  function cancelBlogEdit() {
    isBlogEditing.value = false;
    blog.value = "";
  }

  async function getUserBlogs(nicknameSlug) {
    if (typeof authStore.isAuth == "object") {
      await authStore.isAuth;
    }

    try {
      const response = await blogService.getUserBlogs(
        nicknameSlug || route.params.nicknameSlug,
      );
      userBlogs.value = response.data;
      isMyBlogs.value = false;

      if (
        authStore.userData.nicknameSlug ==
        (nicknameSlug || route.params.nicknameSlug)
      ) {
        isMyBlogs.value = true;
      }
    } catch (error) {
      router.push("/404");
      handleAxiosError(error, globalNotificationStore.showNotification);
    }
  }

  async function updateBlogTitle(blogId, blogNewTitle) {
    if (typeof authStore.isAuth == "object") {
      await authStore.isAuth;
    }

    try {
      await blogService.updateBlogTitle(
        authStore.userData.id,
        blogId,
        blogNewTitle,
      );

      await getUserBlogs(route.params.nicknameSlug);

      cancelBlogEdit();
      globalNotificationStore.showNotification("Заголовок блога обновлен");
    } catch (error) {
      handleAxiosError(error, globalNotificationStore.showNotification);
    }
  }

  function startBlogCreate() {
    isBlogCreating.value = true;
  }

  function cancelBlogCreate() {
    isBlogCreating.value = false;
  }

  async function createBlog(blogTitle) {
    if (typeof authStore.isAuth == "object") {
      await authStore.isAuth;
    }

    try {
      const newBlog = await blogService.createBlog(
        authStore.userData.id,
        blogTitle,
        route.params.nicknameSlug,
      );

      await getUserBlogs(route.params.nicknameSlug);

      cancelBlogCreate();
      globalNotificationStore.showNotification("Блог создан");
    } catch (error) {
      handleAxiosError(error, globalNotificationStore.showNotification);
    }
  }

  onMounted(async () => {
    await getUserBlogs();
    isBlogsLoaded.value = true;
  });

  onBeforeRouteUpdate(async (to, from) => {
    await getUserBlogs(to.params.nicknameSlug);
  });
</script>

<template>
  <Teleport to="#modals">
    <ModalMain
      v-if="isBlogEditing"
      @closeModal="cancelBlogEdit"
    >
      <BlogEdit
        :blog="blog"
        @closeModal="cancelBlogEdit"
        @updateBlogTitle="updateBlogTitle"
      />
    </ModalMain>
  </Teleport>
  <div class="container">
    <h1
      v-if="userBlogs && userBlogs.length > 0"
      class="user-blogs__heading section-heading"
    >
      <span>Блоги</span>
    </h1>
    <div class="user-blogs">
      <div
        v-if="!isBlogCreating && isMyBlogs"
        class="user-blogs__add"
      >
        <ButtonAddNew
          class="user-blogs__add-button notab"
          @click="startBlogCreate"
          >Добавить блог</ButtonAddNew
        >
      </div>
      <BlogCreate
        v-else-if="isMyBlogs"
        @createBlog="createBlog"
        @cancelBlogCreate="cancelBlogCreate"
      />
      <TransitionGroup :name="isBlogsLoaded ? 'list' : ''">
        <UserBlog
          class="user-blog"
          v-for="blog in userBlogs"
          :key="blog.idSimple"
          :blog="blog"
          :class="{ pinned: blog.pinned, hidden: blog.hidden }"
          @openModal="startBlogEdit"
          @updateBlogCover="getUserBlogs"
          @updateBlogs="getUserBlogs"
          @updateBlogPin="getUserBlogs"
          @updateBlogEye="getUserBlogs"
      /></TransitionGroup>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .user-blogs {
    position: relative;
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 50px;
    width: 100%;

    &__add {
      width: calc(50% - 8px);
      min-height: 320px;

      @media (max-width: 1299.98px) {
        width: 100%;
        min-height: 100px;
      }

      &-button {
        width: 100%;
        height: 100%;
      }
    }

    .user-blog {
      &.pinned {
        outline: 2px solid blueviolet;
      }

      &.hidden {
        opacity: 0.5;
        outline: 2px solid gray;
      }
    }
  }
</style>
