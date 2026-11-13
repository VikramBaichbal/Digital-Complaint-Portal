// js/auth.js

// Register a new citizen account
async function registerUser(fullName, email, password, phone, village) {
    try {
        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: fullName,
                    phone: phone,
                    village: village,
                    role: 'citizen'
                }
            }
        });

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Registration Error:', error.message);
        return { success: false, error: error.message };
    }
}

// Log in an existing user (Citizen or Admin)
async function loginUser(email, password) {
    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) throw error;

        const user = data.user;
        const { data: profile, error: profileError } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profileError) throw profileError;

        return { success: true, profile };
    } catch (error) {
        console.error('Login Error:', error.message);
        return { success: false, error: error.message };
    }
}

// Log out the current user
async function logoutUser() {
    try {
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Logout Error:', error.message);
    }
}

// Check current session and enforce route protection
async function checkUserSession(requiredRole = null) {
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    
    if (error || !session) {
        window.location.href = 'login.html';
        return null;
    }

    const { data: profile, error: profileError } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

    if (profileError || !profile) {
        window.location.href = 'login.html';
        return null;
    }

    if (requiredRole && profile.role !== requiredRole) {
        alert('Unauthorized access! Redirecting to your dashboard.');
        window.location.href = profile.role === 'admin' ? 'admin-dashboard.html' : 'citizen-dashboard.html';
        return null;
    }

    return profile;
}
// Send password reset email
async function sendPasswordReset(email) {
    try {
        const redirectUrl = `${window.location.origin}/reset-password.html`;
        const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
            redirectTo: redirectUrl
        });

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Password Reset Error:', error.message);
        return { success: false, error: error.message };
    }
}

// Update password after user clicks the email recovery link
async function updateUserPassword(newPassword) {
    try {
        const { error } = await supabaseClient.auth.updateUser({
            password: newPassword
        });

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Update Password Error:', error.message);
        return { success: false, error: error.message };
    }
}
window.authModule = {
    registerUser,
    loginUser,
    logoutUser,
    checkUserSession,
    sendPasswordReset,
    updateUserPassword
};