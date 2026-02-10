

## Reduzir ainda mais o texto abaixo do banner

### Alteracao

No arquivo `src/pages/DadosPessoaisPage.tsx`, linha 132, trocar as classes do paragrafo:

- De: `text-xs text-slate-500 font-medium px-3 mt-2`
- Para: `text-[10px] leading-tight text-slate-400 px-4 mt-1.5`

Isso resulta em:
- Fonte ainda menor (10px ao inves de 12px)
- Cor mais sutil (slate-400 ao inves de slate-500)
- Espacamento entre linhas mais compacto (leading-tight)
- Remove o `font-medium` para ficar mais leve visualmente
- Margem superior reduzida para ficar mais colado ao banner

Nenhuma outra alteracao no arquivo.

