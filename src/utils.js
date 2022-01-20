const now = () => +Date.now() / 1000;

const memoizeAsync = (fn) => {
  const CACHE_DURATION = 10;

  let lastRunTs = 0;
  let cache;

  return async () => {
    const isCacheExpired = (now() - lastRunTs) > CACHE_DURATION;

    if (isCacheExpired) {
      lastRunTs = now();
      cache = await fn();
    }

    return cache;
  }
};

const debounce = (fn) => {
  let timeoutId;

  return () => new Promise((resolve) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => resolve(fn()), 500);
  });
};

const blocknativeApiFetchOptions = {
  method: 'GET',
  headers: { Authorization: '7ef1ad25-e1f0-41f6-b01b-d39615186be8' },
};

const getBlocknativeData = memoizeAsync(async () => {
  const resp = await (await fetch('https://api.blocknative.com/gasprices/blockprices?confidenceLevels=99&confidenceLevels=90&confidenceLevels=80&confidenceLevels=60', blocknativeApiFetchOptions)).json();
  const { blockPrices: [{ baseFeePerGas, estimatedPrices }] } = resp;

  return {
    baseFee: baseFeePerGas,
    fastest: estimatedPrices.find(({ confidence }) => confidence === 99),
    fast: estimatedPrices.find(({ confidence }) => confidence === 90),
    standard: estimatedPrices.find(({ confidence }) => confidence === 80),
    slow: estimatedPrices.find(({ confidence }) => confidence === 60),
  };
});

const getEtherscanData = memoizeAsync(async () => (
  (await fetch('https://api.etherscan.io/api?module=gastracker&action=gasoracle')).json()
));

const getEGSData = memoizeAsync(async () => (
  (await fetch(`https://ethgasstation.info/api/ethgasAPI.json?api-key=3923e07fd996632e1fbc897c859aa90a1f604bab3a2c22efa2780109db6f`)).json()
));

export {
  debounce,
  getBlocknativeData,
  getEtherscanData,
  getEGSData,
}
