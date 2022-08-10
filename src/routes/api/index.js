//proxying digitalnz get

const digitalnz = `https://api.digitalnz.org/v3/records.json`;

// @ts-ignore
export async function get(request) {
	let searchstring = request.url.search;
	let resp = fetch(digitalnz + searchstring).then((response) => response.json());

	return {
		status: 200,
		body: await resp
	};
}
