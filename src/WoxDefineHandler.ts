import { Logger } from "./woxlib/Logger";
import { IWoxQueryHandler } from "./woxlib/IWoxQueryHandler";
import { JsonRPCAction } from "./woxlib/JsonRPCAction";
import { ResultItem } from "./woxlib/ResultItem";
import { Result } from "./woxlib/Result";
import * as fs from "fs";
import * as open from "open";
import { Definition } from "./Definition";

interface FoundDefinition {
  word: string;
  definition: string;
}

export class WoxDefineHandler implements IWoxQueryHandler {
  constructor(private logger: Logger) {}

  search(term: string): FoundDefinition[] {
    term = term.toLowerCase();
    const definitions: Definition = JSON.parse(
      fs.readFileSync("dictionary.json").toString()
    );
    const matching = Object.keys(definitions)
      .filter((word: any) => word.startsWith(term))
      .sort();
    return matching.map((word) => ({
      word,
      definition: definitions[word],
    }));
  }

  async processAsync(rpcAction: JsonRPCAction): Promise<Result> {
    if (rpcAction.method === "query") {
      const word = rpcAction.parameters.join(" ");
      const results = this.search(word).map((res) => ({
        IcoPath: "dictionary.png",
        JsonRPCAction: {
          method: "openUrl",
          parameters: [`https://www.dictionary.com/browse/${res.word}`],
        },
        Subtitle: res.definition,
        Title: res.word,
      }));

      return {
        result: results,
      };
    } else if (rpcAction.method === "openUrl") {
      open(rpcAction.parameters[0]);
    } else {
      this.logger.log(JSON.stringify(rpcAction));
    }
    return {
      result: [],
    };
  }
}
