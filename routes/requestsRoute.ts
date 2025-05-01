import { Router } from "express";
import { isAuth } from "../middleware/authMiddleware";
import {
  validateBodyUUID,
  validateRequestGroup,
  validateType,
  validateUUID,
} from "../util/validators";
import { validationErrorMiddleware } from "../middleware/validationErrorMiddleware";
import {
  getRequest,
  getRequests,
  makeRequest,
  deleteRequestPending,
  updateRequest,
  getSentRequests,
} from "../controllers/requestsController";

const requestsRoute = Router();

requestsRoute.get("/", isAuth, getRequests);
requestsRoute.get("/sent", isAuth, getSentRequests);
requestsRoute.post(
  "/",
  isAuth,
  validateBodyUUID,
  validateType,
  validateRequestGroup,
  validationErrorMiddleware,
  makeRequest,
);
requestsRoute.get(
  "/:requestid",
  isAuth,
  validateUUID("requestid"),
  validationErrorMiddleware,
  getRequest,
);
requestsRoute.put(
  "/:requestid",
  isAuth,
  validateUUID("requestid"),
  validationErrorMiddleware,
  updateRequest,
);
requestsRoute.delete(
  "/:requestid",
  isAuth,
  validateUUID("requestid"),
  validationErrorMiddleware,
  deleteRequestPending,
);

export default requestsRoute;
