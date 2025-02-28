import express from 'express';
import db from '../database/connection';
import ensureAuth from '../middleware/ensureauth';
import errorHandler from '../lib/errorHandler';
import { FieldsInvalidError, FieldsRequiredError, NotFoundError } from '../lib/errors';
import type { DBLocation, DBMessage } from '../database/models';
import { addRemover } from '../lib/defaultCRUD';

const messagesRouter = express.Router();

messagesRouter.use(ensureAuth);

addRemover(messagesRouter, "message", "author = $user_id", { user_id: "$user_id" });

messagesRouter.get('/received', errorHandler(async (req, res) => {
  const { page = 1, limit = 50, author, include = "global" } = req.query;
  if (isNaN(+page) || isNaN(+limit)) 
    throw new FieldsInvalidError();
  if (+page < 1 || +limit < 1 || +limit > 50)
    throw new FieldsInvalidError();

  const include_global = include?.toString().includes("global");
  const include_direct = include?.toString().includes("direct");

  const messages = (await db.query(`
    SELECT * FROM message 
    WHERE recipient IN [${include_direct ? "$user_id," : ""} ${include_global ? "NONE, NULL," : ""}] 
    ${author ? `AND author IN [$author, $user_id]` : ""}
    ORDER BY created DESC
    LIMIT $limit
    START $page * $limit - $limit;
  `, {
    user_id: req.employee?.id,
    page: +page,
    limit: +limit,
    author,
  }))[0];

  res.status(200).json({
    code: "success",
    message: "Messages retrieved",
    data: { messages },
  });
}));

messagesRouter.get('/get', errorHandler(async (req, res) => {
  const ids = (req.query.ids as string).trim().split(",");
  if (ids.length === 0)
    throw new FieldsRequiredError();
  if (ids.every(id => !id.startsWith("message:")))
    throw new FieldsInvalidError();

  const selection = [];
  selection.push("*");
  // if (req.query.include) {
  //   const include = new Set((req.query.include as string).trim().split(","));
  //   if (include.has("something")) selection.push("some_query");
  // }
  const messages = (await db.query<DBLocation[][]>(`
    SELECT ${selection.join(",")} FROM array::map($ids, |$id| type::thing($id))
    WHERE recipient IN [$user_id, NONE, NULL];
  `, { ids, user_id: req.employee?.id }))[0];

  if (!messages || !messages.length)
    throw new NotFoundError();

  res.status(200).json({
    code: "success",
    message: "Message(s) retrieved",
    data: { messages },
  });
}));

messagesRouter.post('/create', errorHandler(async (req, res) => {
  const { text, recipient, reply_to } = req.body;
  if (!text || !text.trim().length)
    throw new FieldsRequiredError();

  const message = (await db.query<DBMessage[]>(`
    CREATE ONLY message CONTENT {
      text: $text,
      author: type::thing($user_id),
      ${recipient ? `recipient: type::thing($recipient),` : ""}
      ${reply_to ? `reply_to: type::thing($reply_to),` : ""}
    };
  `, { text, recipient, reply_to, user_id: req.employee?.id }))[0];

  if (!message || !message.id)
    throw new FieldsInvalidError();

  res.status(200).json({
    code: "success",
    message: "Message created",
    data: { message },
  });
}));

messagesRouter.post('/update', errorHandler(async (req, res) => {
  const { id, text } = req.body;
  if (!id || !text)
    throw new FieldsRequiredError();
  if (!id.startsWith("message:") || !text.trim().length)
    throw new FieldsInvalidError();

  const message = (await db.query<DBLocation[]>(`
    UPDATE ONLY type::thing($id) MERGE {
      text: $text,
    } WHERE author = $user_id;
  `, { id, text, user_id: req.employee?.id }))[0];

  if (!message || !message.id)
    throw new NotFoundError();

  res.status(200).json({
    code: "success",
    message: "Message updated",
    data: { message },
  });
}));

export default messagesRouter;