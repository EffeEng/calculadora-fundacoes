import { Projeto } from './tipos-projeto';
import { Furo } from './dados-furos';
import { Camada } from './types';
import { gerarGraficoNSPT, gerarDiagramaCamadas } from './svg-charts';

/**
 * Utilitário para gerar relatórios em PDF com design profissional
 * Utiliza a biblioteca react-native-html-to-pdf para gerar PDFs
 */

export interface RelatorioEstaca {
  furo: Furo;
  diametro: number; // em cm
  padm: number; // Carga admissível em kN
  rp: number; // Resistência de ponta em kN
  rl: number; // Resistência por atrito lateral em kN
  kv: number; // Coeficiente de mola vertical
  kh: number; // Coeficiente de mola horizontal
}

export interface RelatorioFuro {
  furo: Furo;
  projeto: Projeto;
  data: string;
}

/**
 * Gera HTML para relatório de análise de resistência de estaca
 */
export function gerarHTMLRelatorioEstaca(relatorio: RelatorioEstaca): string {
  const { furo, diametro, padm, rp, rl, kv, kh } = relatorio;
  
  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Relatório de Análise de Estaca</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
          line-height: 1.6;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 210mm;
          height: 297mm;
          margin: 0 auto;
          padding: 20mm;
          background-color: white;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
          border-bottom: 3px solid #0066CC;
          padding-bottom: 15px;
          margin-bottom: 20px;
        }
        .header h1 {
          color: #0066CC;
          font-size: 24px;
          margin-bottom: 5px;
        }
        .header p {
          color: #666;
          font-size: 12px;
        }
        .section {
          margin-bottom: 20px;
        }
        .section-title {
          background-color: #0066CC;
          color: white;
          padding: 8px 12px;
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 10px;
          border-radius: 4px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 15px;
        }
        .info-item {
          border-left: 3px solid #0066CC;
          padding-left: 10px;
        }
        .info-label {
          font-size: 11px;
          color: #666;
          font-weight: bold;
          text-transform: uppercase;
          margin-bottom: 3px;
        }
        .info-value {
          font-size: 16px;
          color: #333;
          font-weight: bold;
        }
        .highlight {
          background-color: #E6F4FE;
          padding: 15px;
          border-radius: 4px;
          border-left: 4px solid #0066CC;
          margin: 15px 0;
        }
        .highlight-title {
          font-size: 12px;
          color: #0066CC;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .highlight-value {
          font-size: 20px;
          color: #0066CC;
          font-weight: bold;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 15px 0;
          font-size: 11px;
        }
        th {
          background-color: #0066CC;
          color: white;
          padding: 8px;
          text-align: left;
          font-weight: bold;
        }
        td {
          padding: 8px;
          border-bottom: 1px solid #ddd;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        .footer {
          margin-top: 30px;
          padding-top: 10px;
          border-top: 1px solid #ddd;
          font-size: 10px;
          color: #999;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Relatório de Análise de Estaca</h1>
          <p>Método Aoki-Velloso (1975) | Coeficiente de Segurança = 2</p>
        </div>

        <div class="section">
          <div class="section-title">Informações do Furo</div>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Furo</div>
              <div class="info-value">${furo.nome}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Coordenadas</div>
              <div class="info-value" style="font-size: 12px;">${furo.coordenadas}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Profundidade Total</div>
              <div class="info-value">${furo.profundidadeTotal} m</div>
            </div>
            <div class="info-item">
              <div class="info-label">Nível d'Água</div>
              <div class="info-value">${furo.nivelAgua} m</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Parâmetros da Estaca</div>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Diâmetro</div>
              <div class="info-value">${diametro} cm</div>
            </div>
            <div class="info-item">
              <div class="info-label">Número de Camadas</div>
              <div class="info-value">${furo.camadas.length}</div>
            </div>
          </div>
        </div>

        <div class="highlight">
          <div class="highlight-title">Carga Admissível (Padm)</div>
          <div class="highlight-value">${padm.toFixed(2)} kN</div>
        </div>

        <div class="section">
          <div class="section-title">Componentes de Resistência</div>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Resistência de Ponta (Rp)</div>
              <div class="info-value">${rp.toFixed(2)} kN</div>
            </div>
            <div class="info-item">
              <div class="info-label">Atrito Lateral (Rl)</div>
              <div class="info-value">${rl.toFixed(2)} kN</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Parâmetros Elásticos (Molas)</div>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Coeficiente Vertical (Kv)</div>
              <div class="info-value">${kv.toFixed(2)} kN/m</div>
            </div>
            <div class="info-item">
              <div class="info-label">Coeficiente Horizontal (Kh)</div>
              <div class="info-value">${kh.toFixed(2)} kN/m</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Gráfico de NSPT por Profundidade</div>
          ${gerarGraficoNSPT(furo)}
        </div>

        <div class="section">
          <div class="section-title">Diagrama Estratigráfico</div>
          ${gerarDiagramaCamadas(furo, diametro)}
        </div>

        <div class="section">
          <div class="section-title">Perfil de Sondagem</div>
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

        <div class="footer">
          <p>Relatório gerado automaticamente pela Calculadora de Fundações</p>
          <p>Data: ${new Date().toLocaleDateString('pt-BR')} | Hora: ${new Date().toLocaleTimeString('pt-BR')}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return html;
}

