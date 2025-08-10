(function(){
  const D = window.DashboardData;
  const State = { page: 'overview', month: new Date().getMonth()+1, charts: {} };

  // Utilities
  function sum(arr){ return arr.reduce((a,b)=>a+b,0); }
  function formatNumber(v, unit=""){ return (v>=10000? (v/10000).toFixed(2)+'万' : v.toLocaleString('zh-CN', {maximumFractionDigits:2})) + unit; }
  function pct(v){ return `${(+v).toFixed(2)}%`; }
  function yoy(curr, prev){ if(prev===0) return null; return ((curr-prev)/prev)*100; }
  function clampMonth(m){ return Math.min(12, Math.max(1, m|0)); }

  // Init controls
  const monthSelect = document.getElementById('monthSelect');
  monthSelect.value = String(State.month);
  document.getElementById('dataTime').textContent = `${D.meta.year}年${State.month}月`;

  // Tabs
  document.querySelectorAll('.tab').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const page = btn.dataset.page;
      switchPage(page);
    });
  });

  monthSelect.addEventListener('change', ()=>{
    State.month = clampMonth(+monthSelect.value);
    document.getElementById('dataTime').textContent = `${D.meta.year}年${State.month}月`;
    renderAll();
  });

  function switchPage(page){
    State.page = page;
    document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
    document.getElementById(`page-${page}`).classList.add('active');
    renderAll();
  }

  // KPI builders
  function kpi(id, label, value, sub){
    return `<div class="kpi"><div class="label">${label}</div><div class="value">${value}</div>${sub||''}</div>`;
  }
  function badge(content, trend){
    const cls = trend==null? 'badge' : (trend>=0? 'badge positive' : 'badge negative');
    return `<span class="${cls}">${content}</span>`;
  }

  // Data calculators
  function calcOverview(){
    const m = State.month - 1;
    const currRevenue = D.revenue2024[m];
    const currNetProfit = D.netProfit2024[m];
    const currParentNetProfit = D.parentNetProfit2024[m];
    const currROE = D.roe2024[m];

    const ytdRevenue = sum(D.revenue2024.slice(0, State.month));
    const ytdNetProfit = sum(D.netProfit2024.slice(0, State.month));

    const lastRevenue = D.revenue2023[m];
    const lastNetProfit = D.netProfit2023[m];

    const yoyRevenue = yoy(currRevenue, lastRevenue);
    const yoyNetProfit = yoy(currNetProfit, lastNetProfit);

    const ytdBudgetRevenue = sum(D.revenueBudget2024.slice(0, State.month));
    const ytdBudgetProfit = sum(D.netProfitBudget2024.slice(0, State.month));
    const revenueCompletion = ytdBudgetRevenue? (ytdRevenue / ytdBudgetRevenue * 100) : null;
    const profitCompletion = ytdBudgetProfit? (ytdNetProfit / ytdBudgetProfit * 100) : null;

    return {
      currRevenue, currNetProfit, currParentNetProfit, currROE,
      ytdRevenue, ytdNetProfit,
      yoyRevenue, yoyNetProfit,
      revenueCompletion, profitCompletion
    };
  }

  function renderOverviewKpis(){
    const t = calcOverview();
    const el = document.getElementById('kpi-overview');
    const items = [];
    items.push(kpi('kr1', '营业收入（亿）', formatNumber(t.currRevenue), `<div class="meta">${badge(`本年累计 ${formatNumber(+t.ytdRevenue.toFixed(2))}`)}${badge(`同比 ${t.yoyRevenue==null?'-':pct(t.yoyRevenue)}`, t.yoyRevenue)}</div>`));
    items.push(kpi('kr2', '净利润（亿）', formatNumber(t.currNetProfit), `<div class="meta">${badge(`本年累计 ${formatNumber(+t.ytdNetProfit.toFixed(2))}`)}${badge(`同比 ${t.yoyNetProfit==null?'-':pct(t.yoyNetProfit)}`, t.yoyNetProfit)}</div>`));
    items.push(kpi('kr3', '归母净利润（亿）', formatNumber(t.currParentNetProfit)));
    items.push(kpi('kr4', '净资产收益率', pct(t.currROE)));
    items.push(kpi('kr5', '预算完成率-营收', t.revenueCompletion==null? '-' : pct(t.revenueCompletion)));
    items.push(kpi('kr6', '预算完成率-净利', t.profitCompletion==null? '-' : pct(t.profitCompletion)));
    el.innerHTML = items.join('');
  }

  function renderOverviewCharts(){
    const months = D.months.map(m=> `${m}月`);

    const revEl = document.getElementById('overviewRevenueTrend');
    const revChart = State.charts.overviewRevenueTrend || echarts.init(revEl);
    State.charts.overviewRevenueTrend = revChart;
    revChart.setOption({
      grid:{left:40,right:18,top:28,bottom:30},
      tooltip:{trigger:'axis'},
      legend:{data:['2024收入','2023收入','预算'], textStyle:{color:'#cbd5e1'}},
      xAxis:{type:'category',data:months, axisLine:{lineStyle:{color:'#475569'}}, axisLabel:{color:'#cbd5e1'}},
      yAxis:{type:'value', axisLine:{show:false}, splitLine:{lineStyle:{color:'rgba(255,255,255,.06)'}}, axisLabel:{color:'#cbd5e1'}},
      series:[
        {name:'2024收入', type:'bar', data:D.revenue2024, itemStyle:{color:'#3b82f6'}, barMaxWidth:18},
        {name:'2023收入', type:'line', data:D.revenue2023, itemStyle:{color:'#94a3b8'}, lineStyle:{width:2, color:'#94a3b8'}},
        {name:'预算', type:'line', data:D.revenueBudget2024, itemStyle:{color:'#22c55e'}, lineStyle:{width:2, type:'dashed', color:'#22c55e'}}
      ]
    });

    const npEl = document.getElementById('overviewNetProfitTrend');
    const npChart = State.charts.overviewNetProfitTrend || echarts.init(npEl);
    State.charts.overviewNetProfitTrend = npChart;
    npChart.setOption({
      grid:{left:40,right:18,top:28,bottom:30},
      tooltip:{trigger:'axis'},
      legend:{data:['2024净利','2023净利','预算'], textStyle:{color:'#cbd5e1'}},
      xAxis:{type:'category',data:months, axisLine:{lineStyle:{color:'#475569'}}, axisLabel:{color:'#cbd5e1'}},
      yAxis:{type:'value', axisLine:{show:false}, splitLine:{lineStyle:{color:'rgba(255,255,255,.06)'}}, axisLabel:{color:'#cbd5e1'}},
      series:[
        {name:'2024净利', type:'bar', data:D.netProfit2024, itemStyle:{color:'#22c55e'}, barMaxWidth:18},
        {name:'2023净利', type:'line', data:D.netProfit2023, itemStyle:{color:'#94a3b8'}, lineStyle:{width:2, color:'#94a3b8'}},
        {name:'预算', type:'line', data:D.netProfitBudget2024, itemStyle:{color:'#f59e0b'}, lineStyle:{width:2, type:'dashed', color:'#f59e0b'}}
      ]
    });
  }

  // Channel page
  function renderChannelKpis(){
    const m = State.month-1;
    const el = document.getElementById('kpi-channel');
    const items = [];
    const hainan = D.hainanRevenue2024[m];
    const onlineGMV = D.onlineTaxGMV2024[m];
    const turnover = D.zeroNotifyTurnover2024[m];
    items.push(kpi('kc1','海南区域营收（亿）', formatNumber(hainan), `<div class="meta">${badge(`同比 ${pct(yoy(hainan, D.hainanRevenue2023[m]))}`, yoy(hainan, D.hainanRevenue2023[m]))}</div>`));
    items.push(kpi('kc2','线上完税GMV（亿）', formatNumber(onlineGMV), `<div class="meta">${badge(`同比 ${pct(yoy(onlineGMV, D.onlineTaxGMV2023[m]))}`, yoy(onlineGMV, D.onlineTaxGMV2023[m]))}</div>`));
    items.push(kpi('kc3','零告业务周转率（次）', formatNumber(turnover), `<div class="meta">${badge(`同比 ${pct(yoy(turnover, D.zeroNotifyTurnover2023[m]))}`, yoy(turnover, D.zeroNotifyTurnover2023[m]))}</div>`));
    items.push(kpi('kc4','毛利率（本月）', pct(D.grossMargin2024[m])));
    items.push(kpi('kc5','本年累计营收（亿）', formatNumber(sum(D.revenue2024.slice(0,State.month)))));
    items.push(kpi('kc6','营收预算完成率', pct(sum(D.revenue2024.slice(0,State.month)) / sum(D.revenueBudget2024.slice(0,State.month)) * 100)));
    el.innerHTML = items.join('');
  }

  function renderChannelCharts(){
    const months = D.months.map(m=> `${m}月`);
    const mixEl = document.getElementById('channelMixChart');
    const mixChart = State.charts.channelMixChart || echarts.init(mixEl);
    State.charts.channelMixChart = mixChart;

    // 饼图展示当前月渠道结构
    const m = State.month-1;
    const pieData = D.channels.map(ch=>({ name: ch, value: D.channelRevenue2024[ch][m] }));
    mixChart.setOption({
      tooltip:{trigger:'item', formatter: p=> `${p.name}: ${p.value.toFixed(2)} 亿 (${p.percent}%)`},
      legend:{top:8, textStyle:{color:'#cbd5e1'}},
      series:[{ type:'pie', radius:['32%','60%'], center:['50%','55%'],
        itemStyle:{borderColor:'#0e1220', borderWidth:2},
        label:{color:'#e2e8f0'}, data: pieData }]
    });

    const mbEl = document.getElementById('channelMarginBudgetChart');
    const mbChart = State.charts.channelMarginBudgetChart || echarts.init(mbEl);
    State.charts.channelMarginBudgetChart = mbChart;

    // 柱线组合：各渠道毛利率（线）与预算完成率（柱），按当前月与年度均值
    const marginData = D.channels.map(ch=> D.channelMargin[ch][m]);
    const budgetData = D.channels.map(ch=> {
      const complete = D.channelBudgetCompletion[ch][m];
      return +complete.toFixed(2);
    });
    mbChart.setOption({
      grid:{left:50,right:18,top:30,bottom:40},
      tooltip:{trigger:'axis'},
      legend:{data:['预算完成率','毛利率'], textStyle:{color:'#cbd5e1'}},
      xAxis:{type:'category', data:D.channels, axisLabel:{color:'#cbd5e1'}},
      yAxis:[
        {type:'value', name:'完成率(%)', position:'left', axisLabel:{color:'#cbd5e1'}, splitLine:{lineStyle:{color:'rgba(255,255,255,.06)'}}},
        {type:'value', name:'毛利率(%)', position:'right', axisLabel:{color:'#cbd5e1'}, splitLine:{show:false}}
      ],
      series:[
        {name:'预算完成率', type:'bar', data: budgetData, itemStyle:{color:'#3b82f6'}, barMaxWidth:20},
        {name:'毛利率', type:'line', yAxisIndex:1, data: marginData, itemStyle:{color:'#22c55e'}, lineStyle:{width:2}}
      ]
    });
  }

  // Customer page
  function renderCustomerKpis(){
    const m = State.month-1;
    const el = document.getElementById('kpi-customer');
    const items = [];
    const intl = D.internationalShare2024[m];
    items.push(kpi('ku1','国际化业务占比', pct(intl), `<div class="meta">${badge(`去年同期 ${pct(D.internationalShare2023[m])}`)}</div>`));
    items.push(kpi('ku2','海南区域营收（亿）', formatNumber(D.hainanRevenue2024[m])));
    items.push(kpi('ku3','线上完税GMV（亿）', formatNumber(D.onlineTaxGMV2024[m])));
    items.push(kpi('ku4','毛利率（本月）', pct(D.grossMargin2024[m])));
    items.push(kpi('ku5','本年累计营收（亿）', formatNumber(sum(D.revenue2024.slice(0,State.month)))));
    items.push(kpi('ku6','同比-营收', pct(yoy(D.revenue2024[m], D.revenue2023[m]))));
    el.innerHTML = items.join('');
  }

  function renderCustomerCharts(){
    const m = State.month-1;
    const regionEl = document.getElementById('customerRegionChart');
    const regionChart = State.charts.customerRegionChart || echarts.init(regionEl);
    State.charts.customerRegionChart = regionChart;
    const regionData = D.regions.map(r=> ({ name: r, value: D.regionRevenue2024[r][m] }));
    regionChart.setOption({
      grid:{left:50,right:18,top:30,bottom:50},
      tooltip:{trigger:'axis'},
      xAxis:{type:'category', data: regionData.map(d=>d.name), axisLabel:{color:'#cbd5e1'}},
      yAxis:{type:'value', axisLabel:{color:'#cbd5e1'}, splitLine:{lineStyle:{color:'rgba(255,255,255,.06)'}}},
      series:[{ type:'bar', data: regionData.map(d=> +d.value.toFixed(2)), itemStyle:{color:(p)=> p.name==='海南'? '#22c55e' : '#3b82f6'}, barMaxWidth:22 }]
    });

    const segEl = document.getElementById('customerSegmentChart');
    const segChart = State.charts.customerSegmentChart || echarts.init(segEl);
    State.charts.customerSegmentChart = segChart;
    const segData = D.customerSegments.map(s=> ({ name: s, value: D.customerSegmentation[s][m] }));
    segChart.setOption({
      tooltip:{trigger:'item', formatter: p=> `${p.name}: ${p.value}%`},
      legend:{top:8, textStyle:{color:'#cbd5e1'}},
      series:[{ type:'pie', radius:['30%','60%'], center:['50%','55%'], itemStyle:{borderColor:'#0e1220', borderWidth:2}, label:{color:'#e2e8f0'}, data: segData }]
    });
  }

  // Product page
  function renderProductKpis(){
    const m = State.month-1;
    const el = document.getElementById('kpi-product');
    const items = [];
    const guochao = D.guochaoSales2024[m];
    items.push(kpi('kp1','国潮商品销售额（亿）', formatNumber(guochao), `<div class="meta">${badge(`去年同期 ${formatNumber(D.guochaoSales2023[m])}`)}</div>`));
    items.push(kpi('kp2','毛利率（本月）', pct(D.grossMargin2024[m]), `<div class="meta">${badge(`去年同期 ${pct(D.grossMargin2023[m])}`)}</div>`));
    items.push(kpi('kp3','国际化业务占比', pct(D.internationalShare2024[m])));
    items.push(kpi('kp4','线上完税GMV（亿）', formatNumber(D.onlineTaxGMV2024[m])));
    items.push(kpi('kp5','本年累计营收（亿）', formatNumber(sum(D.revenue2024.slice(0,State.month)))));
    items.push(kpi('kp6','预算完成率-净利', pct(sum(D.netProfit2024.slice(0,State.month)) / sum(D.netProfitBudget2024.slice(0,State.month)) * 100)));
    el.innerHTML = items.join('');
  }

  function renderProductCharts(){
    const m = State.month-1;
    const catEl = document.getElementById('productCategorySalesChart');
    const catChart = State.charts.productCategorySalesChart || echarts.init(catEl);
    State.charts.productCategorySalesChart = catChart;
    const catPairs = D.categories.map(c=> ({ name: c, value: D.categorySales2024[c][m] }))
      .sort((a,b)=> b.value - a.value);
    catChart.setOption({
      grid:{left:80,right:18,top:20,bottom:40},
      tooltip:{trigger:'axis'},
      xAxis:{type:'value', axisLabel:{color:'#cbd5e1'}, splitLine:{lineStyle:{color:'rgba(255,255,255,.06)'}}},
      yAxis:{type:'category', data: catPairs.map(d=>d.name), axisLabel:{color:'#cbd5e1'}},
      series:[{ type:'bar', data: catPairs.map(d=> +d.value.toFixed(2)), itemStyle:{color:(p)=> p.name==='国潮'? '#22c55e' : '#3b82f6'}, barMaxWidth:16 }]
    });

    const scatEl = document.getElementById('productCategoryMarginScatter');
    const scatChart = State.charts.productCategoryMarginScatter || echarts.init(scatEl);
    State.charts.productCategoryMarginScatter = scatChart;
    const scatData = D.categories.map(c=> [D.categorySales2024[c][m], D.categoryMargin[c][m], c]);
    scatChart.setOption({
      grid:{left:60,right:18,top:20,bottom:40},
      tooltip:{formatter:(p)=> `${p.data[2]}<br/>销售额：${p.data[0].toFixed(2)} 亿<br/>毛利率：${p.data[1].toFixed(2)}%`},
      xAxis:{name:'销售额(亿)', axisLabel:{color:'#cbd5e1'}, splitLine:{lineStyle:{color:'rgba(255,255,255,.06)'}}},
      yAxis:{name:'毛利率(%)', axisLabel:{color:'#cbd5e1'}, splitLine:{lineStyle:{color:'rgba(255,255,255,.06)'}}},
      series:[{ type:'scatter', symbolSize:(v)=> Math.max(10, Math.min(26, v[0]*1.2)), data: scatData, itemStyle:{color:(p)=> p.data[2]==='国潮'? '#22c55e' : '#3b82f6'} }]
    });
  }

  // Rendering orchestrator
  function renderAll(){
    renderOverviewKpis();
    renderOverviewCharts();
    if(State.page==='channel'){
      renderChannelKpis();
      renderChannelCharts();
    }
    if(State.page==='customer'){
      renderCustomerKpis();
      renderCustomerCharts();
    }
    if(State.page==='product'){
      renderProductKpis();
      renderProductCharts();
    }
    // Resize after render to ensure responsive layout
    Object.values(State.charts).forEach(ch=> ch && ch.resize());
  }

  // Initial render
  renderAll();

  // Hash navigation support
  function applyHash(){
    const page = (location.hash.replace('#','') || 'overview');
    const tab = document.querySelector(`.tab[data-page="${page}"]`) || document.querySelector(`.tab[data-page="overview"]`);
    tab.click();
  }
  window.addEventListener('hashchange', applyHash);
  applyHash();

  // Resize observer
  window.addEventListener('resize', ()=>{
    clearTimeout(window.__rsz);
    window.__rsz = setTimeout(()=> Object.values(State.charts).forEach(ch=> ch && ch.resize()), 100);
  });
})();