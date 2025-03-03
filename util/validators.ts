import { body } from "express-validator";

const validateCredentials = [
    body("username").trim()
        .isAlphanumeric().withMessage("Must only contain letters and/or numbers."),
    body("password").trim()
        .isAscii().withMessage("Must be only Ascii characters.")
];

export { validateCredentials };
