import { useTheme } from '@mui/material/styles';
import { merge } from '@/utils/helpers';
export default function useChartOptions(options = {}) {
  const theme = useTheme();
  const baseOptions = {
    chart: {
      stacked: true,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      },
      background: 'rgba(0, 0, 0, 0)',
      fontFamily: theme.typography.fontFamily
    },
    states: {
      hover: {
        filter: {
          type: 'none'
        }
      },
      active: {
        filter: {
          type: 'none'
        }
      }
    },
    grid: {
      show: false,
      strokeDashArray: 3,
      borderColor: theme.palette.divider
    },
    legend: {
      show: false,
      itemMargin: {
        horizontal: 10
      },
      markers: {
        size: 5,
        offsetX: -3,
        strokeWidth: 0,
        shape: 'circle'
      }
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
        opacity: 1,
        show: false,
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
  };
  return merge({}, baseOptions, options);
}