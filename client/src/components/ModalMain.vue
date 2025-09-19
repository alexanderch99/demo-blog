<script setup>
  import { useBodyScrollLock } from "@/composables/use-body-scroll-lock";
  import ButtonMain from "./UI/ButtonMain.vue";

  const emit = defineEmits(["closeModal"]);

  function closeModalHC() {
    emit("closeModal");
  }

  useBodyScrollLock();
</script>

<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal">
        <div class="modal__body">
          <ButtonMain
            class="modal__button modal__reset"
            @click="closeModalHC"
            ><div>&times;</div></ButtonMain
          >
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .modal {
    position: relative;
    z-index: 9999;
    width: 1000px;
    max-height: 800px;
    margin: 0 auto;
    background-color: transparent;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    overflow-y: auto;
    border-radius: 20px;

    @media (max-width: 1099.98px) {
      width: 99%;
      padding-bottom: var(--footer-height);
    }

    @media (max-height: 799.98px) {
      padding-top: 200px;
    }

    &__body {
      margin: 20px;
      padding: 50px;
      background-color: #1f2430;
      border-radius: 20px;

      @media (max-width: 999.98px) {
        padding: 50px 20px;
        margin: 8px;
      }

      @media (max-width: 499.98px) {
        padding: 50px 10px;
      }
    }

    &__input {
      border: 1px solid gray;
      padding: 10px 5px;
      margin-top: 12px;
    }

    &__save {
      margin: 20px auto 0px;
      padding: 10px;
      width: 300px;
      border: 1px solid gray;
    }

    &__reset {
      position: absolute;
      top: 4px;
      right: 4px;
      padding: 0px;
      font-size: 40px;
      line-height: 40px;
      width: 50px;
      height: 50px;

      @media (max-width: 999.98px) {
        width: 40px;
        height: 40px;
        font-size: 32px;
        line-height: 32px;
        top: 8px;
        right: 8px;
      }

      @media (max-height: 799.98px) {
        top: 204px;
      }

      @media (min-height: 799.98px) {
        top: 2px;
        right: 2px;
      }
    }

    &-mask {
      display: table;
      position: fixed;
      z-index: 9999;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
    }

    &-wrapper {
      display: table-cell;
      vertical-align: middle;
      height: 100%;
    }
  }

  @media (max-height: 799.98px) {
    .modal-mask,
    .modal-wrapper,
    .modal {
      height: 100%;
      max-height: 100vh;
    }
  }
</style>
