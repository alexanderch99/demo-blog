<script setup></script>

<template>
  <footer class="footer">
    <div class="container footer__container">
      <div class="footer__items">
        <div class="footer__copy">2025 DemoSite</div>
        <div class="terms">
          <RouterLink
            class="footer__link no-active-link"
            to="/terms"
            >Пользовательское соглашение</RouterLink
          >
        </div>
        <div class="privacy">
          <RouterLink
            class="footer__link no-active-link"
            to="/privacy"
            >Политика конфиденциальности</RouterLink
          >
        </div>
        <div class="source-code">
          <a
            href="https://github.com/alexanderch99/demo-blog"
            class="footer__link"
            target="_blank"
            >GitHub</a
          >
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
  .footer {
    position: relative;
    z-index: 99999;
    width: 100%;
    height: 80px;
    background-color: transparent;
    background-color: #1e1d24;

    @media (max-width: 999.98px) {
      height: 160px;
    }

    &__link {
      text-decoration: underline snow;
      color: snow;
    }

    &__container {
      height: 100%;
    }

    &__items {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 64px;
      color: rgb(209, 190, 190);
      font-size: 16px;
      line-height: 16px;
      font-family: monospace;

      @media (max-width: 999.98px) {
        height: 160px;
        flex-direction: column;
        gap: 16px;
      }
    }
  }
</style>
