(function() {
  function setDataAndNotify(data) {
    window.dashboardData = data;
    window.dispatchEvent(new CustomEvent('dashboard-data-ready', { detail: data }));
  }

  async function fetchJson(url) {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  }

  async function load() {
    try {
      const data = await fetchJson('./data/monthly.json');
      setDataAndNotify(data);
    } catch (_) {
      try {
        const data = await fetchJson('./data/monthly.sample.json');
        setDataAndNotify(data);
      } catch (err) {
        console.error('加载数据失败', err);
      }
    }
  }

  if (!window.dashboardData) {
    load();
  } else {
    setDataAndNotify(window.dashboardData);
  }
})();