import { queueService } from './services/queue';

async function startWorker() {
  console.log('Worker started... polling every 5 seconds');
  
  setInterval(async () => {
    await queueService.processNextJob();
  }, 5000);
}

// Start worker if not in test mode
if (require.main === module) {
  startWorker();
}
