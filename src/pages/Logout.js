//Logout.js
import { supabase } from '../supabaseClient'; // Correct import path

export async function logout() {
    const { error } = await supabase.auth.signOut(); // Sign out the user

    if (error) {
        console.error('Error logging out:', error.message);
        return false; // Indicate failure
    }

    console.log('User logged out successfully');
    return true; // Indicate success
}