

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

	// console.log('CSRF token:', getCSRFToken());

	return fetch(url, options);
};

function getCSRFToken() {
	return document.cookie
		.split('; ')
		.find((row) => row.startsWith('csrf_token='))
		?.split('=')[1];
}


// export async function csrfFetch( url, options = {} ) {

//     options.method = options.method || 'GET';

// 		options.headers = options.headers || {};

// 		options.credentials = 'include';

// 		if (options.method.toUpperCase() !== 'GET') {
// 			const token = document.cookie
// 				.split('; ')
// 				.find((row) => row.startsWith('csrf_token='))
// 				.split('=')[1];
// 			options.headers['X-CSRF-Token'] = token;
// 			options.headers['Content-Type'] =
// 				options.headers['Content-Type'] || 'application/json';
// 			options.headers['XSRF-Token'] = Cookies.get('XSRF-TOKEN');
// 		}

// 		const res =
// 			(await window.fetch(url, options)) || (await fetch(url, options));

// 		if (res.status >= 400) throw res;

// 		if (!res.ok) {
// 			throw new Error(res.statusText);
// 		}

// 		return res;

// }

export function restoreCSRF() {
    return csrfFetch('/api/csrf/restore');
}

