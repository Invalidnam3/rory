import { AudioPlayer, createAudioPlayer, createAudioResource, getVoiceConnection, VoiceConnection } from "@discordjs/voice"
import * as youtubedl from 'youtube-dl-exec'
import { Song } from "./song"

export class QueueManager {
  public guildId: string
  public queue: Song[]

  private voiceConnection: VoiceConnection
  private audioPlayer: AudioPlayer

  constructor(guildId: string) {
    this.guildId = guildId
    this.queue = []
    this.audioPlayer = createAudioPlayer()

    this.registerAudioPlayerEvents()
  }

  public async play(song: Song): Promise<void> {
    this.voiceConnection = getVoiceConnection(this.guildId)
    console.log('Currente queue:', this.queue)
    if (
      this.voiceConnection 
      && this.queue.length > 0
      && this.audioPlayer.state.status !== 'playing') {
      console.log(`Trying to reproduce ${song.title}`)
      const process = youtubedl.exec(song.url, {
        format: 'ba',
        output: '-'
      })
      const resource = createAudioResource(process.stdout)
      this.audioPlayer.play(resource)
      this.voiceConnection.subscribe(this.audioPlayer)
    }
  }

  public skip(): void {
    console.log(`Skipped ${this.queue[0].title}`)
    if (this.audioPlayer.state.status === 'playing') {
      this.audioPlayer.stop(true)
    }
  }

  private registerAudioPlayerEvents(): void {
    this.audioPlayer.on('stateChange', async (oldState, newState) => {
      // Song stopped playing and audioPlayer is now available
      if (oldState.status === 'playing' && newState.status === 'idle') {
        // Play next song available in the Queue if any
        this.queue.shift()
        if (this.queue.length > 0) this.play(this.queue[0])
      }
    })
  }
}

