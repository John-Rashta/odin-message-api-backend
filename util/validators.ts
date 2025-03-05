import { body, param, query } from "express-validator";

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

const validateOptionalUUID = (fieldname: string) => {
    return [
        param(fieldname)
            .optional({ values: "falsy" })
            .isUUID().withMessage("Must be an UUID")
    ]
};

const validateUserProfile = [
    body("name")
        .optional({ values: "falsy" })
        .isAlpha().withMessage("Must only be words"),
    body("icon")
        .optional({ values: "falsy" })
        .isInt().withMessage("Must be an integer"),
    body("aboutMe")
        .optional({ values: "falsy" })
        .isAscii().withMessage("Must only be Ascii"),
];

const validateOptionalCredentials = [
    body("username").trim()
        .optional({ values: "falsy" })
        .isAlphanumeric().withMessage("Must only contain letters and/or numbers."),
    body("password").trim()
        .optional({ values: "falsy" })
        .isAscii().withMessage("Must be only Ascii characters.")
];

const validateSearchUser = [
    query("user")
        .isAscii().withMessage("Must be either an Username or an UUID")
];

const validateMessage = [
    body("content")
        .notEmpty()
        .isAscii().withMessage("Must be only Ascii characters.")
];

export { validateMessage, validateSearchUser, validateCredentials, validateUUID, validateType, validateBodyUUID, validateRequestGroup, validateOptionalUUID, validateUserProfile, validateOptionalCredentials };
