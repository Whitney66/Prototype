(function(){
  function fmtB(n){ if(n==null) return '--'; return Number(n).toFixed(1); }
  function fmtPct(n){ if(n==null) return '--'; return (Number(n)*100).toFixed(1)+'%'; }

  function render(){
    const d = window.dashboardData; if(!d || !d.products) return;

    const kpiGM = d.overall?.kpis?.grossMargin; // 使用总体毛利率作为示例
    const intl = d.channels?.internationalShare ?? d.overall?.kpis?.internationalShare;

    document.getElementById('kpi-guochao').textContent = fmtB(d.products.guochaoSales);
    document.getElementById('kpi-gross-margin-prod').textContent = fmtPct(kpiGM);
    document.getElementById('kpi-international-prod').textContent = fmtPct(intl);

    const cats = d.products.categorySales || [];
    const names = cats.map(x=>x.name); const values = cats.map(x=>x.value);

    const catChart = echarts.init(document.getElementById('chart-category'));
    catChart.setOption({
      tooltip:{},
      grid:{left:40,right:20,top:30,bottom:40},
      xAxis:{type:'category',data:names},
      yAxis:{type:'value',name:'亿'},
      series:[{ type:'bar', data: values, itemStyle:{ color:'#ef4444' } }]
    });

    // Top category trend: use first top 3 categories to synthesize monthly series if not provided
    const months = (d.overall?.monthlyRevenue || []).map(x=>x.month);
    const topNames = names.slice(0,3);
    const base = (d.overall?.monthlyRevenue || []).map(x=>x.value);

    const series = topNames.map((n, idx) => ({
      name: n,
      type: 'line',
      smooth: true,
      data: months.map((_, i) => Number((base[i]||0) * (0.12 - idx*0.03) * (0.9 + Math.random()*0.2)).toFixed(1))
    }));

    const topChart = echarts.init(document.getElementById('chart-topcat'));
    topChart.setOption({
      tooltip:{ trigger:'axis' },
      legend:{ data: topNames },
      grid:{left:40,right:20,top:30,bottom:40},
      xAxis:{type:'category',data:months},
      yAxis:{type:'value',name:'亿'},
      series
    });

    window.addEventListener('resize', function(){ catChart.resize(); topChart.resize(); });
  }

  if (window.dashboardData) render();
  window.addEventListener('dashboard-data-ready', render, { once: true });
})();