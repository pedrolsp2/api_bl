import DAO from '../../DAO';
import log from '../../middleware/logger';
import queryGen from '../../utils/queryGen';
import { socketFunctions } from '../../http/server';
import { RequestHandler } from 'express';
import { PutReportProps } from './type';

const { queryInsertSingle, queryUpdate } = queryGen;

export default {
  async newReport(req: any, res: any) {
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
      DS_PRODUTO,
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
        DS_PRODUTO,
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
  async putReport(req: any, res: any) {
    const props = req.body.props;

    try {
      const q = `
      INSERT INTO FT_ITEM_STEP (SK_STEP,SK_FORMULARIO,VALOR,INICIO,FIM,TOTAL,SK_CABECALHO_BOLETIM,SK_USUARIO) VALUES ${props
        .map((i: PutReportProps) => {
          return `
          (${i.SK_STEP},${i.SK_FORMULARIO},
          ${i.VALOR ? `'${i.VALOR}'` : null},
          ${i.INICIO ? `'${i.INICIO}'` : null},
          ${i.FIM ? `'${i.FIM}'` : null},
          ${i.TOTAL ? `'${i.TOTAL}'` : null},
          ${i.SK_CABECALHO_BOLETIM ? `'${i.SK_CABECALHO_BOLETIM}'` : null},
          ${req.body.cod_usuario})`;
        })
        .join(',')}
      `;
      const { status, body } = await DAO.insert(q);
      return status === 200
        ? res.status(status).json({ message: `Inserido com sucesso` })
        : res.status(status).json({ message: 'Erro ao inserir ao boletim' });
    } catch (error) {
      log(`512 - Erro de execucao do controller: ${error}`);
      return res.status(512).json({
        status: 512,
        body: error,
      });
    }
  },
  async getReport(req: any, res: any) {
    const type = Number(req.query.type);

    try {
      if (isNaN(type)) {
        return res.status(400).json({ error: 'Invalid type' });
      }
      const q = `
      SELECT * FROM DIM_CABECALHO_BOLETIM WHERE SK_TIPO_BOLETIM = ${type}
      `;
      const { body, status } = await DAO.select(q);
      return res.status(status).json(body);
    } catch (error) {
      log(`512 - Erro de execucao do controller: ${error}`);
      return res.status(512).json({
        status: 512,
        body: error,
      });
    }
  },
  async getDinamicValues(req: any, res: any) {
    const {
      REF_CAMPO_CONDICAO,
      REF_TABELA,
      REF_VALOR_CONDICAO,
      CAMPO_REF_TABELA,
    } = req.body;

    try {
      const q = `
      SELECT DISTINCT ${CAMPO_REF_TABELA} FROM ${REF_TABELA} ${
        REF_CAMPO_CONDICAO
          ? ` WHERE ${REF_CAMPO_CONDICAO} = '${REF_VALOR_CONDICAO}'`
          : ''
      }
      `;
      const { body, status } = await DAO.select(q);
      return res.status(status).json(body);
    } catch (error) {
      log(`512 - Erro de execucao do controller: ${error}`);
      return res.status(512).json({
        status: 512,
        body: error,
      });
    }
  },
};
