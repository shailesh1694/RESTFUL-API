const nodemailer = require("nodemailer")




const sendEmail = async (options, callback) => {

    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "dcbc28235ce7cd",
            pass: "1979f290dfcdab"
        }
    });

    async function main() {
        // send mail with defined transport object
        const info = await transport.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>', // sender address
            to: options.email, // list of receivers
            subject: options.subject, // Subject line
            text: options.message, // plain text body
            html: "<b>Hello world?</b>", // html body
        });

        console.log("Message sent: %s", info.messageId);

    }

    main().catch(() => { callback() });
}

module.exports = sendEmail
