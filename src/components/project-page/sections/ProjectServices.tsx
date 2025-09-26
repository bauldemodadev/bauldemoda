"use client";

import { ProjectService } from '@/types/project';
import { motion } from 'framer-motion';
import { integralCF } from '@/styles/fonts';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface ProjectServicesProps {
  services: ProjectService[];
}

const ProjectServices = ({ services }: ProjectServicesProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8 }
    }
  };

  return (
    <section className="py-20 lg:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className={cn([
            integralCF.className,
            "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 text-gray-900"
          ])}>
            Nuestros Servicios
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto leading-relaxed">
            Ofrecemos una amplia gama de servicios especializados en carpintería y construcción
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-16"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              className={cn([
                "grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center",
                index % 2 === 1 && "lg:grid-flow-col-dense"
              ])}
            >
              {/* Image */}
              <div className={cn([
                "relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl",
                index % 2 === 1 && "lg:col-start-2"
              ])}>
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Content */}
              <div className={cn([
                "space-y-8",
                index % 2 === 1 && "lg:col-start-1 lg:row-start-1"
              ])}>
                <div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-gray-900">
                    {service.title}
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  {service.features.map((feature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: featureIndex * 0.1 }}
                      className="flex items-center space-x-3"
                    >
                      <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                      <span className="text-sm sm:text-base md:text-lg text-gray-700">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Price */}
                {service.price && (
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider">
                          Desde
                        </p>
                        <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                          {service.price.currency}{service.price.from.toLocaleString()}
                          <span className="text-sm sm:text-base md:text-lg text-gray-500">/{service.price.unit}</span>
                        </p>
                      </div>
                      <Link href="/contact">
                        <Button className="bg-black hover:bg-gray-800 text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base group">
                          Cotizar
                          <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}

                {!service.price && (
                  <Link href="/contact">
                    <Button className="bg-black hover:bg-gray-800 text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg group">
                      Solicitar Cotización
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectServices;
