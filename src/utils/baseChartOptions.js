export const baseChartOptions = theme => ({
  chart: {
    stacked: true,
    toolbar: {
      show: false
    },
    background: 'rgba(0, 0, 0, 0)',
    fontFamily: theme.typography.fontFamily
  },
  states: {
    active: {
      filter: {
        type: 'none'
      }
    },
    hover: {
      filter: {
        type: 'none'
      }
    }
  },
  grid: {
    show: false
  },
  legend: {
    show: false
  },
  dataLabels: {
    enabled: false
  },
  theme: {
    mode: theme.palette.mode
  },
  stroke: {
    width: 3,
    curve: 'smooth'
  },
  yaxis: {
    show: false
  },
  xaxis: {
    labels: {
      show: false
    },
    axisTicks: {
      show: false
    },
    axisBorder: {
      show: false
    },
    crosshairs: {
      show: false,
      opacity: 1,
      fill: {
        color: theme.palette.primary.main
      },
      stroke: {
        color: theme.palette.primary.main
      }
    }
  },
  tooltip: {
    shared: false,
    x: {
      show: false
    },
    marker: {
      show: false
    },
    style: {
      fontSize: '14px',
      fontFamily: theme.typography.fontFamily
    },
    y: {
      title: {
        formatter: () => ''
      },
      formatter: function (val, {
        dataPointIndex,
        w
      }) {
        return `${w.globals.categoryLabels[dataPointIndex]} : ${val}`;
      }
    }
  },
  markers: {
    strokeWidth: 5,
    strokeOpacity: 0.2,
    strokeColors: theme.palette.primary.main
  }
});