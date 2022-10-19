import { Command } from "../../types/global";

import { Client, ClientOptions, Collection } from "discord.js";
import { QueueManager } from "./queue-manager";

export class ExtendedClient extends Client {
  public commands?: Collection<unknown, Command>
  public queues?: Map<string, QueueManager> 

  constructor(options: ClientOptions) {
    super(options)
  }
}