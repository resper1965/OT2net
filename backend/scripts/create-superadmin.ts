
import * as admin from 'firebase-admin';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Initialize Firebase Admin
if (!admin.apps.length) {
  // Try to load service account from common locations
  let serviceAccount: any;
  try {
    // Tenta caminho relativo ao script (se rodando de backend/)
    serviceAccount = require('../../infrastructure/terraform/sa-key.json');
  } catch (e) {
    console.warn('Could not load sa-key.json locally. Relying on default credentials.');
  }

  admin.initializeApp({
    credential: serviceAccount ? admin.credential.cert(serviceAccount) : admin.credential.applicationDefault(),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'ot2net',
  });
}

const prisma = new PrismaClient();

async function createSuperAdmin() {
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.error('Usage: tsx scripts/create-superadmin.ts <email> <password>');
    process.exit(1);
  }

  try {
    console.log(`Creating user ${email}...`);

    let uid;
    try {
      // 1. Create in Firebase Auth
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName: 'Super Admin',
        emailVerified: true,
      });
      uid = userRecord.uid;
      console.log(`Firebase User created: ${uid}`);
    } catch (e: any) {
      if (e.code === 'auth/email-already-exists') {
        console.log('User already exists in Firebase, fetching UID...');
        const user = await admin.auth().getUserByEmail(email);
        uid = user.uid;
      } else {
        throw e;
      }
    }

    // 2. Set Custom Claims (Admin Role)
    await admin.auth().setCustomUserClaims(uid, {
      role: 'ADMIN', // Using 'ADMIN' to match usePermissions.ts
      tenant_id: 'global',
    });
    console.log('Custom Claims set: { role: "ADMIN", tenant_id: "global" }');

    // 3. Create/Update in Prisma
    const upsertUser = await prisma.usuario.upsert({
      where: { email },
      update: {
        perfil: 'Administrador', // UI Display role
        status: 'ativo',
        supabase_user_id: uid, // We map Firebase UID to this field for now
      },
      create: {
        email,
        nome: 'Super Administrator',
        perfil: 'Administrador',
        status: 'ativo',
        supabase_user_id: uid, // We map Firebase UID to this field for now
      },
    });

    console.log('Database record upserted:', upsertUser.id);
    console.log('✅ Superadmin created successfully!');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSuperAdmin();
