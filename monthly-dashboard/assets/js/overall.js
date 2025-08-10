(function(){
  function formatBillion(n) { if (n === null || n === undefined) return '--'; return (Number(n).toFixed(1)); }
  function formatPct(n) { if (n === null || n === undefined) return '--'; return (Number(n) * 100).toFixed(1) + '%'; }

  function render() {
    const data = window.dashboardData;
    if (!data || !data.overall) return;
    const k = data.overall.kpis || {};

    document.getElementById('kpi-revenue').textContent = formatBillion(k.revenue);
    document.getElementById('kpi-net-profit').textContent = formatBillion(k.netProfit);
    document.getElementById('kpi-parent-net-profit').textContent = formatBillion(k.parentNetProfit);
    document.getElementById('kpi-roe').textContent = formatPct(k.roe);

    document.getElementById('kpi-gross-margin').textContent = formatPct(k.grossMargin);
    document.getElementById('kpi-ytd-revenue').textContent = formatBillion(k.ytdRevenue);
    document.getElementById('kpi-ytd-last-year').textContent = formatBillion(k.ytdRevenueLastYear);
    document.getElementById('kpi-yoy-revenue').textContent = formatPct(k.yoyRevenue);
    document.getElementById('kpi-budget-revenue').textContent = formatBillion(k.budgetRevenue);
    document.getElementById('kpi-budget-completion').textContent = formatPct(k.budgetCompletionRevenue);

    // Revenue trend
    const revMonths = (data.overall.monthlyRevenue || []).map(x => x.month);
    const revValues = (data.overall.monthlyRevenue || []).map(x => x.value);
    const revChart = echarts.init(document.getElementById('chart-revenue'));
    revChart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: 40, right: 20, top: 30, bottom: 40 },
      xAxis: { type: 'category', data: revMonths },
      yAxis: { type: 'value', name: '亿' },
      series: [{ type: 'line', data: revValues, smooth: true, areaStyle: {}, name: '收入' }]
    });

    // Net profit trend
    const npMonths = (data.overall.monthlyNetProfit || []).map(x => x.month);
    const npValues = (data.overall.monthlyNetProfit || []).map(x => x.value);
    const npChart = echarts.init(document.getElementById('chart-net-profit'));
    npChart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: 40, right: 20, top: 30, bottom: 40 },
      xAxis: { type: 'category', data: npMonths },
      yAxis: { type: 'value', name: '亿' },
      series: [{ type: 'line', data: npValues, smooth: true, areaStyle: {}, name: '净利润', color: '#10b981' }]
    });

    window.addEventListener('resize', function(){ revChart.resize(); npChart.resize(); });
  }

  if (window.dashboardData) render();
  window.addEventListener('dashboard-data-ready', render, { once: true });
})();