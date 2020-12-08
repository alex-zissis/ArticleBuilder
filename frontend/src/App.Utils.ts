export const getRandomString = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

function ArticleBuilderFetch<ResponseType = object>(url: string, config: RequestInit = {}, body?: object) {
    const headers = new Headers();
    if (body) {
        config.body = JSON.stringify(body);
        headers.append('Content-Type', 'application/json');
    }
    config.headers = headers;

    return fetch(url, config).then(res => {
        if (res.ok) {
            return res.json() as Promise<ResponseType>;
        }

        throw Error();
    });
}

export {ArticleBuilderFetch};