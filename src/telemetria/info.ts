import { NodeSDK } from '@opentelemetry/sdk-node';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';
import { ConsoleMetricExporter, PeriodicExportingMetricReader, MeterProvider } from '@opentelemetry/sdk-metrics';
import { LoggerProvider, BatchLogRecordProcessor, ConsoleLogRecordExporter } from '@opentelemetry/sdk-logs';
import { PinoInstrumentation } from '@opentelemetry/instrumentation-pino';
import { MongoDBInstrumentation } from '@opentelemetry/instrumentation-mongodb';
import { FsInstrumentation } from '@opentelemetry/instrumentation-fs';
import { metrics } from '@opentelemetry/api';

const loggerProvider = new LoggerProvider();

const meterProvider = new MeterProvider({
  readers: [
    new PeriodicExportingMetricReader({
      exporter: new ConsoleMetricExporter(),
      exportIntervalMillis: 10000,
    }),
  ],
});

metrics.setGlobalMeterProvider(meterProvider);

const sdk = new NodeSDK({
  serviceName: 'internatura-backend',
  traceExporter: new ConsoleSpanExporter(),
  logRecordProcessor: new BatchLogRecordProcessor(
    new ConsoleLogRecordExporter()
  ),
  instrumentations: [
    new PinoInstrumentation(),
    new MongoDBInstrumentation({
      enhancedDatabaseReporting: true,
    }),
    new FsInstrumentation(),
  ],
});

sdk.start();
console.log('\n========================================');
console.log('✅ OpenTelemetry успешно запущен');
console.log('📊 Трейсы, метрики и логи будут экспортироваться в консоль');
console.log('========================================\n');

const meter = metrics.getMeter('test-meter');

const requestCounter = meter.createCounter('http.requests.total', {
  description: 'Общее количество HTTP запросов',
});

const responseTimeHistogram = meter.createHistogram('http.response.duration', {
  description: 'Время ответа HTTP запросов',
  unit: 'ms',
});

const activeConnectionsGauge = meter.createUpDownCounter('http.active.connections', {
  description: 'Количество активных соединений',
});

requestCounter.add(1, { method: 'INIT', status: 'started' });

console.log('⏳ Ожидание экспорта метрик (5 секунд)...\n');

process.on('SIGINT', async () => {
  console.log('\n🛑 Получен сигнал SIGINT, завершаем работу...');
  try {
    await meterProvider.shutdown();
    await sdk.shutdown();
    console.log('✅ OpenTelemetry корректно остановлен');
    process.exit(0);
  } catch (error: unknown) {
    console.error('❌ Ошибка при остановке OpenTelemetry:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Получен сигнал SIGTERM, завершаем работу...');
  try {
    await meterProvider.shutdown();
    await sdk.shutdown();
    console.log('✅ OpenTelemetry корректно остановлен');
    process.exit(0);
  } catch (error: unknown) {
    console.error('❌ Ошибка при остановке OpenTelemetry:', error);
    process.exit(1);
  }
});

process.on('unhandledRejection', async (reason: unknown) => {
  console.error('❌ Необработанное отклонение промиса:', reason);
  try {
    await meterProvider.shutdown();
    await sdk.shutdown();
  } catch (error: unknown) {
    console.error('❌ Ошибка при остановке OpenTelemetry:', error);
  }
  process.exit(1);
});

export { requestCounter, responseTimeHistogram, activeConnectionsGauge };
export default sdk;