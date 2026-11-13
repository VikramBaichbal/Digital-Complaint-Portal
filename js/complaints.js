// js/complaints.js

// Generate unique complaint reference ID (e.g., GP-2026-4829)
function generateComplaintNumber() {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `GP-${year}-${randomNum}`;
}

// Upload complaint photo to Supabase Storage
async function uploadComplaintImage(file, userId) {
    if (!file) return null;

    // Validate size (max 5MB) and MIME type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Only JPG, PNG, and WebP images are allowed.');
    }
    if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size exceeds 5MB limit.');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}_${Date.now()}.${fileExt}`;

    const { data, error } = await supabaseClient.storage
        .from('complaint-images')
        .upload(fileName, file);

    if (error) throw error;

    // Retrieve public URL
    const { data: urlData } = supabaseClient.storage
        .from('complaint-images')
        .getPublicUrl(fileName);

    return urlData.publicUrl;
}

// Submit a new complaint to Supabase
async function submitComplaint(userId, formData, imageFile) {
    try {
        let imageUrl = null;
        if (imageFile) {
            imageUrl = await uploadComplaintImage(imageFile, userId);
        }

        const complaintNumber = generateComplaintNumber();

        const { data, error } = await supabaseClient
            .from('complaints')
            .insert([{
                complaint_number: complaintNumber,
                user_id: userId,
                category: formData.category,
                subject: formData.subject,
                description: formData.description,
                village: formData.village,
                location: formData.location,
                image_url: imageUrl,
                status: 'Submitted'
            }])
            .select()
            .single();

        if (error) throw error;

        return { success: true, complaint: data };
    } catch (error) {
        console.error('Complaint Submission Error:', error.message);
        return { success: false, error: error.message };
    }
}

// Fetch all complaints belonging to the logged-in citizen
async function getUserComplaints(userId) {
    try {
        const { data, error } = await supabaseClient
            .from('complaints')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { success: true, complaints: data };
    } catch (error) {
        console.error('Fetch Complaints Error:', error.message);
        return { success: false, error: error.message };
    }
}

window.complaintsModule = {
    submitComplaint,
    getUserComplaints
};