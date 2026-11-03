# 🎨 Camilla Paschoal - Portfolio Designer Social Media

Portfolio profissional reformulado para **Camilla Paschoal**, designer de social media com foco em criação de conteúdos visuais criativos e profissionais.

## ✨ Características Principais

- **Paleta Lilás Moderna**: Design visual sofisticado com lilás, cinza e branco
- **Responsivo**: Funciona perfeitamente em mobile, tablet e desktop
- **Animações Suaves**: Transições elegantes e efeitos de scroll
- **7 Carrosséis**: Portfólio com 80+ slides de trabalhos reais
- **Acessível**: Suporta navegação por teclado e screen readers
- **SEO Otimizado**: Meta tags, Open Graph e Schema JSON-LD
- **Performance**: Lazy loading, compressão de imagens, CSS separado
- **Menu Mobile**: Navegação responsiva com hambúrguer menu

## 📁 Estrutura do Projeto

```
portfolio/
├── index.html              # HTML semântico com estrutura completa
├── styles/
│   ├── main.css            # Estilos base e variáveis CSS
│   ├── components.css      # Componentes específicos
│   ├── animations.css      # Keyframes e animações
│   └── responsive.css      # Media queries e breakpoints
├── scripts/
│   └── app.js              # JavaScript principal
├── assets/
│   ├── avatar-real.jpg     # Foto de perfil
│   ├── background.jpg      # Fundo paralax
│   └── carrosseis/         # 7 pastas com 80+ slides
├── README.md               # Documentação
└── .gitignore              # Git ignore patterns
```

## 🎨 Paleta de Cores

```css
--bg-primary: #F5F0FA;      /* Lilás muito claro - fundo */
--color-light: #DCC9EF;     /* Lilás suave - elements light */
--color-mid: #A987C8;       /* Lilás médio - accents */
--color-dark: #35313A;      /* Cinza escuro - texto */
--white: #FFFFFF;           /* Branco puro */
--text-muted: #6B6470;      /* Cinza médio - texto secundário */
```

## 🔤 Tipografia

- **Títulos**: DM Sans (700 bold)
- **Texto**: Inter (400-600)
- **Carregamento**: Google Fonts

## 🎯 Seções do Site

1. **Hero** - Apresentação principal com CTA
2. **Sobre** - Bio com foto circular e descrição
3. **Portfólio** - 7 carrosséis com 80+ slides
4. **Serviços** - 6 cards com ofertas
5. **Diferenciais** - 4 pontos fortes (criatividade, identidade, comunicação, detalhes)
6. **Contato** - CTA com WhatsApp, Email e Instagram
7. **Floating Button** - Botão flutuante WhatsApp

## 💻 Como Usar

### Instalação Local
```bash
# 1. Clone ou baixe os arquivos
cd portfolio

# 2. Abra index.html em um navegador
# Ou use um servidor local:
python -m http.server 8000
# Acesse: http://localhost:8000
```

### Modificações Rápidas

**Alterar conteúdo:**
- Texto: Edite diretamente no `index.html`
- Cores: Altere as variáveis em `styles/main.css` (linhas 8-29)
- Fonts: Atualize links no `index.html` `<head>`

**Adicionar conteúdo:**
- Novo carrossel: Copie o template do carousel em `index.html`
- Novo serviço: Adicione `.service-card` em `#servicos`
- Nova seção: Crie `<section>` com classes apropriadas

## 🔧 Customização

### Cores Personalizadas
Edite `styles/main.css` (linhas 8-29):
```css
:root {
  --color-mid: #SUA-COR;
  /* Mais cores... */
}
```

### Adicionar Fontes
No `index.html` `<head>`:
```html
<link href="https://fonts.googleapis.com/css2?family=SEU+FONT&display=swap" rel="stylesheet">
```

### Alterar URLs de Contato
No `index.html`, procure por:
- WhatsApp: `https://wa.me/5521982566564`
- Email: `camillacpaschoal@gmail.com`
- Instagram: `https://instagram.com/camillapaschoal`

## 📊 SEO & Performance

### Meta Tags
- Title e description presentes
- Open Graph para compartilhamento em redes
- Schema JSON-LD Person
- Alt text em todas as imagens

### Performance
- **Lazy loading**: Imagens carregam conforme necessário
- **CSS separado**: Permite caching do navegador
- **Minificação**: Recomendado em produção
- **Compressão de imagens**: Background JPEG < 1MB

### Lighthouse Target
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1
- Score: > 90

## 🎬 Animações

- **Entrada**: slideInUp, slideInLeft, slideInRight
- **Hover**: translateY, scale, shadow
- **Scroll**: fadeInUp ao entrar viewport
- **Contínuas**: float, bounce, pulse, shimmer
- **Respeitam**: prefers-reduced-motion

## 📱 Breakpoints

- **Mobile**: até 640px (1 coluna, menu hamburger)
- **Tablet**: 641px - 1024px (2 colunas)
- **Desktop**: 1025px+ (3 colunas, full layout)

## ♿ Acessibilidade

- ✅ Contraste WCAG AA
- ✅ Navegação por teclado
- ✅ ARIA labels e roles
- ✅ Focus states visíveis
- ✅ Alt text descritivo
- ✅ Skip to content link
- ✅ Suporte a screen readers

## 🚀 Deployment

### GitHub Pages
```bash
# 1. Crie repositório: username.github.io
# 2. Push os arquivos
git add .
git commit -m "Portfolio Camilla Paschoal"
git push origin main

# 3. Site ativo em: https://username.github.io
```

### Netlify
```bash
# 1. Conecte repositório Git
# 2. Deploy automático
# 3. Site ativo em: seu-site.netlify.app
```

### Servidor Próprio
```bash
# Upload via FTP ou SSH
# Certifique-se de HTTPS ativo
# Configure cache headers apropriados
```

## 📝 Manutenção

### Atualizar Carrossel
1. Adicione imagens em `assets/carrosseis/seu-carrossel/`
2. Copie template carousel em `index.html`
3. Atualize IDs únicos (rail-0, rail-1, etc)

### Adicionar Novo Serviço
1. Adicione card em `#servicos`
2. Use emoji ou SVG icon
3. Classe automática: `.service-card`

### Modificar Logo/Branding
- Logo: `nav-logo` em navbar
- Cores: CSS variables em `main.css`
- Favicon: Adicione `<link rel="icon" href="assets/favicon.ico">`

## 🐛 Troubleshooting

**Imagens não aparecem:**
- Verifique caminhos em `assets/`
- Certifique-se que o servidor serve static files
- Verifique console do navegador (F12)

**Menu mobile não funciona:**
- Verifique se `app.js` está carregando
- Abra console (F12) e procure erros
- Limpe cache do navegador (Ctrl+Shift+R)

**Animações travando:**
- Reduza número de animações simultâneas
- Aumente hardware (teste em mobile)
- Verifique `prefers-reduced-motion`

## 📄 Licença

Este projeto é propriedade de Camilla Paschoal. Todos os direitos reservados.

## 📞 Contato

- **WhatsApp**: [+55 21 98256-6564](https://wa.me/5521982566564)
- **Email**: camillacpaschoal@gmail.com
- **Instagram**: [@camillapaschoal](https://instagram.com/camillapaschoal)

---

**Versão**: 2.0 - Reformulação Completa  
**Data**: Novembro 2026  
**Criado por**: Claude AI com Camilla Paschoal
