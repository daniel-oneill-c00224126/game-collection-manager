import { useState } from 'react';
import { supabase } from './supabaseClient';

function SearchGames({ user, onGameAdded })
{

    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

async function handleSearch(event)
{
    event.preventDefault();

    if (!search.trim())
    {
        return;
    }

    setLoading(true);
    setErrorMessage('');
    setResults([]);

    try
    {
        const response = await fetch(
            '/.netlify/functions/rawg-search?search=' +
            encodeURIComponent(search.trim())
        );

        if (!response.ok)
        {
            throw new Error('Search request failed');
        }

        const data = await response.json();
        setResults(data.results ?? []);
    }
    catch (error)
    {
        console.log('RAWG search error', error);
        setErrorMessage('Search request failed. Please try again later.');
    }
    finally
    {
        setLoading(false);
    }
}
async function handleAddGame(game)
{
    if (!user)
    {
        alert('You must be logged in to add a game.');
        return;
    }
    const { error } = await supabase
    .from('games')
    .insert({
        user_id: user.id,
        rawg_id: game.id,
        title: game.name,
        img_url: game.background_image,
        status: 'To Play'
    });

    if (error)
    {
        if (error.code === '23505') // Unique violation error code
        {
            alert('Game already exists in your collection.');
        }
        else
        {
            alert('Error adding game: ' + error.message);
        }
    }
    else
    {
        alert(game.name + ' added to your collection!');
        onGameAdded();
    }
}
    return (
        <div>
            <h2>Search for Games</h2>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Enter game name"
                    required
                />
                <button type="submit" disabled={loading}>
                    search
                </button>
            </form>
            {loading && <p>Searching Rawg...</p>}
            {errorMessage && <p>{errorMessage}</p>}

            <div>
                {results.map((game) => (
                    <div key={game.id}>
                        <h3>{game.name}</h3>
                        {game.background_image && (
                            <img
                                src={game.background_image}
                                alt={game.name}
                                width="150"
                            />
                        )}
                        <p>Released: {game.released || 'Unknown'}</p>
                        <button type="button" onClick={() => handleAddGame(game)}>
                            Add to My Collection
                        </button>
                    </div>
                ))}
            </div>
            <p>
                Game data provided by 
                <a href="https://rawg.io/" target="_blank" rel="noopener noreferrer">RAWG</a>
            </p>
            </div>
    );
}
export default SearchGames;
