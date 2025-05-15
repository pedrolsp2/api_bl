import DAO from '../../DAO';
import log from '../../middleware/logger';
import queryGen from '../../utils/queryGen';
import { socketFunctions } from '../../http/server';
import { RequestHandler } from 'express';
import { getDistinctItem } from '../../utils/arrayDistinct';
import { FormProps } from './type';

const { queryInsertSingle, queryUpdate } = queryGen;

export default {
  async newStep(req: any, res: any) {
    const {
      NK_PRODUTO,
      DD_SALA,
      NM_FABRICO,
      NM_ORDEM_FABRICACAO,
      NM_FMT,
      NM_BATCH_CONTROL,
      SK_FILIAL,
      SK_TIPO_BOLETIM,
      cod_usuario: SK_USUARIO,
    } = req.body;
    try {
      const q = `
      INSERT INTO DIM_CABECALHO_BOLETIM ${queryInsertSingle({
        NK_PRODUTO,
        DD_SALA,
        NM_FABRICO,
        NM_ORDEM_FABRICACAO,
        NM_FMT,
        NM_BATCH_CONTROL,
        SK_FILIAL,
        SK_TIPO_BOLETIM,
        SK_USUARIO,
      })}
      `;
      const { status, body } = await DAO.insert(q);
      return status === 200
        ? res
            .status(status)
            .json({ message: `Boletim Nº ${body[0]} criado com sucesso` })
        : res.status(status).json({ message: 'Erro ao criar o boletim' });
    } catch (error) {
      log(`512 - Erro de execucao do controller: ${error}`);
      return res.status(512).json({
        status: 512,
        body: error,
      });
    }
  },
  async getStep(req: any, res: any) {
    const type = req.SK_TIPO_BOLETIM;
    try {
      if (isNaN(type)) {
        return res.status(400).json({ error: 'Invalid type' });
      }
      const q = /*SQL*/ `
      SELECT 
        FT.SK_CABECALHO_STEP,
        DC.DS_STEP,
        DF.SK_FORMULARIO,
        DF.DS_CAMPO,
        DF.SK_TIPO_CAMPO,
        DF.REF_INICIO,
        DF.REF_FIM,
        DF.AGRUPAMENTO,
        DF.DD_ORDENACAO,
        DF.DD_UM,
        DF.REF_TABELA,
        DF.CAMPO_REF_TABELA,
        DF.OBRIGATORIO,
        DF.DD_TOTAL_REGISTROS, 
        DF.REF_CAMPO_CONDICAO, 
        DF.TIPO_INFORMACAO,
        DF.VLR_CHECKBOX,
        CASE
          WHEN DF.REF_CAMPO_CONDICAO IS NOT NULL
              AND DF.REF_VALOR_CONDICAO IS NULL
          THEN (SELECT NK_PRODUTO FROM DIM_CABECALHO_BOLETIM WHERE SK_CABECALHO_BOLETIM = ${req.SK_CABECALHO_BOLETIM})
          ELSE DF.REF_VALOR_CONDICAO
        END AS REF_VALOR_CONDICAO
      FROM FT_STEP FT
      LEFT JOIN DIM_CABECALHO_STEP DC ON FT.SK_CABECALHO_STEP = DC.SK_CABECALHO_STEP
      LEFT JOIN DIM_FORMULARIO DF ON FT.SK_STEP = DF.SK_STEP
      WHERE FT.SK_TIPO_BOLETIM = ${type} AND FT.D_E_L_E_T_ IS NULL AND DC.D_E_L_E_T_ IS NULL AND DF.D_E_L_E_T_ IS NULL
      ORDER BY DF.DD_ORDENACAO ASC
      `;
      const resp = await DAO.select(q);
      if (resp.status !== 200) {
        return res
          .status(resp.status)
          .json({ message: 'Erro ao buscar formulario.' });
      }
      const body = resp.body as FormProps[];
      const steps = getDistinctItem(body, 'SK_CABECALHO_STEP');
      const forms = steps
        .map((header) => {
          const FORM = body.filter(
            (i) => i.SK_CABECALHO_STEP === Number(header)
          );
          const { SK_CABECALHO_STEP, DS_STEP } = FORM[0];
          const STEP = { SK_CABECALHO_STEP, DS_STEP };
          return { STEP, FORM };
        })
        .sort(
          (a, b) =>
            Number(a.STEP.SK_CABECALHO_STEP) - Number(b.STEP.SK_CABECALHO_STEP)
        );
      const qFill = `
        SELECT * FROM FT_ITEM_STEP WHERE SK_CABECALHO_BOLETIM = ${req.SK_CABECALHO_BOLETIM} 
        `;
      const rFill = await DAO.select(qFill);
      if (rFill.status !== 200) {
        return res
          .status(rFill.status)
          .json({ message: 'Erro ao buscar itens preenchidos.' });
      }

      return res.status(resp.status).json({ data: forms, FILL: rFill.body });
    } catch (error) {
      log(`512 - Erro de execucao do controller: ${error}`);
      return res.status(512).json({
        status: 512,
        body: error,
      });
    }
  },
};
