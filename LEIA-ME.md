# Coleta Belém

Mapa com OpenStreetMap, trajetos registrados e estimativa de horário por interpolação entre pontos. Sem rastreamento ao vivo. As linhas ligam as coordenadas: não são cálculo de rota pelas ruas.

## Abrir e publicar

A pasta `dist` é o site completo. Pode ser publicada no GitHub Pages: copie seu conteúdo para a raiz do repositório. Para teste local, execute `python -m http.server 8000 --directory dist` e abra http://localhost:8000. Não abra o HTML por duplo clique, pois a leitura automática do Excel requer um servidor.

## Atualizar os dados

Substitua `dist/dados/trajetos.xlsx`, mantendo esse nome. No GitHub Pages, envie a planilha atualizada para `dados/trajetos.xlsx` e aguarde a publicação. O site consulta o arquivo ao abrir, a cada 60 segundos enquanto a página está visível e pelo botão Atualizar dados. Alterar um Excel apenas no computador não altera o site hospedado. Na hospedagem Sites, as alterações precisam ser publicadas novamente.

## Planilha

Formato recomendado: Setor | Caminhao | latitude | longitude | Periodo | Hora. Cada combinação Setor-Caminhao forma uma linha independente, na ordem da planilha. Setor 1: azul; setor 2: verde; setor 3: vermelho. Todos os trajetos aparecem no mapa. O período e o horário aparecem na consulta e na janela do ponto. A planilha incluída usa as 18 linhas do exemplo (2 trajetos); substitua pela tabela completa.

Cada linha é um ponto. Caminhões e empresas são agrupados separadamente. Pode haver várias abas. Latitude/Longitude aceitam números ou texto com vírgula decimal. Hora aceita HH:MM ou horário numérico do Excel. As linhas de cada caminhão devem estar na ordem do percurso. O formato original com cabeçalho Empresa A | Hora | Latitude | Longitude e Caminhão 1 nas linhas também é aceito: o nome da aba identifica a empresa. Limite: 10 MB.

Para mais empresas/caminhões, acrescente linhas e mantenha identificadores únicos. O modelo não contém dias da semana ou datas: não é possível afirmar que há coleta diária. Para múltiplas viagens do mesmo caminhão, use identificadores separados até adicionar campos de data/viagem.

A consulta procura o trecho registrado mais próximo entre todos os trajetos e seleciona esse caminhão. Até 100 m do trecho, mostra o horário interpolado. Fora disso, mostra sem previsão. A tolerância é uma hipótese operacional inicial, não comprova atendimento do endereço. O mapa usa ruas de OpenStreetMap e exige internet. Bibliotecas Leaflet 1.9.4 e SheetJS CE estão incluídas localmente, com seus avisos de licença nos arquivos. Planilha inválida mantém a última leitura válida e exibe erro.

## Precisão

Os nove pontos fornecidos são amostras esparsas. Acrescente coordenadas ao longo de todas as ruas efetivamente percorridas para uma rota mais fiel. As previsões podem variar por trânsito, paradas e operação. A planilha não fornece margem estatística de atraso, posição atual ou calendário de coleta.
