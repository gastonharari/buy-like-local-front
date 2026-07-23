## Qué cambia

<!-- Una o dos líneas: qué hace este PR y por qué. -->

## Checklist

- [ ] **Docs actualizados** — si tocaste código de producto, actualizaste el archivo que corresponde bajo [`docs/`](../docs/README.md). Si no aplica, poné `[skip-docs]` en el título o el label `skip-docs`.
- [ ] **Copy nuevo** — está en `lib/translations.ts` en **los tres idiomas** (EN/ES/PT), no hardcodeado en el componente.
- [ ] **Sin hex hardcodeados** — usaste las clases semánticas de Tailwind. Tokens en `app/globals.css`.
- [ ] **Claims dentro del scope** — [`BRAND.md`](../../BRAND.md): productos y entradas a shows sí; reservas de restaurante no.
- [ ] **Mobile / iOS** — si agregaste algo `fixed`, no queda en el DOM cuando está oculto (rompe el scroll táctil en iOS Safari).

<!--
Los jobs docs-coverage y e2e-coverage comentan solos si falta algo.
Son avisos, no bloqueos: CI queda verde igual.
-->
