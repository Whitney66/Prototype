(function(){
  const months = Array.from({length:12}, (_,i)=>i+1);

  function genSeries(base, fluct){
    return months.map((m, idx)=>{
      const seasonal = 1 + 0.12*Math.sin((idx/12)*Math.PI*2);
      const noise = (Math.random()*2-1)*fluct;
      return +(base*seasonal + noise).toFixed(2);
    });
  }

  // 财务主指标（单位：亿元/百分比）
  const revenue2024 = genSeries(120, 8); // 营业收入（亿）
  const revenue2023 = genSeries(105, 7);
  const netProfit2024 = genSeries(12, 1.2); // 净利润（亿）
  const netProfit2023 = genSeries(10, 1.0);
  const parentNetProfit2024 = netProfit2024.map(v=>+(v*0.9).toFixed(2));
  const parentNetProfit2023 = netProfit2023.map(v=>+(v*0.9).toFixed(2));
  const roe2024 = months.map(()=> +(12 + Math.random()*4).toFixed(2)); // 净资产收益率（%）
  const roe2023 = months.map(()=> +(11 + Math.random()*3.5).toFixed(2));
  const grossMargin2024 = months.map(()=> +(38 + Math.random()*4).toFixed(2)); // 毛利率（%）
  const grossMargin2023 = months.map(()=> +(37 + Math.random()*4).toFixed(2));

  // 预算（简单按月度分摊，单位：亿）
  const revenueBudget2024 = revenue2024.map(v=> +(v*1.02).toFixed(2));
  const netProfitBudget2024 = netProfit2024.map(v=> +(v*1.03).toFixed(2));

  // 海南区域营收（亿）与线上完税GMV（亿）
  const hainanRevenue2024 = genSeries(22, 2.5);
  const hainanRevenue2023 = genSeries(18, 2.0);
  const onlineTaxGMV2024 = genSeries(35, 3.5);
  const onlineTaxGMV2023 = genSeries(28, 3.0);

  // 国际化业务占比（%）、国潮商品销售额（亿）
  const internationalShare2024 = months.map(()=> +(18 + Math.random()*6).toFixed(2));
  const internationalShare2023 = months.map(()=> +(15 + Math.random()*5).toFixed(2));
  const guochaoSales2024 = genSeries(12, 1.8);
  const guochaoSales2023 = genSeries(9, 1.5);

  // 零告业务周转率（次）
  const zeroNotifyTurnover2024 = months.map(()=> +(6 + Math.random()*2).toFixed(2));
  const zeroNotifyTurnover2023 = months.map(()=> +(5.5 + Math.random()*1.8).toFixed(2));

  // 渠道维度（营收、毛利率、预算完成率）
  const channels = ["直营","线上","免税","合作","机场口岸"];
  const channelRevenue2024 = channels.reduce((acc, ch)=>{
    const base = {"直营":40, "线上":32, "免税":28, "合作":18, "机场口岸":14}[ch];
    acc[ch] = genSeries(base, base*0.15);
    return acc;
  },{});
  const channelRevenue2023 = channels.reduce((acc, ch)=>{
    const base = {"直营":34, "线上":26, "免税":24, "合作":16, "机场口岸":12}[ch];
    acc[ch] = genSeries(base, base*0.15);
    return acc;
  },{});
  const channelMargin = channels.reduce((acc, ch)=>{
    const base = {"直营":42, "线上":36, "免税":39, "合作":33, "机场口岸":31}[ch];
    acc[ch] = months.map(()=> +(base + (Math.random()*2-1)*3).toFixed(2));
    return acc;
  },{});
  const channelBudgetCompletion = channels.reduce((acc, ch)=>{
    acc[ch] = months.map(()=> +(85 + Math.random()*20).toFixed(2)); // %
    return acc;
  },{});

  // 区域营收（亿）简化：海南、华东、华北、华南、海外
  const regions = ["海南","华东","华北","华南","海外"];
  const regionRevenue2024 = regions.reduce((acc, r)=>{
    const base = {"海南":22, "华东":38, "华北":26, "华南":32, "海外":18}[r];
    acc[r] = genSeries(base, base*0.18);
    return acc;
  },{});

  // 客户分层（%）VIP/高净值/普通 客户占比
  const customerSegments = ["VIP","高净值","普通"];
  const customerSegmentation = customerSegments.reduce((acc, s)=>{
    if(s==="VIP") acc[s] = months.map(()=> +(12 + Math.random()*3).toFixed(2));
    if(s==="高净值") acc[s] = months.map(()=> +(28 + Math.random()*4).toFixed(2));
    if(s==="普通") acc[s] = months.map(()=> +(60 + Math.random()*5).toFixed(2));
    return acc;
  },{});

  // 产品品类数据
  const categories = ["美妆","酒类","食品","服饰","数码","家居","箱包","珠宝","保健","国潮"];
  const categorySales2024 = categories.reduce((acc, c)=>{
    const base = {"美妆":28, "酒类":18, "食品":16, "服饰":14, "数码":12, "家居":10, "箱包":9, "珠宝":8, "保健":7, "国潮":12}[c];
    acc[c] = genSeries(base, base*0.2);
    return acc;
  },{});
  const categoryMargin = categories.reduce((acc, c)=>{
    const base = {"美妆":40, "酒类":35, "食品":32, "服饰":38, "数码":28, "家居":30, "箱包":36, "珠宝":33, "保健":31, "国潮":42}[c];
    acc[c] = months.map(()=> +(base + (Math.random()*2-1)*3).toFixed(2));
    return acc;
  },{});

  window.DashboardData = {
    months,
    revenue2024, revenue2023,
    netProfit2024, netProfit2023,
    parentNetProfit2024, parentNetProfit2023,
    roe2024, roe2023,
    grossMargin2024, grossMargin2023,
    revenueBudget2024, netProfitBudget2024,
    hainanRevenue2024, hainanRevenue2023,
    onlineTaxGMV2024, onlineTaxGMV2023,
    internationalShare2024, internationalShare2023,
    guochaoSales2024, guochaoSales2023,
    zeroNotifyTurnover2024, zeroNotifyTurnover2023,
    channels, channelRevenue2024, channelRevenue2023, channelMargin, channelBudgetCompletion,
    regions, regionRevenue2024,
    customerSegments, customerSegmentation,
    categories, categorySales2024, categoryMargin,
    meta: { year: 2024, lastYear: 2023 }
  };
})();