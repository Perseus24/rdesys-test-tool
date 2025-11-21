import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from "@supabase/ssr"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

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