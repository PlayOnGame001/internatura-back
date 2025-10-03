import prisma from "../../../prisma/prisma.service";

const client: any = prisma;

export async function createLineItem(data: any) {
  return client.LineItem.create({ data });
}

export async function getLineItems() {
  return client.LineItem.findMany({ orderBy: { createdAt: 'desc' } });
}