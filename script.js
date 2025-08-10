// 全局变量
let charts = {};
let currentPage = 1;

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    initializeCharts();
    updateDateTime();
    setInterval(updateDateTime, 1000);
});

// 初始化页面
function initializePage() {
    // 显示默认页面
    switchPage(1);
    
    // 添加页面切换事件监听
    document.querySelectorAll('.nav-item').forEach((item, index) => {
        item.addEventListener('click', () => switchPage(index + 1));
    });
}

// 页面切换功能
function switchPage(pageNumber) {
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // 显示目标页面
    const targetPage = document.getElementById(`page${pageNumber}`);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // 更新导航状态
    document.querySelectorAll('.nav-item').forEach((item, index) => {
        item.classList.remove('active');
        if (index === pageNumber - 1) {
            item.classList.add('active');
        }
    });
    
    currentPage = pageNumber;
    
    // 延迟初始化图表以确保DOM渲染完成
    setTimeout(() => {
        initializePageCharts(pageNumber);
    }, 100);
}

// 更新日期时间
function updateDateTime() {
    const now = new Date();
    const dateStr = now.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });
    const timeStr = now.toLocaleTimeString('zh-CN');
    
    document.getElementById('current-date').textContent = `${dateStr} ${timeStr}`;
}

// 刷新数据
function refreshData() {
    // 添加刷新动画
    const refreshBtn = document.querySelector('.refresh-btn');
    refreshBtn.classList.add('loading');
    
    // 模拟数据刷新
    setTimeout(() => {
        refreshBtn.classList.remove('loading');
        // 这里可以添加实际的数据刷新逻辑
        console.log('数据已刷新');
    }, 2000);
}

// 初始化所有图表
function initializeCharts() {
    // 设置Chart.js默认配置
    Chart.defaults.color = '#ffffff';
    Chart.defaults.borderColor = 'rgba(120, 119, 198, 0.2)';
    Chart.defaults.backgroundColor = 'rgba(120, 119, 198, 0.1)';
}

// 根据页面初始化对应图表
function initializePageCharts(pageNumber) {
    switch(pageNumber) {
        case 1:
            initializePage1Charts();
            break;
        case 2:
            initializePage2Charts();
            break;
        case 3:
            initializePage3Charts();
            break;
        case 4:
            initializePage4Charts();
            break;
    }
}