/**
 * Gera HTML para relatório de furo de sondagem
 */
export function gerarHTMLRelatorioFuro(relatorio: RelatorioFuro): string {
  const { furo, projeto, data } = relatorio;

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Relatório de Furo de Sondagem</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
          line-height: 1.6;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 210mm;
          height: 297mm;
          margin: 0 auto;
          padding: 20mm;
          background-color: white;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
          border-bottom: 3px solid #0066CC;
          padding-bottom: 15px;
          margin-bottom: 20px;
        }
        .header h1 {
          color: #0066CC;
          font-size: 24px;
          margin-bottom: 5px;
        }
        .header p {
          color: #666;
          font-size: 12px;
        }
        .section {
          margin-bottom: 20px;
        }
        .section-title {
          background-color: #0066CC;
          color: white;
          padding: 8px 12px;
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 10px;
          border-radius: 4px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 15px;
        }
        .info-item {
          border-left: 3px solid #0066CC;
          padding-left: 10px;
        }
        .info-label {
          font-size: 11px;
          color: #666;
          font-weight: bold;
          text-transform: uppercase;
          margin-bottom: 3px;
        }
        .info-value {
          font-size: 14px;
          color: #333;
          font-weight: bold;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 15px 0;
          font-size: 11px;
        }
        th {
          background-color: #0066CC;
          color: white;
          padding: 8px;
          text-align: left;
          font-weight: bold;
        }
        td {
          padding: 8px;
          border-bottom: 1px solid #ddd;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        .soil-type {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 3px;
          font-size: 10px;
          font-weight: bold;
          color: white;
        }
        .soil-areia {
          background-color: #D4A574;
        }
        .soil-silte {
          background-color: #A9A9A9;
        }
        .soil-argila {
          background-color: #8B7355;
        }
        .footer {
          margin-top: 30px;
          padding-top: 10px;
          border-top: 1px solid #ddd;
          font-size: 10px;
          color: #999;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Relatório de Furo de Sondagem</h1>
          <p>Análise Estratigráfica e Caracterização do Solo</p>
        </div>

        <div class="section">
          <div class="section-title">Informações do Projeto</div>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Projeto</div>
              <div class="info-value">${projeto.nome}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Local</div>
              <div class="info-value">${projeto.local}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Proprietário</div>
              <div class="info-value">${projeto.proprietario}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Data</div>
              <div class="info-value">${data}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Informações do Furo</div>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Identificação</div>
              <div class="info-value">${furo.nome}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Coordenadas</div>
              <div class="info-value" style="font-size: 12px;">${furo.coordenadas}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Profundidade Total</div>
              <div class="info-value">${furo.profundidadeTotal} m</div>
            </div>
            <div class="info-item">
              <div class="info-label">Nível d'Água</div>
              <div class="info-value">${furo.nivelAgua} m</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Gráfico de NSPT por Profundidade</div>
          ${gerarGraficoNSPT(furo)}
        </div>

        <div class="section">
          <div class="section-title">Diagrama Estratigráfico</div>
          ${gerarDiagramaCamadas(furo)}
        </div>

        <div class="section">
          <div class="section-title">Estratigrafia - Perfil de Sondagem</div>
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
                  <td>
                    <span class="soil-type soil-${camada.tipo.toLowerCase()}">
                      ${camada.tipo.charAt(0).toUpperCase() + camada.tipo.slice(1)}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="section">
          <div class="section-title">Resumo Estatístico</div>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Número de Camadas</div>
              <div class="info-value">${furo.camadas.length}</div>
            </div>
            <div class="info-item">
              <div class="info-label">NSPT Médio</div>
              <div class="info-value">
                ${(furo.camadas.reduce((sum, c) => sum + c.nspt, 0) / furo.camadas.length).toFixed(1)}
              </div>
            </div>
            <div class="info-item">
              <div class="info-label">NSPT Mínimo</div>
              <div class="info-value">
                ${Math.min(...furo.camadas.map(c => c.nspt))}
              </div>
            </div>
            <div class="info-item">
              <div class="info-label">NSPT Máximo</div>
              <div class="info-value">
                ${Math.max(...furo.camadas.map(c => c.nspt))}
              </div>
            </div>
          </div>
        </div>

        <div class="footer">
          <p>Relatório gerado automaticamente pela Calculadora de Fundações</p>
          <p>Data: ${new Date().toLocaleDateString('pt-BR')} | Hora: ${new Date().toLocaleTimeString('pt-BR')}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return html;
}
