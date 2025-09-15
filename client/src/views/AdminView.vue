<script setup>
  import { onMounted, ref } from "vue";
  import AdminNav from "@/components/AdminNav.vue";
  import LineChart from "@/components/LineChart.vue";
  import handleAxiosError from "@/utils/handle-axios-error";
  import adminService from "@/services/admin-service";
  import { formatDateTimeSimple } from "@/utils/format-date";
  import { useRoute } from "vue-router";

  const route = useRoute();

  const postsData = ref({
    labels: [],
    datasets: [
      {
        data: [],
        label: "",
        borderColor: "rgb(209, 190, 190)",
        pointRadius: 6,
        pointHoverRadius: 10,
      },
    ],
  });
  const usersData = ref({
    labels: [],
    datasets: [
      {
        data: [],
        label: "",
        borderColor: "rgb(209, 190, 190)",
        pointRadius: 6,
        pointHoverRadius: 10,
      },
    ],
  });
  const isDataReady = ref(false);

  async function getStats() {
    try {
      const response = await adminService.getStats();

      postsData.value.labels = response.data.map(el =>
        formatDateTimeSimple(el.date),
      );
      postsData.value.datasets[0].data = response.data.map(el => el.postsCount);
      postsData.value.datasets[0].label = "Статистика постов";

      usersData.value.labels = response.data.map(el =>
        formatDateTimeSimple(el.date),
      );
      usersData.value.datasets[0].data = response.data.map(el => el.usersCount);
      usersData.value.datasets[0].label = "Статистика пользователей";

      isDataReady.value = true;
    } catch (error) {
      handleAxiosError(error);
    }
  }

  onMounted(() => {
    getStats();
  });
</script>

<template>
  <AdminNav />
  <div class="admin-main">
    <RouterView />
    <div
      v-if="route.fullPath.endsWith('/admin')"
      class="admin-main__line-charts"
    >
      <LineChart
        v-if="isDataReady"
        :data="postsData"
      />
      <LineChart
        v-if="isDataReady"
        :data="usersData"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
  .admin-main {
    margin-left: 300px;
    padding: 20px;

    &__line-charts {
      position: relative;
    }
  }
</style>
