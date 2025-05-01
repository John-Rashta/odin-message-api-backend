import asyncHandler from "express-async-handler";
import { matchedData } from "express-validator";
import {
  checkOwnerOfMessage,
  deleteMessage,
  updateMessage,
} from "../util/queries";
import { deleteFiles } from "../util/helperFunctions";

const updateUserMessage = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(400).json();
    return;
  }

  const formData = matchedData(req);
  const possibleMessage = await checkOwnerOfMessage(
    req.user.id,
    formData.messageid,
  );

  if (!possibleMessage) {
    res.status(400).json();
    return;
  }

  await updateMessage(formData.messageid, formData.content);
  res.status(200).json();
});

const deleteUserMessage = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(400).json();
    return;
  }

  const formData = matchedData(req);
  const possibleMessage = await checkOwnerOfMessage(
    req.user.id,
    formData.messageid,
  );

  if (!possibleMessage) {
    res.status(400).json();
    return;
  }

  const deletedMessage = await deleteMessage(formData.messageid);
  if (deletedMessage.image) {
    await deleteFiles([deletedMessage.image]);
  }
  res.status(200).json();
});

const getMessage = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(400).json();
    return;
  }
  const formData = matchedData(req);
  const messageInfo = await checkOwnerOfMessage(
    req.user.id,
    formData.messageid,
  );

  if (!messageInfo) {
    res.status(400).json();
    return;
  }

  res.status(200).json({ message: messageInfo });
});

export { updateUserMessage, deleteUserMessage, getMessage };
