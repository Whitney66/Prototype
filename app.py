import os
import pandas as pd
import streamlit as st
from dateutil.relativedelta import relativedelta
from datetime import datetime
import plotly.express as px
import numpy as np

DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
MONTHLY_FILE = os.path.join(DATA_DIR, 'monthly_kpi.csv')
CHANNEL_FILE = os.path.join(DATA_DIR, 'channel_kpi.csv')
CUSTOMER_FILE = os.path.join(DATA_DIR, 'customer_kpi.csv')
PRODUCT_FILE = os.path.join(DATA_DIR, 'product_kpi.csv')

# ----------------------
# Sample data generator
# ----------------------

def ensure_sample_data() -> None:
    os.makedirs(DATA_DIR, exist_ok=True)
    if not os.path.exists(MONTHLY_FILE):
        generate_monthly()
    if not os.path.exists(CHANNEL_FILE):
        generate_channel()
    if not os.path.exists(CUSTOMER_FILE):
        generate_customer()
    if not os.path.exists(PRODUCT_FILE):
        generate_product()


def month_range(months: int = 24):
    end = pd.Period(datetime.today().strftime('%Y-%m'), freq='M')
    periods = [end - i for i in range(months)][::-1]
    return [str(p) for p in periods]


def generate_monthly():
    months = month_range(24)
    companies = ['华东事业群-子公司A', '华南事业群-子公司B', '海南区域-子公司C']
    rows = []
    for m in months:
        year = int(m.split('-')[0])
        base = 80 if year == datetime.today().year else 70
        for comp in companies:
            growth = 1.06 if '海南' in comp else 1.04
            idx = months.index(m)
            seasonal = 1.0 + 0.08 * np.sin(idx / 12 * 3.14)
            revenue = round((base + idx * 1.2) * growth * seasonal, 2)
            net_profit = round(revenue * 0.12, 2)
            parent_net_profit = round(net_profit * 0.92, 2)
            roe = round(12 + 1.5 * np.sin(idx / 6 * 3.14), 2)
            gross_margin = round(28 + 2.0 * np.sin(idx / 5 * 3.14), 2)
            revenue_budget = round(revenue * 1.05, 2)
            net_profit_budget = round(net_profit * 1.06, 2)
            hainan_revenue = round(revenue * (0.35 if '海南' in comp else 0.08), 2)
            online_taxed_gmv = round(revenue * (0.22 if '华东' in comp else 0.15), 2)
            international_share = round(0.18 + 0.03 * np.sin(idx / 7 * 3.14), 3)
            guochao_sales = round(revenue * (0.12 + 0.02 * np.sin(idx / 4 * 3.14)), 2)
            turnover_rate = round(4.0 + 0.5 * np.sin(idx / 3 * 3.14), 2)
            rows.append({
                'month': m,
                'company': comp,
                'revenue': revenue,
                'net_profit': net_profit,
                'parent_net_profit': parent_net_profit,
                'roe': roe,
                'gross_margin': gross_margin,
                'revenue_budget': revenue_budget,
                'net_profit_budget': net_profit_budget,
                'hainan_revenue': hainan_revenue,
                'online_taxed_gmv': online_taxed_gmv,
                'international_share': international_share,
                'guochao_sales': guochao_sales,
                'turnover_rate': turnover_rate,
            })
    pd.DataFrame(rows).to_csv(MONTHLY_FILE, index=False)


def generate_channel():
    months = month_range(24)
    companies = ['华东事业群-子公司A', '华南事业群-子公司B', '海南区域-子公司C']
    channels = ['线下门店', '线上完税', '免税渠道', '国际业务']
    rows = []
    for m in months:
        idx = months.index(m)
        for comp in companies:
            base = 20 + idx * 0.6
            for ch in channels:
                factor = {
                    '线下门店': 1.0,
                    '线上完税': 0.6,
                    '免税渠道': 0.8 if '海南' in comp else 0.3,
                    '国际业务': 0.4,
                }[ch]
                revenue = round(base * factor * (1.0 + 0.1 * np.sin(idx / 6 * 3.14)), 2)
                gross_margin = round(26 + 6 * (0.5 if ch == '线上完税' else 0.3) + 1.5 * np.sin(idx / 5 * 3.14), 2)
                budget = round(revenue * 1.05, 2)
                rows.append({
                    'month': m,
                    'company': comp,
                    'channel': ch,
                    'revenue': revenue,
                    'gross_margin': gross_margin,
                    'revenue_budget': budget,
                })
    pd.DataFrame(rows).to_csv(CHANNEL_FILE, index=False)


