"use client";

import { useEffect, useState } from "react";
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useObtenerPerfilCliente } from "@/lib/hooks/useGetClientProfile";
import { useGuardarPerfilCliente } from "@/lib/hooks/useSaveClientProfile";

interface UserProfile {
  id?: string;
  fullName?: string;
  nombre?: string;
  email: string;
  phone?: string;
  telefono?: string;
  dni?: string;
  cuit?: string;
  createdAt?: any;
  creadoEn?: any;
  updatedAt?: any;
  actualizadoEn?: any;
  isFavorite?: boolean;
  direccion?: string;
  localidad?: string;
  partido?: string;
  codigoPostal?: string;
  barrio?: string;
  area?: string;
  lote?: string;
  lat?: number | null;
  lng?: number | null;
  esClienteViejo?: boolean;
  origen?: string;
}

interface ApiResponse {
  success: boolean;
  data: UserProfile | UserProfile[];
}

interface ClientProfile {
  uid: string;
  email: string;
  nombre: string;
  telefono: string;
  dni: string;
  cuit?: string;
  direccion?: string;
  localidad?: string;
  partido?: string;
  codigoPostal?: string;
  barrio?: string;
  area?: string;
  lote?: string;
  lat?: number | null;
  lng?: number | null;
  esClienteViejo?: boolean;
  origen?: string;
  creadoEn?: string;
  actualizadoEn?: string;
}

