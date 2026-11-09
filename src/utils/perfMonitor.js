/**
 * APP FACTORY — Low-End Device Performance & Battery Monitor
 * Author: QA Automation Lead (Ex-BrowserStack) & Staff PWA Engineer
 */

export class PerformanceMonitor {
  constructor() {
    this.metrics = {
      fcpMs: 0,
      memoryHeapMb: 0,
      isLowEndDevice: false,
      batteryLevel: 1.0,
      isCharging: true
    };

    this.auditDeviceProfile();
  }

  /**
   * Assesses device hardware constraints (RAM, CPU cores)
   */
  auditDeviceProfile() {
    if (typeof navigator !== 'undefined') {
      const ramGb = navigator.deviceMemory || 4;
      const cores = navigator.hardwareConcurrency || 4;
      this.metrics.isLowEndDevice = ramGb <= 2 || cores <= 4;
    }

    if (typeof performance !== 'undefined' && performance.memory) {
      this.metrics.memoryHeapMb = Math.round(performance.memory.usedJSHeapSize / (1024 * 1024));
    }
  }

  /**
   * Reads battery level asynchronously if Battery Status API is available
   * @returns {Promise<{ level: number, charging: boolean }>}
   */
  async getBatteryStatus() {
    if (typeof navigator !== 'undefined' && typeof navigator.getBattery === 'function') {
      try {
        const battery = await navigator.getBattery();
        this.metrics.batteryLevel = Math.round(battery.level * 100);
        this.metrics.isCharging = battery.charging;
        return {
          level: this.metrics.batteryLevel,
          charging: this.metrics.isCharging
        };
      } catch (e) {
        // Battery API may be restricted in some browsers
      }
    }
    return { level: 100, charging: true };
  }

  /**
   * Measures execution time of a synchronous or asynchronous task
   * @param {string} taskName
   * @param {Function} taskFn
   * @returns {Promise<{ durationMs: number, result: any }>}
   */
  async measureTask(taskName, taskFn) {
    const start = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const result = await taskFn();
    const end = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const durationMs = Math.round((end - start) * 100) / 100;

    return {
      taskName,
      durationMs,
      result
    };
  }
}
