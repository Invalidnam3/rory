export function isValidYoutubeUrl(url: string): boolean {
  const regExp = new RegExp('^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?')
  return regExp.test(url)
}

export function getYoutubePlaylistId(url: string): string | null {
  const regExp = new RegExp(/[&?]list=([^&]+)/i)
  return regExp.exec(url) ? regExp.exec(url)[1]: null
}