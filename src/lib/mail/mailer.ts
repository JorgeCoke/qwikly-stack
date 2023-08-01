import { CreateEmailOptions } from "resend/build/src/emails/interfaces";
import { resend } from "./resend";
import { setPasswordTemplate } from "./templates/set-password";


export const sendSetPasswordEmail = async (
    createEmailOptions: Omit<CreateEmailOptions, "react" | "from" | "subject">,
    props: { url: string },
  ) => {
    await resend.sendEmail({
      ...createEmailOptions,
      subject: "Qwikly Stack - Set Password",
      from: process.env.RESEND_FROM!,
      html: setPasswordTemplate("Qwikly Stack - Set Password", props.url)
    }).catch(err => {
      console.error(err);
    })
  };
  