

// import Cookies from 'js-cookie';
export const csrfFetch = async (url, options = {}) => {
	options.method = options.method || 'GET';
	options.headers = options.headers || {};

	if (options.method.toUpperCase() !== 'GET') {
		options.headers['Content-Type'] =
			options.headers['Content-Type'] || 'application/json';
		options.headers['X-CSRF-Token'] = getCSRFToken();
	}

	options.credentials = 'include'; // Ensure cookies are sent

	return fetch(url, options);
};

function getCSRFToken() {
	return document.cookie
		.split('; ')
		.find((row) => row.startsWith('csrf_token='))
		?.split('=')[1];
}

export function restoreCSRF() {
    return csrfFetch('/api/csrf/restore');
}

