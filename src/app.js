let error = readCookie('X-Form-Error');
if (error) document.forms.item(0).append(Object.assign(document.createElement('span'), {innerText: decodeURI(error)}));

function readCookie(name) {
	name = name + "=";
	for (let chunk of document.cookie.split(';')) {
		while (chunk.charAt(0) === ' ') chunk = chunk.substring(1, chunk.length);
		if (chunk.indexOf(name) === 0) return chunk.substring(name.length, chunk.length);
	}
	return null;
}
