class ChartService {
    constructor() {
        this.chart = null;
        this.candlestickSeries = null;
        this.volumeSeries = null;
        this.currentSymbol = 'AAPL';
        this.chartType = 'candlestick';
        this.indicators = new Map();
        this.initChart();
    }

    initChart() {
        const chartContainer = document.getElementById('chart');
        this.chart = LightweightCharts.createChart(chartContainer, {
            layout: {
                background: { color: '#1E222D' },
                textColor: '#DDD',
            },
            grid: {
                vertLines: { color: '#2B2B43' },
                horzLines: { color: '#2B2B43' },
            },
            crosshair: {
                mode: LightweightCharts.CrosshairMode.Normal,
            },
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
            },
        });

        // Make the chart responsive
        const resizeChart = () => {
            const width = chartContainer.clientWidth;
            const height = chartContainer.clientHeight;
            this.chart.applyOptions({ width, height });
        };

        window.addEventListener('resize', debounce(resizeChart, 100));
        resizeChart();

        this.setupChartSeries();
    }

    setupChartSeries() {
        // Remove existing series if any
        if (this.candlestickSeries) {
            this.chart.removeSeries(this.candlestickSeries);
        }
        if (this.volumeSeries) {
            this.chart.removeSeries(this.volumeSeries);
        }

        // Create new series based on chart type
        switch (this.chartType) {
            case 'candlestick':
                this.candlestickSeries = this.chart.addCandlestickSeries({
                    upColor: '#26a69a',
                    downColor: '#ef5350',
                    borderVisible: false,
                    wickUpColor: '#26a69a',
                    wickDownColor: '#ef5350'
                });
                break;
            case 'line':
                this.candlestickSeries = this.chart.addLineSeries({
                    color: '#2196F3',
                    lineWidth: 2,
                });
                break;
            case 'area':
                this.candlestickSeries = this.chart.addAreaSeries({
                    topColor: 'rgba(33, 150, 243, 0.56)',
                    bottomColor: 'rgba(33, 150, 243, 0.04)',
                    lineColor: 'rgba(33, 150, 243, 1)',
                    lineWidth: 2,
                });
                break;
        }

        // Add volume series
        this.volumeSeries = this.chart.addHistogramSeries({
            color: '#26a69a',
            priceFormat: {
                type: 'volume',
            },
            priceScaleId: '',
            scaleMargins: {
                top: 0.8,
                bottom: 0,
            },
        });
    }

    async loadData(symbol = this.currentSymbol, timeframe = '1D') {
        try {
            showLoading();
            const to = Math.floor(Date.now() / 1000);
            const from = to - this.getTimeframeSeconds(timeframe);
            
            const data = await marketData.getCandles(symbol, this.getResolution(timeframe), from, to);
            
            if (data.s === 'ok') {
                const ohlcData = data.t.map((time, index) => ({
                    time: time,
                    open: data.o[index],
                    high: data.h[index],
                    low: data.l[index],
                    close: data.c[index]
                }));

                const volumeData = data.t.map((time, index) => ({
                    time: time,
                    value: data.v[index],
                    color: data.c[index] >= data.o[index] ? '#26a69a' : '#ef5350'
                }));

                this.candlestickSeries.setData(ohlcData);
                this.volumeSeries.setData(volumeData);
                this.currentSymbol = symbol;
                
                // Update symbol info
                document.getElementById('currentSymbol').textContent = symbol;
                this.updateCurrentPrice(data.c[data.c.length - 1]);
            }
        } catch (error) {
            showError('Failed to load chart data');
            console.error('Error loading chart data:', error);
        } finally {
            hideLoading();
        }
    }

    updateCurrentPrice(price) {
        const priceElement = document.getElementById('currentPrice');
        const changeElement = document.getElementById('priceChange');
        
        priceElement.textContent = formatPrice(price);
        // Note: Change calculation would need previous day's close price
        // This is simplified for the example
        changeElement.textContent = '+0.00 (0.00%)';
    }

    getTimeframeSeconds(timeframe) {
        const periods = {
            '1m': 60 * 60, // 1 hour of 1-minute data
            '5m': 60 * 60 * 24, // 1 day of 5-minute data
            '15m': 60 * 60 * 24 * 7, // 1 week of 15-minute data
            '1h': 60 * 60 * 24 * 30, // 1 month of 1-hour data
            '4h': 60 * 60 * 24 * 30 * 3, // 3 months of 4-hour data
            '1D': 60 * 60 * 24 * 365, // 1 year of daily data
            '1W': 60 * 60 * 24 * 365 * 5, // 5 years of weekly data
        };
        return periods[timeframe] || periods['1D'];
    }

    getResolution(timeframe) {
        const resolutions = {
            '1m': '1',
            '5m': '5',
            '15m': '15',
            '1h': '60',
            '4h': '240',
            '1D': 'D',
            '1W': 'W'
        };
        return resolutions[timeframe] || 'D';
    }

    changeChartType(type) {
        this.chartType = type;
        const currentData = this.candlestickSeries.getData();
        this.setupChartSeries();
        this.candlestickSeries.setData(currentData);
    }
}

// Initialize chart
const chartService = new ChartService();

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Timeframe buttons
    document.querySelectorAll('.timeframe-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            document.querySelector('.timeframe-btn.active')?.classList.remove('active');
            e.target.classList.add('active');
            chartService.loadData(chartService.currentSymbol, e.target.dataset.timeframe);
        });
    });

    // Chart type buttons
    document.querySelectorAll('.chart-type-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            document.querySelector('.chart-type-btn.active')?.classList.remove('active');
            e.target.classList.add('active');
            chartService.changeChartType(e.target.dataset.type);
        });
    });

    // Initial chart load
    chartService.loadData();
});