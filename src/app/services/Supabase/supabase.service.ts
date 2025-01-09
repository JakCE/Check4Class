import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js'
import { environment } from '../../../environments/environment.development';
import { catchError, from, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  supabaseClient: any;

  constructor() { 
    this.supabaseClient = createClient(environment.SUPABASE_URL, environment.SUPABASE_KEY)
  };

  /// Niveles

  // Obtener todos los registros
  getAllNiveles(): Observable<any[]> {
    return from(
      this.supabaseClient.from('grados')
      .select('*')
      .then(({ data, error }: { data: any[] | null; error: any }) => {
        if (error) throw error;
        return data || [];
      })
    ) as Observable<any[]>;
  }

  // Obtener un registro por ID
  getByIdNiveles(id: number): Observable<any> {
    return from(
      this.supabaseClient.from('grados')
      .select('*').eq('id', id).single().then(({ data, error }: { data: any | null; error: any }) => {
        if (error) throw error;
        return data;
      })
    );
  }

  // Crear un nuevo registro
  createNiveles(grado: any): Observable<any> {
    return from(
      this.supabaseClient.from('grados')
      .insert([grado])
      .then(({ data, error }: { data: any | null; error: any }) => {
        if (error) throw error;
        return data;
      })
    );
  }

  // Actualizar un registro
  updateNiveles(id: number, grado: any): Observable<any> {
    return from(
      this.supabaseClient.from('grados').update(grado).eq('id', id).then(({ data, error }: { data: any | null; error: any }) => {
        if (error) throw error;
        return data;
      })
    );
  }

  // Eliminar un registro
  deleteNiveles(id: number): Observable<any> {
    return from(
      this.supabaseClient.from('grados').delete().eq('id', id).then(({ data, error }: { data: any | null; error: any }) => {
        if (error) throw error;
        return data;
      })
    );
  }

  ///USUARIO CRUD
  // Crear un nuevo usuario con información adicional y grados
  createUser(email: string, password: string, userData: any, grados: number[]): Observable<any> {
    return from(this.supabaseClient.auth.signUp({ email, password })).pipe(
      map((authResult: any) => {
        if (!authResult.user) {
          throw new Error('Error creando usuario');
        }
        const userId = authResult.user.id;

        // Insertar información en "usuarios"
        const insertUser = this.supabaseClient.from('usuarios').insert({ ...userData, user_id: userId });

        // Insertar grados asociados
        const gradosData = grados.map((grado) => ({ user_id: userId, grado_id: grado }));
        const insertGrados = this.supabaseClient.from('grados').insert(gradosData);

        return Promise.all([insertUser, insertGrados]);
      }),
      catchError((error) => {
        console.error('Error en createUser:', error);
        return throwError(() => new Error(error.message));
      })
    );
  }

  /*
  // Obtener todos los usuarios con sus grados
  getUsers(): Observable<any> {
    return from(
      this.supabaseClient
        .from('usuarios')
        .select(`
          *,
          grados(grado_id)
        `)
    ).pipe(
      map(({ data, error }) => {
        if (error) throw new Error(error.message);
        return data;
      }),
      catchError((error) => {
        console.error('Error en getUsers:', error);
        return throwError(() => new Error(error.message));
      })
    );
  }

  // Actualizar un usuario
  updateUser(userId: string, userData: any, grados: number[]): Observable<any> {
    return from(
      this.supabaseClient
        .from('usuarios')
        .update(userData)
        .eq('user_id', userId)
    ).pipe(
      map(() => {
        // Eliminar grados anteriores
        const deleteGrados = this.supabaseClient.from('grados').delete().eq('user_id', userId);

        // Insertar nuevos grados
        const gradosData = grados.map((grado) => ({ user_id: userId, grado_id: grado }));
        const insertGrados = this.supabaseClient.from('grados').insert(gradosData);

        return Promise.all([deleteGrados, insertGrados]);
      }),
      catchError((error) => {
        console.error('Error en updateUser:', error);
        return throwError(() => new Error(error.message));
      })
    );
  }

  // Eliminar un usuario
  deleteUser(userId: string): Observable<any> {
    return from(
      this.supabaseClient
        .from('grados')
        .delete()
        .eq('user_id', userId)
    ).pipe(
      map(() =>
        this.supabaseClient.from('usuarios').delete().eq('user_id', userId).then(() =>
          this.supabaseClient.auth.admin.deleteUser(userId)
        )
      ),
      catchError((error) => {
        console.error('Error en deleteUser:', error);
        return throwError(() => new Error(error.message));
      })
    );
  }

  // Registrar una marcación
  createMarcacion(userId: string, claseId: string, entrada: string, salida: string): Observable<any> {
    return from(
      this.supabaseClient.from('marcaciones').insert({ user_id: userId, clase_id: claseId, entrada, salida })
    ).pipe(
      map(({ error }) => {
        if (error) throw new Error(error.message);
        return { message: 'Marcación registrada exitosamente' };
      }),
      catchError((error) => {
        console.error('Error en createMarcacion:', error);
        return throwError(() => new Error(error.message));
      })
    );
  }

  // Obtener marcaciones por usuario
  getMarcacionesByUser(userId: string): Observable<any> {
    return from(this.supabaseClient.from('marcaciones').select('*').eq('user_id', userId)).pipe(
      map(({ data, error }) => {
        if (error) throw new Error(error.message);
        return data;
      }),
      catchError((error) => {
        console.error('Error en getMarcacionesByUser:', error);
        return throwError(() => new Error(error.message));
      })
    );
  }*/
}
