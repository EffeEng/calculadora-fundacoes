import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Furo } from './dados-furos';
import { Projeto } from './tipos-projeto';
import { gerarGraficoNSPT, gerarDiagramaCamadas } from './svg-charts';

/**
 * Exporta um relatório de estaca em PDF
 */
export async function exportarRelatorioPDF(
  furo: Furo,
  projeto: Projeto | undefined,
  diametro: number,
  padm: number,
  rp: number,
  rl: number
): Promise<void> {
  try {
    const html = gerarHTMLRelatorioPDF(furo, projeto, diametro, padm, rp, rl);

    // Usar expo-print para gerar PDF
    const { uri } = await Print.printToFileAsync({
      html,
      base64: false,
    });

    // Compartilhar o PDF
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: `Relatório - ${furo.nome}`,
      });
    } else {
      // Se não conseguir compartilhar, salvar no diretório de documentos
      const fileName = `relatorio_${furo.nome}_${Date.now()}.pdf`;
      const newPath = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.copyAsync({
        from: uri,
        to: newPath,
      });
      alert(`Relatório salvo em: ${newPath}`);
    }
  } catch (erro) {
    console.error('Erro ao exportar PDF:', erro);
    throw erro;
  }
}

/**
 * Gera HTML para o relatório em PDF
 */
