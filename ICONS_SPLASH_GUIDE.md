# 📱 Guia Completo: App Icons & Splash Screen - UNPAIR

## 🎨 Requisitos de Design

### App Icon (Obrigatório)
Um ícone simples e reconhecível que representa UNPAIR.

**Conceito Sugerido:**
- Dois sneakers (um de cada cor)
- Um "par quebrado" ou sneaker único
- Letra "U" estilizada como sneaker
- Cores: Azul (#007AFF) + Laranja (#FF6B35) no fundo branco/preto

### Splash Screen (Obrigatório)
Tela de carregamento inicial enquanto o app abre.

---

## 📐 Dimensões Necessárias

### iOS (App Store)

**App Icon:**
```
1024x1024px  - App Store (obrigatório)
180x180px    - iPhone @3x
120x120px    - iPhone @2x
87x87px      - iPhone @3x Settings
58x58px      - iPhone @2x Settings
```

**Splash Screen:**
```
1125x2436px  - iPhone X/11 Pro/12/13
1242x2688px  - iPhone XS Max/11 Pro Max
828x1792px   - iPhone XR/11
```

### Android (Google Play)

**App Icon:**
```
512x512px    - Play Store (obrigatório)
192x192px    - xxxhdpi
144x144px    - xxhdpi
96x96px      - xhdpi
72x72px      - hdpi
48x48px      - mdpi
```

**Adaptive Icon (Android 8+):**
```
1024x1024px  - Foreground layer
1024x1024px  - Background layer
```

**Splash Screen:**
```
1080x1920px  - xxxhdpi
720x1280px   - xxhdpi
480x800px    - xhdpi
320x480px    - hdpi
```

---

## 🛠️ Como Criar (3 Opções)

### Opção 1: Usar Ferramentas Online (Mais Fácil)

**1. Figma (Grátis)**
- Acesse: https://figma.com
- Template: 1024x1024px
- Exporte em PNG com fundo transparente

**2. Canva (Grátis)**
- Acesse: https://canva.com
- Busque "App Icon" template
- Personalize com cores e texto
- Download em PNG

**3. App Icon Generator**
- Acesse: https://appicon.co
- Upload sua imagem 1024x1024px
- Gera TODOS os tamanhos automaticamente
- Download .zip com tudo

### Opção 2: Contratar Designer (Rápido)

**Fiverr:**
- App icon designs: €15-50
- Turnaround: 1-3 dias
- Busque: "app icon design ios android"

**99designs:**
- Contest: €200-500
- Múltiplos designers competem
- Escolhe o melhor

### Opção 3: IA (Mais Rápido)

**DALL-E / Midjourney:**
```
Prompt: "minimalist app icon for sneaker marketplace,
single sneaker shoe, blue and orange colors, flat design,
simple, professional, white background, 1024x1024"
```

**Stable Diffusion:**
```
Prompt: "app icon design, single sneaker,
modern, clean, professional logo, vector style"
```

---

## 📦 Implementação no Expo

### 1. Preparar Assets

Coloque os arquivos na pasta:
```
/app/frontend/assets/images/
├── icon.png              (1024x1024)
├── splash-icon.png       (512x512, logo para splash)
├── adaptive-icon.png     (1024x1024, Android)
└── favicon.png           (48x48, Web)
```

### 2. Configurar app.json

Já está configurado! Apenas substitua as imagens:

```json
{
  "expo": {
    "icon": "./assets/images/icon.png",
    "splash": {
      "image": "./assets/images/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#FFFFFF"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      }
    },
    "web": {
      "favicon": "./assets/images/favicon.png"
    }
  }
}
```

### 3. Gerar Todos os Tamanhos (Automático)

O Expo EAS Build gera automaticamente! Não precisa criar manualmente.

```bash
# Quando fizer o build:
npx eas-cli build --platform all

# O Expo gera todos os tamanhos a partir do icon.png
```

---

## 🎨 Criar Icons Agora (Passo a Passo)

### Design Simples com Texto

1. **Figma ou Canva**
   - Canvas: 1024x1024px
   - Fundo: Gradiente azul (#007AFF) para laranja (#FF6B35)
   - Texto: "UN" em branco, bold, centralizado
   - Subtexto: "PAIR" menor embaixo
   - Bordas arredondadas: 180px radius

2. **Exportar**
   - PNG, 1024x1024px
   - Fundo: Com cor (não transparente para splash)
   - Salvar como: `icon.png`

3. **Criar Splash**
   - Mesmo design, mas 512x512px
   - Salvar como: `splash-icon.png`

### Usar IA (Recomendado)

**ChatGPT DALL-E:**
```
"Create an app icon for a sneaker marketplace called UNPAIR.
The icon should feature a single sneaker (left or right foot)
in a minimalist style. Use blue (#007AFF) and orange (#FF6B35) colors.
The design should be modern, clean, and work well at small sizes.
Square format, 1024x1024 pixels."
```

**Midjourney (Discord):**
```
/imagine minimalist app icon, single sneaker, blue orange gradient,
modern clean design, white background, professional logo --ar 1:1 --v 6
```

---

## 📱 Splash Screen Branding

### Configuração Atual
```javascript
// No app.json:
"splash": {
  "image": "./assets/images/splash-icon.png",
  "resizeMode": "contain",
  "backgroundColor": "#FFFFFF"  // ou "#0A0A0A" para dark
}
```

### Melhorar Splash (Opcional)

**Adicionar texto embaixo do logo:**

Instale:
```bash
cd /app/frontend
yarn add expo-splash-screen
```

Configure em `app/_layout.tsx`:
```typescript
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

// Esconde após app carregar
useEffect(() => {
  if (!loading) {
    SplashScreen.hideAsync();
  }
}, [loading]);
```

---

## ✅ Checklist Final

### Antes de Submeter

- [ ] Icon.png (1024x1024) criado
- [ ] Splash-icon.png (512x512) criado
- [ ] Adaptive-icon.png (1024x1024) criado
- [ ] Favicon.png (48x48) criado
- [ ] Testado em device (Expo Go)
- [ ] Cores consistentes com brand
- [ ] Legível em tamanhos pequenos
- [ ] Funciona em dark/light mode

### Ferramentas Úteis

**Tester:**
- iOS: Simulator preview
- Android: Device preview
- Web: Browser favicon

**Validadores:**
- App Icon: https://appicon.co
- Splash: Expo Go preview
- Adaptive: Android Studio preview

---

## 🚀 Assets de Exemplo

### Temporário (Enquanto não tem design)

Você pode usar assets genéricos temporariamente:

**Icon temporário:**
```bash
cd /app/frontend/assets/images
# Criar icon simples com ImageMagick:
convert -size 1024x1024 xc:#007AFF \
  -gravity center \
  -pointsize 300 \
  -fill white \
  -annotate +0+0 'U' \
  icon.png
```

**Ou baixe grátis:**
- Flaticon: https://flaticon.com (search "sneaker")
- Icons8: https://icons8.com (search "shoe icon")
- Noun Project: https://thenounproject.com

---

## 💡 Dicas de Design

### Boas Práticas
✅ Simples e memorável
✅ Funciona em preto e branco
✅ Legível em 29x29px (menor tamanho iOS)
✅ Sem texto pequeno
✅ Sem gradientes complexos

### Evitar
❌ Fotos ou imagens detalhadas
❌ Texto pequeno ou fino
❌ Muitas cores
❌ Ícones genéricos de loja

---

## 📞 Precisa de Ajuda?

**Opções:**
1. Posso gerar um design simples com IA agora
2. Posso recomendar designers específicos
3. Posso criar placeholders para você testar

**Quanto tempo leva:**
- IA: 5 minutos
- Você mesmo: 30-60 minutos
- Designer: 1-3 dias

---

## 🎯 Próximo Passo

Depois de ter os icons:

```bash
cd /app/frontend

# 1. Adicione os arquivos em assets/images/

# 2. Teste localmente:
yarn start

# 3. Build com icons:
npx eas-cli build --platform all

# 4. Os icons aparecem automaticamente no build!
```

**Pronto! Seus icons estarão no app.** 🎉

---

**Quer que eu gere alguns designs de exemplo com IA agora?**
