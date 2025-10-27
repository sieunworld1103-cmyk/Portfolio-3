//그래프

  const ctx = document.getElementById('suicideChart').getContext('2d');
  const chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['2021년', '2022년', '2023년', '2024년'],
    datasets: [
      {
        label: '자살자 수',
        data: [13352, 12906, 13978, 14439],
        // backgroundColor: 'rgba(54, 162, 235, 0.6)',
        backgroundColor: '#377eb8',
        yAxisID: 'y',
        barPercentage: 0.3,
      },
      {
        label: '자살률 (10만명당)',
        data: [26.0, 25.2, 27.3, 28.3],
        type: 'line',
        border: 1,
        borderColor: 'rgba(250, 231, 235, 1)',
        // backgroundColor: 'rgba(209, 58, 91, 0.3)',
        backgroundColor: '#ec1932ff',
        yAxisID: 'y1',

        pointRadius: (function () {
          const w = window.innerWidth;
          if (w > 960) return 6;
          if (w > 600) return 4;
          if (w > 400) return 2;
          return 2;
        })(),
        pointHoverRadius: (function () {
          const w = window.innerWidth;
          if (w > 960) return 8;
          if (w > 600) return 6;
          if (w > 400) return 4;
          return 3;
        })(),
        pointStyle: 'circle'
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    stacked: false,

    scales: {
      x: {
        ticks: {
          font: {
            size: function (context) {
              const w = window.innerWidth;
              if (w > 960) return 15;
              if (w > 600) return 13;
              if (w > 400) return 10;
              return 10;
            },
            family: '고운바탕, GounBatangBold',
            weight: 'bold'
          }
        }
      },
      y: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: '자살자 수',
          font: {
            size: (ctx) => {
              const w = window.innerWidth;
              if (w > 960) return 15;
              if (w > 600) return 13;
              if (w > 400) return 10;
              return 10;
            },
            family: '고운바탕, GounBatangBold',
            weight: 'bold'
          }
        },
        ticks: {
          font: {
            size: (ctx) => {
              const w = window.innerWidth;
              if (w > 960) return 15;
              if (w > 600) return 13;
              if (w > 400) return 10;
              return 10;
            },
            family: '고운바탕, GounBatangBold'
          }
        }
      },
      y1: {
        type: 'linear',
        position: 'right',
        title: {
          display: true, text: '자살률 (명/10만명)',
          font: {
            size: function (context) {
              const w = window.innerWidth;
              if (w > 960) return 15;
              if (w > 600) return 13;
              if (w > 400) return 10;
              return 10;
            },
            family: '고운바탕, GounBatangBold',
            weight: 'bold'
          }
        },
        ticks: {
          font: {
            size: (ctx) => {
              const w = window.innerWidth;
              if (w > 960) return 15;
              if (w > 600) return 13;
              if (w > 400) return 10;
              return 10;
            },
            family: '고운바탕, GounBatangBold'
          }
        },
        grid: { drawOnChartArea: false }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            if (context.dataset.label === '자살자 수') {
              return `자살자 수: ${context.formattedValue} 명`;
            }
            if (context.dataset.label === '자살률 (10만명당)') {
              return `자살률: ${context.formattedValue} 명/10만명`;
            }
          },
          title: function (context) {
            return `연도: ${context[0].label}`;
          }
        },
        titleFont: {
          size: function (context) {
            const w = window.innerWidth;
            if (w > 960) return 14;
            if (w > 600) return 12;
            if (w > 400) return 10;
            return 8;
          },
          family: '고운바탕, GounBatangBold',
        },
        bodyFont: {
          size: function (context) {
            const w = window.innerWidth;
            if (w > 960) return 13;
            if (w > 600) return 11;
            if (w > 400) return 9;
            return 7;
                                  },
          family: '고운바탕, GounBatang',
              },
      },
      legend: {
      labels: {
        font: {
          size: (ctx) => {
            const w = window.innerWidth;
            if (w > 960) return 14;   
            if (w > 600) return 12;   
            return 10;                
          },
          family: '고운바탕, GounBatangBold',
          weight: 'bold'
              },
              },
      position: 'top',        
      align: 'center'         
              }
  }
}
});
window.addEventListener("resize", () => {
  const w = window.innerWidth;
  if (w > 960) {
    chart.data.datasets[1].pointRadius = 6;
    chart.data.datasets[1].pointHoverRadius = 8;
  } else if (w > 600) {
    chart.data.datasets[1].pointRadius = 4;
    chart.data.datasets[1].pointHoverRadius = 6;
  }
});
window.addEventListener("resize", () => {
  const w = window.innerWidth;
  if (w > 960) {
    chart.data.datasets[1].pointRadius = 6;
    chart.data.datasets[1].pointHoverRadius = 8;
  } else if (w > 600) {
    chart.data.datasets[1].pointRadius = 4;
    chart.data.datasets[1].pointHoverRadius = 6;
  } else if (w > 400) {
    chart.data.datasets[1].pointRadius = 2;
    chart.data.datasets[1].pointHoverRadius = 4;
  } else {
    chart.data.datasets[1].pointRadius = 2;
    chart.data.datasets[1].pointHoverRadius = 3;
  }
  chart.update();
});



// 아코디언
const headers = document.querySelectorAll(".accordion_header");

headers.forEach(btn => {
  btn.addEventListener("click", () => {
    headers.forEach(otherBtn => {
      if (otherBtn !== btn) {
        otherBtn.classList.remove("active");
        otherBtn.nextElementSibling.style.maxHeight = null;
      }
  });
    btn.classList.toggle("active");
    const content = btn.nextElementSibling;
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
});