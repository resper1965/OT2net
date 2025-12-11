import { initializeApp, cert, ServiceAccount, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { logger } from '../utils/logger';

// Interface para configuração do Firebase (via variável de ambiente JSON string)
interface FirebaseConfig {
  projectId: string;
  clientEmail: string;
  privateKey: string;
}

let firebaseApp: App | undefined;

function initializeFirebase() {
  if (firebaseApp) return;

  try {
    const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT;
    
    if (!serviceAccountStr) {
      logger.warn('FIREBASE_SERVICE_ACCOUNT não configurado. Autenticação falhará em produção.');
      return;
    }

    const serviceAccount = JSON.parse(serviceAccountStr) as ServiceAccount;

    firebaseApp = initializeApp({
      credential: cert(serviceAccount),
    });
    
    logger.info('Firebase Admin SDK inicializado');
  } catch (error: any) {
    logger.error({ error: error.message }, 'Erro ao inicializar Firebase Admin');
  }
}

export const firebaseAuth = {
  /**
   * Verifica token ID do Firebase e retorna o decoded token
   */
  verifyIdToken: async (token: string) => {
    initializeFirebase();
    if (!firebaseApp) throw new Error('Firebase não inicializado');
    
    return getAuth().verifyIdToken(token);
  },

  /**
   * Obtém usuário por UID
   */
  getUser: async (uid: string) => {
    initializeFirebase();
    if (!firebaseApp) throw new Error('Firebase não inicializado');
    
    return getAuth().getUser(uid);
  },
  
  /**
   * Define claims customizadas (para tenant_id e role)
   */
  setCustomUserClaims: async (uid: string, claims: object) => {
    initializeFirebase();
    if (!firebaseApp) throw new Error('Firebase não inicializado');
    
    return getAuth().setCustomUserClaims(uid, claims);
  }
};
