<script setup>
  import BlogEdit from "@/components/BlogEdit.vue";
  import BlogPost from "@/components/BlogPost.vue";
  import ModalMain from "@/components/ModalMain.vue";
  import ButtonAddNew from "@/components/UI/ButtonAddNew.vue";
  import UserBlog from "@/components/UserBlog.vue";
  import blogService from "@/services/blog-service";
  import postService from "@/services/post-service";
  import { useAuthStore } from "@/stores/auth-store";
  import handleAxiosError from "@/utils/handle-axios-error";
  import Masonry from "masonry-layout";
  import { onMounted, ref, computed } from "vue";
  import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
  import PostCreate from "@/components/PostCreate.vue";
  import PostEdit from "@/components/PostEdit.vue";
  import ArrowRightAngle from "@/components/svg/ArrowRightAngle.vue";
  import ButtonNavigation from "@/components/UI/ButtonNavigation.vue";
  import { useGlobalNotificationStore } from "@/stores/global-notification-store";

  const authStore = useAuthStore();
  const globalNotificationStore = useGlobalNotificationStore();

  const router = useRouter();
  const route = useRoute();

  const userBlogRef = ref(null);

  const blog = ref({});
  const blogPosts = ref([]);
  const isMyBlog = ref(false);

  const postDataForEdit = ref("");

  const isBlogEditing = ref(false);
  const isPostCreating = ref(false);
  const isPostEditing = ref(false);
  const isPostsLoaded = ref(false);

  function startPostEdit(post) {
    postDataForEdit.value = post;
    isPostEditing.value = true;
  }

  function cancelPostEdit() {
    postDataForEdit.value = "";
    isPostEditing.value = false;
  }

  async function editPost(postNewData) {
    if (typeof authStore.isAuth == "object") {
      await authStore.isAuth;
    }

    try {
      await postService.editPost(
        authStore.userData?.id,
        postNewData.title,
        postNewData.body,
        postNewData.tags,
        route.params.nicknameSlug,
        postNewData.id,
      );
      globalNotificationStore.showNotification("Пост изменен");
      await getBlogPosts();
      cancelPostEdit();
      initMasonry();
      return true;
    } catch (error) {
      handleAxiosError(error, globalNotificationStore.showNotification);
    }
  }

  function startBlogEdit(thisBlog) {
    blog.value = thisBlog;
    isBlogEditing.value = true;
  }

  function cancelBlogEdit() {
    isBlogEditing.value = false;
  }

  async function deletePost(postId) {
    if (typeof authStore.isAuth == "object") {
      await authStore.isAuth;
    }

    try {
      await postService.deletePost(postId);
      await getBlogPosts();
      await getUserBlog();
      globalNotificationStore.showNotification("Пост удален");
      return true;
    } catch (error) {
      handleAxiosError(error, globalNotificationStore.showNotification);
    }
  }

  async function getBlogPosts(blogSlug) {
    try {
      const response = await postService.getBlogPosts(
        blogSlug || route.params.blogSlug,
      );

      blogPosts.value = response.data;
    } catch (error) {
      handleAxiosError(error, globalNotificationStore.showNotification);
    }
  }

  async function getUserBlog(blogSlug) {
    if (typeof authStore.isAuth == "object") {
      await authStore.isAuth;
    }

    blogSlug = blogSlug || route.params.blogSlug;

    try {
      const response = await blogService.getUserBlog(blogSlug);
      blog.value = response.data;

      if (blog.value?.author?.id == authStore?.userData?.id) {
        isMyBlog.value = true;
      }
    } catch (error) {
      handleAxiosError(error, globalNotificationStore.showNotification);
    }
  }

  async function updateBlogTitle(blogId, blogNewTitle) {
    if (typeof authStore.isAuth == "object") {
      await authStore.isAuth;
    }

    try {
      const response = await blogService.updateBlogTitle(
        authStore.userData.id,
        blogId,
        blogNewTitle,
      );

      cancelBlogEdit();

      globalNotificationStore.showNotification("Заголовок блога обновлен");

      router.push(
        `/users/${route.params.nicknameSlug}/blogs/${response.data?.blogSlug}`,
      );
    } catch (error) {
      handleAxiosError(error, globalNotificationStore.showNotification);
    }
  }

  const isBlogCoverSelected = computed(
    () => userBlogRef?.value?.isBlogCoverSelected,
  );

  function initMasonry() {
    const msnry = new Masonry(".posts-masonry", {
      itemSelector: ".post-item",
      columnWidth: "",
      gutter: 16,
    });
  }

  function startPostCreate() {
    isPostCreating.value = true;
  }

  function cancelPostCreate() {
    isPostCreating.value = false;
  }

  async function createPost(post) {
    if (typeof authStore.isAuth == "object") {
      await authStore.isAuth;
    }

    try {
      await postService.createPost(
        authStore.userData?.id,
        post.title,
        post.body,
        post.tags,
        blog.value.id,
        route.params.nicknameSlug,
      );

      await getBlogPosts();
      await getUserBlog();
      cancelPostCreate();
      globalNotificationStore.showNotification("Пост создан");
      return true;
    } catch (error) {
      handleAxiosError(error, globalNotificationStore.showNotification);
    }
  }

  async function pinTogglePost(post) {
    if (typeof authStore.isAuth == "object") {
      await authStore.isAuth;
    }

    try {
      const response = await postService.pinTogglePost(
        authStore.userData?.id,
        post.id,
      );

      await getBlogPosts();
      initMasonry();
      globalNotificationStore.showNotification(
        response.data?.message || "Успешно",
      );
    } catch (error) {
      handleAxiosError(error, globalNotificationStore.showNotification);
    }
  }

  async function hideTogglePost(post) {
    if (typeof authStore.isAuth == "object") {
      await authStore.isAuth;
    }

    try {
      const response = await postService.hideTogglePost(
        authStore.userData?.id,
        post.id,
      );

      await getBlogPosts();
      initMasonry();
      globalNotificationStore.showNotification(
        response.data?.message || "Успешно",
      );
    } catch (error) {
      handleAxiosError(error, globalNotificationStore.showNotification);
    }
  }

  function goToBlogsList() {
    router.push(`/users/${route.params.nicknameSlug}/blogs/`);
  }

  onMounted(async () => {
    await getUserBlog();
    await getBlogPosts();
    initMasonry();
    isPostsLoaded.value = true;
  });

  onBeforeRouteUpdate(async (to, from) => {
    await getUserBlog(to.params.blogSlug);
    await getBlogPosts(to.params.blogSlug);
    initMasonry();
    isPostsLoaded.value = true;
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
    <ModalMain
      v-if="isPostCreating"
      @closeModal="cancelPostCreate"
    >
      <PostCreate
        @createPost="createPost"
        @cancelForm="cancelPostCreate"
      />
    </ModalMain>
    <ModalMain
      v-if="isPostEditing"
      @closeModal="cancelPostEdit"
    >
      <PostEdit
        :post="postDataForEdit"
        @updatePost="editPost"
        @cancelForm="cancelPostEdit"
      />
    </ModalMain>
  </Teleport>
  <UserBlog
    class="user-blog inside"
    :class="
      (blog.coverUrl && blog.coverUrl != 'none') || isBlogCoverSelected
        ? 'cover'
        : 'no-cover'
    "
    :blog="blog"
    :inside="true"
    @openModal="startBlogEdit"
    @updateBlogCover="getUserBlog"
    @updateBlogs="goToBlogsList"
    @updateBlogPin="getUserBlog"
    @updateBlogEye="getUserBlog"
    ref="userBlogRef"
  />
  <div class="back-to-blog">
    <div class="container">
      <ButtonNavigation>
        <RouterLink
          class="back-to-blog__link"
          :to="`/users/${route.params.nicknameSlug}/blogs/`"
        >
          <ArrowRightAngle class="back-to-blog__icon" />
          <span>К списку блогов</span></RouterLink
        >
      </ButtonNavigation>
    </div>
  </div>
  <div class="blog-posts">
    <div class="container">
      <div class="blog-posts__posts-wrapper posts-masonry">
        <div
          v-if="isMyBlog"
          class="blog-posts__add blog-posts__post post-item"
        >
          <ButtonAddNew
            class="blog-posts__add-button notab"
            @click="startPostCreate"
            >Добавить пост</ButtonAddNew
          >
        </div>

        <TransitionGroup
          :name="isPostsLoaded ? 'list' : ''"
          @leave="initMasonry"
          @enter="initMasonry"
        >
          <BlogPost
            class="blog-posts__post"
            v-for="post in blogPosts"
            :key="post.id"
            :post="post"
            :class="{ pinned: post.pinned, hidden: post.hidden }"
            @editPost="startPostEdit"
            @deletePost="deletePost"
            @pinTogglePost="pinTogglePost"
            @hideTogglePost="hideTogglePost"
            @likePost="getBlogPosts"
            @dislikePost="getBlogPosts"
          />
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .back-to-blog {
    margin-top: 50px;

    &__icon {
      width: 24px;
      height: 24px;
      transform: rotate(180deg);
      margin-right: 4px;
    }
  }

  .user-blog {
    position: relative;
    top: -80px;

    &.inside {
      width: 100%;
      border-radius: 0px;
      border: 0;
      border-top: 8px solid #242936;
    }

    &.cover {
      height: 80vh;
    }
  }

  .blog-posts {
    margin-top: 50px;

    &__post {
      width: calc(50% - 8px);
      margin-bottom: 16px;

      &.pinned {
        outline: 2px solid blueviolet;
      }

      &.hidden {
        opacity: 0.5;
        outline: 2px solid gray;
      }
    }

    &__add {
      height: 320px;

      &-button {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
