import {manageForm} from './forms.js';

const formElement = document.forms.item(0);
const errorElement = document.createElement('p');

function showMessage(message = "An unexpected error occurred", isError = true) {
	switch (typeof message) {
		case 'object':
			message.then(message => showMessage(message.split('\n')[0], isError));
			break;
		case 'string':
			errorElement.innerText = message;
			errorElement.classList[isError ? 'add' : 'remove']('error');
			formElement.append(errorElement);
	}
}

// Hide the error when form is submitted
formElement.addEventListener('submit', () => errorElement.innerHTML = "&nbsp;");

// Enable asynchronous form fetch
manageForm()
	.setSubmitResponseCallback(fetch => fetch
		.then(response => {
			switch (response.status) {
				case 200:
					return showMessage(response.text(), false);
				case 400:
				case 403:
				case 500:
					return showMessage(response.text())
				case 303:
					return window.location.href = response.url;
				case 404:
					return showMessage("Not yet implemented.", false);
				default:
					showMessage();
					throw Error("Unexpected fetch response.");
			}
		})
		.catch(console.error)
	);
