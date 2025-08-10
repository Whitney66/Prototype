(function(){
  function fmt(n){ if(n==null) return '--'; return Number(n).toFixed(1); }
  function fmtPct(n){ if(n==null) return '--'; return (Number(n)*100).toFixed(1)+'%'; }

  function sum(arr){ return arr.reduce((a,b)=>a+(Number(b)||0),0); }

  function render(){
    const d = window.dashboardData; if(!d || !d.customers) return;

    const active = d.customers.activeMonthly || [];
    const newly = d.customers.newMonthly || [];

    const last = active[active.length-1]?.value;
    const lastNew = newly[newly.length-1]?.value;

    document.getElementById('kpi-active-customers').textContent = fmt(last);
    document.getElementById('kpi-new-customers').textContent = fmt(lastNew);
    document.getElementById('kpi-repeat-rate').textContent = fmtPct(d.customers.repeatRate);

    const intl = d.channels?.internationalShare ?? d.overall?.kpis?.internationalShare;
    document.getElementById('kpi-international-cus').textContent = fmtPct(intl);

    const monthsA = active.map(x=>x.month); const valsA = active.map(x=>x.value);
    const monthsN = newly.map(x=>x.month); const valsN = newly.map(x=>x.value);

    const aChart = echarts.init(document.getElementById('chart-active'));
    aChart.setOption({
      tooltip:{ trigger:'axis' },
      grid:{left:40,right:20,top:30,bottom:40},
      xAxis:{type:'category',data:monthsA},
      yAxis:{type:'value',name:'万'},
      series:[{type:'line',smooth:true,data:valsA, areaStyle:{}, name:'月活客户', color:'#6366f1'}]
    });

    const nChart = echarts.init(document.getElementById('chart-new'));
    nChart.setOption({
      tooltip:{ trigger:'axis' },
      grid:{left:40,right:20,top:30,bottom:40},
      xAxis:{type:'category',data:monthsN},
      yAxis:{type:'value',name:'万'},
      series:[{type:'bar',data:valsN, name:'新增客户', itemStyle:{color:'#22c55e'}}]
    });

    window.addEventListener('resize', function(){ aChart.resize(); nChart.resize(); });
  }

  if (window.dashboardData) render();
  window.addEventListener('dashboard-data-ready', render, { once: true });
})();