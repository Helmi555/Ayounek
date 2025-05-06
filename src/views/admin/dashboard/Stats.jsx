import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import firebase from '../../../services/firebase';

const Stats = () => {
  const [chartData, setChartData] = useState({
    products: [],
    colors: [],
    revenue: { labels: [], series: [{ data: [] }] },
    metrics: {
      totalRevenue: 0,
      totalOrders: 0,
      avgOrderValue: 0,
      conversionRate: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [
          products, 
          colors, 
          revenue,
          totalRevenue,
          totalOrders,
          userCount
        ] = await Promise.all([
          firebase.getMostSoldProducts(),
          firebase.getMostSoldColors(),
          firebase.getMonthlyRevenue(selectedYear),
          firebase.getTotalRevenue(),
          firebase.getTotalOrders(),
          firebase.getUserCount()
        ]);

        setChartData({
          products: products || [],
          colors: colors || [],
          revenue: revenue || { labels: [], series: [{ data: [] }] },
          metrics: {
            totalRevenue: totalRevenue || 0,
            totalOrders: totalOrders || 0,
            avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
            conversionRate: userCount > 0 ? (totalOrders / userCount) * 100 : 0
          }
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedYear]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
      }}>
        <div>Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        color: 'red'
      }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(12, 1fr)',
      gridTemplateRows: 'auto auto auto',
      gap: '16px',
      height: '100vh',
      padding: '16px',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      {/* Year Selector */}
      <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
        <select 
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          style={{
            padding: '8px 12px',
            borderRadius: '4px',
            border: '1px solid #ddd'
          }}
        >
          {[new Date().getFullYear(), new Date().getFullYear() - 1].map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* KPI Cards - Top Row */}
      <div style={{
        gridColumn: '1 / -1',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px'
      }}>
        <KPICard 
          title="Total Revenue" 
          value={`$${chartData.metrics.totalRevenue.toFixed(2)}`} 
          color="#4CAF50" 
        />
        <KPICard 
          title="Total Orders" 
          value={chartData.metrics.totalOrders} 
          color="#2196F3" 
        />
        <KPICard 
          title="Avg. Order" 
          value={`$${chartData.metrics.avgOrderValue.toFixed(2)}`} 
          color="#FFC107" 
        />
        <KPICard 
          title="Conversion Rate" 
          value={`${chartData.metrics.conversionRate.toFixed(2)}%`} 
          color="#9C27B0" 
        />
      </div>

      {/* Revenue Chart - Middle Left */}
      <div style={{
        gridColumn: '1 / 7',
        gridRow: '3',
        height: '100%'
      }}>
        <ChartContainer title={`Monthly Revenue (${selectedYear})`}>
          {chartData.revenue.series[0].data.length > 0 ? (
            <Chart
              options={{
                chart: { type: 'area', height: '100%' },
                xaxis: { categories: chartData.revenue.labels },
                yaxis: { 
                  labels: { formatter: (val) => `$${val.toFixed(2)}` },
                  title: { text: 'Revenue ($)' }
                },
                colors: ['#4CAF50'],
                dataLabels: { enabled: false },
                stroke: { curve: 'smooth' }
              }}
              series={chartData.revenue.series}
              type="area"
              height="100%"
            />
          ) : (
            <EmptyState message="No revenue data available" />
          )}
        </ChartContainer>
      </div>

      {/* Products Chart - Middle Right */}
      <div style={{
        gridColumn: '7 / -1',
        gridRow: '3',
        height: '100%'
      }}>
        <ChartContainer title="Top Selling Products">
          {chartData.products.length > 0 ? (
            <Chart
              options={{
                chart: { type: 'bar', height: '100%' },
                xaxis: { 
                  categories: chartData.products.map(p => p.name),
                  title: { text: 'Products' }
                },
                yaxis: { 
                  title: { text: 'Units Sold' }
                },
                plotOptions: { 
                  bar: { 
                    horizontal: true,
                    borderRadius: 4
                  } 
                },
                dataLabels: {
                  enabled: true,
                  formatter: (val) => `${val} units`,
                  style: {
                    fontSize: '12px',
                    colors: ["#304758"]
                  }
                }
              }}
              series={[{ 
                name: 'Units Sold', 
                data: chartData.products.map(p => p.unitsSold) 
              }]}
              type="bar"
              height="100%"
            />
          ) : (
            <EmptyState message="No product data available" />
          )}
        </ChartContainer>
      </div>

      
      <div style={{
        gridColumn: '1 / -1',
        gridRow: '4',
        height: '100%'
      }}>
        <ChartContainer title="Most Popular Colors">
          {chartData.colors.length > 0 ? (
            <Chart
              options={{
                chart: { type: 'donut' },
                labels: chartData.colors.map(c => c.name),
                colors: chartData.colors.map(c => c.name),
                legend: {
                  position: 'bottom',
                  formatter: function(seriesName) {
                    return seriesName;
                  }
                },
                plotOptions: {
                  pie: {
                    donut: {
                      labels: {
                        show: true,
                        total: {
                          show: true,
                          label: 'Total',
                          formatter: () => chartData.colors.reduce((sum, c) => sum + c.value, 0)
                        }
                      }
                    }
                  }
                }
              }}
              series={chartData.colors.map(c => c.value)}
              type="donut"
              height="100%"
            />
          ) : (
            <EmptyState message="No color data available" />
          )}
        </ChartContainer>
      </div>
    </div>
  );
};


const KPICard = ({ title, value, color }) => (
  <div style={{
    background: 'white',
    padding: '16px',
    borderRadius: '8px',
    borderTop: `4px solid ${color}`,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  }}>
    <h3 style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>{title}</h3>
    <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{value}</p>
  </div>
);

const ChartContainer = ({ title, children }) => (
  <div style={{
    background: 'white',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  }}>
    <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>{title}</h3>
    <div style={{ flex: 1, position: 'relative' }}>
      {children}
    </div>
  </div>
);

const EmptyState = ({ message }) => (
  <div style={{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#999'
  }}>
    {message}
  </div>
);

export default Stats;