import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js'
import { environment } from '../../../environments/environment.development';
import { catchError, from, map, Observable, of, switchMap, throwError } from 'rxjs';

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

  createUser3(email: string, password: string, userData: any, grados: number[]): Observable<any> {
    return from(this.supabaseClient.auth.signUp({ email, password })).pipe(
        switchMap((authResult: any) => {
            if (!authResult.data.user) {
                throw new Error(authResult.error?.message || 'Error creando usuario');
            }
            console.log(authResult);
            const userId = authResult.data.user.id;

            // Insertar en usuarios
            const insertUsuarios = this.supabaseClient
                .from('usuarios')
                .insert({ ...userData, id: userId });

            // Insertar en usuarios_grados (si hay grados)
            const insertGrados =
                grados.length > 0
                    ? this.supabaseClient.from('usuarios_grados').insert(
                          grados.map((grado) => ({ usuario_id: userId, grado_id: grado }))
                      )
                    : Promise.resolve();

            return from(Promise.all([insertUsuarios, insertGrados]));
        }),
        catchError((error) => {
            console.error('Error en createUser:', error);
            return throwError(() => new Error(error.message));
        })
    );
  }

  createUser2(email: string, password: string, userData: any, grados: number[]): Observable<any> {
    return from(this.supabaseClient.auth.signUp({ email, password })).pipe(
        switchMap((authResult: any) => {
            if (!authResult.data?.user) {
                throw new Error(authResult.error?.message || 'Error creando usuario');
            }

            const userId = authResult.data.user.id;

            // Inserta en la tabla 'usuarios' primero
            return from(
                this.supabaseClient
                    .from('usuarios')
                    .insert({ ...userData, id: userId })
            ).pipe(
                switchMap(() => {
                    // Luego inserta en 'usuarios_grados' si hay grados
                    if (grados.length > 0) {
                        const gradosData = grados.map((grado) => ({ usuario_id: userId, grado_id: grado }));
                        return from(this.supabaseClient.from('usuarios_grados').insert(gradosData));
                    }
                    return of(null); // Si no hay grados, devuelve un observable vacío
                })
            );
        }),
        catchError((error) => {
            console.error('Error en createUser2:', error);
            return throwError(() => new Error(error.message));
        })
    );
  }

  getGradosPorUsuario(userId: string): Observable<any[]> {
    return from(
      this.supabaseClient
        .from('usuarios_grados')
        .select(`*, grados(*)`) // Relación con la tabla `grados` utilizando el FK
        .eq('usuario_id', userId) // Filtra por el ID del usuario
    ).pipe(
      map((response: any) => {
        if (response.error) {
          throw new Error(response.error.message);
        }
        return response.data;
      })
    );
  }

  getDataUser(id: string): Observable<any> {
    return from(
      this.supabaseClient
        .from('usuarios')
        .select('*')
        .eq('id', id)
        .single()
    ).pipe(
      map((response: any) => {
        if (response.error) {
          throw new Error(response.error.message);
        }
        return response.data;
      })
    );
  }

  getMarcaciones(userId: any, claseId: any, fecha: string): Observable<any[]> {
    return from(
      this.supabaseClient
        .from('marcaciones')
        .select('*')
        .eq('user_id', userId)
        .eq('clase_id', claseId)
        .gte('fecha_marcacion', `${fecha}T00:00:00Z`) // Fecha desde el inicio del día
        .lte('fecha_marcacion', `${fecha}T23:59:59Z`) // Fecha hasta el final del día
    ).pipe(
      map((response: any) => {
        if (response.error) {
          throw new Error(response.error.message);
        }
        return response.data;
      })
    );
  }  
  
  postMarcacion(marcacion: {
    user_id: string;
    clase_id: string;
    fecha_marcacion: string; // Formato ISO: YYYY-MM-DDTHH:mm:ssZ
    tipo_marcacion: 'entrada' | 'salida';
  }): Observable<any> {
    return from(
      this.supabaseClient.from('marcaciones').insert(marcacion)
    ).pipe(
      map((response: any) => {
        if (response.error) {
          throw new Error(response.error.message);
        }
        return response.data;
      })
    );
  }
}
