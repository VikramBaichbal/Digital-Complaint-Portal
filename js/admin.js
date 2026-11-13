// js/admin.js

// Fetch all complaints across the Gram Panchayat with citizen profile details
async function getAllComplaints() {
    try {
        const { data, error } = await supabaseClient
            .from('complaints')
            .select(`
                *,
                profiles:user_id (full_name, email, phone, village)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { success: true, complaints: data };
    } catch (error) {
        console.error('Admin Fetch Complaints Error:', error.message);
        return { success: false, error: error.message };
    }
}

// Update complaint status, staff assignment, and log entry into complaint_history
async function updateComplaintStatus(complaintId, previousStatus, newStatus, assignedTo, remarks, adminId) {
    try {
        // 1. Update main complaint record
        const { error: updateError } = await supabaseClient
            .from('complaints')
            .update({
                status: newStatus,
                assigned_to: assignedTo || null,
                updated_at: new Date().toISOString()
            })
            .eq('id', complaintId);

        if (updateError) throw updateError;

        // 2. Insert audit log into complaint_history
        const { error: historyError } = await supabaseClient
            .from('complaint_history')
            .insert([{
                complaint_id: complaintId,
                previous_status: previousStatus,
                new_status: newStatus,
                remarks: remarks || null,
                updated_by: adminId
            }]);

        if (historyError) throw historyError;

        return { success: true };
    } catch (error) {
        console.error('Admin Update Status Error:', error.message);
        return { success: false, error: error.message };
    }
}

window.adminModule = {
    getAllComplaints,
    updateComplaintStatus
};