/**
 * Utilidades para parsear archivos XML de WordPress
 */

import { XMLParser } from 'fast-xml-parser';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Opciones de parseo para preservar CDATA y manejar arrays
 */
const parserOptions = {
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  ignoreNameSpace: false,
  allowBooleanAttributes: true,
  parseNodeValue: true,
  parseAttributeValue: true,
  trimValues: true,
  cdataTagName: '__cdata',
  cdataPositionChar: '\\c',
  parseTrueNumberOnly: false,
  arrayMode: false, // No convertir automáticamente a arrays
  stopNodes: ['*.pre', '*.script'], // No parsear estos nodos
  processEntities: true,
  htmlEntities: true,
};

const parser = new XMLParser(parserOptions);

/**
 * Lee y parsea un archivo XML de WordPress
 * 
 * @param xmlPath - Ruta relativa al archivo XML (desde la raíz del proyecto)
 * @returns Array de items del XML (json.rss.channel.item)
 */
export function parseWordPressXML(xmlPath: string): any[] {
  try {
    // Resolver la ruta absoluta
    const absolutePath = join(process.cwd(), xmlPath);
    
    // Leer el archivo
    const xmlContent = readFileSync(absolutePath, 'utf-8');
    
    // Parsear a JSON
    const json = parser.parse(xmlContent);
    
    // Extraer items del canal RSS
    const channel = json?.rss?.channel;
    if (!channel) {
      throw new Error('No se encontró el canal RSS en el XML');
    }
    
    // Normalizar items (puede ser array o objeto único)
    const items = Array.isArray(channel.item) 
      ? channel.item 
      : channel.item 
      ? [channel.item] 
      : [];
    
    return items;
  } catch (error) {
    console.error(`❌ Error al parsear XML ${xmlPath}:`, error);
    throw error;
  }
}

/**
 * Convierte una fecha de WordPress a Timestamp de Firestore
 * 
 * @param wpDate - Fecha en formato WordPress (ej: "Mon, 09 Mar 2020 22:53:06 +0000")
 * @returns Timestamp de Firestore
 */
export function wpDateToTimestamp(wpDate: string | undefined): any {
  if (!wpDate) {
    return null;
  }
  
  try {
    const date = new Date(wpDate);
    if (isNaN(date.getTime())) {
      console.warn(`⚠️ Fecha inválida: ${wpDate}`);
      return null;
    }
    
    // Para Firestore Admin SDK, usar Timestamp
    const { Timestamp } = require('firebase-admin/firestore');
    return Timestamp.fromDate(date);
  } catch (error) {
    console.warn(`⚠️ Error al convertir fecha ${wpDate}:`, error);
    return null;
  }
}

