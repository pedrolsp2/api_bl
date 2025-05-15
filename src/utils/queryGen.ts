export default {
  queryUpdate: (params: any) => {
    if (typeof params !== 'object')
      throw Error('Parâmetro deve ser do tipo objeto.');

    let query = '';
    let index = 0;

    const entries = Object.entries(params).filter(
      (entry) =>
        (entry[1] !== null && entry[1] !== undefined) ||
        entry[0] == 'D_E_L_E_T_'
    );

    for (let [k, v] of entries) {
      query += `${k} = ${v == null && k == 'D_E_L_E_T_' ? `NULL` : `"${v}"`}${
        index === entries.length - 1 ? '' : ', '
      }`;
      index++;
    }

    return query;
  },

  /* 
        PARAMETROS: 
        { key: value }
        
        Sendo: 
        Key: Campo do banco
        Value: Valor a ser inserido
    */
  queryInsertSingle: (params: any) => {
    if (typeof params !== 'object')
      throw Error('Parâmetro deve ser do tipo objeto.');

    let query = '';
    const entries = Object.entries(params);

    for (let [k, v] of entries) {
      if (!v) delete params[k];
    }

    const keys = Object.keys(params);
    const values = Object.values(params);

    keys.forEach(
      (key, index) =>
        (query += `${index === 0 ? '(' : ''}${key}${
          index === keys.length - 1 ? ') VALUES ' : ', '
        }`)
    );

    values.forEach(
      (value, index) =>
        (query += `${index === 0 ? '(' : ''}"${value}"${
          index === keys.length - 1 ? ')' : ', '
        }`)
    );

    return query;
  },

  queryValues: (params: any) => {
    if (typeof params !== 'object' || params === null) {
      throw new Error('Parâmetro deve ser do tipo objeto.');
    }

    const values = Object.values(params).map((v) =>
      v == null ? 'null' : `'${v}'`
    );

    return `(${values.join(', ')})`;
  },

  queryFilter: (filters: any) => {
    const generateFilterQuery = (filter: any) => {
      if ('AND' in filter) {
        const subFilters = filter.AND.map(generateFilterQuery).filter(Boolean);
        return subFilters.length > 0 ? `(${subFilters.join(' AND ')})` : null;
      }

      if ('OR' in filter) {
        const subFilters = filter.OR.map(generateFilterQuery).filter(Boolean);
        return subFilters.length > 0 ? `(${subFilters.join(' OR ')})` : null;
      }

      switch (filter.OPERADOR) {
        case 'BETWEEN':
          return filter.VALOR &&
            filter.VALOR.length === 2 &&
            filter.VALOR.every((value: any) => Boolean(value))
            ? `${filter.CAMPO} BETWEEN '${filter.VALOR.join("' AND '")}'`
            : null;
        case 'LIKE':
          return filter.VALOR
            ? `${filter.CAMPO} LIKE '%${filter.VALOR}%'`
            : null;
        case 'EQUALS':
          return filter.VALOR ? `${filter.CAMPO} = ${filter.VALOR}` : null;
        case 'NOT_NULL':
          return `${filter.CAMPO} IS NOT NULL`;
        case 'NULL':
          return `${filter.CAMPO} IS NULL`;
        case 'DIFFERENT':
          return filter.VALOR ? `${filter.CAMPO} <> ${filter.VALOR}` : null;
        case "REGEXP('.*')":
          return filter.VALOR ? `${filter.CAMPO} "REGEXP('.*')",` : null;

        default:
          throw new Error(`Invalid operator: ${filter.OPERADOR}`);
      }
    };

    const filterQueries = filters.map(generateFilterQuery).filter(Boolean);
    return filterQueries.join(' AND ');
  },
};
