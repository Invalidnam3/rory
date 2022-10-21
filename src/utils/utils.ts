export function isValidYoutubeUrl(text: string) {
	const regexp = new RegExp('^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?')
	return regexp.test(text)
}
