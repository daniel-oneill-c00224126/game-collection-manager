import { supabase } from './supabaseClient';
import MyGames from './MyGames';
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
    return (
        <div>
            <h2>Welcome, {username}!</h2>
            <h3>Game collection Database</h3>

            <p>Manage your personal game collection here!</p>
            
            <button>My collection</button>
            <MyGames user={user} />
            <button>Search for games</button>
            <button>My ratings</button>
            <button type="button" onClick={handleLogout}>
  Logout
</button>
        </div>
    );
}
export default Dashboard;