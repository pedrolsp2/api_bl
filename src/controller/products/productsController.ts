import DAO from '../../DAO';
import log from '../../middleware/logger';
import queryGen from '../../utils/queryGen';
import { socketFunctions } from '../../http/server';
import { getDistinctItem } from '../../utils/arrayDistinct';

const { queryInsertSingle, queryUpdate } = queryGen;

export default {
  async getProducts(req: any, res: any) {
    try {
      const q = `
      SELECT * FROM ETL_PRODUTOS 
      `;
      const { status, body } = await DAO.select(q);
      const distinct = getDistinctItem(body, 'COD_PROD').map((codProd) => {
        const prodGroup = body.filter((item: any) => item.COD_PROD === codProd);
        const items = body.find((item: any) => item.COD_PROD === codProd);
        const comps = getDistinctItem(prodGroup, 'COD_COMP').flatMap(
          (codComp) => {
            const compGroup = prodGroup.filter(
              (item: any) => item.COD_COMP === codComp
            );
            return compGroup;
          }
        );

        return {
          ...items,
          componentes: comps.map((i: any) => i),
        };
      });
      return res.status(status).json(distinct);
    } catch (error) {
      log(`512 - Erro de execucao do controller: ${error}`);
      return res.status(512).json({
        status: 512,
        body: error,
      });
    }
  },
};