def generate_customer():
    months = month_range(24)
    companies = ['华东事业群-子公司A', '华南事业群-子公司B', '海南区域-子公司C']
    rows = []
    for m in months:
        idx = months.index(m)
        for comp in companies:
            active = int(200_000 + idx * 3500 + (20_000 if '海南' in comp else 0))
            new = int(active * (0.18 + 0.02 * np.sin(idx / 6 * 3.14)))
            repeat_rate = round(0.52 + 0.06 * np.sin(idx / 4 * 3.14), 3)
            arpu = round(320 + 15 * np.sin(idx / 5 * 3.14), 2)
            satisfaction = round(86 + 2.5 * np.sin(idx / 7 * 3.14), 2)
            rows.append({
                'month': m,
                'company': comp,
                'active_customers': active,
                'new_customers': new,
                'repeat_rate': repeat_rate,
                'arpu': arpu,
                'customer_satisfaction': satisfaction,
            })
    pd.DataFrame(rows).to_csv(CUSTOMER_FILE, index=False)


def generate_product():
    months = month_range(24)
    companies = ['华东事业群-子公司A', '华南事业群-子公司B', '海南区域-子公司C']
    categories = [
        ('美妆', False), ('酒水', False), ('香化', False), ('饰品', False), ('国潮', True)
    ]
    rows = []
    for m in months:
        idx = months.index(m)
        for comp in companies:
            base = 5 + idx * 0.2
            for cat, is_guochao in categories:
                multiplier = 1.0
                if cat == '美妆':
                    multiplier = 1.4
                elif cat == '国潮':
                    multiplier = 1.0 + 0.2 * np.sin(idx / 4 * 3.14)
                revenue = round(base * multiplier * (1.0 + 0.1 * np.sin(idx / 6 * 3.14)), 2)
                gross_margin = round(30 + 2.0 * np.sin(idx / 5 * 3.14) + (2.5 if is_guochao else 0.0), 2)
                rows.append({
                    'month': m,
                    'company': comp,
                    'category': cat,
                    'revenue': revenue,
                    'gross_margin': gross_margin,
                    'is_guochao': is_guochao,
                })
    pd.DataFrame(rows).to_csv(PRODUCT_FILE, index=False)


# ----------------------
# Data loading
# ----------------------

def load_csv_or_raise(path: str) -> pd.DataFrame:
    if not os.path.exists(path):
        ensure_sample_data()
    return pd.read_csv(path)


def to_period(s: pd.Series) -> pd.Series:
    return pd.to_datetime(s).dt.to_period('M')


# ----------------------
# KPI computations
# ----------------------

def compute_yoy(df: pd.DataFrame, month_col: str, value_col: str, current_month: str) -> tuple[float, float]:
    df = df.copy()
    df[month_col] = pd.PeriodIndex(df[month_col], freq='M')
    cur_period = pd.Period(current_month, freq='M')
    last_year_period = cur_period - 12
    cur_val = df.loc[df[month_col] == cur_period, value_col].sum()
    ly_val = df.loc[df[month_col] == last_year_period, value_col].sum()
    yoy = None
    if ly_val and ly_val != 0:
        yoy = (cur_val - ly_val) / ly_val
    return cur_val, (yoy if yoy is not None else pd.NA)


def compute_ytd(df: pd.DataFrame, month_col: str, value_col: str, current_month: str) -> float:
    df = df.copy()
    df[month_col] = pd.PeriodIndex(df[month_col], freq='M')
    cur_period = pd.Period(current_month, freq='M')
    start_of_year = pd.Period(f"{cur_period.year}-01", freq='M')
    mask = (df[month_col] >= start_of_year) & (df[month_col] <= cur_period)
    return df.loc[mask, value_col].sum()


def ratio_safe(n: float, d: float) -> float:
    if d is None or d == 0:
        return pd.NA
    return n / d


# ----------------------
# UI components
# ----------------------

