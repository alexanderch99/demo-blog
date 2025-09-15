<script setup>
  import PostForm from "./PostForm.vue";

  const { post } = defineProps(["post"]);
  const emit = defineEmits(["updatePost", "cancelForm"]);

  function updatePostHC(postNewData) {
    emit("updatePost", postNewData);
  }

  function cancelFormHC() {
    emit("cancelForm");
  }
</script>

<template>
  <div class="post-edit">
    <PostForm
      :postDataForEdit="post"
      @submitForm="updatePostHC"
      @cancelForm="cancelFormHC"
      >Изменить</PostForm
    >
  </div>
</template>

<style scoped></style>
