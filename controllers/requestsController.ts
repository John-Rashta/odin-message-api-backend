import asyncHandler from "express-async-handler";
import { matchedData } from "express-validator";
import {
  checkIfUserInRequest,
  getAllUserRequests,
  getRequestInfo,
  createRequest,
  getUser,
  deleteRequest,
  checkIfUserRoleInRequest,
  createFriendship,
  checkIfGroupMember,
  updateGroupInfo,
  checkIfFriendshipExists,
  findIfRequestExists,
  checkIfGroupAdmin,
  getUserSentRequests,
} from "../util/queries";

const getRequests = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(400).json();
    return;
  }

  const userRequests = await getAllUserRequests(req.user.id);
  if (!userRequests) {
    res.status(400).json();
    return;
  }

  res.status(200).json({ user: userRequests });
});

const getSentRequests = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(400).json();
    return;
  }

  const userSentRequests = await getUserSentRequests(req.user.id);

  if (!userSentRequests) {
    res.status(400).json();
    return;
  }

  res.status(200).json({ user: userSentRequests });
});

const getRequest = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(400).json();
    return;
  }
  const formData = matchedData(req);
  const checkRequest = await checkIfUserInRequest(
    req.user.id,
    formData.requestid,
  );
  if (!checkRequest) {
    res.status(400).json();
    return;
  }
  const userRequest = await getRequestInfo(formData.requestid);
  if (!userRequest) {
    res.status(400).json();
    return;
  }

  res.status(200).json({ request: userRequest });
});

const makeRequest = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(400).json();
    return;
  }
  const formData = matchedData(req);

  if (req.user.id === formData.targetid) {
    res.status(400).json();
    return;
  }

  const checkTarget = await getUser(formData.targetid);
  if (!checkTarget) {
    res.status(400).json();
    return;
  }

  if (formData.targetid === req.user.id) {
    res.status(400).json();
    return;
  }

  const checkIfRequestExists = await findIfRequestExists(
    req.user.id,
    formData.targetid,
    formData.type,
  );
  if (checkIfRequestExists) {
    res.status(400).json({ message: "Request Already Sent" });
    return;
  }
  if (formData.type === "FRIEND" || formData.type === "GROUP") {
    if (formData.type === "GROUP" && !formData.groupid) {
      res.status(400).json({ message: "GroupId Required for Group Requests" });
      return;
    }
    if (formData.groupid) {
      const isAdmin = await checkIfGroupAdmin(req.user.id, formData.groupid);
      if (!isAdmin) {
        res.status(400).json({ message: "Only Admins Can Invite" });
        return;
      }
      const alreadyMember = await checkIfGroupMember(
        formData.targetid,
        formData.groupid,
      );
      if (alreadyMember) {
        res.status(400).json({ message: "Already a Member" });
        return;
      }
    }
    if (formData.type === "FRIEND") {
      const checkIfFriends = await checkIfFriendshipExists(
        req.user.id,
        formData.targetid,
      );
      if (checkIfFriends) {
        res.status(400).json({ message: "Already Friends" });
        return;
      }
    }
    await createRequest(
      req.user.id,
      formData.targetid,
      formData.type,
      new Date(),
      formData.groupid || null,
    );
    res.status(200).json();
    return;
  }
  res.status(400).json();
});

const updateRequest = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(400).json();
    return;
  }
  const formData = matchedData(req);
  const requestInfo = await checkIfUserRoleInRequest(
    req.user.id,
    formData.requestid,
    "receiver",
  );
  if (!requestInfo) {
    res.status(400).json();
    return;
  }
  if (requestInfo.type === "FRIEND") {
    await createFriendship(requestInfo.senderid, requestInfo.receiverid);
    await deleteRequest(formData.requestid);
    res.status(200).json();
    return;
  } else if (requestInfo.type === "GROUP") {
    if (!requestInfo.groupid) {
      res.status(400).json();
      return;
    }
    const checkIfAlreadyIn = await checkIfGroupMember(
      req.user.id,
      requestInfo.groupid,
    );
    if (checkIfAlreadyIn) {
      await deleteRequest(formData.requestid);
      res.status(400).json();
      return;
    }
    await updateGroupInfo(requestInfo.groupid, {
      memberid: req.user.id,
      action: "ADD",
    });
    await deleteRequest(formData.requestid);
    res.status(200).json();
    return;
  }
  res.status(400).json();
});

const deleteRequestPending = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(400).json();
    return;
  }
  const formData = matchedData(req);
  const checkIfInRequest = await checkIfUserInRequest(
    req.user.id,
    formData.requestid,
  );
  if (!checkIfInRequest) {
    res.status(400).json();
    return;
  }

  await deleteRequest(formData.requestid);
  res.status(200).json();
});

export {
  getRequest,
  getRequests,
  makeRequest,
  deleteRequestPending,
  updateRequest,
  getSentRequests,
};
