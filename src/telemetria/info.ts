import { NodeSDK } from '@opentelemetry/sdk-node';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';
import { ConsoleMetricExporter, PeriodicExportingMetricReader, MeterProvider } from '@opentelemetry/sdk-metrics';
import { BatchLogRecordProcessor, ConsoleLogRecordExporter } from '@opentelemetry/sdk-logs';
import { PinoInstrumentation } from '@opentelemetry/instrumentation-pino';
import { MongoDBInstrumentation } from '@opentelemetry/instrumentation-mongodb';
import { FsInstrumentation } from '@opentelemetry/instrumentation-fs';
import { metrics } from '@opentelemetry/api';

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
  logRecordProcessors: [
    new BatchLogRecordProcessor(new ConsoleLogRecordExporter())
  ],
  instrumentations: [
    new PinoInstrumentation(),
    new MongoDBInstrumentation({
      enhancedDatabaseReporting: true,
    }),
    new FsInstrumentation(),
  ],
});

sdk.start();
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

async function gracefulShutdown(signal: string) {
  console.log(`\n🛑 Получен сигнал ${signal}, завершаем работу...`);
  let exitCode = 0;
  try {
    await sdk.shutdown();
    await meterProvider.shutdown();
  } catch (error: unknown) {
    console.error('❌ Ошибка при остановке OpenTelemetry:', error);
    exitCode = 1;
  }
  process.exit(exitCode);
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('unhandledRejection', async (reason: unknown) => {
  console.error('❌ Необработанное отклонение промиса:', reason);
  await gracefulShutdown('unhandledRejection');
});
process.on('uncaughtException', async (error: unknown) => {
  console.error('❌ Необработанное исключение:', error);
  await gracefulShutdown('uncaughtException');
});
process.on('beforeExit', async (code) => {
  if (code === 0) {
    await gracefulShutdown('beforeExit');
  }
});
export { requestCounter, responseTimeHistogram, activeConnectionsGauge };
export default sdk;