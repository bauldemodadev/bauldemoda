/**
 * Panel Admin: Gestión de Banners
 * 
 * Página placeholder para la gestión de banners del sitio
 */

export default function AdminBannersPage() {
  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 
            className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight" 
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Banners
          </h1>
          <p 
            className="text-sm text-gray-500 mt-1.5" 
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Gestiona los banners del sitio web
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
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
            La gestión de banners estará disponible próximamente.
          </p>
        </div>
      </div>
    </div>
  );
}

