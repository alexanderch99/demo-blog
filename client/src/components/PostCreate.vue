<script setup>
  import PostForm from "./PostForm.vue";

  const emit = defineEmits(["createPost", "cancelForm"]);

  function createPostHC(post) {
    emit("createPost", post);
  }

  function cancelFormHC() {
    emit("cancelForm");
  }
</script>

<template>
  <div class="post-create">
    <PostForm
      @submitForm="createPostHC"
      @cancelForm="cancelFormHC"
      >Создать</PostForm
    >
  </div>
</template>

<style scoped></style>
