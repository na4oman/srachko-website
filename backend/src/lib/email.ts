import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendServiceRequestEmail = async (requestData: any) => {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set, skipping email notification')
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

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@srachko.bg'
  const adminEmail = process.env.ADMIN_EMAIL || 'v.srachko@gmail.com'

  try {
    // Send both emails in parallel
    await Promise.all([
      // 1. Admin notification email
      resend.emails.send({
        from: fromEmail,
        to: adminEmail,
        subject: `Нова заявка: ${requestType} - ${firstName} ${lastName}`,
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
      }),

      // 2. Customer confirmation email
      resend.emails.send({
        from: fromEmail,
        to: email,
        subject: `Потвърждение на заявка - Srachko Service`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Потвърждение на заявка</h2>
            <p>Здравейте <strong>${firstName} ${lastName}</strong>,</p>
            <p>Благодарим Ви за заявката! Вашата заявка за <strong>${requestType}</strong> е получена успешно.</p>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #1f2937;">Детайли на заявката:</h3>
              <p><strong>Уред:</strong> ${brand} ${model}</p>
              <p><strong>Описание:</strong> ${complaint}</p>
              <p><strong>Адрес:</strong> ${city}, ${street} ${streetNumber}</p>
            </div>

            <p>Нашият екип ще се свърже с Вас скоро на телефон <strong>${phone}</strong>.</p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
            
            <p style="color: #6b7280; font-size: 14px;">
              С уважение,<br />
              <strong>Екипът на Srachko Service</strong><br />
              Телефон: 0888 123 456<br />
              Email: ${adminEmail}
            </p>
          </div>
        `,
      })
    ])

    console.log('Admin notification and customer confirmation emails sent successfully via Resend')
  } catch (error: any) {
    console.error('Error sending email via Resend:', error)
    // Re-throw to allow caller to handle
    throw error
  }
}
