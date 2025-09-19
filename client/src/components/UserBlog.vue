<script setup>
  import { onMounted, ref, watch } from "vue";
  import EyeMain from "@/components/svg/EyeMain.vue";
  import HeartMain from "@/components/svg/HeartMain.vue";
  import PaperScroll from "@/components/svg/PaperScroll.vue";
  import AvatarMini from "@/components/AvatarMini.vue";
  import ArrowRightAngle from "./svg/ArrowRightAngle.vue";
  import { useAuthStore } from "@/stores/auth-store";
  import EditImgForm from "./EditImgForm.vue";
  import SpinnerMain from "./UI/SpinnerMain.vue";
  import ButtonEdit from "./UI/ButtonEdit.vue";
  import blogService from "@/services/blog-service";
  import handleAxiosError from "@/utils/handle-axios-error";
  import ButtonDel from "./UI/ButtonDel.vue";
  import ButtonEyeSlash from "./UI/ButtonEyeSlash.vue";
  import ButtonPin from "./UI/ButtonPin.vue";
  import { onBeforeRouteUpdate, useRoute } from "vue-router";
  import ButtonPinSlash from "./UI/ButtonPinSlash.vue";
  import ButtonEye from "./UI/ButtonEye.vue";
  import waitMs from "@/utils/wait-ms";
  import { useGlobalNotificationStore } from "@/stores/global-notification-store";

  const authStore = useAuthStore();
  const globalNotificationStore = useGlobalNotificationStore();

  const route = useRoute();

  const isMyBlog = ref(false);
  const isBlogCoverSelected = ref(false);
  const isBlogCoverLoading = ref(false);

  const { blog, inside, home } = defineProps(["blog", "inside", "home"]);
  const emit = defineEmits([
    "openModal",
    "updateBlogCover",
    "updateBlogs",
    "updateBlogPin",
    "updateBlogEye",
  ]);

  const previewBlogCoverSrc = ref("");

  let formData = null;

  async function blogCoverUpload() {
    try {
      isBlogCoverLoading.value = true;
      await blogService.updateBlogCover(formData);
      cancelBlogCoverUpload();
      emit("updateBlogCover");
      globalNotificationStore.showNotification("Обложка блога изменена");
    } catch (error) {
      handleAxiosError(error, globalNotificationStore.showNotification);
    } finally {
      setTimeout(() => {
        isBlogCoverLoading.value = false;
      }, 1000);
    }
  }

  function cancelBlogCoverUpload() {
    formData = null;
    isBlogCoverSelected.value = false;
    URL.revokeObjectURL(previewBlogCoverSrc.value);
    previewBlogCoverSrc.value = "";
  }

  async function startBlogCoverUpload(et) {
    if (typeof authStore.isAuth == "object") {
      await authStore.isAuth;
    }

    isBlogCoverSelected.value = true;

    formData = new FormData();
    const blogCover = et.files[0];

    formData.append("blog-cover", blogCover);
    formData.append("id", authStore.userData.id);
    formData.append("blogId", blog.id);

    previewBlogCoverSrc.value = URL.createObjectURL(blogCover);
  }

  async function delBlogCover() {
    if (typeof authStore.isAuth == "object") {
      await authStore.isAuth;
    }

    formData = new FormData();
    const blogCover = null;

    formData.append("blog-cover", blogCover);
    formData.append("type", "delete");
    formData.append("id", authStore.userData.id);
    formData.append("blogId", blog.id);

    try {
      await blogService.updateBlogCover(formData);
      cancelBlogCoverUpload();
      emit("updateBlogCover");
      globalNotificationStore.showNotification("Обложка блога удалена");
    } catch (error) {
      handleAxiosError(error, globalNotificationStore.showNotification);
    }
  }

  function openModalHC() {
    emit("openModal", blog);
  }

  async function deleteBlog() {
    if (typeof authStore.isAuth == "object") {
      await authStore.isAuth;
    }

    try {
      const response = await blogService.deleteBlog(blog.id);
      emit("updateBlogs");
      globalNotificationStore.showNotification("Блог удален");
    } catch (error) {
      handleAxiosError(error, globalNotificationStore.showNotification);
    }
  }

  async function pinToggleBlog() {
    if (typeof authStore.isAuth == "object") {
      await authStore.isAuth;
    }

    try {
      const response = await blogService.pinToggleBlog(
        authStore.userData.id,
        blog.id,
      );
      emit("updateBlogPin");
      globalNotificationStore.showNotification(
        response?.data?.message || "Успешно",
      );
    } catch (error) {
      handleAxiosError(error, globalNotificationStore.showNotification);
    }
  }

  async function hideToggleBlog() {
    if (typeof authStore.isAuth == "object") {
      await authStore.isAuth;
    }

    try {
      const response = await blogService.hideToggleBlog(
        authStore.userData.id,
        blog.id,
      );
      emit("updateBlogEye");
      globalNotificationStore.showNotification(
        response?.data?.message || "Успешно",
      );
    } catch (error) {
      handleAxiosError(error, globalNotificationStore.showNotification);
    }
  }

  defineExpose({
    isBlogCoverSelected,
  });

  async function checkIsMyBlog() {
    if (typeof authStore.isAuth == "object") {
      await authStore.isAuth;
    }

    await waitMs;

    if (blog?.author?.id == authStore?.userData?.id) {
      isMyBlog.value = true;
    } else {
      isMyBlog.value = false;
    }
  }

  watch(
    () => blog,
    () => {
      if (blog?.author?.id == authStore?.userData?.id) {
        isMyBlog.value = true;
      } else {
        isMyBlog.value = false;
      }
    },
  );

  onMounted(async () => {
    await checkIsMyBlog();
  });

  onBeforeRouteUpdate(async () => {
    await checkIsMyBlog();
  });
