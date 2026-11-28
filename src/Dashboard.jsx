import { supabase } from './supabaseClient';
import MyGames from './MyGames';
import SearchGames from './Searchgames';
import { useState } from 'react';
function Dashboard({ user }) 
{
    const username =user.user_metadata?.username || 'Player';

    async function handleLogout()
    {
        const { error } = await supabase.auth.signOut();

        if (error)
        {
            alert('Logout failed: ' + error.message);
            return;
        }

        alert('Logged out!!');
    }
    const [refreshGames, setRefreshGames] = useState(0);

    function handleGameAdded()
    {
        setRefreshGames((current) => current + 1);
    }
    return (
        <div>
            <h2>Welcome, {username}!</h2>
            <h3>Game collection Database</h3>

            <p>Manage your personal game collection here!</p>
            
            <button>My collection</button>
            <MyGames user={user} refreshGames={refreshGames} />
            <SearchGames user={user} onGameAdded={handleGameAdded} />
            <button type="button" onClick={handleLogout}>
  Logout
</button>
        </div>
    );
}
export default Dashboard;