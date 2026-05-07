interface AlertRule { id: string; deviceId: string; metric: 'soilMoisture' | 'temperature' | 'humidity' | 'lightLevel'; condition: 'above' | 'below'; threshold: number; severity: 'warning' | 'critical'; cooldownMinutes: number; }
interface Alert { id: string; ruleId: string; deviceId: string; metric: string; value: number; threshold: number; severity: string; message: string; triggeredAt: Date; acknowledged: boolean; }

const rules: AlertRule[] = [
  { id: 'rule-1', deviceId: '*', metric: 'soilMoisture', condition: 'below', threshold: 20, severity: 'critical', cooldownMinutes: 30 },
  { id: 'rule-2', deviceId: '*', metric: 'soilMoisture', condition: 'above', threshold: 85, severity: 'warning', cooldownMinutes: 15 },
  { id: 'rule-3', deviceId: '*', metric: 'temperature', condition: 'above', threshold: 45, severity: 'critical', cooldownMinutes: 60 },
  { id: 'rule-4', deviceId: '*', metric: 'temperature', condition: 'below', threshold: 5, severity: 'critical', cooldownMinutes: 60 },
  { id: 'rule-5', deviceId: '*', metric: 'humidity', condition: 'below', threshold: 20, severity: 'warning', cooldownMinutes: 30 },
];

const activeAlerts: Alert[] = [];
const lastTriggered = new Map<string, Date>();

export function evaluateReading(deviceId: string, reading: Record<string, number>): Alert[] {
  const triggered: Alert[] = [];

  for (const rule of rules) {
    if (rule.deviceId !== '*' && rule.deviceId !== deviceId) continue;
    const value = reading[rule.metric];
    if (value === undefined) continue;

    const shouldTrigger = rule.condition === 'above' ? value > rule.threshold : value < rule.threshold;
    if (!shouldTrigger) continue;

    const lastTime = lastTriggered.get(rule.id);
    if (lastTime && Date.now() - lastTime.getTime() < rule.cooldownMinutes * 60000) continue;

    const alert: Alert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      ruleId: rule.id,
      deviceId,
      metric: rule.metric,
      value,
      threshold: rule.threshold,
      severity: rule.severity,
      message: `${rule.metric} is ${rule.condition} threshold: ${value} (threshold: ${rule.threshold})`,
      triggeredAt: new Date(),
      acknowledged: false,
    };

    activeAlerts.push(alert);
    lastTriggered.set(rule.id, new Date());
    triggered.push(alert);
  }

  return triggered;
}

export function getActiveAlerts(deviceId?: string): Alert[] {
  return activeAlerts.filter((a) => !a.acknowledged && (!deviceId || a.deviceId === deviceId));
}

export function acknowledgeAlert(alertId: string): boolean {
  const alert = activeAlerts.find((a) => a.id === alertId);
  if (alert) { alert.acknowledged = true; return true; }
  return false;
}
