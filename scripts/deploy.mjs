import gcloud from '@battis/partly-gcloudy';
import CLI from '@battis/qui-cli';

await CLI.env.configure();
const args = await CLI.init({
  opt: {
    name: {
      description: 'Google Cloud project name',
      default: 'Carousel Daily Schedule'
    },
    billingAccountId: {
      description: 'Google Cloud billing account ID for this project'
    },
    region: {
      description: 'Google Cloud region in which to create App Engine instance'
    }
  }
});
try {
  await gcloud.batch.appEngineDeployAndCleanup({
    ...args.values,
    retainVersions: 2
  });
  CLI.log.info('Deploy complete.');
} catch (e) {
  CLI.log.error(e);
}
