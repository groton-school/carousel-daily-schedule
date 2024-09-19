#!/usr/bin/env node
import gcloud from '@battis/partly-gcloudy';
import options from './options.json' assert { type: 'json' };

const args = await gcloud.init({ args: { options } });
await gcloud.batch.appEnginePublish(args.values);
