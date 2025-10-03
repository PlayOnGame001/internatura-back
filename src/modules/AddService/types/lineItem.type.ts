import { FastifyReply, FastifyRequest } from 'fastify';
import path from 'path';
import fs from 'fs';
import { pipeline } from 'stream/promises';
import { createLineItem, getLineItems } from '../service/lineItem.service';

const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export async function renderForm(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const html = `
    <!doctype html>
    <html>
    <head><meta charset="utf-8"><title>Create Line Item</title></head>
    <body style="font-family: Arial; padding:20px;">
      <h1>Create Line Item</h1>
      <form method="POST" action="/line-item" enctype="multipart/form-data">
        <div><label>Size: <input name="size" required></label></div>
        <div><label>Min CPM: <input type="number" step="0.01" name="minCpm" required></label></div>
        <div><label>Max CPM: <input type="number" step="0.01" name="maxCpm" required></label></div>
        <div><label>Geo: <input name="geo"></label></div>
        <div><label>Ad Type:
          <select name="adType">
            <option value="banner">banner</option>
            <option value="video">video</option>
          </select>
        </label></div>
        <div><label>Frequency: <input type="number" name="frequency" value="1" required></label></div>
        <div><label>Creative: <input type="file" name="creative" required></label></div>
        <button type="submit" style="margin-top:10px;">Create</button>
      </form>
    </body>
    </html>
  `;
  reply.type('text/html').send(html);
}

export async function handleCreate(
  req: FastifyRequest,
  reply: FastifyReply
) {
  if (!req.isMultipart()) {
    return reply.code(400).send({ error: 'Expected multipart/form-data' });
  }

  const parts = req.parts();
  const fields: Record<string, string> = {};
  let savedFilePath = '';

  for await (const part of parts) {
    if (part.type === 'file') {
      // сохраняем файл
      const filename = `${Date.now()}_${part.filename}`;
      const filePath = path.join(uploadsDir, filename);
      await pipeline(part.file, fs.createWriteStream(filePath));
      savedFilePath = `/uploads/${filename}`;
    } else {
      // безопасно обрабатываем поле
      if (typeof part.value === 'string') {
        fields[part.fieldname] = part.value;
      } else {
        // если вдруг пришло не строковое значение
        fields[part.fieldname] = String(part.value);
      }
    }
  }

  // создаем объект для БД с правильными типами
  const data = {
    size: fields.size,
    minCpm: parseFloat(fields.minCpm),
    maxCpm: parseFloat(fields.maxCpm),
    geo: fields.geo,
    adType: fields.adType,
    frequency: parseInt(fields.frequency, 10),
    creativeUrl: savedFilePath
  };

  const created = await createLineItem(data);
  reply.send({ ok: true, lineItem: created });
}

export async function getAllItems(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const items = await getLineItems();
  reply.send(items);
}
