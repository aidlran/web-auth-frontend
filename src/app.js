import {manageForm} from './forms.js';

const errorCookie = 'X-Form-Error=';

const formElement = document.forms.item(0);
const errorElement = document.createElement('p');

function readCookie() {
	for (let chunk of document.cookie.split(';')) {
		while (chunk.charAt(0) === ' ') chunk = chunk.substring(1, chunk.length);
		if (chunk.indexOf(errorCookie) === 0) return chunk.substring(errorCookie.length, chunk.length);
	}
	return null;
}

function showError() {
	const error = readCookie();
	if (error) {
		errorElement.innerText = decodeURI(error);
		errorElement.classList.add('error');
		formElement.append(errorElement);
	}
}

function showMessage(message) {
	errorElement.innerText = message;
	errorElement.classList.remove('error');
	formElement.append(errorElement);
}

// Check if there is a form error that needs displaying
showError();

// Hide the error when form is submitted
formElement.addEventListener('submit', () => errorElement.innerHTML = "&nbsp;");

// Enable asynchronous form fetch
manageForm()
	.setFetchParams({redirect: 'manual'})
	.setSubmitResponseCallback(fetch => fetch
		.then(response => {
			if (response.type === 'opaqueredirect') showError();
			else switch (response.status) {
				case 200: return showMessage("Logged in successfully.");
				case 404: return showMessage("Not yet implemented.");
				default: throw Error("Unexpected fetch response.");
			}
		})
		.catch(console.log)
	);
