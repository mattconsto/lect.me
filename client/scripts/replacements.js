/*
	URL Replacements
*/

export const urlReplacements = {
	'dailymotion.com/video/([a-zA-Z0-9\-_]+)':   'https://dailymotion.com/embed/video/%2$s',
	'gfycat.com/([a-zA-Z0-9]+)':                 'https://gfycat.com/ifr/%2$s',
	'twitch.tv/videos/([0-9]+)$':                'https://player.twitch.tv/?video=%2$s',
	'twitch.tv/([a-zA-Z0-9\-_]+)$':              'https://player.twitch.tv/?channel=%2$s',
	'youtube\.com\/watch?.+v=([a-zA-Z0-9\-_]+)': 'https://youtube.com/embed/%2$s',
	'vimeo.com/([0-9]+)':                        'https://player.vimeo.com/video/%2$s'
};