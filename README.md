# backlane

TypeScript kütüphanelerini tek yerde topladığım monorepo.

Makinede node, pnpm ya da npm yok — olmasını da istemiyorum. Bütün toolchain
konteynerin içinde yaşıyor, host'ta sadece `docker` ve `git` gerekiyor.

## Gereksinimler

- Docker (Compose v2+)
- git

Hepsi bu.

## Başlangıç

```sh
./dx up        # imajı kurar, geliştirme konteynerini ayağa kaldırır
./dx install   # bağımlılıkları kurar
./dx build     # bütün paketleri derler
```

`./dx doctor` ile ortamın doğru kurulduğunu kontrol edebilirsin.

## Komutlar

Her şey `./dx` üzerinden geçiyor; amaç her seferinde uzun `docker compose`
satırları yazmamak. Konteyner ayaktaysa komut `exec` ile (~100ms), değilse tek
seferlik `run --rm` ile çalışır.

| Komut | Ne yapar |
|---|---|
| `./dx up` / `./dx down` | konteyneri başlatır / durdurur |
| `./dx sh` | konteynerde kabuk açar |
| `./dx install` | `pnpm install` |
| `./dx add <paket> [-F @backlane/core]` | bağımlılık ekler |
| `./dx build` / `test` / `typecheck` | turbo görevleri |
| `./dx lint` / `./dx fmt` | biome ile denetim / düzeltme |
| `./dx check` | lint + typecheck + test |
| `./dx pnpm <...>` | ham pnpm |
| `./dx nuke` | konteyner + volume'leri siler (sıfırdan kurulum) |

## Yapı

```
packages/
  core/    @backlane/core    Result tipi ve yardımcıları
  utils/   @backlane/utils   core'u kullanan yardımcılar
```

Paketler birbirine `workspace:*` ile bağlanıyor. Ortak bağımlılık sürümleri
`pnpm-workspace.yaml` içindeki `catalog` bölümünde tutuluyor; paketler oradan
çekiyor ki sürümler birbirinden kaymasın.

Yeni paket eklerken `packages/<ad>` altına `package.json`, `tsconfig.json` ve
`tsdown.config.ts` koymak yeterli — mevcut paketlerden birini kopyalamak en
hızlısı.

### node_modules nerede?

Kök `node_modules` ve pnpm store, host'ta değil docker volume'lerinde duruyor.
Host'ta `ls node_modules` boş görünür, bu normal. Editörün tipleri görmesi için
projeyi **Dev Container** olarak açman gerekiyor (VS Code / Cursor →
"Reopen in Container"); `.devcontainer/` hazır.

## Kalite kontrolü

- **Biome** hem format hem lint işini görüyor, ayrıca eslint/prettier tutmuyorum.
- **husky** hook'ları host'ta `sh` olarak çalışıp işi `dx` üzerinden konteynere
  devrediyor:
  - `pre-commit` → staged dosyaları biome ile düzeltir, sonra typecheck
  - `commit-msg` → commitlint (conventional commits)
  - `pre-push` → `main` ve `development`'a doğrudan push'u engeller, testleri koşar
- Hook'lar `./dx install` sırasında kuruluyor. Acil bir durumda `--no-verify`
  ile atlanabilir ama CI aynı kontrolleri tekrar çalıştırır.

## Dal akışı

```
feature/*  ──PR──▶  development  ──PR──▶  main
```

- `main`'e doğrudan push kapalı; yalnızca `development`'tan PR ile giriliyor.
  Bu kuralı `branch-policy` workflow'u denetliyor.
- Geliştirme `feature/*` dallarında yapılır, onaylanınca `development`'a squash
  merge edilir.
- CI her PR'da aynı Docker imajını kurup lint + typecheck + test + build koşar.
