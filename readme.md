# Landing Page

Landing page estática construída com **HTML**, **CSS**, **JavaScript** e **PHP** (para processamento de formulário).  
Ideal para apresentação pessoal/profissional e portfólio.

## Índice

- [Sobre](#sobre)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [SEO e Metadados](#seo-e-metadados)
- [Acessibilidade](#acessibilidade)
- [Performance](#performance)
- [Formulário de Contato (PHP)](#formulário-de-contato-php)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação e Uso](#instalação-e-uso)
- [Build e Automação (opcional)](#build-e-automação-opcional)
- [Deploy](#deploy)
- [Checklist de Qualidade](#checklist-de-qualidade)
- [Roadmap](#roadmap)
- [Contribuição](#contribuição)
- [Licença](#licença)

---

## Sobre

Este projeto entrega uma landing page enxuta, responsiva e fácil de hospedar.  
Páginas comuns no repositório: `index.html`, `contato.html`, `experiencia.html`, `formacao.html`, `projetos.html`.

---

## Funcionalidades

- Layout responsivo com CSS.
- Navegação simples entre seções/páginas.
- Formulário de contato com processamento em PHP.
- Estrutura pronta para SEO básico (title/description, OG tags).
- Dicas e scripts para otimizar performance.

---

## Tecnologias Utilizadas

**Front-end**
- HTML5 semântico
- CSS3 (flex/grid)
- JavaScript (DOM básico)

**Back-end**
- PHP (para envio do formulário)

**Ferramentas opcionais**
- Node.js + npm (para minificação/lint)
- GitHub Pages / cPanel / Vercel (para deploy)

---

## SEO e Metadados

Inclua no `<head>` (ajuste os valores):

```html
<title>Tiago Rogato — Portfólio</title>
<meta name="description" content="Apresentação, experiência, formação e projetos de Tiago Rogato. Entre em contato.">
<meta name="viewport" content="width=device-width, initial-scale=1">

<!-- Open Graph -->
<meta property="og:title" content="Tiago Rogato — Portfólio">
<meta property="og:description" content="Apresentação, experiência, formação e projetos.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://seudominio.com/">
<meta property="og:image" content="https://seudominio.com/images/preview.jpg">

<!-- Favicon / Manifest -->
<link rel="icon" href="/images/favicon.ico">
<link rel="apple-touch-icon" href="/images/icon-192.png">
<link rel="manifest" href="/site.webmanifest">
````

---

## Acessibilidade

* Use contrastes adequados (WCAG AA).
* Foco visível para elementos interativos.
* Labels associados a inputs (`<label for="id">`).
* Navegação por teclado (evitar `outline: none`).
* Títulos hierárquicos (`h1 > h2 > h3`…).

---

## Performance

* Otimize imagens (WebP/AVIF quando possível).
* Defina dimensões (`width/height`) das imagens.
* Minifique CSS/JS.
* Use `rel="preload"` para fontes críticas.
* Carregue JS não essencial com `defer`.

---

## Formulário de Contato (PHP)

### HTML (exemplo)

```html
<form action="/php/contato.php" method="POST">
  <label for="nome">Nome</label>
  <input id="nome" name="nome" type="text" required>

  <label for="email">E-mail</label>
  <input id="email" name="email" type="email" required>

  <label for="mensagem">Mensagem</label>
  <textarea id="mensagem" name="mensagem" rows="5" required></textarea>

  <button type="submit">Enviar</button>
</form>
```

### PHP (exemplo simples usando `mail()`)

```php
<?php
$destino = "contato@tiagorogato.com"; // ajuste para seu e-mail real

$nome = trim($_POST['nome'] ?? '');
$email = trim($_POST['email'] ?? '');
$mensagem = trim($_POST['mensagem'] ?? '');

if (!$nome || !filter_var($email, FILTER_VALIDATE_EMAIL) || !$mensagem) {
  http_response_code(400);
  exit('Dados inválidos.');
}

$assunto = "Contato via site: $nome";
$corpo = "Nome: $nome\nEmail: $email\n\nMensagem:\n$mensagem\n";

$headers = [
  'From' => "Landing Page <no-reply@tiagorogato.com>",
  'Reply-To' => $email
];
$headers_str = '';
foreach ($headers as $k => $v) $headers_str .= "$k: $v\r\n";

if (@mail($destino, $assunto, $corpo, $headers_str)) {
  header('Location: /contato.html?enviado=1');
  exit;
} else {
  http_response_code(500);
  exit('Falha ao enviar. Tente novamente mais tarde.');
}
```

---

## Estrutura do Projeto

```
landingpage/
├─ css/           
├─ images/        
├─ js/            
├─ php/           
├─ index.html
├─ contato.html
├─ experiencia.html
├─ formacao.html
└─ projetos.html
```

---

## Instalação e Uso

```bash
git clone https://github.com/TRogato/landingpage.git
cd landingpage
php -S localhost:8000
```

Acesse em: [http://localhost:8000/index.html](http://localhost:8000/index.html)

---

## Build e Automação (opcional)

```bash
npm install
npm run build
```

Scripts disponíveis no `package.json` incluem lint e minificação de CSS/JS.

---

## Deploy

* **GitHub Pages**: para arquivos estáticos (sem PHP).
* **cPanel / hospedagem compartilhada**: suporta PHP, ideal para contato.
* **Vercel/Netlify**: apenas front-end (o PHP precisaria ser adaptado via serverless ou outro serviço de backend).

---

## Checklist de Qualidade

* [x] Title e description configurados.
* [x] Labels e alt text em formulários/imagens.
* [x] CSS/JS organizados.
* [x] Estrutura HTML semântica.

---

## Roadmap

* [ ] Tema claro/escuro.
* [ ] Seção de depoimentos.
* [ ] Integração com Google Analytics ou Plausible.
* [ ] SMTP autenticado (PHPMailer).
* [ ] Captcha para formulário de contato.

---

## Contribuição

1. Faça um fork
2. Crie uma branch: `git checkout -b feat/minha-ideia`
3. Commit: `git commit -m "feat: minha ideia"`
4. Push: `git push origin feat/minha-ideia`
5. Abra um Pull Request

---

## Licença

Este projeto está licenciado sob a licença **MIT**.

```
MIT License

Copyright (c) 2025 Tiago Rogato

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 📄 Licença

Este repositório está sob a licença [MIT](https://github.com/TRogato/Trogato/blob/main/LICENSE). Por favor, consulte o arquivo `LICENSE` para mais detalhes.


---

✍ Desenvolvido por **Tiago Rogato**
📧 contato:<br>
[<img alt="LinkedIn" src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" />](https://www.linkedin.com/in/tiago-rogato-da-silveira-095563b6/)
[<img alt="GitHub" src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" />](https://github.com/TRogato/Trogato)
[<img alt="Email" src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" />](t.rogato@gmail.com)

---
