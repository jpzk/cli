import { uploader } from '../utils/uploader';
import { linker } from '../utils/linker';
import { wrapAsync } from '../utils/wrap-async';

export function upload(vorpal: any) {
  vorpal
  .command('upload')
  .description('Uploads scene to IPFS and updates IPNS.')
  .option('-p, --port <number>', 'IPFS daemon API port (default is 5001).')
  .action(wrapAsync(async function (args: any, callback: () => void) {
    await uploader(vorpal, args, callback);
    callback();
  }));
}
