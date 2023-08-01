import { Resend } from "resend";
import { CreateEmailOptions } from "resend/build/src/emails/interfaces";
import { setPasswordTemplate } from "./templates/set-password";

export const mailer = new Resend(process.env.RESEND_SECRET);

export const sendSetPasswordEmail = async (
    createEmailOptions: Omit<CreateEmailOptions, "react" | "from" | "subject">,
    props: { url: string },
  ) => {
    await mailer.sendEmail({
      ...createEmailOptions,
      subject: "Qwikly Stack - Set Password",
      from: process.env.RESEND_FROM!,
      html: setPasswordTemplate("Qwikly Stack - Set Password", props.url)
    });
  };
  