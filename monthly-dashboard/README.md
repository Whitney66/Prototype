# 月度经营看板（静态原型）

该目录包含一个可直接通过浏览器访问的静态可视化看板原型（无需安装依赖）。用于集团月度经营分析的大屏展示雏形，后续可替换为对接集团数据集成平台的实时接口。

## 运行方式

- 方式一：直接用浏览器打开 `index.html`
- 方式二：启动本地静态服务（推荐）

```bash
cd /workspace/monthly-dashboard
python3 -m http.server 8080
# 浏览器访问：http://localhost:8080
```

## 页面结构

- `index.html`：总体经营情况（营业收入、净利润、归母净利润、ROE、毛利率、YTD/去年同期/同比、预算与完成率、收入/净利润月度趋势）
- `channels.html`：渠道运营情况（渠道营收分布、线上完税GMV、海南区域营收与趋势、周转率、国际化业务占比）
- `customers.html`：客户运营情况（活跃/新增趋势、复购率等）
- `products.html`：产品运营情况（品类销售、国潮商品销售额等）

## 数据配置

- 页面默认尝试请求 `data/monthly.json`，若不存在则回退至 `data/monthly.sample.json`
- 可将真实数据按相同结构投放为 `data/monthly.json`

## 指标口径（示例）

- 金额单位：亿元
- 比例：0~1（页面中以百分比展示）
- 周转率：次

详见 `data/monthly.sample.json` 示例结构。