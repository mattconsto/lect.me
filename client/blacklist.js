/* 
	Extension blacklist
	http://www.computerhope.com/issues/ch001789.htm
*/

export const extensionBlacklist = {
	// Audio
	'aif': 'audio',
	'cda': 'audio',
	'mid': 'audio',
	'midi': 'audio',
	'mp2': 'audio',
	'mp3': 'audio',
	'mpa': 'audio',
	'ogg': 'audio',
	'wav': 'audio',
	'wma': 'audio',
	'wpl': 'audio',

	// Compressed files
	'7z': 'compressed',
	'arj': 'compressed',
	'deb': 'compressed',
	'pkg': 'compressed',
	'rar': 'compressed',
	'rpm': 'compressed',
	'gz': 'compressed',
	'z': 'compressed',
	'zip': 'compressed',

	// Disc images
	'bin': 'download',
	'dmg': 'download',
	'iso': 'download',
	'toast': 'download',
	'vcd': 'download',

	// Databases
	'csv': 'webpage',
	'dat': 'webpage',
	'db': 'download',
	'log': 'webpage',
	'mdb': 'download',
	'sav': 'webpage',
	'sql': 'webpage',
	'tar': 'download',
	'xml': 'webpage',

	// Executables
	'apk': 'invalid',
	'bat': 'invalid',
	'bin': 'invalid',
	'com': 'invalid',
	'exe': 'invalid',
	'gadget': 'invalid',
	'jar': 'invalid',
	'wsf': 'invalid',

	// Fonts
	'fnt': 'font',
	'fon': 'font',
	'otf': 'font',
	'ttf': 'font',

	// Images
	'ai': 'download',
	'bmp': 'picture',
	'cur': 'download',
	'gif': 'picture',
	'ico': 'picture',
	'jpeg': 'picture',
	'jpg': 'picture',
	'png': 'picture',
	'ps': 'picture',
	'psd': 'download',
	'svg': 'picture',
	'tif': 'picture',
	'tiff': 'picture',

	// Webpages
	'asp': 'webpage',
	'aspx': 'webpage',
	'cer': 'download',
	'cfm': 'webpage',
	'css': 'webpage',
	'htm': 'webpage',
	'html': 'webpage',
	'js': 'webpage',
	'jsp': 'webpage',
	'part': 'invalid',
	'php': 'webpage',
	'rss': 'webpage',
	'xhtml': 'webpage',
	
	// Presentations
	'key': 'webpage',
	'odp': 'webpage',
	'pps': 'webpage',
	'ppt': 'webpage',
	'pptx': 'webpage',
	
	// Programming
	'c': 'webpage',
	'cgi': 'webpage',
	'class': 'invalid',
	'cpp': 'webpage',
	'.cs': 'webpage',
	'h': 'webpage',
	'java': 'webpage',
	'pl': 'webpage',
	'py': 'webpage',
	'sh': 'webpage',
	'swft': 'webpage',
	'vb': 'webpage',
	
	// Spreadsheets
	'ods': 'webpage',
	'xlr': 'webpage',
	'xls': 'webpage',
	'xlsx': 'webpage',
	
	// System
	'bak': 'invalid',
	'cab': 'invalid',
	'cfg': 'webpage',
	'cpl': 'invalid',
	'dll': 'invalid',
	'dmp': 'invalid',
	'drv': 'invalid',
	'icns': 'invalid',
	'ini': 'webpage',
	'lnk': 'webpage',
	'msi': 'invalid',
	'sys': 'invalid',
	'tmp': 'invalid',
	
	// Video
	'3g2': 'video',
	'3gp': 'video',
	'avi': 'video',
	'flv': 'video',
	'h264': 'video',
	'm4v': 'video',
	'mkv': 'video',
	'mov': 'video',
	'mp4': 'video',
	'mpg': 'video',
	'mpeg': 'video',
	'rm': 'video',
	'swf': 'video',
	'vob': 'download',
	'wmv': 'video',
	
	// Word
	'doc': 'webpage',
	'odt': 'webpage',
	'pdf': 'pdf',
	'rtf': 'webpage',
	'tex': 'webpage',
	'txt': 'webpage',
	'wks': 'webpage',
	'wps': 'webpage',
	'wpd': 'webpage',
}