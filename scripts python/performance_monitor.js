/**
 * 🎯 Real-Time Performance Monitor - Projeto M
 * Monitor de performance em tempo real para análise contínua
 * 
 * Funcionalidades:
 * - Core Web Vitals em tempo real
 * - Memory usage monitoring
 * - Network performance tracking
 * - User interaction metrics
 * - Frame rate monitoring
 * - Bundle loading analysis
 */

class RealTimePerformanceMonitor {
    constructor(options = {}) {
        this.options = {
            enableConsoleOutput: true,
            enableVisualOverlay: false,
            samplingInterval: 1000,
            maxSamples: 100,
            ...options
        };
        
        this.metrics = {
            webVitals: {},
            memory: [],
            network: [],
            interactions: [],
            frameRate: [],
            bundle: {},
            errors: []
        };
        
        this.observers = [];
        this.isMonitoring = false;
        this.startTime = performance.now();
        
        this.init();
    }
    
    init() {
        console.log('🎯 Performance Monitor iniciado');
        this.setupWebVitalsObservers();
        this.setupMemoryMonitoring();
        this.setupNetworkMonitoring();
        this.setupInteractionTracking();
        this.setupFrameRateMonitoring();
        this.setupErrorTracking();
        this.setupBundleAnalysis();
        
        if (this.options.enableVisualOverlay) {
            this.createVisualOverlay();
        }
    }
    
