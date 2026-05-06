# Proyecto SaaS - Stock Manager

Aplicacion SaaS de inventario, ventas, clientes y usuarios construida con:

- React + Vite
- Supabase Auth + PostgreSQL + API
- jsPDF para reportes en frontend
- Vercel gratis para deploy del frontend

## Desarrollo Local

```bash
npm install
npm run dev
```

Sin variables de Supabase, la app usa datos mock y puedes entrar con:

- `admin / 1234`
- `vendedor / 1234`

## Configurar Supabase

1. Crea un proyecto gratis en Supabase.
2. Abre el SQL Editor y ejecuta `supabase/schema.sql`.
3. Crea usuarios en Supabase Auth.
4. Inserta un perfil para cada usuario en `profiles`, usando el mismo `id` del usuario Auth:

```sql
insert into public.profiles (id, tenant_id, username, name, email, role, avatar)
values (
  'UUID_DEL_USUARIO_AUTH',
  'tenant_techstore_alpha',
  'carlos',
  'Carlos Administrador',
  'quispenaverosc@gmail.com',
  'admin',
  'CA'
);
```

5. Copia `.env.example` a `.env.local` y completa:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

En modo Supabase, el login usa email y password de Supabase Auth.

## Deploy Gratis En Vercel

1. Sube el proyecto a GitHub.
2. Importa el repositorio en Vercel.
3. Configura las mismas variables:

```env
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

4. Ejecuta el build:

```bash
npm run build
```

## Estado De La Migracion

- Auth real con Supabase y fallback mock.
- Productos con CRUD en Supabase y fallback mock.
- Ventas con cabecera/detalle en `sales` y `sale_items`.
- Clientes con CRUD en Supabase y fallback mock.
- Usuarios leen/editan perfiles; la creacion de credenciales se hace desde Supabase Auth en v1.
- RLS incluido para separar datos por `tenant_id`.
