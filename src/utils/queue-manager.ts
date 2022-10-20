import { AudioPlayer, createAudioPlayer, createAudioResource, getVoiceConnection, VoiceConnection } from "@discordjs/voice"
import * as youtubedl from 'youtube-dl-exec'

export class QueueManager {
  public guildId: string
  public queue: string[]

  private voiceConnection: VoiceConnection
  private audioPlayer: AudioPlayer

  constructor(guildId: string) {
    this.guildId = guildId
    this.queue = []
    this.audioPlayer = createAudioPlayer()

    this.registerAudioPlayerEvents()
  }

  public play(): void {
    this.voiceConnection = getVoiceConnection(this.guildId)
    console.log(this.queue, this.audioPlayer.state.status)
    if (
      this.voiceConnection 
      && this.queue.length > 0
      && this.audioPlayer.state.status !== 'playing') {
      const process = youtubedl.exec(this.queue[0], {
        format: 'ba',
        output: '-'
      })
      const resource = createAudioResource(process.stdout)
      this.audioPlayer.play(resource)
      this.voiceConnection.subscribe(this.audioPlayer)
    }
  }

  public skip(): void {
    this.audioPlayer.stop(true)
    this.queue.shift()
    this.play()
  }

  private registerAudioPlayerEvents(): void {
    // For debuggin purpose 
    this.audioPlayer.on('stateChange', async (newState) => {
      const { status } = newState
      // Song is done buffering, which means it already stopped
      if (status === 'playing') {
        this.queue.shift()
        this.play()
      }
    })
  }
}