import { transporter } from "../../config/email";


if (!transporter) {
    throw new Error("You need to configure an email transporter. ");
}

export const emailTransporter = transporter;
