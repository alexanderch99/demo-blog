<script setup>
  import AvatarMini from "./AvatarMini.vue";

  import formatDateTime from "@/utils/format-date.js";
  import HrMain from "./UI/HrMain.vue";
  import ThumbUpMain from "./svg/ThumbUpMain.vue";
  import ThumbDownMain from "./svg/ThumbDownMain.vue";
  import ArrowRightAngle from "./svg/ArrowRightAngle.vue";
  import PostTag from "./PostTag.vue";
  import ButtonEdit from "./UI/ButtonEdit.vue";
  import ButtonPin from "./UI/ButtonPin.vue";
  import ButtonEyeSlash from "./UI/ButtonEyeSlash.vue";
  import ButtonDel from "./UI/ButtonDel.vue";
  import { onBeforeRouteUpdate, useRoute } from "vue-router";
  import ButtonPinSlash from "./UI/ButtonPinSlash.vue";
  import ButtonEye from "./UI/ButtonEye.vue";
  import { onMounted, ref, watch } from "vue";
  import waitMs from "@/utils/wait-ms";
  import { useAuthStore } from "@/stores/auth-store";
  import postService from "@/services/post-service";
  import handleAxiosError from "@/utils/handle-axios-error";
  import { useGlobalNotificationStore } from "@/stores/global-notification-store";

  const route = useRoute();

  const authStore = useAuthStore();
  const globalNotificationStore = useGlobalNotificationStore();

  const { post, fullSize, home } = defineProps(["post", "fullSize", "home"]);
  const emit = defineEmits([
    "editPost",
    "deletePost",
    "pinTogglePost",
    "hideTogglePost",
    "likePost",
    "dislikePost",
  ]);

  const isMyPost = ref(false);

  async function checkIsMyPost() {
    if (typeof authStore.isAuth == "object") {
      await authStore.isAuth;
    }

    await waitMs;

    if (post?.author?.id == authStore?.userData?.id) {
      isMyPost.value = true;
    } else {
      isMyPost.value = false;
    }
  }

  watch(
    () => post,
    () => {
      if (post?.author?.id == authStore?.userData?.id) {
        isMyPost.value = true;
      } else {
        isMyPost.value = false;
      }
    },
  );

  function editPostHC() {
    emit("editPost", post);
  }

  function deletePostHC() {
    emit("deletePost", post?.id);
  }

  function pinTogglePostHC() {
    emit("pinTogglePost", post);
  }

  function hideTogglePostHC() {
    emit("hideTogglePost", post);
  }

  async function likePost() {
    if (typeof authStore.isAuth == "object") {
      await authStore.isAuth;
    }

    if (!authStore.isAuth || isMyPost.value) {
      return false;
    }

    try {
      const userId = authStore.userData?.id;
      const postId = post.id;

      const response = await postService.likePost(userId, postId);
      emit("likePost");
    } catch (error) {
      handleAxiosError(error, globalNotificationStore.showNotification);
    }
  }

  async function dislikePost() {
    if (typeof authStore.isAuth == "object") {
      await authStore.isAuth;
    }

    if (!authStore.isAuth || isMyPost.value) {
      return false;
    }

    try {
      const userId = authStore.userData?.id;
      const postId = post.id;

      const response = await postService.dislikePost(userId, postId);
      emit("dislikePost");
    } catch (error) {
      handleAxiosError(error, globalNotificationStore.showNotification);
    }
  }

  onMounted(async () => {
    await checkIsMyPost();
  });

  onBeforeRouteUpdate(async () => {
    await checkIsMyPost();
  });
</script>

