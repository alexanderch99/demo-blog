<script setup>
  import BlogPost from "@/components/BlogPost.vue";
  import SpinnerMain from "@/components/UI/SpinnerMain.vue";
  import UserBlog from "@/components/UserBlog.vue";
  import blogService from "@/services/blog-service";
  import postService from "@/services/post-service";
  import handleAxiosError from "@/utils/handle-axios-error";
  import { onBeforeMount, ref } from "vue";

  const latestPosts = ref([]);
  const popularBlogs = ref([]);

  const isPostsLoaded = ref(false);
  const isBlogsLoaded = ref(false);

  async function getLatestPosts() {
    try {
      const response = await postService.getLatestPosts();
      latestPosts.value = response.data;
      isPostsLoaded.value = true;
    } catch (error) {
      handleAxiosError(error);
    }
  }

  async function getPopularBlogs() {
    try {
      const response = await blogService.getPopularBlogs();
      popularBlogs.value = response.data;
      isBlogsLoaded.value = true;
    } catch (error) {
      handleAxiosError(error);
    }
  }

  onBeforeMount(() => {
    getLatestPosts();
    getPopularBlogs();
  });
</script>

<template>
  <section class="latest-posts">
    <h1 class="section-heading"><span>Новые посты</span></h1>
    <div class="container">
      <SpinnerMain
        v-if="!isPostsLoaded"
        class="section-spinner"
        :fake="true"
      />
      <div class="latest-posts__posts-wrapper items-wrapper">
        <TransitionGroup name="list-s">
          <BlogPost
            class="latest-posts__post"
            v-for="post in latestPosts"
            :key="post.id"
            :post="post"
            :home="true"
            @likePost="getLatestPosts"
            @dislikePost="getLatestPosts"
          />
        </TransitionGroup>
      </div>
    </div>
  </section>
  <section class="popular-blogs">
    <h1 class="section-heading"><span>Популярные блоги</span></h1>
    <div class="container">
      <SpinnerMain
        v-if="!isBlogsLoaded"
        class="section-spinner"
        :fake="true"
      />
      <div class="popular-blogs__blogs-wrapper items-wrapper">
        <TransitionGroup name="list-s">
          <UserBlog
            class="popular-blogs__blog"
            v-for="blog in popularBlogs"
            :key="blog.id"
            :blog="blog"
            :home="true"
          />
        </TransitionGroup>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
  .section-spinner {
    position: relative;
    width: 100%;
    height: 400px;
    border-radius: 10px;
    margin: 0 auto;
  }

  .latest-posts {
    &__posts-wrapper {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
  }

  .popular-blogs {
    &__blogs-wrapper {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    &__blog {
      width: 100%;
      height: 700px;
      flex: 0 0 auto;

      @media (max-width: 999.98px) {
        height: 500px;
      }
    }
  }
</style>
