<script setup>
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
  } from "chart.js";
  import { Line } from "vue-chartjs";

  const { data } = defineProps(["data"]);

  ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
  );

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: "orange", // цвет подписей по оси X
        },
        grid: {
          color: "darkslategray", // цвет линий сетки по X
          borderColor: "darkslategray", // цвет линии оси X
        },
      },
      y: {
        ticks: {
          color: "orange", // цвет подписей по оси Y
          callback: function (value) {
            if (Number.isInteger(value)) {
              return value;
            }
            return null;
          },
        },
        grid: {
          color: "darkslategray", // цвет линий сетки по Y
          borderColor: "green", // цвет линии оси Y
        },
      },
    },
  };
</script>

<template>
  <div class="line-chart-wrapper">
    <div class="line-chart">
      <Line
        :data="data"
        :options="options"
      />
    </div>
  </div>
</template>

<style scoped>
  .line-chart {
    width: 100%;
    min-width: 1000px;
    height: 500px;
  }

  .line-chart-wrapper {
    overflow-x: auto;
    padding-bottom: 20px;
  }

  .line-chart-wrapper:not(:first-child) {
    margin-top: 20px;
  }
</style>
