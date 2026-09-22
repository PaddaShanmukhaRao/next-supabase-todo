import { createBrowserClient } from "@supabase/ssr";

function getEnvironmentVariables(){
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    if (!supabaseUrl || !supabasePublishableKey){
        throw new Error(
            "Missing Keys"
        )
    }
    return {supabaseUrl,supabasePublishableKey}
}

export default  function createClient(){
    const {supabaseUrl, supabasePublishableKey } = getEnvironmentVariables();
    createBrowserClient(supabaseUrl,supabasePublishableKey);

}