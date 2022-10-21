interface ISongProperties {
  title: string
  url: string
}

export class Song {
  title: string
  url: string
  constructor(properties: ISongProperties) {
    this.title = properties.title
    this.url = properties.url
  }
}