import { body, param, query } from "express-validator";

const validateCredentials = [
    body("username")
        .isAlphanumeric().withMessage("Must only contain letters and/or numbers."),
    body("password")
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
        body(fieldname)
            .optional({ values: "falsy" })
            .isUUID().withMessage("Must be an UUID")
    ]
};

const validateUserProfile = [
    body("name")
        .optional()
        .isString().withMessage("Must only be Ascii"),
    body("icon")
        .optional({ values: "falsy" })
        .isInt().withMessage("Must be an integer")
        .toInt(),
    body("aboutMe")
        .optional()
        .isString().withMessage("Must only be Ascii"),
];

const validateOptionalCredentials = [
    body("username").trim()
        .optional({ values: "falsy" })
        .isAlphanumeric().withMessage("Must only contain letters and/or numbers."),
    body("password")
        .optional({ values: "falsy" })
        .isAscii().withMessage("Must be only Ascii characters."),
    body("oldPassword")
        .optional({ values: "falsy" })
        .isAscii().withMessage("Must be only Ascii characters.")
    ];

const validateSearchUser = [
    query("user")
        .notEmpty()
        .isAscii().withMessage("Must be either an Username or an UUID")
];

const validateMessage = [
    body("content")
        .notEmpty()
        .isString()
];

const validateOptionalMessage = [
    body("content")
        .optional({values: "falsy"})
        .notEmpty()
        .isString()
]

const validateGroupUpdate = [
    body("targetid")
        .optional({values: "falsy"})
        .isUUID().withMessage("Must be an UUID"),
    body("action")
        .optional({values: "falsy"})
        .isIn(["REMOVE", "PROMOTE", "DEMOTE"]).withMessage("Types can only be REMOVE, DEMOTE or PROMOTE"),
];

const validateConvoQuery = [
    query("type")
    .optional({values: "falsy"})
    .isAlpha().withMessage("Only letters")
]

const validateGroupName = [
    body("name")
    .optional({values: "falsy"})
    .notEmpty()
    .isAscii().withMessage("Must be Ascii")

]

export { validateConvoQuery, validateGroupName, validateOptionalMessage, validateGroupUpdate, validateMessage, validateSearchUser, validateCredentials, validateUUID, validateType, validateBodyUUID, validateRequestGroup, validateOptionalUUID, validateUserProfile, validateOptionalCredentials };
