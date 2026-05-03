/**
 * ═══════════════════════════════════════════════════
 *  Tenant Middleware — Multi-Tenancy Guard
 * ═══════════════════════════════════════════════════
 * 
 * ESTRATEGIA DE MULTI-TENANCY:
 * ─────────────────────────────
 * 
 * Este middleware intercepta CADA request y extrae el
 * clientId del header 'x-client-id' (en producción
 * vendría del JWT decodificado).
 * 
 * Una vez extraído, se adjunta a req.clientId para que
 * TODOS los controladores y repositorios filtren
 * automáticamente por tenant.
 * 
 * ¿Cómo garantiza el aislamiento?
 * 
 *   1. El middleware inyecta clientId en cada request
 *   2. Los repositorios SIEMPRE incluyen { clientId } 
 *      en sus queries
 *   3. Ningún endpoint puede acceder a datos sin
 *      pasar por este middleware
 * 
 * Ejemplo de query filtrada en el repositorio:
 * 
 *   // En ProductRepository
 *   async findAll(clientId) {
 *     return Product.find({ clientId }); // ← Siempre filtrado
 *   }
 * 
 * De esta forma, el 'Cliente A' NUNCA puede ver datos
 * del 'Cliente B', porque todas las consultas están
 * scoped al tenant del request.
 * 
 * En producción, la cadena sería:
 *   JWT → decodificar → extraer clientId → inyectar en req
 * 
 * ═══════════════════════════════════════════════════
 */

const tenantMiddleware = (req, res, next) => {
  // ─── En producción: extraer de JWT ───
  // const decoded = jwt.verify(req.headers.authorization, SECRET);
  // req.clientId = decoded.clientId;

  // ─── Simulación: extraer del header x-client-id ───
  const clientId = req.headers['x-client-id'];

  if (!clientId) {
    return res.status(401).json({
      success: false,
      error: 'TENANT_REQUIRED',
      message: 'Se requiere el header x-client-id para identificar el tenant.',
    });
  }

  // Validar formato (simulamos validación de ObjectId)
  if (typeof clientId !== 'string' || clientId.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'INVALID_TENANT',
      message: 'El clientId proporcionado no es válido.',
    });
  }

  // Inyectar clientId en el request para uso downstream
  req.clientId = clientId.trim();

  // Log de auditoría (útil para debugging multi-tenant)
  console.log(`[Tenant] Request de tenant: ${req.clientId} → ${req.method} ${req.path}`);

  next();
};

/**
 * Middleware opcional para rutas que no requieren tenant
 * (ej: health check, login)
 */
const optionalTenant = (req, res, next) => {
  const clientId = req.headers['x-client-id'];
  if (clientId) {
    req.clientId = clientId.trim();
  }
  next();
};

module.exports = { tenantMiddleware, optionalTenant };
