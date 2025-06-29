# 🖼️ Guia de Otimização de Imagens

## Imagens Prioritárias para Otimização

### Críticas (>1MB)
- `processos.png` (1.78MB) → `processos.webp`
- `atendimento.png` (1.34MB) → `atendimento.webp`
- `vendas.png` (1.08MB) → `vendas.webp`

### Icons (>1MB cada)
- `Automatize-com-inteligencia.png` (1.48MB)
- `Conecte-tudo-precisao.png` (1.33MB)
- `Fluxos-estrategicos-adaptaveis.png` (1.27MB)
- `Crescimento-monitoramento-total.png` (1.20MB)

## Ferramentas Recomendadas

### Online (Mais Fácil)
1. **[Squoosh](https://squoosh.app/)**
   - Upload da imagem
   - Selecionar WebP
   - Qualidade: 80-85%
   - Download

2. **[TinyPNG](https://tinypng.com/)**
   - Compressão automática
   - Suporte a PNG/JPEG

### Desktop
1. **ImageOptim** (Mac)
2. **RIOT** (Windows)
3. **GIMP** (Multiplataforma)

## Configurações Recomendadas

### WebP
- **Qualidade**: 80-85%
- **Compressão**: Lossy
- **Redução esperada**: 60-80%

### Responsive Images
```html
<picture>
  <source srcset="image.webp" type="image/webp">
  <source srcset="image.png" type="image/png">
  <img src="image.png" alt="Descrição" loading="lazy">
</picture>
```

## Próximos Passos

1. ✅ Otimizar imagens críticas (>1MB)
2. ✅ Implementar componente LazyImage
3. ✅ Configurar responsive images
4. ✅ Testar performance pós-otimização

**Meta**: Reduzir assets de 9.77MB para ~3MB (-70%)