</script>

<template>
  <div class="user-blog">
    <div class="user-blog__cover">
      <img
        v-if="blog.coverUrl && blog.coverUrl != 'none' && !previewBlogCoverSrc"
        :src="blog.coverUrl"
        alt="cover"
        class="user-blog__cover-img"
      />
      <img
        v-if="isBlogCoverSelected"
        :src="previewBlogCoverSrc"
        alt="preview"
        class="user-blog__cover-preview"
      />
      <div
        v-if="
          !blog.coverUrl ||
          (blog.coverUrl == 'none' &&
            !isBlogCoverSelected &&
            !isBlogCoverLoading)
        "
        class="user-blog__no-cover"
      ></div>
      <Transition name="fade">
        <SpinnerMain
          v-if="isBlogCoverLoading"
          size="120px"
          class="user-blog__cover-loading"
          :style="inside ? { top: 0, right: 0, bottom: 0, left: 0 } : {}"
      /></Transition>
      <div
        v-if="isMyBlog && !home"
        class="user-blog__blog-edit"
      >
        <ButtonPin
          v-if="!blog.pinned"
          class="user-blog__button user-blog__button--pin"
          @click="pinToggleBlog"
        />
        <ButtonPinSlash
          v-else
          class="user-blog__button user-blog__button--pin"
          @click="pinToggleBlog"
        />
        <ButtonEyeSlash
          v-if="!blog.hidden"
          class="user-blog__button user-blog__button--eye-slash"
          @click="hideToggleBlog"
        />
        <ButtonEye
          v-else
          class="user-blog__button user-blog__button--eye-slash"
          @click="hideToggleBlog"
        />
        <ButtonDel
          class="user-blog__button user-blog__button--del"
          @click="deleteBlog"
        />
      </div>
      <div
        v-if="isMyBlog && !home"
        class="user-blog__cover-edit"
      >
        <EditImgForm
          class="user-blog__cover-edit-form"
          :isMyObject="isMyBlog"
          :imgUrl="blog.coverUrl"
          :isImgSelected="isBlogCoverSelected"
          :isImgLoading="isBlogCoverLoading"
          forImg="blog-cover"
          @startImgUpload="startBlogCoverUpload"
          @delImg="delBlogCover"
          @imgUpload="blogCoverUpload"
          @cancelImgUpload="cancelBlogCoverUpload"
        />
        <div class="user-blog__cover-edit-info">
          <span v-if="!isBlogCoverSelected"
            >Не&nbsp;более&nbsp;5&nbsp;мегабайт</span
          >
          <span v-else-if="!isBlogCoverLoading">предпросмотр</span>
        </div>
      </div>
    </div>
    <div class="user-blog__info">
      <ButtonEdit
        v-if="isMyBlog && !home"
        class="user-blog__title-edit"
        @click="openModalHC"
      />
      <div class="user-blog__author-avatar">
        <AvatarMini
          class="user-blog__author-avatar-img"
          :avatarUrl="blog?.author?.avatarUrl"
          :nicknameFirstLetter="blog?.author?.nickname?.at(0)"
        />
      </div>
      <p class="user-blog__title">{{ blog.title }}</p>
      <p class="user-blog__author-nickname">
        <RouterLink
          class="no-active-link"
          :to="`/users/${blog.author?.nicknameSlug}`"
        >
          Блог {{ blog.author?.nickname }}</RouterLink
        >
      </p>
    </div>
    <div
      v-if="!inside"
      class="user-blog__go"
    >
      <RouterLink
        class="user-blog__go-link"
        :to="`/users/${blog?.author?.nicknameSlug}/blogs/${blog?.blogSlug}`"
      >
        <span class="user-blog__go-text">Перейти</span>
        <ArrowRightAngle class="user-blog__icon user-blog__icon-go"
      /></RouterLink>
    </div>
    <div class="user-blog__stats">
      <div class="user-blog__posts">
        <PaperScroll class="user-blog__icon" />
        <span class="user-blog__count">{{ blog.postsCount }}</span>
      </div>
      <div class="user-blog__views">
        <EyeMain class="user-blog__icon" />
        <span class="user-blog__count">{{ blog.viewsCount }}</span>
      </div>
      <div class="user-blog__likes">
        <HeartMain class="user-blog__icon" />
        <span class="user-blog__count">{{ blog.ratingCount }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .user-blog {
    position: relative;
    width: calc(50% - 8px);
    flex: 0 0 calc(50% - 8px);
    height: 320px;
    background-color: transparent;
    border-radius: 16px;
    border: 3px solid #1e1d24;

    @media (max-width: 1299.98px) {
      width: 100%;
      flex: 0 0 100%;
      height: 500px;
    }

    &__title {
      padding-right: 32px;
      overflow-wrap: break-word;
      white-space: pre-wrap;
    }

    &__title-edit {
      position: absolute;
      top: 6px;
      right: 6px;
      z-index: 99;
    }

    &__no-cover {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: #1e1d24;
      border-radius: inherit;
    }

    &__blog {
      &-edit {
        position: absolute;
        top: 12px;
        right: 8px;
        display: flex;
        gap: 8px;
      }
    }

    &__cover {
      position: relative;
      width: 100%;
      height: 100%;
      background-color: transparent;
      border-radius: inherit;

      &-edit {
        z-index: 199;
        position: absolute;
        top: 100px;
        right: 8px;
        width: 136px;

        &-info {
          font-size: 13px;
          line-height: 13px;
          font-family: monospace;
          margin-top: 12px;
          margin-left: -18px;

          & > span {
            padding: 4px 8px;
            background-color: rgba(0, 0, 0, 0.6);
            border-radius: 8px;
            color: snow;
          }
        }
      }

      &-img,
      &-preview {
        width: 100%;
        height: 100%;
        border-radius: inherit;
        object-fit: cover;
        z-index: 55;
      }

      &-preview {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 198;
      }
    }

    &__info {
      z-index: 99;
      position: absolute;
      top: 30px;
      left: 30px;
      background-color: rgba(0, 0, 0, 0.6);
      padding: 20px;
      border-radius: 10px;
      cursor: default;
      display: grid;
      grid-template: auto / 50px 280px;
      column-gap: 20px;
    }

    &__author-avatar {
      grid-row: span 2;
    }

    &__author-nickname {
      margin-top: 8px;
      font-size: 14px;
      line-height: 14px;
      word-break: break-all;
    }

    &__go {
      z-index: 99;
      font-size: 18px;
      line-height: 18px;
      font-family: monospace;
      position: absolute;
      bottom: 60px;
      right: 16px;
      background-color: rgba(0, 0, 0, 0.6);

      border-radius: 10px;
      cursor: pointer;
      color: snow;
      text-shadow: 2px 2px 2px black;

      &-link {
        padding: 4px 8px 4px 16px;
      }

      &-text {
        position: relative;
        top: 1px;
      }
    }

    &__stats {
      z-index: 99;
      display: flex;
      justify-content: flex-end;
      gap: 24px;
      position: absolute;
      bottom: 16px;
      right: 16px;
      background-color: rgba(0, 0, 0, 0.6);
      padding: 8px 12px;
      border-radius: 8px;
    }

    &__icon {
      width: 20px;
      height: 20px;

      & > * {
        fill: snow !important;
      }

      &-go {
        width: 20px;
        height: 20px;
        margin-left: 4px;
      }
    }

    &__count {
      margin-left: 8px;
      font-size: 16px;
      line-height: 16px;
      color: gray;
      vertical-align: middle;
    }
  }
</style>
