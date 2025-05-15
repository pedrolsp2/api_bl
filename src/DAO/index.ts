import { QueryTypes } from 'sequelize';
import sequelize from '../config';
import log from '../middleware/logger';

interface DAOResponse {
  status: number;
  body: any;
}

const DAO = {
  async insert(query: string): Promise<DAOResponse> {
    try {
      await sequelize.authenticate();
      try {
        const insertCompleted = await sequelize.query(query, {
          type: QueryTypes.INSERT,
        });
        return {
          status: 200,
          body: insertCompleted,
        };
      } catch (error) {
        log(`510 - Erro execucao do script ${query} ,${error}`);
        return {
          status: 510,
          body: error,
        };
      }
    } catch (error) {
      log(`511 - Erro de autenticacao ,${error}`);
      return {
        status: 511,
        body: error,
      };
    }
  },
  async select(query: string): Promise<DAOResponse> {
    try {
      await sequelize.authenticate();
      try {
        const selectCompleted = await sequelize.query(query, {
          type: QueryTypes.SELECT,
        });
        return {
          status: 200,
          body: selectCompleted,
        };
      } catch (error) {
        log(` 510 - Erro execucao do script ${query} ,${error} `);
        return {
          status: 510,
          body: error,
        };
      }
    } catch (error) {
      log(`511 - Erro de autenticacao ,${error} `);
      return {
        status: 511,
        body: error,
      };
    }
  },
  async update(query: string): Promise<DAOResponse> {
    try {
      await sequelize.authenticate();
      try {
        const updateCompleted = await sequelize.query(query, {
          type: QueryTypes.UPDATE,
        });
        return {
          status: 200,
          body: updateCompleted,
        };
      } catch (error) {
        log(` 510 - Erro execucao do script ${query} ,${error} `);
        return {
          status: 510,
          body: error,
        };
      }
    } catch (error) {
      log(`511 - Erro de autenticacao ,${error} `);
      return {
        status: 511,
        body: error,
      };
    }
  },

  async delete(query: string): Promise<DAOResponse> {
    try {
      await sequelize.authenticate();
      try {
        const deleteCompleted = await sequelize.query(query, {
          type: QueryTypes.UPDATE,
        });
        return {
          status: 200,
          body: deleteCompleted,
        };
      } catch (error) {
        log(` 510 - Erro execucao do script ${query} ,${error} `);
        return {
          status: 510,
          body: error,
        };
      }
    } catch (error) {
      log(`511 - Erro de autenticacao ,${error} `);
      return {
        status: 511,
        body: error,
      };
    }
  },
};

export default DAO;