    setupWebVitalsObservers() {
        // First Contentful Paint
        const fcpObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.name === 'first-contentful-paint') {
                    this.metrics.webVitals.fcp = entry.startTime;
                    this.log('FCP', `${entry.startTime.toFixed(2)}ms`);
                }
            }
        });
        fcpObserver.observe({ type: 'paint', buffered: true });
        this.observers.push(fcpObserver);
        
        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.metrics.webVitals.lcp = lastEntry.startTime;
            this.log('LCP', `${lastEntry.startTime.toFixed(2)}ms`);
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
        this.observers.push(lcpObserver);
        
        // Cumulative Layout Shift
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                    this.metrics.webVitals.cls = clsValue;
                    this.log('CLS', clsValue.toFixed(4));
                }
            }
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });
        this.observers.push(clsObserver);
        
        // First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                this.metrics.webVitals.fid = entry.processingStart - entry.startTime;
                this.log('FID', `${this.metrics.webVitals.fid.toFixed(2)}ms`);
            }
        });
        fidObserver.observe({ type: 'first-input', buffered: true });
        this.observers.push(fidObserver);
    }
    
    setupMemoryMonitoring() {
        if (!performance.memory) {
            console.warn('⚠️ Performance.memory não disponível');
            return;
        }
        
        const collectMemoryMetrics = () => {
            const memory = {
                timestamp: performance.now(),
                usedJSHeapSize: performance.memory.usedJSHeapSize,
                totalJSHeapSize: performance.memory.totalJSHeapSize,
                jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
                domNodes: document.querySelectorAll('*').length,
                eventListeners: this.countEventListeners()
            };
            
            this.metrics.memory.push(memory);
            
            // Manter apenas as últimas amostras
            if (this.metrics.memory.length > this.options.maxSamples) {
                this.metrics.memory.shift();
            }
            
            // Detectar memory leaks
            this.detectMemoryLeaks();
        };
        
        setInterval(collectMemoryMetrics, this.options.samplingInterval);
    }
    
    setupNetworkMonitoring() {
        const networkObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'navigation') {
                    this.metrics.network.push({
                        type: 'navigation',
                        name: entry.name,
                        duration: entry.duration,
                        transferSize: entry.transferSize,
                        encodedBodySize: entry.encodedBodySize,
                        decodedBodySize: entry.decodedBodySize,
                        domContentLoadedEventEnd: entry.domContentLoadedEventEnd,
                        loadEventEnd: entry.loadEventEnd
                    });
                }
                
                if (entry.entryType === 'resource') {
                    this.metrics.network.push({
                        type: 'resource',
                        name: entry.name,
                        duration: entry.duration,
                        transferSize: entry.transferSize,
                        encodedBodySize: entry.encodedBodySize,
                        decodedBodySize: entry.decodedBodySize,
                        resourceType: this.getResourceType(entry.name)
                    });
                }
            }
        });
        
        networkObserver.observe({ type: 'navigation', buffered: true });
        networkObserver.observe({ type: 'resource', buffered: true });
        this.observers.push(networkObserver);
    }
    
    setupInteractionTracking() {
        const interactions = ['click', 'scroll', 'keydown', 'touchstart'];
        
        interactions.forEach(eventType => {
            document.addEventListener(eventType, (event) => {
                const interaction = {
                    type: eventType,
                    timestamp: performance.now(),
                    target: event.target.tagName,
                    x: event.clientX || 0,
                    y: event.clientY || 0
                };
                
                this.metrics.interactions.push(interaction);
                
                // Manter apenas as últimas interações
                if (this.metrics.interactions.length > this.options.maxSamples) {
                    this.metrics.interactions.shift();
                }
            }, { passive: true });
        });
    }
    
    setupFrameRateMonitoring() {
        let lastTime = performance.now();
        let frameCount = 0;
        
        const measureFrameRate = () => {
            const currentTime = performance.now();
            frameCount++;
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                
                this.metrics.frameRate.push({
                    timestamp: currentTime,
                    fps: fps
                });
                
                // Manter apenas as últimas amostras
                if (this.metrics.frameRate.length > this.options.maxSamples) {
                    this.metrics.frameRate.shift();
                }
                
                if (fps < 30) {
                    this.log('FPS Warning', `${fps} FPS (< 30)`, 'warn');
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(measureFrameRate);
        };
        
        requestAnimationFrame(measureFrameRate);
    }
    
    setupErrorTracking() {
        window.addEventListener('error', (event) => {
            this.metrics.errors.push({
                type: 'javascript',
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                timestamp: performance.now()
            });
            
            this.log('JS Error', event.message, 'error');
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            this.metrics.errors.push({
                type: 'promise',
                message: event.reason.toString(),
                timestamp: performance.now()
            });
            
            this.log('Promise Rejection', event.reason.toString(), 'error');
        });
    }
    
    setupBundleAnalysis() {
        // Analisar recursos carregados
        window.addEventListener('load', () => {
            const resources = performance.getEntriesByType('resource');
            
            let jsSize = 0;
            let cssSize = 0;
            let imageSize = 0;
            let fontSize = 0;
            
            resources.forEach(resource => {
                const size = resource.transferSize || 0;
                const type = this.getResourceType(resource.name);
                
                switch (type) {
                    case 'script':
                        jsSize += size;
                        break;
                    case 'stylesheet':
                        cssSize += size;
                        break;
                    case 'image':
                        imageSize += size;
                        break;
                    case 'font':
                        fontSize += size;
                        break;
                }
            });
            
            this.metrics.bundle = {
                totalResources: resources.length,
                jsSize,
                cssSize,
                imageSize,
                fontSize,
                totalSize: jsSize + cssSize + imageSize + fontSize
            };
            
            this.log('Bundle Analysis', `Total: ${(this.metrics.bundle.totalSize / 1024).toFixed(2)} KB`);
        });
    }
    
    countEventListeners() {
        // Aproximação do número de event listeners
        const elements = document.querySelectorAll('*');
        let count = 0;
        
        elements.forEach(element => {
            const events = getEventListeners ? getEventListeners(element) : {};
            count += Object.keys(events).length;
        });
        
        return count;
    }
    
    detectMemoryLeaks() {
        if (this.metrics.memory.length < 10) return;
        
        const recent = this.metrics.memory.slice(-10);
        const trend = recent.map(m => m.usedJSHeapSize);
        
        // Calcular tendência de crescimento
        let increasing = 0;
        for (let i = 1; i < trend.length; i++) {
            if (trend[i] > trend[i - 1]) increasing++;
        }
        
        // Se a memória está crescendo consistentemente
        if (increasing > 7) {
            this.log('Memory Leak Warning', 'Possível vazamento de memória detectado', 'warn');
        }
    }
    
    getResourceType(url) {
        if (url.includes('.js')) return 'script';
        if (url.includes('.css')) return 'stylesheet';
        if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) return 'image';
        if (url.match(/\.(woff|woff2|ttf|otf)$/i)) return 'font';
        if (url.includes('.json')) return 'json';
        return 'other';
    }
    
    createVisualOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'performance-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px;
            font-family: monospace;
            font-size: 12px;
            z-index: 10000;
            border-radius: 5px;
            min-width: 200px;
        `;
        
        document.body.appendChild(overlay);
        
        // Atualizar overlay periodicamente
        setInterval(() => {
            this.updateVisualOverlay(overlay);
        }, 1000);
    }
    
    updateVisualOverlay(overlay) {
        const memory = this.metrics.memory[this.metrics.memory.length - 1];
        const frameRate = this.metrics.frameRate[this.metrics.frameRate.length - 1];
        
        overlay.innerHTML = `
            <div><strong>Performance Monitor</strong></div>
            <div>FCP: ${this.metrics.webVitals.fcp?.toFixed(2) || 'N/A'}ms</div>
            <div>LCP: ${this.metrics.webVitals.lcp?.toFixed(2) || 'N/A'}ms</div>
            <div>CLS: ${this.metrics.webVitals.cls?.toFixed(4) || 'N/A'}</div>
            <div>FID: ${this.metrics.webVitals.fid?.toFixed(2) || 'N/A'}ms</div>
            <div>Memory: ${memory ? (memory.usedJSHeapSize / 1024 / 1024).toFixed(2) : 'N/A'} MB</div>
            <div>FPS: ${frameRate?.fps || 'N/A'}</div>
            <div>DOM Nodes: ${memory?.domNodes || 'N/A'}</div>
            <div>Errors: ${this.metrics.errors.length}</div>
        `;
    }
    
    log(metric, value, level = 'info') {
        if (!this.options.enableConsoleOutput) return;
        
        const timestamp = ((performance.now() - this.startTime) / 1000).toFixed(2);
        const message = `[${timestamp}s] 📊 ${metric}: ${value}`;
        
        switch (level) {
            case 'warn':
                console.warn(message);
                break;
            case 'error':
                console.error(message);
                break;
            default:
                console.log(message);
        }
    }
    
    getReport() {
        return {
            timestamp: new Date().toISOString(),
            sessionDuration: performance.now() - this.startTime,
            webVitals: this.metrics.webVitals,
            memoryStats: this.calculateMemoryStats(),
            networkStats: this.calculateNetworkStats(),
            interactionStats: this.calculateInteractionStats(),
            frameRateStats: this.calculateFrameRateStats(),
            bundleInfo: this.metrics.bundle,
            errors: this.metrics.errors
        };
    }
    
    calculateMemoryStats() {
        if (this.metrics.memory.length === 0) return null;
        
        const heapSizes = this.metrics.memory.map(m => m.usedJSHeapSize);
        return {
            current: heapSizes[heapSizes.length - 1],
            max: Math.max(...heapSizes),
            min: Math.min(...heapSizes),
            average: heapSizes.reduce((a, b) => a + b, 0) / heapSizes.length,
            trend: this.calculateTrend(heapSizes)
        };
    }
    
    calculateNetworkStats() {
        const resources = this.metrics.network.filter(n => n.type === 'resource');
        
        if (resources.length === 0) return null;
        
        const totalSize = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
        const avgDuration = resources.reduce((sum, r) => sum + r.duration, 0) / resources.length;
        
        return {
            totalRequests: resources.length,
            totalSize,
            averageDuration: avgDuration,
            cacheHitRatio: resources.filter(r => r.transferSize === 0).length / resources.length
        };
    }
    
    calculateInteractionStats() {
        if (this.metrics.interactions.length === 0) return null;
        
        const interactionCounts = {};
        this.metrics.interactions.forEach(i => {
            interactionCounts[i.type] = (interactionCounts[i.type] || 0) + 1;
        });
        
        return {
            total: this.metrics.interactions.length,
            types: interactionCounts,
            averageInterval: this.calculateAverageInterval(this.metrics.interactions)
        };
    }
    
    calculateFrameRateStats() {
        if (this.metrics.frameRate.length === 0) return null;
        
        const fps = this.metrics.frameRate.map(f => f.fps);
        return {
            current: fps[fps.length - 1],
            average: fps.reduce((a, b) => a + b, 0) / fps.length,
            min: Math.min(...fps),
            max: Math.max(...fps),
            dropsBelow30: fps.filter(f => f < 30).length
        };
    }
    
    calculateTrend(values) {
        if (values.length < 2) return 'stable';
        
        const first = values.slice(0, Math.floor(values.length / 2));
        const second = values.slice(Math.floor(values.length / 2));
        
        const firstAvg = first.reduce((a, b) => a + b, 0) / first.length;
        const secondAvg = second.reduce((a, b) => a + b, 0) / second.length;
        
        const change = ((secondAvg - firstAvg) / firstAvg) * 100;
        
        if (change > 10) return 'increasing';
        if (change < -10) return 'decreasing';
        return 'stable';
    }
    
    calculateAverageInterval(events) {
        if (events.length < 2) return 0;
        
        const intervals = [];
        for (let i = 1; i < events.length; i++) {
            intervals.push(events[i].timestamp - events[i - 1].timestamp);
        }
        
        return intervals.reduce((a, b) => a + b, 0) / intervals.length;
    }
    
    exportData() {
        const report = this.getReport();
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `performance-report-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    stop() {
        this.observers.forEach(observer => observer.disconnect());
        this.isMonitoring = false;
        console.log('🛑 Performance Monitor parado');
    }
}

// Auto-inicializar se estiver em desenvolvimento
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.performanceMonitor = new RealTimePerformanceMonitor({
        enableConsoleOutput: true,
        enableVisualOverlay: true
    });
    
    // Adicionar comandos globais
    window.exportPerformanceData = () => window.performanceMonitor.exportData();
    window.getPerformanceReport = () => window.performanceMonitor.getReport();
    
    console.log('🎯 Performance Monitor ativo! Use exportPerformanceData() para salvar dados.');
}

// Exportar para uso em outros contextos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RealTimePerformanceMonitor;
} 