// 页面1图表 - 总体经营情况
function initializePage1Charts() {
    // 营业收入趋势图
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx && !charts.revenue) {
        charts.revenue = new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                datasets: [{
                    label: '营业收入(亿元)',
                    data: [32.5, 28.8, 35.2, 38.7, 42.1, 39.8, 43.5, 46.2, 41.8, 44.6, 47.3, 38.6],
                    borderColor: '#7877c6',
                    backgroundColor: 'rgba(120, 119, 198, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#7877c6',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: getChartOptions('营业收入趋势')
        });
    }
    
    // 净利润趋势图
    const profitCtx = document.getElementById('profitChart');
    if (profitCtx && !charts.profit) {
        charts.profit = new Chart(profitCtx, {
            type: 'line',
            data: {
                labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                datasets: [{
                    label: '净利润(亿元)',
                    data: [4.8, 4.2, 5.3, 5.8, 6.2, 5.9, 6.5, 6.9, 6.2, 6.7, 7.1, 5.8],
                    borderColor: '#ff77c6',
                    backgroundColor: 'rgba(255, 119, 198, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#ff77c6',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: getChartOptions('净利润趋势')
        });
    }
}

// 页面2图表 - 渠道运营情况
function initializePage2Charts() {
    // 各渠道营收趋势
    const channelRevenueCtx = document.getElementById('channelRevenueChart');
    if (channelRevenueCtx && !charts.channelRevenue) {
        charts.channelRevenue = new Chart(channelRevenueCtx, {
            type: 'bar',
            data: {
                labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                datasets: [
                    {
                        label: '线下门店',
                        data: [20.2, 18.5, 22.1, 24.2, 26.3, 24.8, 27.1, 28.9, 26.2, 27.8, 29.5, 24.1],
                        backgroundColor: 'rgba(120, 119, 198, 0.8)',
                        borderColor: '#7877c6',
                        borderWidth: 1
                    },
                    {
                        label: '线上平台',
                        data: [8.5, 7.2, 9.1, 10.3, 11.2, 10.5, 11.8, 12.5, 11.1, 12.0, 12.8, 10.5],
                        backgroundColor: 'rgba(255, 119, 198, 0.8)',
                        borderColor: '#ff77c6',
                        borderWidth: 1
                    },
                    {
                        label: '批发渠道',
                        data: [3.8, 3.1, 4.0, 4.2, 4.6, 4.5, 4.6, 4.8, 4.5, 4.8, 5.0, 4.0],
                        backgroundColor: 'rgba(120, 255, 198, 0.8)',
                        borderColor: '#78ffc6',
                        borderWidth: 1
                    }
                ]
            },
            options: getChartOptions('各渠道营收对比(亿元)')
        });
    }
    
    // 渠道占比饼图
    const channelPieCtx = document.getElementById('channelPieChart');
    if (channelPieCtx && !charts.channelPie) {
        charts.channelPie = new Chart(channelPieCtx, {
            type: 'doughnut',
            data: {
                labels: ['线下门店', '线上平台', '批发渠道'],
                datasets: [{
                    data: [62.4, 27.6, 10.0],
                    backgroundColor: [
                        'rgba(120, 119, 198, 0.8)',
                        'rgba(255, 119, 198, 0.8)',
                        'rgba(120, 255, 198, 0.8)'
                    ],
                    borderColor: [
                        '#7877c6',
                        '#ff77c6',
                        '#78ffc6'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#ffffff',
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }
}

// 页面3图表 - 客户运营情况
function initializePage3Charts() {
    // 客户价值分布
    const customerValueCtx = document.getElementById('customerValueChart');
    if (customerValueCtx && !charts.customerValue) {
        charts.customerValue = new Chart(customerValueCtx, {
            type: 'bar',
            data: {
                labels: ['新客户', '普通客户', '活跃客户', '忠诚客户', 'VIP客户'],
                datasets: [{
                    label: '客户数量(万)',
                    data: [358, 856, 642, 485, 515],
                    backgroundColor: [
                        'rgba(120, 119, 198, 0.6)',
                        'rgba(120, 119, 198, 0.7)',
                        'rgba(120, 119, 198, 0.8)',
                        'rgba(255, 119, 198, 0.8)',
                        'rgba(255, 119, 198, 0.9)'
                    ],
                    borderColor: '#7877c6',
                    borderWidth: 1
                }]
            },
            options: getChartOptions('客户价值分布')
        });
    }
    
    // 客户生命周期价值
    const customerLifetimeCtx = document.getElementById('customerLifetimeChart');
    if (customerLifetimeCtx && !charts.customerLifetime) {
        charts.customerLifetime = new Chart(customerLifetimeCtx, {
            type: 'radar',
            data: {
                labels: ['获客成本', '首次购买', '复购率', '客单价', '推荐价值', '留存时长'],
                datasets: [{
                    label: '本月表现',
                    data: [85, 92, 78, 88, 82, 90],
                    borderColor: '#7877c6',
                    backgroundColor: 'rgba(120, 119, 198, 0.2)',
                    pointBackgroundColor: '#7877c6',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2
                }, {
                    label: '目标水平',
                    data: [90, 85, 85, 85, 85, 85],
                    borderColor: '#ff77c6',
                    backgroundColor: 'rgba(255, 119, 198, 0.1)',
                    pointBackgroundColor: '#ff77c6',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#ffffff',
                            padding: 20
                        }
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            color: '#8892b0'
                        },
                        grid: {
                            color: 'rgba(120, 119, 198, 0.2)'
                        },
                        pointLabels: {
                            color: '#ffffff'
                        }
                    }
                }
            }
        });
    }
}

// 页面4图表 - 产品运营情况
function initializePage4Charts() {
    // 产品类别销售趋势
    const productTrendCtx = document.getElementById('productTrendChart');
    if (productTrendCtx && !charts.productTrend) {
        charts.productTrend = new Chart(productTrendCtx, {
            type: 'line',
            data: {
                labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                datasets: [
                    {
                        label: '香化美妆',
                        data: [12.5, 11.2, 14.8, 16.2, 17.8, 16.9, 18.5, 19.8, 18.2, 19.6, 20.5, 15.5],
                        borderColor: '#7877c6',
                        backgroundColor: 'rgba(120, 119, 198, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: '精品服饰',
                        data: [8.8, 7.9, 10.2, 11.1, 12.1, 11.5, 12.8, 13.6, 12.4, 13.2, 13.9, 10.7],
                        borderColor: '#ff77c6',
                        backgroundColor: 'rgba(255, 119, 198, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: '食品饮料',
                        data: [6.5, 5.8, 7.2, 7.8, 8.5, 8.1, 8.8, 9.3, 8.6, 9.1, 9.6, 7.9],
                        borderColor: '#78ffc6',
                        backgroundColor: 'rgba(120, 255, 198, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: '其他商品',
                        data: [4.7, 4.0, 3.0, 3.6, 4.2, 3.3, 3.4, 3.5, 2.6, 2.7, 3.3, 4.5],
                        borderColor: '#ffd700',
                        backgroundColor: 'rgba(255, 215, 0, 0.1)',
                        tension: 0.4
                    }
                ]
            },
            options: getChartOptions('产品类别销售趋势(亿元)')
        });
    }
    
    // 产品毛利率对比
    const productMarginCtx = document.getElementById('productMarginChart');
    if (productMarginCtx && !charts.productMargin) {
        charts.productMargin = new Chart(productMarginCtx, {
            type: 'bar',
            data: {
                labels: ['香化美妆', '精品服饰', '食品饮料', '其他商品'],
                datasets: [{
                    label: '毛利率(%)',
                    data: [35.2, 28.6, 18.9, 42.3],
                    backgroundColor: [
                        'rgba(120, 119, 198, 0.8)',
                        'rgba(255, 119, 198, 0.8)',
                        'rgba(120, 255, 198, 0.8)',
                        'rgba(255, 215, 0, 0.8)'
                    ],
                    borderColor: [
                        '#7877c6',
                        '#ff77c6',
                        '#78ffc6',
                        '#ffd700'
                    ],
                    borderWidth: 2
                }]
            },
            options: getChartOptions('产品毛利率对比')
        });
    }
}

// 获取图表通用配置
function getChartOptions(title) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#ffffff',
                    padding: 20,
                    usePointStyle: true
                }
            },
            title: {
                display: false
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#8892b0'
                },
                grid: {
                    color: 'rgba(120, 119, 198, 0.1)'
                }
            },
            y: {
                ticks: {
                    color: '#8892b0'
                },
                grid: {
                    color: 'rgba(120, 119, 198, 0.1)'
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        },
        animation: {
            duration: 1000,
            easing: 'easeInOutQuart'
        }
    };
}

// 添加卡片悬停效果
document.addEventListener('DOMContentLoaded', function() {
    // 为所有卡片添加悬停效果
    const cards = document.querySelectorAll('.metric-card, .channel-card, .customer-card, .product-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// 添加数字动画效果
function animateNumbers() {
    const numberElements = document.querySelectorAll('.metric-value .value, .customer-value, .efficiency-value, .behavior-value, .guochao-value');
    
    numberElements.forEach(element => {
        const finalValue = parseFloat(element.textContent);
        const duration = 2000; // 动画持续时间
        const startTime = Date.now();
        
        function updateNumber() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // 使用缓动函数
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = finalValue * easeProgress;
            
            element.textContent = currentValue.toFixed(1);
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = finalValue.toString();
            }
        }
        
        updateNumber();
    });
}

// 页面切换时触发数字动画
function switchPage(pageNumber) {
    // 原有的页面切换逻辑...
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    const targetPage = document.getElementById(`page${pageNumber}`);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    document.querySelectorAll('.nav-item').forEach((item, index) => {
        item.classList.remove('active');
        if (index === pageNumber - 1) {
            item.classList.add('active');
        }
    });
    
    currentPage = pageNumber;
    
    // 延迟初始化图表和动画
    setTimeout(() => {
        initializePageCharts(pageNumber);
        animateNumbers();
    }, 100);
}

// 键盘快捷键支持
document.addEventListener('keydown', function(e) {
    if (e.key >= '1' && e.key <= '4') {
        switchPage(parseInt(e.key));
    } else if (e.key === 'ArrowLeft' && currentPage > 1) {
        switchPage(currentPage - 1);
    } else if (e.key === 'ArrowRight' && currentPage < 4) {
        switchPage(currentPage + 1);
    } else if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
        e.preventDefault();
        refreshData();
    }
});

// 全屏模式支持
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// 添加全屏快捷键
document.addEventListener('keydown', function(e) {
    if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
    }
});

// 导出功能（可选）
function exportDashboard() {
    // 这里可以添加导出功能的实现
    console.log('导出看板数据...');
}