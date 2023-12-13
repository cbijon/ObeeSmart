async function tryChart() {
  await getChartData();
  // Create the chart
  const lineChart = new Chart(
    document.getElementById("lineChart").getContext("2d"),
    {
      type: "line",
      data: {
        datasets: [
          {
            label: "Frelons",
            backgroundColor: "blue",
            borderColor: "rgb(255, 99, 132)",
            data: lineBarData,
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: "Frelons tués les dernieres 48H",
            font: {
              size: 16,
            },
          },
          legend: {
            display: false,
          },
        },
        backgroundColor: "rgba(16,44,139, 0.3)",
        mantainAspectRatio: false,
        responsive: false,
      },
    }
  );
}
tryChart();

// Fetch Data from API

async function getChartData() {
  const API_URL = "http://127.0.0.1:3000/charts";
  const response = await fetch(API_URL);
  const result = await response.json();
  scatterData = result.scatterData;
  lineBarData = result.lineBarData;
}
