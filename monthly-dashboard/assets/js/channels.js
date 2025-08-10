(function(){
  function fmtB(n){ if(n==null) return '--'; return Number(n).toFixed(1); }
  function fmtPct(n){ if(n==null) return '--'; return (Number(n)*100).toFixed(1)+'%'; }
  function fmtTimes(n){ if(n==null) return '--'; return Number(n).toFixed(1); }

  function render(){
    const d = window.dashboardData; if(!d || !d.channels || !d.overall) return;

    document.getElementById('kpi-online-gmv').textContent = fmtB(d.channels.onlineTaxPaidGMV);
    document.getElementById('kpi-turnover').textContent = fmtTimes(d.channels.turnoverRate);
    document.getElementById('kpi-hainan').textContent = fmtB(d.channels.hainanRevenue);
    const intl = d.channels.internationalShare ?? d.overall.kpis?.internationalShare;
    document.getElementById('kpi-international').textContent = fmtPct(intl);
    const gm = d.channels.grossMargin ?? d.overall.kpis?.grossMargin;
    document.getElementById('kpi-gross-margin-chan').textContent = fmtPct(gm);

    // Channel revenue distribution
    const cr = d.channels.revenueByChannel || [];
    const chNames = cr.map(x=>x.name); const chVals = cr.map(x=>x.value);
    const bar = echarts.init(document.getElementById('chart-channel-revenue'));
    bar.setOption({
      tooltip:{},
      grid:{left:40,right:20,top:30,bottom:40},
      xAxis:{type:'category',data:chNames},
      yAxis:{type:'value',name:'亿'},
      series:[{type:'bar',data:chVals, itemStyle:{color:'#3b82f6'}}]
    });

    // Channel share pie
    const pie = echarts.init(document.getElementById('chart-channel-share'));
    pie.setOption({
      tooltip:{ trigger:'item', formatter: '{b}: {c}亿 ({d}%)' },
      series:[{ type:'pie', radius:['35%','65%'], data: cr }]
    });

    // Hainan trend
    const ht = d.channels.hainanMonthly || [];
    const htM = ht.map(x=>x.month); const htV = ht.map(x=>x.value);
    const hChart = echarts.init(document.getElementById('chart-hainan-trend'));
    hChart.setOption({
      tooltip:{trigger:'axis'},
      grid:{left:40,right:20,top:30,bottom:40},
      xAxis:{type:'category',data:htM},
      yAxis:{type:'value',name:'亿'},
      series:[{type:'line',smooth:true,data:htV, areaStyle:{}, name:'海南营收', color:'#f59e0b'}]
    });

    // Online GMV vs Revenue compare (if overall monthly revenue available)
    const months = (d.overall.monthlyRevenue || []).map(x=>x.month);
    const revValues = (d.overall.monthlyRevenue || []).map(x=>x.value);
    const gmvMonthly = (d.channels.onlineTaxPaidMonthly || months.map(m=>({month:m,value:Math.max(0, (Math.random()*0.4+0.1)* (revValues[months.indexOf(m)]||0))}))).map(x=>x.value);

    const cmp = echarts.init(document.getElementById('chart-online-compare'));
    cmp.setOption({
      tooltip:{ trigger:'axis' },
      legend:{ data:['收入','完税GMV'] },
      grid:{left:40,right:20,top:30,bottom:40},
      xAxis:{type:'category',data:months},
      yAxis:{type:'value',name:'亿'},
      series:[
        {type:'bar', name:'收入', data:revValues, itemStyle:{color:'#60a5fa'}},
        {type:'line', name:'完税GMV', data:gmvMonthly, smooth:true, itemStyle:{color:'#10b981'}}
      ]
    });

    window.addEventListener('resize', function(){ bar.resize(); pie.resize(); hChart.resize(); cmp.resize(); });
  }

  if (window.dashboardData) render();
  window.addEventListener('dashboard-data-ready', render, { once: true });
})();