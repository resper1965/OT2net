"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnboardingPDFDocument = void 0;
var react_1 = require("react");
var renderer_1 = require("@react-pdf/renderer");
// Estilos do documento PDF
var styles = renderer_1.StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 11,
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 20,
        borderBottom: '2 solid #00ade8',
        paddingBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00ade8',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
    },
    section: {
        marginTop: 15,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
        borderBottom: '1 solid #ddd',
        paddingBottom: 4,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    label: {
        width: '30%',
        fontWeight: 'bold',
        color: '#555',
    },
    value: {
        width: '70%',
        color: '#333',
    },
    table: {
        marginTop: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        padding: 6,
        fontWeight: 'bold',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottom: '1 solid #eee',
        padding: 6,
    },
    tableCol: {
        width: '33%',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: 'center',
        color: '#999',
        fontSize: 9,
        borderTop: '1 solid #ddd',
        paddingTop: 10,
    },
    chip: {
        backgroundColor: '#e3f2fd',
        color: '#1976d2',
        padding: '3 8',
        borderRadius: 4,
        fontSize: 9,
        marginRight: 5,
        display: 'inline-block',
    },
});
var OnboardingPDFDocument = function (_a) {
    var data = _a.data;
    var formatDate = function (dateString) {
        return new Date(dateString).toLocaleDateString('pt-BR');
    };
    return (<renderer_1.Document>
      <renderer_1.Page size="A4" style={styles.page}>
        {/* Header */}
        <renderer_1.View style={styles.header}>
          <renderer_1.Text style={styles.title}>Relatório de Onboarding</renderer_1.Text>
          <renderer_1.Text style={styles.subtitle}>Projeto: {data.projeto.nome}</renderer_1.Text>
          <renderer_1.Text style={styles.subtitle}>Gerado em: {formatDate(new Date().toISOString())}</renderer_1.Text>
        </renderer_1.View>

        {/* Informações do Projeto */}
        <renderer_1.View style={styles.section}>
          <renderer_1.Text style={styles.sectionTitle}>📋 Informações do Projeto</renderer_1.Text>
          <renderer_1.View style={styles.row}>
            <renderer_1.Text style={styles.label}>Nome:</renderer_1.Text>
            <renderer_1.Text style={styles.value}>{data.projeto.nome}</renderer_1.Text>
          </renderer_1.View>
          {data.projeto.descricao && (<renderer_1.View style={styles.row}>
              <renderer_1.Text style={styles.label}>Descrição:</renderer_1.Text>
              <renderer_1.Text style={styles.value}>{data.projeto.descricao}</renderer_1.Text>
            </renderer_1.View>)}
          {data.projeto.fase_atual && (<renderer_1.View style={styles.row}>
              <renderer_1.Text style={styles.label}>Fase Atual:</renderer_1.Text>
              <renderer_1.Text style={styles.value}>{data.projeto.fase_atual}</renderer_1.Text>
            </renderer_1.View>)}
          <renderer_1.View style={styles.row}>
            <renderer_1.Text style={styles.label}>Data de Criação:</renderer_1.Text>
            <renderer_1.Text style={styles.value}>{formatDate(data.projeto.created_at)}</renderer_1.Text>
          </renderer_1.View>
        </renderer_1.View>

        {/* Organização */}
        {data.organizacao && (<renderer_1.View style={styles.section}>
            <renderer_1.Text style={styles.sectionTitle}>🏢 Organização</renderer_1.Text>
            <renderer_1.View style={styles.row}>
              <renderer_1.Text style={styles.label}>Nome:</renderer_1.Text>
              <renderer_1.Text style={styles.value}>{data.organizacao.nome}</renderer_1.Text>
            </renderer_1.View>
            {data.organizacao.cnpj && (<renderer_1.View style={styles.row}>
                <renderer_1.Text style={styles.label}>CNPJ:</renderer_1.Text>
                <renderer_1.Text style={styles.value}>{data.organizacao.cnpj}</renderer_1.Text>
              </renderer_1.View>)}
            {data.organizacao.classificacao && (<renderer_1.View style={styles.row}>
                <renderer_1.Text style={styles.label}>Classificação:</renderer_1.Text>
                <renderer_1.Text style={styles.value}>{data.organizacao.classificacao}</renderer_1.Text>
              </renderer_1.View>)}
          </renderer_1.View>)}

        {/* Empresas */}
        {data.empresas.length > 0 && (<renderer_1.View style={styles.section}>
            <renderer_1.Text style={styles.sectionTitle}>🏭 Empresas ({data.empresas.length})</renderer_1.Text>
            <renderer_1.View style={styles.table}>
              <renderer_1.View style={styles.tableHeader}>
                <renderer_1.Text style={styles.tableCol}>Identificação</renderer_1.Text>
                <renderer_1.Text style={styles.tableCol}>Tipo</renderer_1.Text>
                <renderer_1.Text style={styles.tableCol}>Status</renderer_1.Text>
              </renderer_1.View>
              {data.empresas.map(function (empresa, idx) { return (<renderer_1.View key={idx} style={styles.tableRow}>
                  <renderer_1.Text style={styles.tableCol}>{empresa.identificacao}</renderer_1.Text>
                  <renderer_1.Text style={styles.tableCol}>{empresa.tipo || '-'}</renderer_1.Text>
                  <renderer_1.Text style={styles.tableCol}>{empresa.status || '-'}</renderer_1.Text>
                </renderer_1.View>); })}
            </renderer_1.View>
          </renderer_1.View>)}

        {/* Sites */}
        {data.sites.length > 0 && (<renderer_1.View style={styles.section}>
            <renderer_1.Text style={styles.sectionTitle}>📍 Sites/Instalações ({data.sites.length})</renderer_1.Text>
            <renderer_1.View style={styles.table}>
              <renderer_1.View style={styles.tableHeader}>
                <renderer_1.Text style={styles.tableCol}>Nome</renderer_1.Text>
                <renderer_1.Text style={styles.tableCol}>Tipo</renderer_1.Text>
                <renderer_1.Text style={styles.tableCol}>Localização</renderer_1.Text>
              </renderer_1.View>
              {data.sites.slice(0, 10).map(function (site, idx) { return (<renderer_1.View key={idx} style={styles.tableRow}>
                  <renderer_1.Text style={styles.tableCol}>{site.nome}</renderer_1.Text>
                  <renderer_1.Text style={styles.tableCol}>{site.tipo_instalacao || '-'}</renderer_1.Text>
                  <renderer_1.Text style={styles.tableCol}>{site.localizacao || '-'}</renderer_1.Text>
                </renderer_1.View>); })}
              {data.sites.length > 10 && (<renderer_1.Text style={{ fontSize: 9, color: '#666', marginTop: 5 }}>
                  ... e mais {data.sites.length - 10} sites
                </renderer_1.Text>)}
            </renderer_1.View>
          </renderer_1.View>)}

        {/* Equipe & Stakeholders */}
        {data.membrosEquipe.length > 0 && (<renderer_1.View style={styles.section}>
            <renderer_1.Text style={styles.sectionTitle}>👥 Equipe & Stakeholders ({data.membrosEquipe.length})</renderer_1.Text>
            <renderer_1.View style={styles.table}>
              <renderer_1.View style={styles.tableHeader}>
                <renderer_1.Text style={styles.tableCol}>Nome</renderer_1.Text>
                <renderer_1.Text style={styles.tableCol}>Tipo</renderer_1.Text>
                <renderer_1.Text style={styles.tableCol}>Cargo/Papel</renderer_1.Text>
              </renderer_1.View>
              {data.membrosEquipe.slice(0, 15).map(function (membro, idx) { return (<renderer_1.View key={idx} style={styles.tableRow}>
                  <renderer_1.Text style={styles.tableCol}>{membro.nome}</renderer_1.Text>
                  <renderer_1.Text style={[styles.tableCol, { fontSize: 8 }]}>{membro.tipo}</renderer_1.Text>
                  <renderer_1.Text style={styles.tableCol}>{membro.cargo || membro.papel || '-'}</renderer_1.Text>
                </renderer_1.View>); })}
              {data.membrosEquipe.length > 15 && (<renderer_1.Text style={{ fontSize: 9, color: '#666', marginTop: 5 }}>
                  ... e mais {data.membrosEquipe.length - 15} membros
                </renderer_1.Text>)}
            </renderer_1.View>
          </renderer_1.View>)}

        {/* Footer */}
        <renderer_1.View style={styles.footer}>
          <renderer_1.Text>OT2net - Plataforma de Governança em Tecnologia Operacional</renderer_1.Text>
          <renderer_1.Text>Relatório gerado automaticamente em {formatDate(new Date().toISOString())}</renderer_1.Text>
        </renderer_1.View>
      </renderer_1.Page>
    </renderer_1.Document>);
};
exports.OnboardingPDFDocument = OnboardingPDFDocument;
