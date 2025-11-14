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

// Paso 2: método de pago (eliminado StepTwo de dirección de envío según FASE 7)
export const stepTwoSchema = z.object({
  paymentMethod: z.enum(['mp', 'cash', 'transfer'], {
    errorMap: () => ({ message: 'Seleccioná un método de pago' }),
  }),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'Debes aceptar los términos y condiciones',
  }),
  comment: z.string().optional(),
})

export type Step2Data = z.infer<typeof stepTwoSchema>

// Mantener Step3Data para compatibilidad, pero ahora será igual a Step2Data
export type Step3Data = Step2Data
export const stepThreeSchema = stepTwoSchema

export const fullSchema = z
  .object({})
  .merge(stepOneSchema(false))
  .merge(stepTwoSchema)

export type FormData = z.infer<typeof fullSchema>