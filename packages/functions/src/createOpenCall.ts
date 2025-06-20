import { Table } from "sst/node/table";
import { v4 as uuid } from "uuid";

export async function handler(event: any) {
  const { title, description } = event.arguments;
  const id = uuid();

  const item = {
    pk: `OPENCALL#${id}`,
    sk: `DETAILS`,
    data: JSON.stringify({ title, description, createdAt: new Date().toISOString() }),
  };

  await Table.SuKunstTable.put(item);

  return { id, title, description, createdAt: new Date().toISOString() };
}
