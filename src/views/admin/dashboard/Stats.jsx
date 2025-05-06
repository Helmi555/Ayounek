import React from 'react'
import Chart from 'react-apexcharts';
function Stats() {
  const styles = {
    container: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '20px',
      padding: '20px',
      width: '100%',
      boxSizing: 'border-box',
      overflow: 'hidden'
    },
    chartWrapper: {
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      padding: '10px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }
  };
  const mostSoldItems = {
    options: {
      chart: {
        id: 'most-sold-products',
        toolbar: {
          show: true
        }
      },
      xaxis: {
        categories: ['Classic Round', 'Aviator Pro', 'Wayfarer Black', 'Rimless Silver', 'Cat-Eye Gold'],
      },
      yaxis: {
        title: {
          text: 'Units Sold'
        }
      },
      title: {
        text: 'Top Selling Products',
        align: 'center'
      }
    },
    series: [
      {
        name: 'Units Sold',
        data: [150, 120, 90, 80, 70]
      }
    ]
  };

  const mostSoldColour = {
    series: [200, 150, 120, 100, 80],
    options: {
      chart: {
        width: 380,
        type: 'pie',
      },
      labels: ['Black', 'Silver', 'Gold', 'Brown', 'Blue'],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }],
      title: {
        text: 'Most Popular Frame Colors',
        align: 'center'
      }
    }
  };
  const series = [
    {
      name: 'Male',
      data: [80, 70, 65, 50, 40]
    },
    {
      name: 'Female',
      data: [60, 75, 70, 80, 90]
    }
  ];

  const options = {
    chart: {
      type: 'radar',
    },
    title: {
      text: 'Customer Engagement by Age Group',
      align: 'center'
    },
    xaxis: {
      categories: ['18-24', '25-34', '35-44', '45-54', '55+']
    },
    yaxis: {
      show: false // Hide y-axis since radar doesn't need it
    },
    legend: {
      position: 'bottom'
    },
    plotOptions: {
      radar: {
        size: 140,
        polygons: {
          strokeColors: '#eaeaea',
          fill: {
            colors: ['#f8f8f8', '#ffffff']
          }
        }
      }
    },
    dataLabels: {
      enabled: true
    }
  };
  return (
    <div style={styles.container}>
    <div style={styles.chartWrapper}>
      <Chart options={mostSoldItems.options} series={mostSoldItems.series} type="bar" height={300} />
    </div>
  
    <div style={styles.chartWrapper}>
      <Chart options={mostSoldColour.options} series={mostSoldColour.series} type="pie" height={300} />
    </div>
  
    <div style={styles.chartWrapper}>
      <Chart options={options} series={series} type="radar" height={300} />
    </div>
  </div>
  
    
  )
}

export default Stats
