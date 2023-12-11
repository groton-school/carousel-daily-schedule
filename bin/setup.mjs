#!/usr/bin/env node
import gcloud from '@battis/partly-gcloudy';
import options from './options.mjs';

await gcloud.init({ args: { options } });
await gcloud.batch.appEnginePublish();
