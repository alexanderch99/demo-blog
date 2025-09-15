<script setup>
  import BlogPost from "@/components/BlogPost.vue";
  import ModalMain from "@/components/ModalMain.vue";
  import PostEdit from "@/components/PostEdit.vue";
  import ArrowRightAngle from "@/components/svg/ArrowRightAngle.vue";
  import ButtonNavigation from "@/components/UI/ButtonNavigation.vue";
  import postService from "@/services/post-service";
  import { useAuthStore } from "@/stores/auth-store";
  import handleAxiosError from "@/utils/handle-axios-error";
  import waitMs from "@/utils/wait-ms";
  import { onMounted, ref } from "vue";
  import { useRoute, useRouter } from "vue-router";

  const router = useRouter();
  const route = useRoute();

  const authStore = useAuthStore();

  const blogPost = ref({});
  const isPostEditing = ref(false);
  const blogPostsPath = `/users/${route.params.nicknameSlug}/blogs/${route.params.blogSlug}`;

  async function getBlogPost(postSlug) {
    try {
      const response = await postService.getBlogPost(
        postSlug || route.params.postSlug,
      );
      blogPost.value = response.data;
      return true;
    } catch (error) {
      handleAxiosError(error);
    }
  }

  async function editPost(postNewData) {
    if (typeof authStore.isAuth == "object") {
      await authStore.isAuth;
    }

    try {
      const response = await postService.editPost(
        authStore.userData?.id,
        postNewData.title,
        postNewData.body,
        postNewData.tags,
        route.params.nicknameSlug,
        postNewData.id,
      );

      const editedPost = response.data;

      router.push(
        `/users/${route.params.nicknameSlug}/blogs/${route.params.blogSlug}/posts/${editedPost.postSlug}`,
      );
      await getBlogPost(editedPost.postSlug);
      cancelPostEdit();
    } catch (error) {
      handleAxiosError(error);
    }
  }

  function startPostEdit() {
    isPostEditing.value = true;
  }

  function cancelPostEdit() {
    isPostEditing.value = false;
  }

  async function deletePost(postId) {
    if (typeof authStore.isAuth == "object") {
      await authStore.isAuth;
    }

    try {
      await postService.deletePost(postId);
      router.push(blogPostsPath);
    } catch (error) {
      handleAxiosError(error);
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

      await getBlogPost();
    } catch (error) {
      handleAxiosError(error);
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

      await getBlogPost();
    } catch (error) {
      handleAxiosError(error);
    }
  }

  onMounted(async () => {
    await getBlogPost();
  });
</script>

<template>
  <Teleport to="#modals">
    <ModalMain
      v-if="isPostEditing"
      @closeModal="cancelPostEdit"
    >
      <PostEdit
        :post="blogPost"
        @updatePost="editPost"
        @cancelForm="cancelPostEdit"
      />
    </ModalMain>
  </Teleport>
  <div class="container">
    <div class="blog-post-navigation">
      <ButtonNavigation>
        <RouterLink
          class="blog-post-navigation__link"
          :to="blogPostsPath"
        >
          <ArrowRightAngle class="blog-post-navigation__icon" />
          <span>К списку постов</span></RouterLink
        >
      </ButtonNavigation>
    </div>
    <BlogPost
      class="blog-post"
      :post="blogPost"
      :fullSize="true"
      :class="{ pinned: blogPost.pinned, hidden: blogPost.hidden }"
      @editPost="startPostEdit"
      @deletePost="deletePost"
      @pinTogglePost="pinTogglePost"
      @hideTogglePost="hideTogglePost"
      @likePost="getBlogPost"
      @dislikePost="getBlogPost"
    />
  </div>
</template>

<style scoped lang="scss">
  .blog-post {
    margin-top: 50px;

    &.hidden {
      opacity: 0.5;
      outline: 2px solid gray;
    }

    &-navigation {
      margin-top: 50px;

      &__icon {
        width: 24px;
        height: 24px;
        transform: rotate(180deg);
        margin-right: 4px;
      }
    }
  }
</style>
