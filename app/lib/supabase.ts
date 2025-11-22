import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from "@supabase/ssr"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Storage configuration
const BUCKET_NAME = 'rdesys-test-tool'
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export function createSupabaseClient() {
    return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const submitResponse = async (data: any) => {
    const { error } = await supabase.from('responses').insert(data);
    if (error) {
        console.error('Error submitting response:', error.message);
        return error;
    }
    return null;
};

export const submitOverallForm = async (data: any) => {
    const { error } = await supabase.from('overall_evaluation').insert(data);
    if (error) {
        console.error('Error submitting response:', error.message);
        return error;
    }
    return null;
}

export const getTestCases = async (userType: string, testId: string) => {
    const { data, error } = await supabase
        .from('test_cases')
        .select('*')
        .eq('user_type', userType)
        .like('test_id', `${testId}%`)
        .order('test_id', { ascending: true });

    if (error) {
        console.error('Error fetching test cases:', error.message);
    }
    return data || [];
}

export const getStepsToTestCases = async (testId: number) => {
    const { data, error } = await supabase
        .from('steps')
        .select('*')
        .eq('test_id', testId)
        .single();

    return data || null;
}

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
    if (!file.type.startsWith('image/')) {
        return { valid: false, error: 'Please select an image file' }
    }

    if (file.size > MAX_FILE_SIZE) {
        return { valid: false, error: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB` }
    }

    return { valid: true }
}

// Generate unique filename
const generateFileName = (file: File): string => {
    const fileExt = file.name.split('.').pop()
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    
    return `${timestamp}-${randomString}.${fileExt}`
}

// Upload image to Supabase Storage
export const uploadImage = async (file: File): Promise<{ 
    success: boolean; 
    url?: string; 
    error?: string 
    }> => {
    try {
        // Validate file
        const validation = validateImageFile(file)
        if (!validation.valid) {
        return { success: false, error: validation.error }
        }

        // Generate unique filename
        const fileName = generateFileName(file)

        // Upload to Supabase Storage
        const { data, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
        })

        if (uploadError) {
        return { success: false, error: uploadError.message }
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName)

        return { success: true, url: publicUrl }

    } catch (error: any) {
        return { success: false, error: error.message || 'Error uploading file' }
    }
}

// Delete image from storage
export const deleteImage = async (fileUrl: string): Promise<{ 
    success: boolean; 
    error?: string 
    }> => {
    try {
        // Extract filename from URL
        const fileName = fileUrl.split('/').pop()
        if (!fileName) {
        return { success: false, error: 'Invalid file URL' }
        }

        const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([fileName])

        if (error) {
        return { success: false, error: error.message }
        }

        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message || 'Error deleting file' }
    }
}
