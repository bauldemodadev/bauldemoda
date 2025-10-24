"use client";

import { ProjectContact as ProjectContactType } from '@/types/project';
import { motion } from 'framer-motion';
import { beauty } from '@/styles/fonts';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle,
  Send,
  Facebook,
  Instagram,
  Twitter
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ProjectContactProps {
  contact: ProjectContactType;
}

const ProjectContact = ({ contact }: ProjectContactProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Aquí iría la lógica para enviar el formulario
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulación
      toast.success('Mensaje enviado correctamente. Te contactaremos pronto.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      toast.error('Error al enviar el mensaje. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return <Facebook className="h-5 w-5" />;
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
      case 'twitter':
        return <Twitter className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section className="py-20 lg:py-32 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className={cn([
            beauty.className,
            "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8"
          ])}>
            {contact.title}
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto leading-relaxed">
            {contact.description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Phone */}
            <motion.div variants={itemVariants} className="flex items-start space-x-4">
              <div className="bg-white/10 p-3 rounded-xl">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Teléfono</h3>
                <a 
                  href={`tel:${contact.phone}`}
                  className="text-gray-300 hover:text-white transition-colors text-base sm:text-lg"
                >
                  {contact.phone}
                </a>
              </div>
            </motion.div>

            {/* Email */}
            <motion.div variants={itemVariants} className="flex items-start space-x-4">
              <div className="bg-white/10 p-3 rounded-xl">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Email</h3>
                <a 
                  href={`mailto:${contact.email}`}
                  className="text-gray-300 hover:text-white transition-colors text-base sm:text-lg"
                >
                  {contact.email}
                </a>
              </div>
            </motion.div>

            {/* WhatsApp */}
            <motion.div variants={itemVariants} className="flex items-start space-x-4">
              <div className="bg-green-500 p-3 rounded-xl">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">WhatsApp</h3>
                <a 
                  href={`https://wa.me/${contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors text-base sm:text-lg"
                >
                  {contact.whatsapp}
                </a>
              </div>
            </motion.div>

            {/* Address */}
            <motion.div variants={itemVariants} className="flex items-start space-x-4">
              <div className="bg-white/10 p-3 rounded-xl">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Dirección</h3>
                <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                  {contact.address}
                </p>
              </div>
            </motion.div>

            {/* Working Hours */}
            <motion.div variants={itemVariants} className="flex items-start space-x-4">
              <div className="bg-white/10 p-3 rounded-xl">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Horarios</h3>
                <div className="space-y-1">
                  {contact.workingHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between text-gray-300">
                      <span>{schedule.day}</span>
                      <span>{schedule.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Social Links */}
            {contact.socialLinks.length > 0 && (
              <motion.div variants={itemVariants} className="pt-8">
                <h3 className="text-lg sm:text-xl font-semibold mb-4">Síguenos</h3>
                <div className="flex space-x-4">
                  {contact.socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-colors"
                    >
                      {getSocialIcon(social.platform)}
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 lg:p-10"
          >
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 sm:mb-8">
              Envíanos un mensaje
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold mb-2">
                    Nombre *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-white/40"
                    placeholder="Tu nombre completo"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold mb-2">
                    Teléfono
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-white/40"
                    placeholder="Tu número de teléfono"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold mb-2">
                  Email *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-white/40"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold mb-2">
                  Mensaje *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-white/40 resize-none"
                  placeholder="Cuéntanos sobre tu proyecto..."
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-black hover:bg-gray-100 py-4 text-lg font-semibold group"
              >
                {isSubmitting ? (
                  "Enviando..."
                ) : (
                  <>
                    Enviar Mensaje
                    <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProjectContact;
