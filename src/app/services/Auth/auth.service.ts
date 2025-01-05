import { Injectable } from '@angular/core';
import { SupabaseService } from '../Supabase/supabase.service';
import { SignInWithPasswordCredentials, SignUpWithPasswordCredentials } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private supabaseClient: SupabaseService
  ) { }

  session(){
    return this.supabaseClient.supabaseClient.auth.getSession();
  }
  
  signUp(credentials: SignUpWithPasswordCredentials){
    return this.supabaseClient.supabaseClient.auth.signUp(credentials);
  }

  login(credentials: SignInWithPasswordCredentials){
    return this.supabaseClient.supabaseClient.auth.signInWithPassword(credentials);
  }

  signOut(){
    return this.supabaseClient.supabaseClient.auth.signOut();
  }
}
