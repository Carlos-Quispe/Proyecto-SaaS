import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

const TENANT_A = 'tenant_techstore_alpha';

const mockUsers = [
  { id: 'user_001', clientId: TENANT_A, name: 'Carlos Administrador', email: 'admin@techstore.com', username: 'admin', role: 'admin', avatar: 'CA', status: 'active', lastLogin: '2026-05-02 18:30' },
  { id: 'user_002', clientId: TENANT_A, name: 'Maria Vendedora', email: 'maria@techstore.com', username: 'vendedor', role: 'seller', avatar: 'MV', status: 'active', lastLogin: '2026-05-02 17:45' },
  { id: 'user_003', clientId: TENANT_A, name: 'Pedro Lopez', email: 'pedro@techstore.com', username: 'pedro', role: 'seller', avatar: 'PL', status: 'active', lastLogin: '2026-05-01 09:20' },
  { id: 'user_004', clientId: TENANT_A, name: 'Laura Torres', email: 'laura@techstore.com', username: 'laura', role: 'seller', avatar: 'LT', status: 'inactive', lastLogin: '2026-04-15 14:00' },
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function mapProfile(row) {
  return {
    id: row.id,
    clientId: row.tenant_id,
    name: row.name,
    email: row.email,
    username: row.username || row.email,
    role: row.role,
    avatar: row.avatar || (row.role === 'admin' ? 'AD' : 'VE'),
    status: row.status || 'active',
    lastLogin: row.last_login ? new Date(row.last_login).toLocaleString('es-PE') : '-',
  };
}

function toProfileRow(profile) {
  return {
    name: profile.name,
    email: profile.email,
    username: profile.username,
    role: profile.role || 'seller',
    avatar: profile.avatar || (profile.role === 'admin' ? 'AD' : 'VE'),
    status: profile.status || 'active',
  };
}

export async function fetchUsers(clientId) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('tenant_id', clientId)
      .order('name', { ascending: true });

    if (error) throw error;
    return (data || []).map(mapProfile);
  }

  await delay(250);
  return mockUsers.filter((user) => user.clientId === clientId);
}

export async function createUserProfile(clientId, profile) {
  if (isSupabaseConfigured) {
    throw new Error('En modo Supabase crea primero el usuario en Auth y luego su perfil en la tabla profiles.');
  }

  await delay(200);
  return {
    ...profile,
    id: `user_${Date.now()}`,
    clientId,
    avatar: profile.role === 'admin' ? 'AD' : 'VE',
    status: 'active',
    lastLogin: '-',
  };
}

export async function updateUserProfile(clientId, userId, profile) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('profiles')
      .update(toProfileRow(profile))
      .eq('id', userId)
      .eq('tenant_id', clientId)
      .select('*')
      .single();

    if (error) throw error;
    return mapProfile(data);
  }

  await delay(200);
  return { ...profile, id: userId, clientId };
}

export async function toggleUserProfileStatus(clientId, userId, status) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ status })
      .eq('id', userId)
      .eq('tenant_id', clientId)
      .select('*')
      .single();

    if (error) throw error;
    return mapProfile(data);
  }

  await delay(150);
  return true;
}

export async function deleteUserProfile(clientId, userId) {
  if (isSupabaseConfigured) {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId)
      .eq('tenant_id', clientId);

    if (error) throw error;
    return true;
  }

  await delay(150);
  return true;
}
