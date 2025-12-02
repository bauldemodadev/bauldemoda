/**
 * Componente: Checkout para Cursos Gratuitos
 * 
 * Permite a los usuarios registrarse para cursos gratuitos
 * sin necesidad de realizar un pago
 */

'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Gift, User, Mail, Phone } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface FreeCourseCheckoutProps {
  courseId: string;
  courseName: string;
  onCancel?: () => void;
}

export default function FreeCourseCheckout({ courseId, courseName, onCancel }: FreeCourseCheckoutProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: user?.email || '',
    phone: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast({
        variant: 'destructive',
        title: 'Campos requeridos',
        description: 'Por favor completa tu nombre y email.',
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Crear orden gratuita en Firestore
      const response = await fetch('/api/free-course-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          courseName,
          customer: formData,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al registrar el curso');
      }

      const result = await response.json();
      
      setSuccess(true);
      
      toast({
        title: '¡Registro exitoso!',
        description: 'Te hemos enviado un email con el acceso al curso.',
      });

      // Redirigir a la página de éxito después de 2 segundos
      setTimeout(() => {
        router.push(`/checkout/success?orderId=${result.orderId}`);
      }, 2000);
    } catch (error) {
      console.error('Error registrando curso gratuito:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo completar el registro. Por favor intenta nuevamente.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="mx-auto flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          ¡Registro Exitoso!
        </h2>
        <p className="text-gray-600">
          Redirigiendo...
        </p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Gift className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-bold text-green-900">Curso Gratuito</h2>
        </div>
        <p className="text-green-700">
          Este curso es completamente <strong>GRATIS</strong>. Solo necesitamos algunos datos para enviarte el acceso.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {courseName}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4" />
              Nombre completo *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Tu nombre completo"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4" />
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4" />
              Teléfono (opcional)
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="+54 9 11 1234-5678"
            />
          </div>

          <div className="flex gap-4 pt-4">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={isProcessing}
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              disabled={isProcessing}
              className="flex-1 px-6 py-3 bg-[#E9ABBD] text-white rounded-lg hover:bg-[#D44D7D] transition-colors disabled:opacity-50"
            >
              {isProcessing ? 'Procesando...' : 'Obtener Acceso Gratis'}
            </button>
          </div>
        </form>
      </div>

      <p className="text-sm text-gray-500 text-center">
        * Recibirás un email con las instrucciones de acceso al curso
      </p>
    </div>
  );
}

