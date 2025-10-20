# Sistema de Controle de Portaria

## 1. Visão Geral

O Sistema de Controle de Portaria é uma solução tecnológica robusta e integrada, projetada para otimizar e formalizar o processo de registro de entrada e saída de veículos em portarias. Combinando uma aplicação de desktop para o ponto de entrada e uma plataforma web para gestão e consulta, o sistema centraliza todas as informações em um banco de dados MySQL, garantindo segurança, agilidade e rastreabilidade completa das operações.

A solução é ideal para empresas que necessitam de um controle rigoroso sobre o fluxo de veículos, cargas e condutores, oferecendo ferramentas para registro detalhado, validação de dados e geração de relatórios gerenciais.

---

## 2. Arquitetura da Solução

O projeto é construído sobre uma arquitetura cliente-servidor flexível, composta por três componentes principais:

1.  **Aplicação de Ponto de Entrada (Desktop):** Uma aplicação desenvolvida em Python com Tkinter, instalada no computador da portaria. É a interface principal do operador para registrar novas entradas de forma rápida, incluindo a captura de imagem em tempo real.
2.  **Plataforma de Gestão (Web):** Uma aplicação web desenvolvida com Flask (Python), que serve como um painel de controle para administradores e gestores. Permite a consulta de todos os registros, gerenciamento de dados mestres (como condutores) e geração de relatórios.
3.  **Banco de Dados Central (MySQL):** O coração do sistema, onde todas as informações coletadas por ambas as aplicações são armazenadas de forma segura e estruturada.

![Arquitetura](https://i.imgur.com/9S4J8Yc.png)

---

## 3. Funcionalidades Detalhadas

### 3.1. Aplicação de Ponto de Entrada (Desktop - `exe_app.py`)

Interface dedicada ao operador da portaria, focada em eficiência e simplicidade de uso.

*   **Registro de Entradas:** Formulário completo para registrar dados essenciais, como:
    *   Nome do Condutor (com preenchimento automático de placas)
    *   Placas do Veículo (Cavalo e Conjunto)
    *   Detalhes da Carga (Espécie, Talhão, Romaneio, Nota Fiscal)
    *   Classificação da Carga
    *   Até 8 números de lacre
    *   Observações gerais
    *   ID do Usuário operador do sistema

*   **Captura de Imagem:** Utiliza uma webcam conectada ao computador para capturar e associar uma fotografia a cada registro, servindo como evidência visual da entrada.

*   **Integração Direta:** Salva os dados instantaneamente no banco de dados central, garantindo que a informação esteja disponível para consulta na plataforma web sem demora.

*   **Interface Intuitiva:** Projetada para minimizar o tempo de digitação, com campos bem definidos e um layout claro que guia o operador através do processo de registro.

### 3.2. Plataforma de Gestão e Relatórios (Web - `web_app.py`)

Acesso via navegador que oferece uma visão completa e ferramentas de gerenciamento sobre as operações da portaria.

*   **Dashboard de Registros:**
    *   Lista todos os registros de entrada em ordem cronológica inversa.
    *   Exibe todos os detalhes de cada registro, incluindo a foto capturada, em uma tabela clara e organizada.
    *   Permite a visualização rápida do status de validação de cada registro.

*   **Geração de Relatórios em PDF:**
    *   **Relatório Individual:** Gera um PDF detalhado para um único registro, contendo todos os seus dados e a imagem associada.
    *   **Relatório por Período:** Permite ao usuário selecionar uma data de início e fim para gerar um relatório consolidado em formato de tabela com todos os registros do período, ideal para auditorias e análises gerenciais. Os campos `validado_por` e `data_validacao` são incluídos.

*   **Gestão de Condutores:**
    *   Uma seção dedicada para listar, adicionar, editar e excluir condutores, centralizando a base de dados e facilitando o preenchimento no ponto de entrada.

*   **Validação de Registros:**
    *   Funcionalidade que permite a um usuário supervisor (validador) aprovar um registro. A validação exige uma senha e, uma vez validado, o sistema armazena o nome do validador e a data/hora da validação, garantindo a integridade e a auditoria do processo.

*   **Controle de Acesso:**
    *   O sistema possui tabelas para `usuarios` (operadores) e `validadores`, permitindo um controle de acesso granular e a identificação de quem realizou cada ação chave.

### 3.3. Ferramentas Adicionais

*   **Importador de Condutores (`importar_condutores.py`):** Script utilitário que permite a importação em massa de dados de condutores a partir de uma planilha Excel (`condutores.xlsx`), agilizando a configuração inicial do sistema.

---

## 4. Tecnologias Utilizadas

*   **Backend (Web):**
    *   **Python 3**
    *   **Flask:** Micro-framework web para a criação das APIs e da interface de gestão.
    *   **ReportLab:** Biblioteca para a geração dinâmica de documentos PDF.
    *   **Pymysql:** Driver de conexão com o banco de dados MySQL.

*   **Frontend (Web):**
    *   **HTML5**
    *   **CSS3** (com **Bootstrap 5** para um design responsivo)
    *   **JavaScript:** Para interatividade, como a captura de imagem pela câmera do navegador (`getUserMedia API`) e validações dinâmicas.

*   **Aplicação Desktop:**
    *   **Python 3**
    *   **Tkinter:** Biblioteca padrão do Python para a criação da interface gráfica.
    *   **OpenCV (cv2):** Para acesso e captura de imagem da webcam.
    *   **Pillow (PIL):** Para manipulação de imagens na interface.

*   **Banco de Dados:**
    *   **MySQL**

---


