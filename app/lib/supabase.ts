import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from "@supabase/ssr"
import { use } from 'react';

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

export const getTestCases = async (userType?: string, testId?: string) => {
    console.log("userType", userType);
    if (userType == 'null') {
        const { data, error } = await supabase
            .from('test_cases')
            .select('*')
            .like('test_id', `${testId}%`)
            .order('order', { ascending: true });

        if (error) {
            console.error('Error fetching test cases:', error.message);
        }
        return data || [];
    } else {
        const { data, error } = await supabase
            .from('test_cases')
            .select('*')
            .eq('user_type', userType)
            .like('test_id', `${testId}%`)
            .order('order', { ascending: true });

        if (error) {
            console.error('Error fetching test cases:', error.message);
        }
        return data || [];
    }

    
}

export const getStepsToTestCases = async (testId: number) => {
    const { data, error } = await supabase
        .from('steps')
        .select('*')
        .eq('test_id', testId)
        .single();

    return data || null;
}

export const getTotalTestCases = async (module?: string) => {

    if (module) {
        switch (module) {
            case 'promis': module = 'PRMS'; break;
            case 'inspire': module = 'INSPR'; break;
            case 'scorecard': module = 'SCRD'; break;
        }

        const { data, error } = await supabase
            .from('test_cases')
            .select('test_id')
            .like('test_id', `${module}%`)
            .order('order', { ascending: true });
        
        return data || null;
    }

    const { data, error } = await supabase
        .from('test_cases')
        .select('test_id')
        .order('order', { ascending: true });
        
    return data || null;
}

export const getNumberOfTestEvaluated = async (module?: string) => {

    if (module) {
        switch (module) {
            case 'promis': module = 'PRMS'; break;
            case 'inspire': module = 'INSPR'; break;
            case 'scorecard': module = 'SCRD'; break;
        }

        const { data, error } = await supabase
            .from('responses')
            .select(`
                *,
                test_cases!inner(*)
            `)
            .like('test_cases.test_id', `${module}%`)
        const distinctTestIds = [...new Set(data?.map(r => r.test_id))];
        
        return distinctTestIds || null;
    }

    const { data, error } = await supabase
        .from('responses')
        .select(`
            *,
            test_cases(*)
        `)
        .select('test_id');
        
    
    const distinctTestIds = [...new Set(data?.map(r => r.test_id))];

    return distinctTestIds || null;
}

export const fetchPreviousModuleEval = async (email: string, module: string) => {
    const { data, error } = await supabase
        .from('overall_evaluation')
        .select('*')
        .eq('user_email', email)
        .eq('module', module)
        
    return data || null;
}

export const getUserEmails =  async () => {
    const { data, error } = await supabase
        .from('responses')
        .select('tester_email');
        
    const emails = [...new Set(data?.map(row => row.tester_email))];
    return emails || null;
}



export const getUserFeedbacks = async (email?: string) => {
    if (email) {
        const { data, error } = await supabase
            .from('responses')
            .select(`
                *,
                test_cases(*)
            `)
            .eq('tester_email', email);
            return data || null;
    }
    else {
        const { data, error } = await supabase
            .from('responses')
            .select(`
                *,
                test_cases(*)
            `)
            return data || null;
    }
}

export const getAverageOverallEval = async (module?: string) => {
    if (module) {
        const { data, error } = await supabase
            .from('overall_evaluation')
            .select('*')
            .eq('module', module)

        const distinct = data?.filter(
            (item, index, self) =>
                index === self.findIndex((t) => t.user_email === item.user_email && t.title === item.title)
            );
        const average = (distinct?.reduce((avg, curr) => avg + curr.rating, 0) / (distinct?.length || 1)) || 0;
        return average;
    }
}

export const getOverallEvals = async (module?: string) => {
    const evaluations = ['easeOfUse', 'speedAndResponsiveness', 'clarity', 'usefulness', 'overallSatisfaction'];
    if (module) {
        const { data, error } = await supabase
            .from('overall_evaluation')
            .select('*')
            .eq('module', module)

        const distinct = data?.filter(
            (item, index, self) =>
                index === self.findIndex((t) => t.user_email === item.user_email && t.title === item.title)
            );
        
        const averages = evaluations.map( evaluation => {
                const matchingData = distinct?.filter(item => item.title === evaluation);
                const sum = matchingData?.reduce((acc, curr) => acc + curr.rating, 0) || 0;
                if (matchingData) return matchingData?.length > 0 ? sum / matchingData.length : 0;
                return 0;
            }
        )
        return averages;
    }
}


export const getOverallEvalResponses = async (module?: string) => {
    const { data, error } = await supabase
        .from('overall_evaluation')
        .select('*')
        
    const distinct = data?.filter(
            (item, index, self) =>
                index === self.findIndex((t) => t.user_email === item.user_email && t.title === item.title && t.module === item.module)
            );
    return distinct || null;
}


export const getUniqueTestersPerModule = async (module?: string) => {
    const { data, error } = await supabase
        .from('responses')
        .select(`
            *,
            test_cases!inner(*)
        `)
        .eq('test_id', module)
        
    const emails = [...new Set(data?.map(row => row.tester_email))];
    return emails || null;
}

export const getResponsePerCase = async (module?: string, testId?: string) => {
    const { data, error } = await supabase
        .from('responses')
        .select(`
            *,
            test_cases!inner(*)
        `)
        .eq('test_cases.id', testId)

    console.log("dadasd", data, module, testId);
        
    return data || null;
}

export const constructBarGraphPromisTests = async (module?: string) => {
    const {data, error} = await supabase
        .from('test_cases')
        .select(`
            *,
            responses!inner(*)
        `)
        .like('test_id', `${module}%`)
    return data || null;
}

export const fetchModuleComments = async (module?: string) => {
    const { data, error } = await supabase
        .from('responses')
        .select(`
            *,
            test_cases!inner(*)
        `)
        .neq('remarks', "")
        .like('test_cases.test_id', `${module}%`);

        console.log("fetchModuleComments", data);

        
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