<template>
  <div class="post-item">
    <div
      v-if="isMyPost && !home"
      class="post-item__edit"
    >
      <ButtonEdit
        class="post-item__button post-item__button--edit"
        @click="editPostHC"
      />
    </div>
    <div
      v-if="isMyPost && !home"
      class="post-item__controls"
    >
      <ButtonPin
        v-if="!post.pinned"
        class="post-item__button post-item__button--pin"
        @click="pinTogglePostHC"
      />
      <ButtonPinSlash
        v-else
        class="post-item__button post-item__button--pin"
        @click="pinTogglePostHC"
      />
      <ButtonEyeSlash
        v-if="!post.hidden"
        class="post-item__button post-item__button--eye-slash"
        @click="hideTogglePostHC"
      />
      <ButtonEye
        v-else
        class="post-item__button post-item__button--eye-slash"
        @click="hideTogglePostHC"
      />
      <ButtonDel
        class="post-item__button post-item__button--del"
        @click="deletePostHC"
      />
    </div>
    <div class="post-item__content">
      <div class="post-item__author">
        <AvatarMini
          class="post-item__author-avatar"
          :avatarUrl="post.author?.avatarUrl"
          :nicknameFirstLetter="post.author?.nickname[0]"
        />
        <div class="post-item__author-nickname">
          <RouterLink :to="`/users/${post.author?.nicknameSlug}`">{{
            post.author?.nickname
          }}</RouterLink>
        </div>
        <div class="post-item__author-created">
          <RouterLink
            v-if="home"
            class="post-item__blog-link"
            :to="`/users/${post.author?.nicknameSlug}/blogs/${post.blog?.blogSlug}`"
          >
            <span>{{ formatDateTime(post.createdAt) }} в блог</span>
            <span>{{ post.blog?.title }}</span></RouterLink
          >
          <span v-else>{{ formatDateTime(post.createdAt) }}</span>
        </div>
      </div>
      <div class="post-item__title">{{ post.title }}</div>
      <div
        class="post-item__body-wrapper"
        :class="{ 'full-size': fullSize }"
      >
        <div class="post-item__body">
          {{
            post.body?.length < 700 || fullSize || home
              ? post.body
              : post.body?.slice(0, 700) + "..."
          }}
        </div>
      </div>
      <HrMain class="hr post-item__hr" />
      <div class="post-item__bottom">
        <div class="post-item__stats">
          <div
            v-if="post?.createdAt != post?.updatedAt"
            class="post-item__stat post-item__edited"
          >
            <span class="count"
              >Изменено {{ formatDateTime(post?.updatedAt) }}</span
            >
          </div>
        </div>
        <div
          v-if="post?.body?.length < 700 || fullSize || home"
          class="post-item__rates"
        >
          <div
            class="post-item__rate post-item__likes"
            @click="likePost"
          >
            <span>
              <ThumbUpMain
                class="post-item__icon"
                :class="{
                  'cant-rate': !authStore.isAuth || isMyPost,
                  'post-item__icon--liked': post.whoLike?.includes(
                    authStore?.userData.id,
                  ),
                }"
              />
            </span>
            <span class="count">{{ post.likesCount }}</span>
          </div>
          <div
            class="post-item__rate post-item__dislikes"
            @click="dislikePost"
          >
            <span>
              <ThumbDownMain
                class="post-item__icon"
                :class="{
                  'cant-rate': !authStore.isAuth || isMyPost,
                  'post-item__icon--disliked': post.whoDislike?.includes(
                    authStore?.userData.id,
                  ),
                }"
              />
            </span>
            <span class="count">{{ post.dislikesCount }}</span>
          </div>
        </div>
        <RouterLink
          v-else-if="!fullSize"
          :to="route.fullPath + '/posts/' + post.postSlug"
          class="post-item__more"
        >
          <span>Читать полностью</span>
          <ArrowRightAngle class="post-item__icon" />
        </RouterLink>
      </div>
      <div
        v-if="post.tags && post.tags?.length"
        class="post-item__tags"
      >
        <template
          v-for="tag in post.tags"
          :key="tag"
        >
          <PostTag
            class="post-item__tag"
            v-if="tag.length"
            >{{ tag }}</PostTag
          >
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .count {
    font-size: 16px;
    line-height: 16px;
    color: gray;

    @media (max-width: 999.98px) {
      font-size: 0.9em;
    }
  }

  .post-item {
    position: relative;
    padding: 16px 16px 12px 16px;
    background-color: #1e1d24;
    border-radius: 10px;

    @media (max-width: 999.98px) {
      padding: 12px 8px 12px 8px;
    }

    &__button {
      &--edit {
        position: absolute;
        top: 16px;
        right: 64px;
      }
    }

    &__controls {
      position: absolute;
      top: 16px;
      right: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    &__more {
      padding: 6px 8px 6px 16px;
      border-radius: 10px;
      font-size: 16px;
      line-height: 16px;
      font-family: monospace;
      color: snow;
      background-color: rgba(0, 0, 0, 0.6);

      > span {
        vertical-align: text-bottom;
        margin-right: 4px;
      }
    }

    &__icon {
      width: 22px;
      height: 22px;
      margin: 0px 2px;
      cursor: pointer;

      &-views {
        cursor: default;
      }

      &--liked {
        & > * {
          fill: orange;
        }
      }

      &--disliked {
        & > * {
          fill: red;
        }
      }
    }

    &__icon.cant-rate {
      cursor: default;

      & > * {
        fill: rgba(128, 128, 128, 0.4);
      }
    }

    &__author {
      width: 85%;
      background-color: rgba(0, 0, 0, 0.6);
      padding: 16px;
      border-radius: 10px;
      cursor: default;
      display: grid;
      grid-template: auto / 50px 280px;
      column-gap: 20px;

      @media (max-width: 999.98px) {
        width: 100%;
        grid-template: auto / 50px 1fr;
      }
    }

    &__author-avatar {
      grid-row: span 2;
    }

    &__author-nickname {
      margin-top: 2px;
      font-size: 18px;
      line-height: 18px;
      word-break: break-all;

      @media (max-width: 999.98px) {
        font-size: 0.8em;
      }
    }

    &__author-created {
      font-size: 14px;
      line-height: 14px;
      margin-top: 8px;
      font-family: monospace;
      color: gray;
      white-space: nowrap;

      @media (max-width: 999.98px) {
        white-space: pre-wrap;
        font-size: 0.6em;
      }

      & .post-item__blog-link > span:last-child {
        margin-left: 8px;
        color: snow;
      }
    }

    &__title {
      margin-top: 32px;
      margin-bottom: 32px;
      font-size: 24px;
      line-height: 24px;
      letter-spacing: 0.8px;
      overflow-wrap: break-word;
      white-space: pre-wrap;
      padding-right: 32px;

      @media (max-width: 999.98px) {
        font-size: 0.9em;
      }
    }

    &__body {
      font-size: 18px;
      line-height: 18px;
      overflow-wrap: break-word;
      white-space: pre-wrap;
      color: rgb(209, 190, 190);

      @media (max-width: 999.98px) {
        font-size: 0.8em;
      }

      &-wrapper {
        max-height: 700px;
        overflow-y: auto;
        padding: 8px 12px 8px 0px;

        &.full-size {
          max-height: 2800px;
        }
      }
    }

    &__tags {
      display: flex;
      gap: 4px;
      font-size: 16px;
      line-height: 16px;
      margin-top: 12px;
    }

    &__content {
      padding: 0px 16px;

      @media (max-width: 999.98px) {
        padding: 0px 4px;
      }
    }

    &__img {
      border-radius: 8px;
      overflow: hidden;

      img {
        width: 100%;
        height: 200px;
        object-fit: cover;
        object-position: center;
      }
    }

    &__bottom,
    &__stats,
    &__rates,
    &__rate,
    &__stat {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }

    &__rate,
    &__stat {
      gap: 4px;
      font-size: 20px;

      @media (max-width: 999.98px) {
        font-size: 0.8em;
      }
    }

    &__edited {
      > .count {
        font-size: 14px;
        line-height: 14px;
        font-family: monospace;
      }
    }
  }
</style>
