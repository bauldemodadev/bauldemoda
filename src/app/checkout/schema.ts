import { z } from 'zod'

// Paso 1: datos personales (depende si está logueado o no)
export const stepOneSchema = (isLoggedIn: boolean) =>
  z.object({
    nombre: z.string().min(1, 'Requerido'),
    email: isLoggedIn
      ? z.string().optional()
      : z.string().min(1, 'Requerido').email('Email inválido'),
    telefono: z.string().min(1, 'Requerido'),
    dni: z.string().min(1, 'Requerido'),
  })

export type Step1Data = z.infer<ReturnType<typeof stepOneSchema>>

// Paso 2: dirección y documento
export const stepTwoSchema = z.object({
    direccion: z.string().min(1, 'La dirección es obligatoria'),
    ciudad: z.string().min(1, 'La ciudad es obligatoria'),
    codigoPostal: z.string().min(1, 'El código postal es obligatorio'),
    metodoEntrega: z.enum(['envio', 'retiro'], {
      errorMap: () => ({ message: 'Seleccioná un método de entrega' }),
    }),
  })
  
  export type Step2Data = z.infer<typeof stepTwoSchema>

// Paso 3: facturación
export const stepThreeSchema = z.object({
  comment: z.string().optional(),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'Debes aceptar los términos y condiciones' }),
  }),
})

export type Step3Data = z.infer<typeof stepThreeSchema>
export const fullSchema = z
  .object({})
  .merge(stepOneSchema(false))
  .merge(stepTwoSchema)
  .merge(stepThreeSchema)

export type FormData = z.infer<typeof fullSchema>