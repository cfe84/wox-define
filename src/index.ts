import { Logger } from "./woxlib/Logger";
import { WoxDefineHandler } from "./WoxDefineHandler";
import { WoxQueryProcessor } from "./woxlib/WoxQueryProcessor";

const logger = new Logger();
const handler = new WoxDefineHandler(logger);
const processor = new WoxQueryProcessor(handler, logger);
processor.processFromCommandLineAsync(process.argv).then(() => {});
