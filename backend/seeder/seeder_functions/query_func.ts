import { PoolClient } from "pg";

export const bulkInsert = async <T extends Record<string, any>>(
  client:PoolClient,
  table: string,
  entities: T[]
) => {
  if(entities.length === 0) return;

  const keys = Object.keys(entities[0]);

  const values: string[] = [];
  const params: any[] = [];

  entities.forEach((entity, i) => {
    const rowParams:string[] = [];
    keys.forEach((key, j) => {
      params.push(entity[key]);
      rowParams.push(`$${i * keys.length + j + 1}`);
    });
    values.push(`(${rowParams.join(',')})`);
  });

  const sql = `
    insert into ${table}
    (${keys.join(',')})
    values
    ${values.join(',')}
  `;
  await client.query(sql, params);
}