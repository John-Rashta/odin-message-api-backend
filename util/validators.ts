import { body, param } from "express-validator";

const validateCredentials = [
    body("username").trim()
        .isAlphanumeric().withMessage("Must only contain letters and/or numbers."),
    body("password").trim()
        .isAscii().withMessage("Must be only Ascii characters.")
];

const validateUUID = (fieldname: string) => {
    return [
        param(fieldname)
            .isUUID().withMessage("Must be an UUID")
    ]
};

const validateType = [
    body("type")
        .isIn(["FRIEND", "GROUP"]).withMessage("Types can only be FRIEND or GROUP")
];

const validateBodyUUID = [
    body("targetid")
        .isUUID().withMessage("Must be an UUID")
];

const validateRequestGroup = [
    body("groupid")
        .optional({ values: "falsy" })
        .isUUID().withMessage("Must be an UUID")
];

export { validateCredentials, validateUUID, validateType, validateBodyUUID, validateRequestGroup };
