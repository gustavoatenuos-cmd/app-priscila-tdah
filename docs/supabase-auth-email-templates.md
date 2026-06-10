# Supabase Auth - URLs e templates de e-mail

## URL Configuration

No Supabase Dashboard, acesse:

`Authentication > URL Configuration`

Configure:

```text
Site URL:
https://app-priscila-tdah.vercel.app

Redirect URLs:
https://app-priscila-tdah.vercel.app/**
https://app-priscila-tdah.vercel.app/reset-password
https://app-priscila-tdah.vercel.app/login
```

## Reset password

No Supabase Dashboard, acesse:

`Authentication > Email Templates > Reset password`

Assunto:

```text
Crie uma nova senha | TDAH Constante
```

Conteudo HTML:

```html
<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px;color:#1f2937">
  <h2 style="margin:0 0 16px">Vamos criar uma nova senha</h2>
  <p style="line-height:1.6;color:#64748b">
    Recebemos uma solicitacao para redefinir a senha da sua conta TDAH Constante.
  </p>
  <p style="margin:28px 0">
    <a
      href="{{ .ConfirmationURL }}"
      style="display:inline-block;background:#1f2937;color:#ffffff;text-decoration:none;padding:14px 22px;border-radius:8px;font-weight:700"
    >
      Criar nova senha
    </a>
  </p>
  <p style="font-size:13px;line-height:1.6;color:#64748b">
    Se voce nao solicitou esta alteracao, ignore este e-mail.
  </p>
</div>
```

O botao precisa usar `{{ .ConfirmationURL }}`. Nao usar apenas `{{ .SiteURL }}`,
pois isso abre o aplicativo sem carregar a sessao de recuperacao.

## Confirm signup

No Supabase Dashboard, acesse:

`Authentication > Email Templates > Confirm signup`

O botao de confirmacao tambem deve usar:

```html
<a href="{{ .ConfirmationURL }}">Confirmar meu e-mail</a>
```

## Codigo do aplicativo

- Cadastro envia `emailRedirectTo` para `/login?confirmed=1`.
- Recuperacao envia `redirectTo` para `/reset-password`.
- `/reset-password` aceita retorno por `code` e retorno legado por hash com
  `type=recovery`.