function gerarHTMLRelatorioPDF(
  furo: Furo,
  projeto: Projeto | undefined,
  diametro: number,
  padm: number,
  rp: number,
  rl: number
): string {
  const graficoNSPT = gerarGraficoNSPT(furo);
  const diagramaCamadas = gerarDiagramaCamadas(furo, diametro);

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Relatório - ${furo.nome}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
          background-color: #fff;
          line-height: 1.6;
        }
        
        .container {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .header {
          border-bottom: 3px solid #0066CC;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        
        .header h1 {
          color: #0066CC;
          font-size: 28px;
          margin-bottom: 10px;
        }
        
        .header p {
          color: #666;
          font-size: 14px;
        }
        
        .section {
          margin-bottom: 30px;
          page-break-inside: avoid;
        }
        
        .section-title {
          background-color: #0066CC;
          color: white;
          padding: 12px 16px;
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 16px;
          border-radius: 4px;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }
        
        .info-box {
          background-color: #f5f5f5;
          padding: 12px;
          border-left: 4px solid #0066CC;
          border-radius: 4px;
        }
        
        .info-box label {
          display: block;
          font-size: 12px;
          color: #666;
          font-weight: bold;
          margin-bottom: 4px;
        }
        
        .info-box value {
          display: block;
          font-size: 16px;
          color: #333;
          font-weight: bold;
        }
        
        .highlight-box {
          background-color: #E6F4FE;
          border: 2px solid #0066CC;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          margin: 20px 0;
        }
        
        .highlight-box .label {
          font-size: 12px;
          color: #0066CC;
          font-weight: bold;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        
        .highlight-box .value {
          font-size: 36px;
          color: #0066CC;
          font-weight: bold;
        }
        
        .highlight-box .unit {
          font-size: 14px;
          color: #0066CC;
          margin-top: 8px;
        }
        
        .two-column {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }
        
        .column-box {
          background-color: #f9f9f9;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 16px;
          text-align: center;
        }
        
        .column-box .label {
          font-size: 12px;
          color: #666;
          font-weight: bold;
          margin-bottom: 8px;
        }
        
        .column-box .value {
          font-size: 24px;
          color: #0066CC;
          font-weight: bold;
        }
        
        .column-box .unit {
          font-size: 12px;
          color: #666;
          margin-top: 4px;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 16px;
        }
        
        table th {
          background-color: #0066CC;
          color: white;
          padding: 12px;
          text-align: left;
          font-weight: bold;
          font-size: 13px;
        }
        
        table td {
          padding: 10px 12px;
          border-bottom: 1px solid #ddd;
          font-size: 13px;
        }
        
        table tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        
        .chart-container {
          display: flex;
          justify-content: center;
          margin: 20px 0;
          page-break-inside: avoid;
        }
        
        .chart-container svg {
          max-width: 100%;
          height: auto;
        }
        
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
        
        .formula {
          background-color: #f0f0f0;
          padding: 12px;
          border-radius: 4px;
          text-align: center;
          font-family: 'Courier New', monospace;
          margin: 16px 0;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>Relatório de Análise de Fundação</h1>
          <p>Método Aoki-Velloso (1975) • ${new Date().toLocaleDateString('pt-BR')}</p>
        </div>
        
        <!-- Informações do Projeto -->
        ${projeto ? `
          <div class="section">
            <div class="section-title">Informações do Projeto</div>
            <div class="info-grid">
              <div class="info-box">
                <label>Projeto</label>
                <value>${projeto.nome}</value>
              </div>
              <div class="info-box">
                <label>Local</label>
                <value>${projeto.local}</value>
              </div>
              <div class="info-box">
                <label>Proprietário</label>
                <value>${projeto.proprietario}</value>
              </div>
              <div class="info-box">
                <label>Data</label>
                <value>${projeto.data}</value>
              </div>
            </div>
          </div>
        ` : ''}
        
        <!-- Informações do Furo -->
        <div class="section">
          <div class="section-title">Informações do Furo de Sondagem</div>
          <div class="info-grid">
            <div class="info-box">
              <label>Identificação</label>
              <value>${furo.nome}</value>
            </div>
            <div class="info-box">
              <label>Coordenadas</label>
              <value>${furo.coordenadas}</value>
            </div>
            <div class="info-box">
              <label>Profundidade Total</label>
              <value>${furo.profundidadeTotal.toFixed(2)} m</value>
            </div>
            <div class="info-box">
              <label>Nível d'Água</label>
              <value>${furo.nivelAgua.toFixed(2)} m</value>
            </div>
          </div>
        </div>
        
        <!-- Parâmetros da Estaca -->
        <div class="section">
          <div class="section-title">Parâmetros da Estaca</div>
          <div class="info-grid">
            <div class="info-box">
              <label>Diâmetro</label>
              <value>${diametro} cm</value>
            </div>
            <div class="info-box">
              <label>Número de Camadas</label>
              <value>${furo.camadas.length}</value>
            </div>
          </div>
        </div>
        
        <!-- Carga Admissível -->
        <div class="section">
          <div class="highlight-box">
            <div class="label">Carga Admissível (FS = 2)</div>
            <div class="value">${padm.toFixed(2)}</div>
            <div class="unit">kN</div>
          </div>
        </div>
        
        <!-- Componentes de Resistência -->
        <div class="section">
          <div class="section-title">Componentes de Resistência</div>
          <div class="two-column">
            <div class="column-box">
              <div class="label">Resistência de Ponta</div>
              <div class="value">${rp.toFixed(2)}</div>
              <div class="unit">kN</div>
            </div>
            <div class="column-box">
              <div class="label">Atrito Lateral</div>
              <div class="value">${rl.toFixed(2)}</div>
              <div class="unit">kN</div>
            </div>
          </div>
          <div class="formula">
            Padm = (Rp + Rl) / 2
          </div>
        </div>
        
        <!-- Gráfico de NSPT -->
        <div class="section">
          <div class="section-title">Gráfico de NSPT por Profundidade</div>
          <div class="chart-container">
            ${graficoNSPT}
          </div>
        </div>
        
        <!-- Diagrama Estratigráfico -->
        <div class="section">
          <div class="section-title">Diagrama Estratigráfico</div>
          <div class="chart-container">
            ${diagramaCamadas}
          </div>
        </div>
        
        <!-- Perfil de Sondagem -->
        <div class="section">
          <div class="section-title">Perfil de Sondagem Detalhado</div>
          <table>
            <thead>
              <tr>
                <th>Camada</th>
                <th>Altura (cm)</th>
                <th>NSPT</th>
                <th>Tipo de Solo</th>
              </tr>
            </thead>
            <tbody>
              ${furo.camadas.map((camada, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td>${camada.espessura}</td>
                  <td>${camada.nspt}</td>
                  <td>${camada.tipo.charAt(0).toUpperCase() + camada.tipo.slice(1)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <!-- Rodapé -->
        <div class="footer">
          <p>Calculadora de Fundações • Método Aoki-Velloso (1975)</p>
          <p>Gerado em ${new Date().toLocaleString('pt-BR')}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
