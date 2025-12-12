"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MermaidGeneratorService = void 0;
/**
 * Gera um diagrama Mermaid a partir de um processo normalizado
 */
var MermaidGeneratorService = /** @class */ (function () {
    function MermaidGeneratorService() {
    }
    /**
     * Gera um diagrama de fluxo Mermaid para um processo
     */
    MermaidGeneratorService.generateFlowchart = function (processo) {
        var etapas = processo.processo_etapas || [];
        var etapasOrdenadas = __spreadArray([], etapas, true).sort(function (a, b) { return a.ordem - b.ordem; });
        var mermaid = 'graph TD\n';
        mermaid += "    Start([".concat(processo.nome, "])\n");
        if (processo.gatilho) {
            mermaid += "    Trigger[Gatilho: ".concat(processo.gatilho, "]\n");
            mermaid += "    Start --> Trigger\n";
        }
        if (etapasOrdenadas.length === 0) {
            mermaid += "    Start --> End([Fim])\n";
        }
        else {
            etapasOrdenadas.forEach(function (etapa, index) {
                var nodeId = "E".concat(index + 1);
                var label = etapa.nome.length > 30
                    ? "".concat(etapa.nome.substring(0, 27), "...")
                    : etapa.nome;
                mermaid += "    ".concat(nodeId, "[").concat(label, "]\n");
                if (index === 0) {
                    if (processo.gatilho) {
                        mermaid += "    Trigger --> ".concat(nodeId, "\n");
                    }
                    else {
                        mermaid += "    Start --> ".concat(nodeId, "\n");
                    }
                }
                else {
                    var prevNodeId = "E".concat(index);
                    mermaid += "    ".concat(prevNodeId, " --> ").concat(nodeId, "\n");
                }
                if (index === etapasOrdenadas.length - 1) {
                    mermaid += "    ".concat(nodeId, " --> End([Fim])\n");
                }
            });
        }
        // Adicionar estilo
        mermaid += "    style Start fill:#00ade8,stroke:#333,stroke-width:2px,color:#fff\n";
        mermaid += "    style End fill:#00ade8,stroke:#333,stroke-width:2px,color:#fff\n";
        return mermaid;
    };
    /**
     * Gera um diagrama de sequência Mermaid para um processo
     */
    MermaidGeneratorService.generateSequence = function (processo) {
        var etapas = processo.processo_etapas || [];
        var etapasOrdenadas = __spreadArray([], etapas, true).sort(function (a, b) { return a.ordem - b.ordem; });
        var mermaid = 'sequenceDiagram\n';
        mermaid += "    participant User as Usu\u00E1rio\n";
        mermaid += "    participant System as Sistema\n";
        if (processo.gatilho) {
            mermaid += "    User->>System: ".concat(processo.gatilho, "\n");
        }
        etapasOrdenadas.forEach(function (etapa, index) {
            mermaid += "    System->>System: ".concat(etapa.nome, "\n");
            if (etapa.descricao) {
                mermaid += "    Note over System: ".concat(etapa.descricao.substring(0, 50), "\n");
            }
        });
        mermaid += "    System->>User: Processo conclu\u00EDdo\n";
        return mermaid;
    };
    /**
     * Gera um diagrama de estado Mermaid para um processo
     */
    MermaidGeneratorService.generateStateDiagram = function (processo) {
        var etapas = processo.processo_etapas || [];
        var etapasOrdenadas = __spreadArray([], etapas, true).sort(function (a, b) { return a.ordem - b.ordem; });
        var mermaid = 'stateDiagram-v2\n';
        mermaid += "    [*] --> Inicio: ".concat(processo.gatilho || 'Início', "\n");
        etapasOrdenadas.forEach(function (etapa, index) {
            var stateName = etapa.nome.replace(/[^a-zA-Z0-9]/g, '_');
            mermaid += "    ".concat(index === 0 ? 'Inicio' : etapasOrdenadas[index - 1].nome.replace(/[^a-zA-Z0-9]/g, '_'), " --> ").concat(stateName, ": ").concat(etapa.nome, "\n");
        });
        if (etapasOrdenadas.length > 0) {
            var lastState = etapasOrdenadas[etapasOrdenadas.length - 1].nome.replace(/[^a-zA-Z0-9]/g, '_');
            mermaid += "    ".concat(lastState, " --> [*]: Conclu\u00EDdo\n");
        }
        else {
            mermaid += "    Inicio --> [*]: Conclu\u00EDdo\n";
        }
        return mermaid;
    };
    return MermaidGeneratorService;
}());
exports.MermaidGeneratorService = MermaidGeneratorService;
