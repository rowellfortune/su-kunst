import { Table } from "sst/node/table";

export async function handler(event: any) {
  const { id } = event.arguments;

  const result = await Table.SuKunstTable.get({
    pk: `OPENCALL#${id}`,
    sk: "DETAILS",
  });

  const data = JSON.parse(result.data);

  return {
    id,
    title: data.title,
    description: data.description,
    createdAt: data.createdAt,
  };
}
