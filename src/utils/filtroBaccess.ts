export default {
  wherePoliticas: (FILTRO: any[], TABELA: string) => {
    if (!FILTRO) return '';

    const modeloFiltro = () => {
      let filtroModelado = '';
      const filtroFormatado = FILTRO.map((item) => {
        const op = item.split('=');
        return {
          CAMPO: op[0].trim(),
          VALOR: op[1].trim(),
        };
      });

      const camposDistinc = [
        ...new Set(filtroFormatado.map((item: any) => item.CAMPO)),
      ];

      for (let index = 0; index < camposDistinc.length; index++) {
        const element = camposDistinc[index];
        const qtdCampos = filtroFormatado.filter(
          (filtro: any) => filtro.CAMPO === element
        );
        if (qtdCampos.length > 1) {
          filtroModelado += `${TABELA}.${element} IN (${qtdCampos
            .map((campo: any) => campo.VALOR)
            .join()})`;
        } else {
          filtroModelado += `${TABELA}.${element} = ${qtdCampos[0].VALOR}`;
        }
        if (index + 1 < camposDistinc.length) {
          filtroModelado += ' AND ';
        }
      }
      return filtroModelado;
    };

    return ` WHERE ${modeloFiltro()}`;
  },
};
