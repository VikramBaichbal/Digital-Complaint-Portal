// js/tracking.js

// Fetch a complaint by its unique reference number (e.g., GP-2026-4829)
async function getComplaintByNumber(complaintNumber) {
    try {
        const { data: complaint, error } = await supabaseClient
            .from('complaints')
            .select('*')
            .eq('complaint_number', complaintNumber.trim().toUpperCase())
            .single();

        if (error) throw error;

        // Fetch audit history for this complaint
        const { data: history, error: historyError } = await supabaseClient
            .from('complaint_history')
            .select(`
                *,
                profiles:updated_by (full_name, role)
            `)
            .eq('complaint_id', complaint.id)
            .order('created_at', { ascending: true });

        if (historyError) throw historyError;

        return { success: true, complaint, history };
    } catch (error) {
        console.error('Tracking Error:', error.message);
        return { success: false, error: 'Complaint not found or you do not have permission to view it.' };
    }
}

// Fetch a single complaint by its UUID (used on complaint-details.html)
async function getComplaintById(complaintId) {
    try {
        const { data: complaint, error } = await supabaseClient
            .from('complaints')
            .select(`
                *,
                profiles:user_id (full_name, email, phone, village)
            `)
            .eq('id', complaintId)
            .single();

        if (error) throw error;

        // Fetch audit history
        const { data: history, error: historyError } = await supabaseClient
            .from('complaint_history')
            .select(`
                *,
                profiles:updated_by (full_name, role)
            `)
            .eq('complaint_id', complaint.id)
            .order('created_at', { ascending: true });

        if (historyError) throw historyError;

        return { success: true, complaint, history };
    } catch (error) {
        console.error('Details Fetch Error:', error.message);
        return { success: false, error: error.message };
    }
}

window.trackingModule = {
    getComplaintByNumber,
    getComplaintById
};