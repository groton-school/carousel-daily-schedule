import gcloud from '@battis/partly-gcloudy';
import { Core } from '@battis/qui-cli.core';
import { OP } from '@battis/qui-cli.env/1Password.js';
import { Log } from '@battis/qui-cli.log';

await OP.configure();
const args = await Core.init({
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
  Log.info('Deploy complete.');
} catch (e) {
  Log.error(e);
}
