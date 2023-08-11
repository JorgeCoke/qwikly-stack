import { CreateEmailOptions } from "resend/build/src/emails/interfaces";
import { siteConfig } from "../site.config";
import { resend } from "./resend";
import { setPasswordTemplate } from "./templates/set-password";


export const sendSetPasswordEmail = async (
    createEmailOptions: Omit<CreateEmailOptions, "react" | "from" | "subject">,
    props: { url: string },
  ) => {
    const subject = `${siteConfig.title} - Set Password`
    await resend.sendEmail({
      ...createEmailOptions,
      subject,
      from: process.env.RESEND_FROM!,
      html: setPasswordTemplate(subject, props.url)
    }).catch(err => {
      console.error(err);
    })
  };
  