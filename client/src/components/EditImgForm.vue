<script setup>
  import ButtonSave from "./UI/ButtonSave.vue";
  import ButtonCancel from "./UI/ButtonCancel.vue";
  import ButtonImageUp from "./UI/ButtonImageUp.vue";
  import ButtonImageDel from "./UI/ButtonImageDel.vue";

  const { isMyObject, imgUrl, isImgSelected, isImgLoading, forImg } =
    defineProps([
      "isMyObject",
      "imgUrl",
      "isImgSelected",
      "isImgLoading",
      "imgUpload",
      "forImg",
    ]);

  const emit = defineEmits([
    "startImgUpload",
    "delImg",
    "imgUpload",
    "cancelImgUpload",
  ]);

  function startImgUploadHC(et) {
    emit("startImgUpload", et);
  }

  function delImgHC() {
    emit("delImg");
  }

  function imgUploadHC() {
    emit("imgUpload");
  }

  function cancelImgUploadHC() {
    emit("cancelImgUpload");
  }
</script>

<template>
  <form
    v-if="isMyObject"
    class="edit-img-form"
    enctype="multipart/form-data"
    @submit.prevent
  >
    <label
      :for="forImg"
      class="edit-img-form__label"
    >
      <ButtonImageUp
        v-if="!isImgLoading"
        class="edit-img-form__button-image-up" />
      <input
        type="file"
        accept="image/*"
        :name="forImg"
        class="edit-img-form__file-input"
        @change="startImgUploadHC($event.target)"
    /></label>
    <div
      v-if="imgUrl && imgUrl != 'none' && !isImgSelected && !isImgLoading"
      class="edit-img-form__del-wrapper"
    >
      <ButtonImageDel
        class="edit-img-form__button-image-del"
        @click="delImgHC"
      />
    </div>
    <div
      v-if="isImgSelected"
      class="edit-img-form__controls"
    >
      <ButtonSave
        v-if="!isImgLoading"
        class="edit-img-form__button-save"
        @click="imgUploadHC"
      />
      <ButtonCancel
        v-if="!isImgLoading"
        class="edit-img-form__button-cancel"
        @click="cancelImgUploadHC"
      />
    </div>
  </form>
</template>

<style scoped lang="scss">
  .edit-img-form {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    &__controls {
      display: flex;
      gap: 8px;
    }

    &__label {
      position: relative;
      cursor: pointer;
    }

    &__file-input {
      opacity: 0.0001;
      position: absolute;
      top: 0;
      left: 0;
      cursor: pointer;
      width: 40px;
      height: 40px;
    }
  }
</style>
