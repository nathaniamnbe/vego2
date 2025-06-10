import { supabase } from '../supabase';

export const restoreSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;

    const session = data?.session;
    return !!session; 
  } catch (error) {
    console.error("Error restoring session:", error);
    return false;
  }
};
