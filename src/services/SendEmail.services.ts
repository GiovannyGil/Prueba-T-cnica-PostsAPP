import Mailjet from 'node-mailjet'

const apiKey = 'APIKEY'
const apiSecret = 'APISECRET'

// funcion para el envio de email de verificaion
const mailjetClient = Mailjet.apiConnect(
    process.env.MJ_APIKEY_PUBLIC || apiKey,
    process.env.MJ_APIKEY_PRIVATE || apiSecret,
    {
      config: {},
      options: {}
    } 
)

export const sendVerificationEmail = async (email: string, fullName: string, verificationLink: string) => {
    try {
        // Configurar los datos del correo electrónico
        const emailData = {
            Messages: [
                {
                    From: {
                        Email: "tucorreo@tudominio.com", // Cambiar por tu dirección de correo electrónico
                        Name: "Tu Nombre" // Cambiar por tu nombre o el nombre de tu aplicación
                    },
                    To: [
                        {
                            Email: email, // Utilizar el correo electrónico del usuario registrado
                            Name: fullName // Utilizar el nombre del usuario registrado
                        }
                    ],
                    Subject: "Verificación de correo electrónico", // Asunto del correo electrónico
                    TextPart: `Por favor, haz clic en el siguiente enlace para verificar tu correo electrónico: ${verificationLink}`, // Cuerpo del correo electrónico en formato de texto
                    HTMLPart: `<p>Por favor, haz clic en el siguiente enlace para verificar tu correo electrónico:</p><p><a href="${verificationLink}">Verificar correo electrónico</a></p>` // Cuerpo del correo electrónico en formato HTML
                }
            ]
        }

        // Enviar el correo electrónico
        const request = mailjetClient.post('send', { version: 'v3.1' }).request(emailData)

        request.then((result) => {
            console.log(result.body) // Manejar la respuesta exitosa
        }).catch((err) => {
            console.error(err.statusCode) // Manejar el error, si lo hay
        });
    } catch (error) {
        console.error('Error al enviar el correo electrónico de verificación:', error)
    }
};

