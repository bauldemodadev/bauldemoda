/**
 * Panel Admin: Gestión de Comunidad
 * 
 * Página placeholder para la gestión de la comunidad
 */

export default function AdminComunidadPage() {
  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 
            className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight" 
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Comunidad
          </h1>
          <p 
            className="text-sm text-gray-500 mt-1.5" 
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Gestiona el contenido de la comunidad
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-[#E9ABBD]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg 
              className="w-8 h-8 text-[#D44D7D]" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" 
              />
            </svg>
          </div>
          <h2 
            className="text-xl font-semibold text-gray-900 mb-2" 
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Sección en desarrollo
          </h2>
          <p 
            className="text-gray-500" 
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            La gestión de comunidad estará disponible próximamente.
          </p>
        </div>
      </div>
    </div>
  );
}

