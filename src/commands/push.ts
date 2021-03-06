import { uploader } from '../utils/uploader';
import { linker } from '../utils/linker';
import { wrapAsync } from '../utils/wrap-async';

export function push(vorpal: any) {
  vorpal
    .command('push')
    .description('Upload, link IPNS, and link Ethereum in one go.')
    .action(function(args: any, callback: () => void) {
      uploader(vorpal, args, callback).then(() => linker(vorpal, args, callback));
    });
}