def page_overview(monthly_df: pd.DataFrame):
    st.subheader('总体经营情况')

    months = sorted(monthly_df['month'].unique())
    current_month = st.selectbox('选择月份', months, index=len(months) - 1)

    month_df = monthly_df.copy()
    month_df['month'] = pd.PeriodIndex(month_df['month'], freq='M')

    cur_revenue, yoy_revenue = compute_yoy(month_df, 'month', 'revenue', current_month)
    cur_np, yoy_np = compute_yoy(month_df, 'month', 'net_profit', current_month)
    cur_pnp, yoy_pnp = compute_yoy(month_df, 'month', 'parent_net_profit', current_month)

    ytd_revenue = compute_ytd(month_df, 'month', 'revenue', current_month)
    ytd_np = compute_ytd(month_df, 'month', 'net_profit', current_month)

    cur_roe = month_df.loc[month_df['month'] == pd.Period(current_month, freq='M'), 'roe'].mean()
    cur_gm = month_df.loc[month_df['month'] == pd.Period(current_month, freq='M'), 'gross_margin'].mean()

    cur_rev_budget = month_df.loc[month_df['month'] == pd.Period(current_month, freq='M'), 'revenue_budget'].sum()
    cur_np_budget = month_df.loc[month_df['month'] == pd.Period(current_month, freq='M'), 'net_profit_budget'].sum()

    rev_budget_rate = ratio_safe(cur_revenue, cur_rev_budget)
    np_budget_rate = ratio_safe(cur_np, cur_np_budget)

    # Other required KPI
    cur_hainan = month_df.loc[month_df['month'] == pd.Period(current_month, freq='M'), 'hainan_revenue'].sum()
    cur_online_gmv = month_df.loc[month_df['month'] == pd.Period(current_month, freq='M'), 'online_taxed_gmv'].sum()
    cur_intl_share = month_df.loc[month_df['month'] == pd.Period(current_month, freq='M'), 'international_share'].mean()
    cur_guochao = month_df.loc[month_df['month'] == pd.Period(current_month, freq='M'), 'guochao_sales'].sum()
    cur_turnover = month_df.loc[month_df['month'] == pd.Period(current_month, freq='M'), 'turnover_rate'].mean()

    col1, col2, col3, col4 = st.columns(4)
    col1.metric('营业收入(亿)', f"{cur_revenue:.2f}", delta=f"同比 {yoy_revenue:.1%}" if pd.notna(yoy_revenue) else None)
    col2.metric('净利润(亿)', f"{cur_np:.2f}", delta=f"同比 {yoy_np:.1%}" if pd.notna(yoy_np) else None)
    col3.metric('归母净利润(亿)', f"{cur_pnp:.2f}", delta=f"同比 {yoy_pnp:.1%}" if pd.notna(yoy_pnp) else None)
    col4.metric('净资产收益率(ROE)', f"{cur_roe:.2f}%")

    col5, col6, col7, col8 = st.columns(4)
    col5.metric('毛利率', f"{cur_gm:.2f}%")
    col6.metric('本年累计收入(亿)', f"{ytd_revenue:.2f}")
    col7.metric('本年累计净利润(亿)', f"{ytd_np:.2f}")
    col8.metric('收入预算完成率', f"{rev_budget_rate:.1%}" if pd.notna(rev_budget_rate) else '—')

    col9, col10, col11, col12 = st.columns(4)
    col9.metric('净利润预算完成率', f"{np_budget_rate:.1%}" if pd.notna(np_budget_rate) else '—')
    col10.metric('海南区域营收(亿)', f"{cur_hainan:.2f}")
    col11.metric('线上完税GMV(亿)', f"{cur_online_gmv:.2f}")
    col12.metric('国际化业务占比', f"{cur_intl_share:.1%}")

    col13, col14 = st.columns(2)
    col13.metric('国潮商品销售额(亿)', f"{cur_guochao:.2f}")
    col14.metric('零售业务周转率(次)', f"{cur_turnover:.2f}")

    st.markdown('—')
    st.markdown('月度趋势')

    trend_df = month_df.groupby('month', as_index=False).agg({
        'revenue': 'sum', 'net_profit': 'sum', 'gross_margin': 'mean'
    })
    trend_df['month'] = trend_df['month'].astype(str)

    fig_rev = px.line(trend_df, x='month', y='revenue', title='月度经营收入趋势(亿)')
    fig_np = px.line(trend_df, x='month', y='net_profit', title='月度净利润趋势(亿)')

    st.plotly_chart(fig_rev, use_container_width=True)
    st.plotly_chart(fig_np, use_container_width=True)


def page_channel(channel_df: pd.DataFrame):
    st.subheader('渠道运营情况')
    months = sorted(channel_df['month'].unique())
    current_month = st.selectbox('选择月份', months, index=len(months) - 1, key='channel_month')

    df = channel_df.copy()
    df['month'] = pd.PeriodIndex(df['month'], freq='M')

    cur = df[df['month'] == pd.Period(current_month, freq='M')]
    grp = cur.groupby('channel', as_index=False).agg({'revenue': 'sum', 'gross_margin': 'mean', 'revenue_budget': 'sum'})
    grp['预算完成率'] = grp.apply(lambda r: ratio_safe(r['revenue'], r['revenue_budget']), axis=1)

    # YoY per channel
    yoy_rows = []
    for ch in grp['channel']:
        cur_val, yoy = compute_yoy(df[df['channel'] == ch], 'month', 'revenue', current_month)
        yoy_rows.append({'channel': ch, 'revenue': cur_val, 'yoy': yoy})
    yoy_df = pd.DataFrame(yoy_rows)
    grp = grp.merge(yoy_df[['channel', 'yoy']], on='channel', how='left')

    st.dataframe(
        grp.rename(columns={'channel': '渠道', 'revenue': '收入(亿)', 'gross_margin': '毛利率(%)', 'revenue_budget': '收入预算(亿)', 'yoy': '同比'}),
        use_container_width=True,
        hide_index=True,
    )

    st.markdown('—')
    st.markdown('渠道收入趋势')

    trend = df.groupby(['month', 'channel'], as_index=False)['revenue'].sum()
    trend['month'] = trend['month'].astype(str)
    fig = px.line(trend, x='month', y='revenue', color='channel', title='各渠道月度收入(亿)')
    st.plotly_chart(fig, use_container_width=True)


