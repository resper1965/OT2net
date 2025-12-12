import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Estilos do documento PDF
const styles = StyleSheet.create({
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

interface OnboardingData {
  projeto: {
    nome: string;
    descricao?: string;
    fase_atual?: string;
    created_at: string;
  };
  organizacao?: {
    nome: string;
    cnpj?: string;
    classificacao?: string;
  };
  empresas: Array<{
    identificacao: string;
    tipo?: string;
    status?: string;
  }>;
  sites: Array<{
    nome: string;
    tipo_instalacao?: string;
    localizacao?: string;
  }>;
  membrosEquipe: Array<{
    nome: string;
    tipo: string;
    cargo?: string;
    papel?: string;
  }>;
}

export const OnboardingPDFDocument: React.FC<{ data: OnboardingData }> = ({ data }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Relatório de Onboarding</Text>
          <Text style={styles.subtitle}>Projeto: {data.projeto.nome}</Text>
          <Text style={styles.subtitle}>Gerado em: {formatDate(new Date().toISOString())}</Text>
        </View>

        {/* Informações do Projeto */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Informações do Projeto</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Nome:</Text>
            <Text style={styles.value}>{data.projeto.nome}</Text>
          </View>
          {data.projeto.descricao && (
            <View style={styles.row}>
              <Text style={styles.label}>Descrição:</Text>
              <Text style={styles.value}>{data.projeto.descricao}</Text>
            </View>
          )}
          {data.projeto.fase_atual && (
            <View style={styles.row}>
              <Text style={styles.label}>Fase Atual:</Text>
              <Text style={styles.value}>{data.projeto.fase_atual}</Text>
            </View>
          )}
          <View style={styles.row}>
            <Text style={styles.label}>Data de Criação:</Text>
            <Text style={styles.value}>{formatDate(data.projeto.created_at)}</Text>
          </View>
        </View>

        {/* Organização */}
        {data.organizacao && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏢 Organização</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Nome:</Text>
              <Text style={styles.value}>{data.organizacao.nome}</Text>
            </View>
            {data.organizacao.cnpj && (
              <View style={styles.row}>
                <Text style={styles.label}>CNPJ:</Text>
                <Text style={styles.value}>{data.organizacao.cnpj}</Text>
              </View>
            )}
            {data.organizacao.classificacao && (
              <View style={styles.row}>
                <Text style={styles.label}>Classificação:</Text>
                <Text style={styles.value}>{data.organizacao.classificacao}</Text>
              </View>
            )}
          </View>
        )}

        {/* Empresas */}
        {data.empresas.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏭 Empresas ({data.empresas.length})</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableCol}>Identificação</Text>
                <Text style={styles.tableCol}>Tipo</Text>
                <Text style={styles.tableCol}>Status</Text>
              </View>
              {data.empresas.map((empresa, idx) => (
                <View key={idx} style={styles.tableRow}>
                  <Text style={styles.tableCol}>{empresa.identificacao}</Text>
                  <Text style={styles.tableCol}>{empresa.tipo || '-'}</Text>
                  <Text style={styles.tableCol}>{empresa.status || '-'}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Sites */}
        {data.sites.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📍 Sites/Instalações ({data.sites.length})</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableCol}>Nome</Text>
                <Text style={styles.tableCol}>Tipo</Text>
                <Text style={styles.tableCol}>Localização</Text>
              </View>
              {data.sites.slice(0, 10).map((site, idx) => (
                <View key={idx} style={styles.tableRow}>
                  <Text style={styles.tableCol}>{site.nome}</Text>
                  <Text style={styles.tableCol}>{site.tipo_instalacao || '-'}</Text>
                  <Text style={styles.tableCol}>{site.localizacao || '-'}</Text>
                </View>
              ))}
              {data.sites.length > 10 && (
                <Text style={{ fontSize: 9, color: '#666', marginTop: 5 }}>
                  ... e mais {data.sites.length - 10} sites
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Equipe & Stakeholders */}
        {data.membrosEquipe.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>👥 Equipe & Stakeholders ({data.membrosEquipe.length})</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableCol}>Nome</Text>
                <Text style={styles.tableCol}>Tipo</Text>
                <Text style={styles.tableCol}>Cargo/Papel</Text>
              </View>
              {data.membrosEquipe.slice(0, 15).map((membro, idx) => (
                <View key={idx} style={styles.tableRow}>
                  <Text style={styles.tableCol}>{membro.nome}</Text>
                  <Text style={[styles.tableCol, { fontSize: 8 }]}>{membro.tipo}</Text>
                  <Text style={styles.tableCol}>{membro.cargo || membro.papel || '-'}</Text>
                </View>
              ))}
              {data.membrosEquipe.length > 15 && (
                <Text style={{ fontSize: 9, color: '#666', marginTop: 5 }}>
                  ... e mais {data.membrosEquipe.length - 15} membros
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>OT2net - Plataforma de Governança em Tecnologia Operacional</Text>
          <Text>Relatório gerado automaticamente em {formatDate(new Date().toISOString())}</Text>
        </View>
      </Page>
    </Document>
  );
};
