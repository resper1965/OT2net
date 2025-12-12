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
exports.VertexAIService = void 0;
var vertexai_1 = require("@google-cloud/vertexai");
var logger_1 = require("../utils/logger");
var VertexAIService = /** @class */ (function () {
    function VertexAIService(project, location) {
        this.project = project || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "ot2net";
        this.location = location || "us-central1";
        this.vertexAI = new vertexai_1.VertexAI({
            project: this.project,
            location: this.location,
        });
        this.model = this.vertexAI.getGenerativeModel({
            model: "gemini-pro",
        });
        logger_1.logger.info({ project: this.project, location: this.location }, "Vertex AI Service initialized");
    }
    VertexAIService.prototype.generateBpmnJson = function (description) {
        return __awaiter(this, void 0, void 0, function () {
            var prompt, result, response, text, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prompt = "\n    You are a BPMN 2.0 expert. Your task is to analyze the following operational description and transform it into a strict BPMN 2.0 JSON structure.\n    \n    Description:\n    ".concat(description, "\n    \n    Return ONLY a valid JSON object with the following structure:\n    {\n      \"definitions\": {\n        \"process\": {\n          \"id\": \"Process_1\",\n          \"name\": \"derived from description\",\n          \"isExecutable\": false,\n          \"laneSets\": [\n            {\n              \"id\": \"LaneSet_1\",\n              \"lanes\": [\n                {\n                  \"id\": \"Lane_1\",\n                  \"name\": \"Actor/Role Name\",\n                  \"flowNodeRef\": [\"StartEvent_1\", \"Task_1\", ...]\n                }\n              ]\n            }\n          ],\n          \"flowElements\": [\n            { \"id\": \"StartEvent_1\", \"name\": \"Start\", \"type\": \"startEvent\", \"outgoing\": [\"Flow_1\"] },\n            { \"id\": \"Task_1\", \"name\": \"Task Name\", \"type\": \"task\", \"incoming\": [\"Flow_1\"], \"outgoing\": [\"Flow_2\"] },\n            { \"id\": \"EndEvent_1\", \"name\": \"End\", \"type\": \"endEvent\", \"incoming\": [\"Flow_X\"] },\n            { \"id\": \"Gateway_1\", \"name\": \"Decision?\", \"type\": \"exclusiveGateway\", \"incoming\": [...], \"outgoing\": [...] }\n          ],\n          \"sequenceFlows\": [\n            { \"id\": \"Flow_1\", \"sourceRef\": \"StartEvent_1\", \"targetRef\": \"Task_1\" }\n          ]\n        }\n      }\n    }\n    \n    Rules:\n    1. Identify all Actors/Roles and create Lanes for them.\n    2. Convert actions into Tasks.\n    3. Convert decisions into Exclusive Gateways.\n    4. Ensure logically connected Sequence Flows.\n    5. No markdown, no explanations. Just the JSON string.\n    ");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.model.generateContent(prompt)];
                    case 2:
                        result = _a.sent();
                        response = result.response;
                        if (!response.candidates || !response.candidates[0] || !response.candidates[0].content || !response.candidates[0].content.parts || !response.candidates[0].content.parts[0]) {
                            throw new Error("No response from Vertex AI");
                        }
                        text = response.candidates[0].content.parts[0].text || "{}";
                        // Clean up markdown code blocks if present
                        text = text.replace(/```json\n?|\n?```/g, "").trim();
                        return [2 /*return*/, JSON.parse(text)];
                    case 3:
                        error_1 = _a.sent();
                        logger_1.logger.error({ error: error_1 }, "Error generating BPMN JSON");
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    VertexAIService.prototype.generateResponse = function (prompt) {
        return __awaiter(this, void 0, void 0, function () {
            var result, response, text, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.model.generateContent(prompt)];
                    case 1:
                        result = _a.sent();
                        response = result.response;
                        if (!response.candidates || !response.candidates[0] || !response.candidates[0].content || !response.candidates[0].content.parts || !response.candidates[0].content.parts[0]) {
                            return [2 /*return*/, "No response generated"];
                        }
                        text = response.candidates[0].content.parts[0].text;
                        return [2 /*return*/, text || "No response generated"];
                    case 2:
                        error_2 = _a.sent();
                        logger_1.logger.error({ error: error_2 }, "Error generating content from Vertex AI");
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    VertexAIService.prototype.chat = function (history, message) {
        return __awaiter(this, void 0, void 0, function () {
            var chat, result, response, text, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        chat = this.model.startChat({
                            history: history,
                        });
                        return [4 /*yield*/, chat.sendMessage(message)];
                    case 1:
                        result = _a.sent();
                        response = result.response;
                        if (!response.candidates || !response.candidates[0] || !response.candidates[0].content || !response.candidates[0].content.parts || !response.candidates[0].content.parts[0]) {
                            return [2 /*return*/, "No response generated"];
                        }
                        text = response.candidates[0].content.parts[0].text;
                        return [2 /*return*/, text || "No response generated"];
                    case 2:
                        error_3 = _a.sent();
                        logger_1.logger.error({ error: error_3 }, "Error in chat with Vertex AI");
                        throw error_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return VertexAIService;
}());
exports.VertexAIService = VertexAIService;
