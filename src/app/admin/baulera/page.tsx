/**
 * Panel Admin: Gestión de Baulera
 * 
 * Página placeholder para la gestión de bauleras
 */

export default function AdminBauleraPage() {
  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 
            className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight" 
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Baulera
          </h1>
          <p 
            className="text-sm text-gray-500 mt-1.5" 
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Gestiona el contenido de bauleras
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
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
            La gestión de bauleras estará disponible próximamente.
          </p>
        </div>
      </div>
    </div>
  );
}

