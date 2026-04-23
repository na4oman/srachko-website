import sgMail from '@sendgrid/mail'

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

export const sendServiceRequestEmail = async (requestData: any) => {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SENDGRID_API_KEY not set, skipping email notification')
    return
  }

  const {
    firstName,
    lastName,
    email,
    phone,
    requestType,
    brand,
    model,
    complaint,
    city,
    street,
    streetNumber,
  } = requestData

  const msg = {
    to: process.env.ADMIN_EMAIL || 'v.srachko@gmail.com', // Admin email
    from: process.env.SENDGRID_FROM_EMAIL || 'noreply@srachko.bg', // Must be verified in SendGrid
    subject: `Нова заявка: ${requestType} - ${firstName} ${lastName}`,
    text: `
      Нова заявка за ${requestType} от ${firstName} ${lastName}.
      Телефон: ${phone}
      Имейл: ${email}
      Уред: ${brand} ${model}
      Описание: ${complaint}
      Адрес: ${city}, ${street} ${streetNumber}
    `,
    html: `
      <h2>Нова заявка за ${requestType}</h2>
      <p><strong>Клиент:</strong> ${firstName} ${lastName}</p>
      <p><strong>Телефон:</strong> ${phone}</p>
      <p><strong>Имейл:</strong> ${email}</p>
      <hr />
      <p><strong>Уред:</strong> ${brand} ${model}</p>
      <p><strong>Описание:</strong> ${complaint}</p>
      <hr />
      <p><strong>Адрес:</strong> ${city}, ${street} ${streetNumber}</p>
    `,
  }

  try {
    await sgMail.send(msg)
    console.log('Service request email sent')
  } catch (error: any) {
    console.error('Error sending email:', error)
    if (error.response) {
      console.error(error.response.body)
    }
  }
}
