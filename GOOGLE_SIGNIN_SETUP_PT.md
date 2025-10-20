# Configuração do Google Sign In - UNPAIR

## ✅ O que já foi feito

Implementei a autenticação Google no app UNPAIR! Você já tem:

- ✅ Botão "Continuar com Google" nas telas de Login e Registro
- ✅ Código completo de integração Firebase + Google OAuth
- ✅ Suporte para Web e Mobile (Expo)

## 🔧 Configuração Necessária no Firebase

### 1. Ativar Google Sign In no Firebase Console

1. Acesse: https://console.firebase.google.com
2. Selecione seu projeto: **unpair98**
3. No menu lateral, clique em **Authentication** (Autenticação)
4. Vá para a aba **Sign-in method** (Método de login)
5. Procure **Google** na lista
6. Clique em **Google** para editar
7. **Ative** o toggle no topo
8. Preencha:
   - **Nome público do projeto**: UNPAIR
   - **Email de suporte**: seu email
9. Clique em **Salvar**

### 2. Copiar o Web Client ID

Ainda na configuração do Google:

1. Expanda a seção **Web SDK configuration**
2. Copie o **Web client ID** (algo como: `803140766783-xxxxx.apps.googleusercontent.com`)
3. Cole esse ID no arquivo `.env`:

```bash
# No arquivo: /app/frontend/.env
EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID=SEU_WEB_CLIENT_ID_AQUI
```

### 3. Adicionar domínios autorizados (para Web)

No Firebase Console:

1. Em **Authentication > Settings** (Configurações)
2. Vá para **Authorized domains** (Domínios autorizados)
3. Adicione:
   - `kickswap-1.preview.emergentagent.com`
   - `localhost` (se já não estiver)

## 📱 Como funciona

### Na Web
- Clica em "Continuar com Google"
- Abre popup do Google
- Usuário escolhe conta Google
- Login automático ✅

### No Mobile (Expo Go)
- Clica em "Continuar com Google"
- Abre navegador para login Google
- Retorna ao app após autenticação
- Login automático ✅

## 🧪 Testando

Depois de configurar:

1. Abra o app: https://kickswap-1.preview.emergentagent.com
2. Clique em "Continuar com Google"
3. Faça login com sua conta Google
4. Você será redirecionado para a tela Home do UNPAIR!

## ⚠️ Importante

- O Google Sign In funciona **mesmo sem** o Email/Password estar ativo
- Os usuários Google são criados automaticamente no Firebase Auth
- As regras do Firestore precisam estar configuradas (veja README.md principal)

## 🐛 Solução de Problemas

### Erro: "popup blocked"
- Configure o navegador para permitir popups do domínio

### Erro: "unauthorized_client"
- Verifique se o domínio está nos **Authorized domains** do Firebase

### Erro: "API key not valid"
- Confirme que todas as variáveis do `.env` estão corretas

## 📚 Recursos Adicionais

- [Firebase Google Sign In Docs](https://firebase.google.com/docs/auth/web/google-signin)
- [Expo Auth Session](https://docs.expo.dev/versions/latest/sdk/auth-session/)

---

**Pronto para usar!** 🚀

Depois de configurar o Google Sign In no Firebase Console e adicionar o Web Client ID no `.env`, o botão "Continuar com Google" vai funcionar perfeitamente!
