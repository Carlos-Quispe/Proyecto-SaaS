import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

const TENANT_A = 'tenant_techstore_alpha';

const mockClients = [
  { id: 'cli_001', clientId: TENANT_A, name: 'TechCorp Mexico', email: 'contact@techcorp.mx', phone: '+52 55 1234 5678', type: 'Corporativo', status: 'active', totalPurchases: 15200.50, lastPurchase: '2026-04-28' },
  { id: 'cli_002', clientId: TENANT_A, name: 'Ana Garcia Lopez', email: 'ana.garcia@gmail.com', phone: '+52 33 9876 5432', type: 'Individual', status: 'active', totalPurchases: 3499.99, lastPurchase: '2026-04-30' },
  { id: 'cli_003', clientId: TENANT_A, name: 'Distribuidora Norte', email: 'ventas@distnorte.com', phone: '+52 81 5555 0001', type: 'Distribuidor', status: 'active', totalPurchases: 42500.00, lastPurchase: '2026-05-01' },
  { id: 'cli_004', clientId: TENANT_A, name: 'Roberto Hernandez', email: 'r.hernandez@outlook.com', phone: '+52 55 7777 8888', type: 'Individual', status: 'inactive', totalPurchases: 899.99, lastPurchase: '2026-03-15' },
  { id: 'cli_005', clientId: TENANT_A, name: 'GameStation SA', email: 'info@gamestation.mx', phone: '+52 33 2222 3333', type: 'Corporativo', status: 'active', totalPurchases: 28750.00, lastPurchase: '2026-05-02' },
  { id: 'cli_006', clientId: TENANT_A, name: 'Universidad Tech', email: 'compras@unitech.edu.mx', phone: '+52 22 4444 5555', type: 'Educacion', status: 'active', totalPurchases: 65000.00, lastPurchase: '2026-04-25' },
];

export const CLIENT_TYPES = ['Todos', 'Individual', 'Corporativo', 'Distribuidor', 'Educacion'];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function mapClient(row) {
  return {
    id: row.id,
    clientId: row.tenant_id,
    name: row.name,
    email: row.email,
    phone: row.phone || '',
    type: row.type,
    status: row.status,
    totalPurchases: Number(row.total_purchases || 0),
    lastPurchase: row.last_purchase || '-',
  };
}

function toClientRow(client, tenantId) {
  const row = {
    tenant_id: tenantId,
    name: client.name,
    email: client.email,
    phone: client.phone || '',
    type: client.type || 'Individual',
    status: client.status || 'active',
    total_purchases: client.totalPurchases || 0,
    last_purchase: client.lastPurchase === '-' ? null : client.lastPurchase || null,
  };
  if (!tenantId) delete row.tenant_id;
  return row;
}

export async function fetchClients(clientId) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('tenant_id', clientId)
      .order('name', { ascending: true });

    if (error) throw error;
    return (data || []).map(mapClient);
  }

  await delay(250);
  return mockClients.filter((client) => client.clientId === clientId);
}

export async function createClientRecord(clientId, client) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('clients')
      .insert(toClientRow(client, clientId))
      .select('*')
      .single();

    if (error) throw error;
    return mapClient(data);
  }

  await delay(200);
  return {
    ...client,
    id: `cli_${Date.now()}`,
    clientId,
    totalPurchases: 0,
    lastPurchase: '-',
    status: 'active',
  };
}

export async function updateClientRecord(clientId, clientIdToUpdate, client) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('clients')
      .update(toClientRow(client, undefined))
      .eq('id', clientIdToUpdate)
      .eq('tenant_id', clientId)
      .select('*')
      .single();

    if (error) throw error;
    return mapClient(data);
  }

  await delay(200);
  return { ...client, id: clientIdToUpdate, clientId };
}

export async function deleteClientRecord(clientId, clientIdToDelete) {
  if (isSupabaseConfigured) {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', clientIdToDelete)
      .eq('tenant_id', clientId);

    if (error) throw error;
    return true;
  }

  await delay(200);
  return true;
}
