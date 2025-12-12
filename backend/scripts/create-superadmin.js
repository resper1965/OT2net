"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var admin = require("firebase-admin");
var client_1 = require("@prisma/client");
var dotenv = require("dotenv");
var path = require("path");
// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env') });
// Initialize Firebase Admin
if (!admin.apps.length) {
    // Try to load service account from common locations
    var serviceAccount = void 0;
    try {
        // Tenta caminho relativo ao script (se rodando de backend/)
        serviceAccount = require('../../infrastructure/terraform/sa-key.json');
    }
    catch (e) {
        console.warn('Could not load sa-key.json locally. Relying on default credentials.');
    }
    admin.initializeApp({
        credential: serviceAccount ? admin.credential.cert(serviceAccount) : admin.credential.applicationDefault(),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'ot2net',
    });
}
var prisma = new client_1.PrismaClient();
function createSuperAdmin() {
    return __awaiter(this, void 0, void 0, function () {
        var email, password, uid, userRecord, e_1, user, upsertUser, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    email = process.argv[2];
                    password = process.argv[3];
                    if (!email || !password) {
                        console.error('Usage: tsx scripts/create-superadmin.ts <email> <password>');
                        process.exit(1);
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 11, 12, 14]);
                    console.log("Creating user ".concat(email, "..."));
                    uid = void 0;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 8]);
                    return [4 /*yield*/, admin.auth().createUser({
                            email: email,
                            password: password,
                            displayName: 'Super Admin',
                            emailVerified: true,
                        })];
                case 3:
                    userRecord = _a.sent();
                    uid = userRecord.uid;
                    console.log("Firebase User created: ".concat(uid));
                    return [3 /*break*/, 8];
                case 4:
                    e_1 = _a.sent();
                    if (!(e_1.code === 'auth/email-already-exists')) return [3 /*break*/, 6];
                    console.log('User already exists in Firebase, fetching UID...');
                    return [4 /*yield*/, admin.auth().getUserByEmail(email)];
                case 5:
                    user = _a.sent();
                    uid = user.uid;
                    return [3 /*break*/, 7];
                case 6: throw e_1;
                case 7: return [3 /*break*/, 8];
                case 8: 
                // 2. Set Custom Claims (Admin Role)
                return [4 /*yield*/, admin.auth().setCustomUserClaims(uid, {
                        role: 'ADMIN', // Using 'ADMIN' to match usePermissions.ts
                        tenant_id: 'global',
                    })];
                case 9:
                    // 2. Set Custom Claims (Admin Role)
                    _a.sent();
                    console.log('Custom Claims set: { role: "ADMIN", tenant_id: "global" }');
                    return [4 /*yield*/, prisma.usuario.upsert({
                            where: { email: email },
                            update: {
                                perfil: 'Administrador', // UI Display role
                                status: 'ativo',
                                supabase_user_id: uid, // We map Firebase UID to this field for now
                            },
                            create: {
                                email: email,
                                nome: 'Super Administrator',
                                perfil: 'Administrador',
                                status: 'ativo',
                                supabase_user_id: uid, // We map Firebase UID to this field for now
                            },
                        })];
                case 10:
                    upsertUser = _a.sent();
                    console.log('Database record upserted:', upsertUser.id);
                    console.log('✅ Superadmin created successfully!');
                    return [3 /*break*/, 14];
                case 11:
                    error_1 = _a.sent();
                    console.error('Error:', error_1);
                    return [3 /*break*/, 14];
                case 12: return [4 /*yield*/, prisma.$disconnect()];
                case 13:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 14: return [2 /*return*/];
            }
        });
    });
}
createSuperAdmin();
