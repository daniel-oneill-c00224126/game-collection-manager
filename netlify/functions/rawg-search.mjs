///.mjs stands for JavaScript Module. It's a file extension that tells Node.js to treat the file as an ECMAScript module (ES module).
export default async function handler(request)
{
    const apiKey = process.env.RAWG_API_KEY;

    if (!apiKey)
    {
        return Response.json(
            { error: 'RAWG API key is not set in environment variables' },
            { status: 500 }
        );
    }
    const requestUrl = new URL(request.url);
    const search = requestUrl.searchParams.get('search')?.trim();
    
    if (!search)
    {
        return Response.json(
            { error: 'Please provide a game to search for' },
            { status: 400 }
        );
    }
    
    if (search.length > 100)
    {
        return Response.json(
            { error: 'Search term is too long. Please limit to 100 characters.' },
            { status: 400 }
        );
    }
    const rawgUrl = new URL('https://api.rawg.io/api/games');
    rawgUrl.searchParams.set('key', apiKey);
    rawgUrl.searchParams.set('search', search);
    rawgUrl.searchParams.set('page_size', '10');

    try
    {
        const response = await fetch(rawgUrl);

        if (!response.ok)
        {
            return Response.json(
                { error: 'Rawg request failed' },
                { status: 502 }
            );
        }

        const data = await response.json();
        return Response.json(({
            results: (data.results ?? []).map(game => ({
                id: game.id,
                name: game.name,
                background_image: game.background_image,
                released: game.released
            }))
        }));
    }
    catch (error)
    {
        console.error('rawg request error:', error);

        return Response.json(
            { error: 'Rawg request failed' },
            { status: 502 }
        );
    }
}