def page_customer(customer_df: pd.DataFrame):
    st.subheader('客户运营情况')
    months = sorted(customer_df['month'].unique())
    current_month = st.selectbox('选择月份', months, index=len(months) - 1, key='customer_month')

    df = customer_df.copy()
    df['month'] = pd.PeriodIndex(df['month'], freq='M')

    cur = df[df['month'] == pd.Period(current_month, freq='M')]
    agg = cur.agg({
        'active_customers': 'sum',
        'new_customers': 'sum',
        'repeat_rate': 'mean',
        'arpu': 'mean',
        'customer_satisfaction': 'mean',
    })

    col1, col2, col3, col4 = st.columns(4)
    col1.metric('活跃客户数', f"{int(agg['active_customers']):,}")
    col2.metric('新增客户数', f"{int(agg['new_customers']):,}")
    col3.metric('复购率', f"{agg['repeat_rate']:.1%}")
    col4.metric('ARPU(元)', f"{agg['arpu']:.2f}")

    st.metric('客户满意度', f"{agg['customer_satisfaction']:.2f}")

    st.markdown('—')
    st.markdown('客户趋势')

    trend = df.groupby('month', as_index=False).agg({'active_customers': 'sum', 'new_customers': 'sum', 'repeat_rate': 'mean'})
    trend['month'] = trend['month'].astype(str)

    fig1 = px.line(trend, x='month', y='active_customers', title='月度活跃客户数')
    fig2 = px.line(trend, x='month', y='new_customers', title='月度新增客户数')
    fig3 = px.line(trend, x='month', y='repeat_rate', title='复购率')

    st.plotly_chart(fig1, use_container_width=True)
    st.plotly_chart(fig2, use_container_width=True)
    st.plotly_chart(fig3, use_container_width=True)


def page_product(product_df: pd.DataFrame):
    st.subheader('产品运营情况')
    months = sorted(product_df['month'].unique())
    current_month = st.selectbox('选择月份', months, index=len(months) - 1, key='product_month')

    df = product_df.copy()
    df['month'] = pd.PeriodIndex(df['month'], freq='M')

    cur = df[df['month'] == pd.Period(current_month, freq='M')]
    grp = cur.groupby('category', as_index=False).agg({'revenue': 'sum', 'gross_margin': 'mean'})

    st.dataframe(
        grp.rename(columns={'category': '品类', 'revenue': '收入(亿)', 'gross_margin': '毛利率(%)'}),
        use_container_width=True,
        hide_index=True,
    )

    guochao_cur = cur[cur['is_guochao']]
    guochao_sales = guochao_cur['revenue'].sum()
    st.metric('国潮商品销售额(亿)', f"{guochao_sales:.2f}")

    st.markdown('—')
    st.markdown('品类收入趋势')

    trend = df.groupby(['month', 'category'], as_index=False)['revenue'].sum()
    trend['month'] = trend['month'].astype(str)
    fig = px.line(trend, x='month', y='revenue', color='category', title='各品类月度收入(亿)')
    st.plotly_chart(fig, use_container_width=True)


# ----------------------
# Main app
# ----------------------

def main():
    st.set_page_config(page_title='集团月度经营分析看板', layout='wide')
    st.title('集团月度经营分析看板')
    st.caption('统一口径 · 实时监控 · 决策支撑')

    ensure_sample_data()

    monthly_df = load_csv_or_raise(MONTHLY_FILE)
    channel_df = load_csv_or_raise(CHANNEL_FILE)
    customer_df = load_csv_or_raise(CUSTOMER_FILE)
    product_df = load_csv_or_raise(PRODUCT_FILE)

    page = st.sidebar.radio('页面导航', ['总体经营情况', '渠道运营情况', '客户运营情况', '产品运营情况'])

    if page == '总体经营情况':
        page_overview(monthly_df)
    elif page == '渠道运营情况':
        page_channel(channel_df)
    elif page == '客户运营情况':
        page_customer(customer_df)
    elif page == '产品运营情况':
        page_product(product_df)


if __name__ == '__main__':
    main()