#!/usr/bin/env node
import gcloud from '@battis/partly-gcloudy';
import options from './options.mjs';

const args = await gcloud.init({ args: { options } });
await gcloud.batch.appEnginePublish(args.values);