export default function AccountPage() {
  const { user: session, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [editingProfile, setEditingProfile] = useState<UserProfile | null>(null);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [authError, setAuthError] = useState<string | null>(null);
  const [editingClientProfile, setEditingClientProfile] = useState<ClientProfile | null>(null);
  const [editingFields, setEditingFields] = useState<{[key: string]: boolean}>({});
  const router = useRouter();

  const { perfil: clientProfile, refetch: refetchClientProfile } = useObtenerPerfilCliente();
  const { guardar: guardarPerfilCliente } = useGuardarPerfilCliente();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.email) return setLoading(false);
      try {
        const response = await api.get<ApiResponse>(`/users/${encodeURIComponent(session.email)}/profiles`);
        
        let profilesArray: UserProfile[] = [];
        
        if (response && typeof response === 'object' && 'data' in response) {
          if (response.data) {
            if (response.data && typeof response.data === 'object' && 'id' in response.data) {
              profilesArray = [response.data as UserProfile];
            } else if (Array.isArray(response.data)) {
              profilesArray = response.data;
            }
          }
        } else if (Array.isArray(response)) {
          profilesArray = response;
        }
        
        setProfiles(profilesArray);
        if (profilesArray.length > 0) {
          const latestProfile = profilesArray[profilesArray.length - 1];
          setSelectedProfile(latestProfile);
        } else {
          setSelectedProfile(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Error al cargar los datos del usuario");
        setAuthError("Error al cargar los datos del usuario");
        setProfiles([]);
        setSelectedProfile(null);
      } finally {
        setLoading(false);
      }
    };
    if (session) {
      fetchUserData();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [session, authLoading]);

  useEffect(() => {
    if (clientProfile) {
      setEditingClientProfile({
        uid: clientProfile.uid,
        email: clientProfile.email,
        nombre: clientProfile.nombre,
        telefono: clientProfile.telefono,
        dni: clientProfile.dni,
        creadoEn: clientProfile.creadoEn,
        actualizadoEn: clientProfile.actualizadoEn
      });
    }
  }, [clientProfile]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.email || !editingProfile?.id) return;

    setSaving(true);
    try {
      const updatedProfile = {
        ...editingProfile,
        actualizadoEn: new Date().toISOString()
      };
      
      await api.put(`/users/${encodeURIComponent(session.email)}/profiles/${encodeURIComponent(editingProfile.id)}`, updatedProfile);
      
      if (Array.isArray(profiles)) {
        setProfiles(profiles.map(p => p.id === editingProfile.id ? updatedProfile : p));
        if (selectedProfile?.id === editingProfile.id) {
          setSelectedProfile(updatedProfile);
        }
      }
      
      toast.success("Perfil actualizado correctamente");
      setEditingProfile(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error al actualizar el perfil");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.email) return;

    setSaving(true);
    try {
      const newProfileId = crypto.randomUUID();
      const newProfile: UserProfile = {
        id: newProfileId,
        nombre: editingProfile?.nombre || editingProfile?.fullName || "",
        email: session.email,
        telefono: editingProfile?.telefono || editingProfile?.phone || "",
        cuit: editingProfile?.cuit || editingProfile?.dni || "",
        creadoEn: new Date().toISOString(),
        actualizadoEn: new Date().toISOString(),
        isFavorite: editingProfile?.isFavorite || false
      };
      await api.post(`/users/${encodeURIComponent(session.email)}/profiles`, newProfile);
      
      if (Array.isArray(profiles)) {
        setProfiles([...profiles, newProfile]);
      } else {
        setProfiles([newProfile]);
      }
      setSelectedProfile(newProfile);
      toast.success("Perfil creado correctamente");
      setEditingProfile(null);
    } catch (error) {
      console.error("Error creating profile:", error);
      toast.error("Error al crear el perfil");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProfile = async (profileId: string) => {
    if (!session?.email) return;

    try {
      await api.delete(`/users/${encodeURIComponent(session.email)}/profiles/${encodeURIComponent(profileId)}`);
      
      if (Array.isArray(profiles)) {
        setProfiles(profiles.filter(p => p.id !== profileId));
        
        if (selectedProfile?.id === profileId) {
          setSelectedProfile(profiles.find(p => p.id !== profileId) || null);
        }
      }
      
      toast.success("Perfil eliminado correctamente");
    } catch (error) {
      console.error("Error deleting profile:", error);
      toast.error("Error al eliminar el perfil");
    }
  };

  const handleToggleFavoriteProfile = async (profileId: string) => {
    if (!session?.email) return;

    try {
      if (!Array.isArray(profiles)) return;
      
      const profile = profiles.find(p => p.id === profileId);
      if (!profile) return;

      const newIsFavorite = !profile.isFavorite;
      
      await api.put(`/users/${encodeURIComponent(session.email)}/profiles/${encodeURIComponent(profileId)}`, {
        isFavorite: newIsFavorite,
        actualizadoEn: new Date().toISOString()
      });

      const updatedProfiles = profiles.map(p => 
        p.id === profileId ? { ...p, isFavorite: newIsFavorite } : p
      );
      setProfiles(updatedProfiles);

      if (newIsFavorite) {
        const otherProfiles = updatedProfiles.filter(p => p.id !== profileId);
        for (const otherProfile of otherProfiles) {
          if (otherProfile.isFavorite && otherProfile.id) {
            await api.put(`/users/${encodeURIComponent(session.email)}/profiles/${encodeURIComponent(otherProfile.id)}`, {
              isFavorite: false,
              actualizadoEn: new Date().toISOString()
            });
          }
        }
        setProfiles(updatedProfiles.map(p => 
          p.id !== profileId ? { ...p, isFavorite: false } : p
        ));
      }

      toast.success(newIsFavorite ? "Perfil marcado como favorito" : "Perfil desmarcado como favorito");
    } catch (error) {
      console.error("Error toggling favorite profile:", error);
      toast.error("Error al actualizar el perfil favorito");
    }
  };

  const handleClientProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClientProfile) return;

    setSaving(true);
    try {
      await guardarPerfilCliente({
        nombre: editingClientProfile.nombre,
        telefono: editingClientProfile.telefono,
        dni: editingClientProfile.dni,
        cuit: editingClientProfile.cuit,
        direccion: editingClientProfile.direccion,
        localidad: editingClientProfile.localidad,
        codigoPostal: editingClientProfile.codigoPostal
      });
      
      toast.success("Perfil del cliente actualizado correctamente");
      await refetchClientProfile();
      setEditingClientProfile(null);
    } catch (error) {
      console.error("Error updating client profile:", error);
      toast.error("Error al actualizar el perfil del cliente");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateClientProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClientProfile) return;

    setSaving(true);
    try {
      await guardarPerfilCliente({
        nombre: editingClientProfile.nombre,
        telefono: editingClientProfile.telefono,
        dni: editingClientProfile.dni,
        cuit: editingClientProfile.cuit,
        direccion: editingClientProfile.direccion,
        localidad: editingClientProfile.localidad,
        codigoPostal: editingClientProfile.codigoPostal
      });
      
      toast.success("Perfil del cliente creado correctamente");
      await refetchClientProfile();
      setEditingClientProfile(null);
    } catch (error) {
      console.error("Error creating client profile:", error);
      toast.error("Error al crear el perfil del cliente");
    } finally {
      setSaving(false);
    }
  };

  const handleFieldEdit = (fieldName: string) => {
    setEditingFields(prev => ({ ...prev, [fieldName]: true }));
  };

  const handleFieldSave = async (fieldName: string, value: string) => {
    if (!clientProfile) return;
    
    setSaving(true);
    try {
      const updatedProfile = {
        ...clientProfile,
        [fieldName]: value,
        actualizadoEn: new Date().toISOString()
      };
      
      await guardarPerfilCliente({
        nombre: updatedProfile.nombre,
        telefono: updatedProfile.telefono,
        dni: updatedProfile.dni,
        cuit: updatedProfile.cuit,
        direccion: updatedProfile.direccion,
        localidad: updatedProfile.localidad,
        codigoPostal: updatedProfile.codigoPostal
      });
      
      toast.success("Campo actualizado correctamente");
      await refetchClientProfile();
      setEditingFields(prev => ({ ...prev, [fieldName]: false }));
    } catch (error) {
      console.error("Error updating field:", error);
      toast.error("Error al actualizar el campo");
    } finally {
      setSaving(false);
    }
  };

  const handleFieldCancel = (fieldName: string) => {
    setEditingFields(prev => ({ ...prev, [fieldName]: false }));
  };

  const EditableField = ({ 
    fieldName, 
    label, 
    value, 
    placeholder = "", 
    type = "text",
    required = false 
  }: {
    fieldName: string;
    label: string;
    value: string;
    placeholder?: string;
    type?: string;
    required?: boolean;
  }) => {
    const [editValue, setEditValue] = useState(value);
    const isEditing = editingFields[fieldName];

    const handleSave = () => {
      if (editValue.trim() !== value) {
        handleFieldSave(fieldName, editValue.trim());
      } else {
        setEditingFields(prev => ({ ...prev, [fieldName]: false }));
      }
    };

    const handleCancel = () => {
      setEditValue(value);
      handleFieldCancel(fieldName);
    };

    if (isEditing) {
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              type={type}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder={placeholder}
              required={required}
              className="flex-1 border-2 border-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 rounded-lg px-3 py-2 text-sm transition-all duration-200"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleSave}
                disabled={saving}
                className="px-3 py-1.5 bg-gray-900 hover:bg-black text-white rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 text-sm"
              >
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "✓"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                className="px-3 py-1.5 border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 rounded-lg transition-all duration-200 hover:scale-105 text-sm"
              >
                ✕
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFieldEdit(fieldName)}
            className="h-6 w-6 p-0 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110 group"
          >
            <svg className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-900 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Button>
        </div>
        <div className="bg-gray-50 border-2 border-gray-200 p-3 rounded-lg hover:border-gray-300 transition-all duration-200">
          <p className="text-gray-900 font-medium text-sm">
            {value || "No especificado"}
          </p>
        </div>
      </div>
    );
  };

  const hasCompleteClientData = clientProfile && 
    clientProfile.nombre && 
    clientProfile.telefono && 
    (clientProfile.dni || clientProfile.cuit);

  const hasAddressData = clientProfile && (
    clientProfile.direccion || 
    clientProfile.localidad || 
    clientProfile.codigoPostal
  );

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <div className="mt-4 text-xs text-gray-500">
          status: {authLoading ? 'loading' : 'ready'}<br />
          loading: {String(loading)}<br />
          user: {JSON.stringify(session)}
        </div>
      </div>
    );
  }

  if (!session && !authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-2xl font-bold mb-4">Primero inicia sesión</h2>
        <Button onClick={() => (window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`)}>Iniciar Sesión</Button>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-2xl font-bold mb-4">Error de autenticación</h2>
        <p className="mb-6 text-red-500">{authError}</p>
        <div className="flex space-x-4">
          <Button onClick={() => window.location.reload()}>Reintentar</Button>
          <Button variant="outline" onClick={() => router.push('/')}>Volver al inicio</Button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="text-center mb-8 lg:mb-12">
          <div className="relative">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-black bg-clip-text text-transparent mb-3 lg:mb-4">
              Mi Cuenta
            </h1>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-gray-900 to-black rounded-full"></div>
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Gestiona tu información personal y perfiles de usuario de manera segura
          </p>
        </div>
        
        <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-2xl shadow-gray-900/5 rounded-2xl p-6 lg:p-8 mb-6">
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-900 to-black text-white px-4 py-2 rounded-xl mb-3">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <h2 className="text-lg lg:text-xl font-bold">Información Personal</h2>
              </div>
              <p className="text-gray-600 text-sm">Datos básicos de tu cuenta</p>
              
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 mt-4">
                {hasCompleteClientData ? (
                  <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-lg text-sm">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-medium">Perfil Completo</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1.5 rounded-lg text-sm">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
                    <span className="font-medium">Perfil Incompleto</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 lg:p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <h3 className="text-base lg:text-lg font-bold text-gray-900">Información Básica</h3>
                </div>
                <p className="text-gray-600 mb-4 text-center lg:text-left text-sm">
                  Haz clic en el ícono de editar para modificar cada campo
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Email</p>
                    <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                      <p className="text-gray-900 font-medium text-sm">{clientProfile?.email || session?.email}</p>
                    </div>
                  </div>
                  <EditableField
                    fieldName="nombre"
                    label="Nombre Completo *"
                    value={clientProfile?.nombre || ""}
                    placeholder="Nombre y apellido"
                    required
                  />
                  <EditableField
                    fieldName="telefono"
                    label="Teléfono *"
                    value={clientProfile?.telefono || ""}
                    placeholder="Número de teléfono"
                    type="tel"
                    required
                  />
                  <EditableField
                    fieldName="dni"
                    label="DNI/CUIT *"
                    value={clientProfile?.dni || clientProfile?.cuit || ""}
                    placeholder="DNI o CUIT"
                    required
                  />
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 lg:p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                  <h3 className="text-base lg:text-lg font-bold text-gray-900">Información de Dirección</h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  <EditableField
                    fieldName="direccion"
                    label="Dirección"
                    value={clientProfile?.direccion || ""}
                    placeholder="Calle y número"
                  />
                  <EditableField
                    fieldName="localidad"
                    label="Localidad"
                    value={clientProfile?.localidad || ""}
                    placeholder="Ciudad o pueblo"
                  />
                  <EditableField
                    fieldName="codigoPostal"
                    label="Código Postal"
                    value={clientProfile?.codigoPostal || ""}
                    placeholder="Código postal"
                  />
                </div>
              </div>

              {clientProfile && (
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 lg:p-6 border border-gray-100">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <h3 className="text-base lg:text-lg font-bold text-gray-900">Información Adicional</h3>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Tipo de Cliente</p>
                      <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                        <p className="text-gray-900 font-medium text-sm">
                          {clientProfile.esClienteViejo ? "Cliente Antiguo" : "Cliente Nuevo"}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Origen</p>
                      <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                        <p className="text-gray-900 font-medium capitalize text-sm">
                          {clientProfile.origen || "No especificado"}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Fecha de Registro</p>
                      <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                        <p className="text-gray-900 font-medium text-sm">
                          {clientProfile.creadoEn ? new Date(clientProfile.creadoEn).toLocaleDateString('es-AR') : "No especificada"}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Última Actualización</p>
                      <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                        <p className="text-gray-900 font-medium text-sm">
                          {clientProfile.actualizadoEn ? new Date(clientProfile.actualizadoEn).toLocaleDateString('es-AR') : "No especificada"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

      <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-2xl shadow-gray-900/5 rounded-2xl p-6 lg:p-8">
        <div className="space-y-6">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-900 to-black text-white px-4 py-2 rounded-xl mb-3">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <h2 className="text-lg lg:text-xl font-bold">Mis Perfiles</h2>
            </div>
            <p className="text-gray-600 text-sm">Gestiona tus perfiles de usuario</p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <Button
              onClick={() => setEditingProfile({
                id: "",
                nombre: "",
                email: session?.email || "",
                telefono: "",
                cuit: "",
                creadoEn: "",
                actualizadoEn: "",
                isFavorite: false
              })}
              className="bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900 text-white px-6 py-2.5 rounded-xl font-semibold text-base transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Agregar Perfil
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {Array.isArray(profiles) && profiles.length > 0 ? (
              profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="group bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden"
                >
                  {profile.isFavorite && (
                    <div className="absolute top-3 right-3">
                      <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-sm">★</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-3 pr-12">
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-gray-900 group-hover:text-black transition-colors duration-200">
                        {profile.nombre || profile.fullName || "Sin nombre"}
                      </h3>
                      <p className="text-gray-600 font-medium text-sm">{profile.email}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-gray-700 text-sm">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>{profile.telefono || profile.phone || "No especificado"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700 text-sm">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>{profile.cuit || profile.dni || "No especificado"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingProfile(profile)}
                      className="h-8 w-8 p-0 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110"
                    >
                      <svg className="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Button>
                    {profiles.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => profile.id && handleDeleteProfile(profile.id)}
                        className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200 hover:scale-110"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => profile.id && handleToggleFavoriteProfile(profile.id)}
                      className={`h-8 w-8 p-0 rounded-lg transition-all duration-200 hover:scale-110 ${
                        profile.isFavorite 
                          ? 'text-yellow-500 hover:bg-yellow-50' 
                          : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                      }`}
                    >
                      <svg className="w-4 h-4" fill={profile.isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No tienes perfiles configurados</h3>
                <p className="text-gray-600 text-sm mb-6 max-w-sm mx-auto">
                  Crea tu primer perfil para comenzar a personalizar tu experiencia
                </p>
              </div>
            )}
          </div>

          {editingProfile && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-xl bg-white/95 backdrop-blur-sm border-0 shadow-2xl shadow-gray-900/20 rounded-2xl p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {editingProfile.id ? "Editar" : "Agregar"} Perfil
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {editingProfile.id ? "Modifica la información de tu perfil" : "Completa la información para crear un nuevo perfil"}
                  </p>
                </div>
                
                <form
                  onSubmit={editingProfile.id ? handleProfileUpdate : handleCreateProfile}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre" className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        Nombre Completo *
                      </Label>
                      <Input
                        id="nombre"
                        value={editingProfile.nombre || editingProfile.fullName || ""}
                        onChange={(e) => setEditingProfile(prev => ({ ...prev!, nombre: e.target.value }))}
                        required
                        className="border-2 border-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 rounded-lg px-3 py-2 text-sm transition-all duration-200"
                        placeholder="Nombre y apellido"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={editingProfile.email}
                        disabled
                        className="border-2 border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefono" className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        Teléfono
                      </Label>
                      <Input
                        id="telefono"
                        type="tel"
                        value={editingProfile.telefono || editingProfile.phone || ""}
                        onChange={(e) => setEditingProfile(prev => ({ ...prev!, telefono: e.target.value }))}
                        className="border-2 border-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 rounded-lg px-3 py-2 text-sm transition-all duration-200"
                        placeholder="Número de teléfono"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cuit" className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        DNI/CUIT
                      </Label>
                      <Input
                        id="cuit"
                        value={editingProfile.cuit || editingProfile.dni || ""}
                        className="border-2 border-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 rounded-lg px-3 py-2 text-sm transition-all duration-200"
                        placeholder="DNI o CUIT"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditingProfile(null)}
                      className="px-6 py-2 border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 rounded-xl font-semibold transition-all duration-200 hover:scale-105 text-sm"
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={saving}
                      className="px-6 py-2 bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900 text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 text-sm"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Guardando...
                        </>
                      ) : (
                        editingProfile.id ? "Actualizar" : "Crear"
                      )}
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          )}
        </div>
      </Card>
      </div>
    </main>
  );
} 