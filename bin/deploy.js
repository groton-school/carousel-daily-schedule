import gcloud from '@battis/partly-gcloudy';
import cli from '@battis/qui-cli';

const args = await cli.init({
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
  cli.log.info('Deploy complete.');
} catch (e) {
  cli.log.error(e);
}
