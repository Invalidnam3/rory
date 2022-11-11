import { AudioPlayer, createAudioPlayer, createAudioResource, getVoiceConnection, VoiceConnection } from "@discordjs/voice"
import * as youtubedl from 'youtube-dl-exec'
import { Song } from "./song"

export class QueueManager {
  public guildId: string
  public queue: Song[]
  public audioPlayer: AudioPlayer

  private listeningToVoiceConnection: boolean

  constructor(guildId: string) {
    this.guildId = guildId
    this.queue = []
    this.audioPlayer = createAudioPlayer()

    this.registerAudioPlayerEvents()
    this.registerVoiceConnectionEvents()
  }

  public async play(song: Song): Promise<void> {
    const voiceConnection = getVoiceConnection(this.guildId)
    console.log('Currente queue:', this.queue)
    if (
      voiceConnection 
      && this.queue.length > 0
      && this.audioPlayer.state.status !== 'playing') {
      console.log(`Trying to reproduce ${song.title}`)
      const process = youtubedl.exec(song.url, {
        format: 'ba',
        output: '-'
      })
      const resource = createAudioResource(process.stdout)
      this.audioPlayer.play(resource)
      voiceConnection.subscribe(this.audioPlayer)
    }
  }

  public skip(): void {
    console.log(`Skipped ${this.queue[0].title}`)
    if (this.audioPlayer.state.status === 'playing') {
      this.audioPlayer.stop(true)
    }
  }

  public registerVoiceConnectionEvents(): void {
    const voiceConnection = getVoiceConnection(this.guildId)
    if (voiceConnection && !this.listeningToVoiceConnection) {
      console.log('Registering VoiceConnection Listeners')
      voiceConnection.on('stateChange', async (oldState, newState) => {
        if (newState.status.toString() === 'disconnected') {
          console.log('Cleaning the Queue and stopping audioPlayer')
          this.queue = []
          this.audioPlayer.stop(true)
          this.listeningToVoiceConnection = false
        }
      })
      this.listeningToVoiceConnection = true
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

