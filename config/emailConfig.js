const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'mail.mymirage.fr',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Multilingual translations for user confirmation emails
const emailTranslations = {
  fr: {
    quoteSubject: '✨ Merci d\'avoir contacté Mirage Merchandising !',
    newsletterSubject: '✨ Merci pour votre inscription à la newsletter Mirage Merchandising !',
    greeting: (name) => `Bonjour ${name},`,
    intro: 'Nous avons bien reçu votre demande et notre équipe opérationnelle vous recontactera sous <strong>24 heures</strong>.',
    summaryTitle: 'Récapitulatif de votre demande :',
    urgencyTitle: '⏰ Délai souhaité :',
    messageTitle: '💬 Message :',
    defaultMessage: 'Demande de renseignements / Devis',
    newsletterMessage: 'Inscription à la newsletter depuis le site web',
    nextStepsTitle: '🔜 Quelles sont les prochaines étapes ?',
    steps: [
      'Nos spécialistes retail analysent vos besoins et planogrammes.',
      'Nous vous contactons pour valider le calendrier d\'intervention et les dimensions du magasin.',
      'Nous préparons une proposition clé en main, sans interruption de votre activité.'
    ],
    contactTitle: '📞 Besoin d\'une assistance immédiate ? Contactez-nous directement :',
    regards: 'Cordialement,',
    teamName: 'L\'équipe Mirage Merchandising',
    teamTagline: 'Transformations Retail & Déploiement Commercial',
    urgencyLabels: {
      urgent: 'Urgent (Moins d\'une semaine)',
      soon: 'Prochainement (2 à 3 semaines)',
      planning: 'Planification (Mois prochain)',
      future: 'Prise d\'information'
    }
  },
  en: {
    quoteSubject: '✨ Thank You for Contacting Mirage Merchandising!',
    newsletterSubject: '✨ Thank You for Subscribing to Mirage Merchandising!',
    greeting: (name) => `Dear ${name},`,
    intro: 'We\'ve received your inquiry and our operations team will get in touch with you within <strong>24 hours</strong>.',
    summaryTitle: 'Your Submission Summary:',
    urgencyTitle: '⏰ Urgency:',
    messageTitle: '💬 Message:',
    defaultMessage: 'Inquiry / Quote Request',
    newsletterMessage: 'Newsletter subscription from website',
    nextStepsTitle: '🔜 What happens next?',
    steps: [
      'Our retail specialists review your requirements.',
      'We contact you to verify operational timelines and store dimensions.',
      'We prepare a turnkey, zero-disruption project proposal.'
    ],
    contactTitle: '📞 Need immediate assistance? Contact us directly:',
    regards: 'Best regards,',
    teamName: 'The Mirage Merchandising Team',
    teamTagline: 'Retail Transformations & Merchandising Execution',
    urgencyLabels: {
      urgent: 'Urgent (Within 1 week)',
      soon: 'Soon (Within 2-3 weeks)',
      planning: 'Planning (Next month)',
      future: 'Future (Information gathering)'
    }
  },
  de: {
    quoteSubject: '✨ Vielen Dank für Ihre Anfrage bei Mirage Merchandising!',
    newsletterSubject: '✨ Vielen Dank für Ihre Newsletter-Anmeldung bei Mirage Merchandising!',
    greeting: (name) => `Sehr geehrte(r) ${name},`,
    intro: 'Wir haben Ihre Anfrage erhalten. Unser Einsatzteam wird sich innerhalb von <strong>24 Stunden</strong> mit Ihnen in Verbindung setzen.',
    summaryTitle: 'Zusammenfassung Ihrer Anfrage:',
    urgencyTitle: '⏰ Dringlichkeit:',
    messageTitle: '💬 Nachricht:',
    defaultMessage: 'Anfrage / Angebotserstellung',
    newsletterMessage: 'Newsletter-Anmeldung über die Website',
    nextStepsTitle: '🔜 Wie geht es weiter?',
    steps: [
      'Unsere Ladenbau-Spezialisten prüfen Ihre Projektanforderungen.',
      'Wir kontaktieren Sie zur Abstimmung des Einsatzzeitplans und der Flächenmaße.',
      'Wir erstellen ein schlüsselfertiges Konzept ohne Betriebsunterbrechung.'
    ],
    contactTitle: '📞 Benötigen Sie sofortige Unterstützung? Kontaktieren Sie uns direkt:',
    regards: 'Mit freundlichen Grüßen,',
    teamName: 'Ihr Mirage Merchandising Team',
    teamTagline: 'Ladenbau, Regalverschiebung & Merchandising',
    urgencyLabels: {
      urgent: 'Dringend (Innerhalb von 1 Woche)',
      soon: 'Bald (In 2-3 Wochen)',
      planning: 'Planung (Nächster Monat)',
      future: 'Informationsphase'
    }
  },
  nl: {
    quoteSubject: '✨ Bedankt voor uw contactaanvraag bij Mirage Merchandising!',
    newsletterSubject: '✨ Bedankt voor uw inschrijving op de Mirage Merchandising nieuwsbrief!',
    greeting: (name) => `Beste ${name},`,
    intro: 'Wij hebben uw aanvraag goed ontvangen. Ons operationele team neemt binnen <strong>24 uur</strong> contact met u op.',
    summaryTitle: 'Overzicht van uw aanvraag:',
    urgencyTitle: '⏰ Gewenste termijn:',
    messageTitle: '💬 Bericht:',
    defaultMessage: 'Informatieaanvraag / Offerte',
    newsletterMessage: 'Nieuwsbrief inschrijving via de website',
    nextStepsTitle: '🔜 Wat zijn de volgende stappen?',
    steps: [
      'Onze retailspecialisten analyseren uw wensen en schappenplan.',
      'Wij nemen contact met u op om de planning en winkelafmetingen af te stemmen.',
      'Wij stellen een turnkey voorstel op zonder sluiting van uw winkel.'
    ],
    contactTitle: '📞 Heeft u direct ondersteuning nodig? Neem contact op:',
    regards: 'Met vriendelijke groet,',
    teamName: 'Het Mirage Merchandising Team',
    teamTagline: 'Winkelherinrichting & Merchandising',
    urgencyLabels: {
      urgent: 'Urgent (Binnen 1 week)',
      soon: 'Binnenkort (2-3 weken)',
      planning: 'Planning (Volgende maand)',
      future: 'Informatiefase'
    }
  },
  it: {
    quoteSubject: '✨ Grazie per aver contattato Mirage Merchandising!',
    newsletterSubject: '✨ Grazie per l\'iscrizione alla newsletter Mirage Merchandising!',
    greeting: (name) => `Gentile ${name},`,
    intro: 'Abbiamo ricevuto la tua richiesta e il nostro team operativo ti ricontatterà entro <strong>24 ore</strong>.',
    summaryTitle: 'Riepilogo della richiesta:',
    urgencyTitle: '⏰ Tempistica desiderata:',
    messageTitle: '💬 Messaggio:',
    defaultMessage: 'Richiesta di informazioni / Preventivo',
    newsletterMessage: 'Iscrizione alla newsletter dal sito web',
    nextStepsTitle: '🔜 Cosa succede adesso?',
    steps: [
      'I nostri specialisti retail esaminano le tue esigenze.',
      'Ti contatteremo per verificare le tempistiche operative e le dimensioni del punto vendita.',
      'Prepareremo una proposta chiavi in mano senza interruzione delle vendite.'
    ],
    contactTitle: '📞 Hai bisogno di assistenza immediata? Contattaci direttamente:',
    regards: 'Cordiali saluti,',
    teamName: 'Il Team Mirage Merchandising',
    teamTagline: 'Allestimento Negozi & Spostamento Scaffalature',
    urgencyLabels: {
      urgent: 'Urgente (Entro 1 settimana)',
      soon: 'A breve (2-3 settimane)',
      planning: 'Pianificazione (Mese prossimo)',
      future: 'Raccolta informazioni'
    }
  },
  es: {
    quoteSubject: '✨ ¡Gracias por contactar con Mirage Merchandising!',
    newsletterSubject: '✨ ¡Gracias por suscribirte al boletín de Mirage Merchandising!',
    greeting: (name) => `Estimado/a ${name},`,
    intro: 'Hemos recibido su solicitud y nuestro equipo de operaciones se pondrá en contacto con usted en un plazo de <strong>24 horas</strong>.',
    summaryTitle: 'Resumen de su solicitud:',
    urgencyTitle: '⏰ Plazo previsto:',
    messageTitle: '💬 Mensaje:',
    defaultMessage: 'Solicitud de presupuesto / Información',
    newsletterMessage: 'Suscripción al boletín desde el sitio web',
    nextStepsTitle: '🔜 ¿Cuáles son los siguientes pasos?',
    steps: [
      'Nuestros especialistas retail analizan sus requerimientos.',
      'Le contactamos para verificar plazos de ejecución y dimensiones de tienda.',
      'Preparamos una propuesta llave en mano sin interrupción de su actividad comercial.'
    ],
    contactTitle: '📞 ¿Necesita asistencia inmediata? Contáctenos directamente:',
    regards: 'Atentamente,',
    teamName: 'El Equipo de Mirage Merchandising',
    teamTagline: 'Montaje Comercial & Merchandising',
    urgencyLabels: {
      urgent: 'Urgente (En 1 semana)',
      soon: 'Pronto (2-3 semanas)',
      planning: 'Planificación (Próximo mes)',
      future: 'Recopilación de información'
    }
  },
  ro: {
    quoteSubject: '✨ Vă mulțumim că ați contactat Mirage Merchandising!',
    newsletterSubject: '✨ Vă mulțumim pentru abonarea la newsletter-ul Mirage Merchandising!',
    greeting: (name) => `Stimate/Stimată ${name},`,
    intro: 'Am primit solicitarea dumneavoastră, iar echipa noastră operațională vă va contacta în termen de <strong>24 de ore</strong>.',
    summaryTitle: 'Rezumatul solicitării dumneavoastră:',
    urgencyTitle: '⏰ Termen dorit:',
    messageTitle: '💬 Mesaj:',
    defaultMessage: 'Cerere de informații / Ofertă',
    newsletterMessage: 'Abonare la newsletter de pe site',
    nextStepsTitle: '🔜 Care sunt pașii următori?',
    steps: [
      'Specialiștii noștri în retail analizează cerințele proiectului dumneavoastră.',
      'Vă contactăm pentru a stabili calendarul de execuție și dimensiunile magazinului.',
      'Pregătim o ofertă la cheie, cu zero întreruperi ale activității comerciale.'
    ],
    contactTitle: '📞 Aveți nevoie de asistență imediată? Contactați-ne direct:',
    regards: 'Cu stimă,',
    teamName: 'Echipa Mirage Merchandising',
    teamTagline: 'Amenajări Retail & Mutări Rafturi Încărcate',
    urgencyLabels: {
      urgent: 'Urgent (În termen de o săptămână)',
      soon: 'În curând (2-3 săptămâni)',
      planning: 'Planificare (Luna viitoare)',
      future: 'Colectare informații'
    }
  }
};

// Email templates generator
const emailTemplates = {
  adminNotification: (contactData) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
      <h2 style="color: #2563eb; margin-bottom: 8px;">📋 New ${contactData.leadType === 'newsletter' ? 'Newsletter Subscription' : 'Quote Request'} Received</h2>
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb;">
        <p style="margin: 6px 0;"><strong>👤 Name:</strong> ${contactData.name}</p>
        <p style="margin: 6px 0;"><strong>📧 Email:</strong> ${contactData.email}</p>
        <p style="margin: 6px 0;"><strong>📞 Phone:</strong> ${contactData.phone}</p>
        <p style="margin: 6px 0;"><strong>🌐 Language:</strong> ${(contactData.lang || 'fr').toUpperCase()}</p>
        ${contactData.leadType !== 'newsletter' ? `<p style="margin: 6px 0;"><strong>⏰ Urgency:</strong> ${contactData.urgencyLabel}</p>` : ''}
        <p style="margin: 6px 0;"><strong>💬 Message:</strong> ${contactData.message || (contactData.leadType === 'newsletter' ? 'Newsletter subscription' : 'No message provided')}</p>
        <p style="margin: 6px 0;"><strong>📅 Submitted:</strong> ${new Date().toLocaleString()}</p>
      </div>
      <p style="margin-top: 20px; color: #64748b; font-size: 13px;">
        This alert was generated automatically from the Mirage Merchandising website.
      </p>
    </div>
  `,

  userConfirmation: (contactData, lang = 'fr') => {
    const t = emailTranslations[lang] || emailTranslations.fr;
    const isNewsletter = contactData.leadType === 'newsletter';

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
        <h2 style="color: #059669; margin-bottom: 8px;">${isNewsletter ? t.newsletterSubject : t.quoteSubject}</h2>
        <p>${t.greeting(contactData.name)}</p>
        <p>${t.intro}</p>

        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #059669; margin: 20px 0;">
          <h3 style="color: #065f46; margin-top: 0;">${t.summaryTitle}</h3>
          ${!isNewsletter ? `<p style="margin: 6px 0;"><strong>${t.urgencyTitle}</strong> ${contactData.urgencyLabel}</p>` : ''}
          <p style="margin: 6px 0;"><strong>${t.messageTitle}</strong> ${contactData.message || (isNewsletter ? t.newsletterMessage : t.defaultMessage)}</p>
        </div>

        <p><strong>${t.nextStepsTitle}</strong></p>
        <ol style="line-height: 1.6;">
          ${t.steps.map(step => `<li>${step}</li>`).join('')}
        </ol>

        <p>${t.contactTitle}</p>
        <ul style="line-height: 1.6;">
          <li>Email: <a href="mailto:Sveta@mymirage.fr" style="color: #2563eb;">Sveta@mymirage.fr</a></li>
          <li>Phone: <a href="tel:+40749111592" style="color: #2563eb;">+40 749 111 592</a></li>
        </ul>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">

        <p style="color: #64748b; font-size: 13px;">
          ${t.regards}<br>
          <strong>${t.teamName}</strong><br>
          <em>${t.teamTagline}</em>
        </p>
      </div>
    `;
  }
};

// Send email function
const sendEmail = async (mailOptions) => {
  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

// Send contact form emails
const sendContactEmails = async (contactData) => {
  const lang = contactData.lang && emailTranslations[contactData.lang] ? contactData.lang : 'fr';
  const t = emailTranslations[lang];

  const urgencyLabel = t.urgencyLabels[contactData.urgency] || contactData.urgency || t.urgencyLabels.future;

  const contactDataWithLabel = {
    ...contactData,
    urgencyLabel
  };

  const isNewsletter = contactData.leadType === 'newsletter';
  const userSubject = isNewsletter ? t.newsletterSubject : t.quoteSubject;

  // Plain-text fallbacks
  const adminText = `New ${isNewsletter ? 'Newsletter Subscription' : 'Quote Request'}\n\nName: ${contactData.name}\nEmail: ${contactData.email}\nPhone: ${contactData.phone}\nLanguage: ${lang.toUpperCase()}\nUrgency: ${urgencyLabel}\nMessage: ${contactData.message || (isNewsletter ? 'Newsletter subscription' : 'N/A')}\nSubmitted: ${new Date().toLocaleString()}`;

  const userText = `${userSubject}\n\n${t.greeting(contactData.name)}\n\n${t.intro.replace(/<[^>]*>/g, '')}\n\n${t.summaryTitle}\n- ${t.messageTitle} ${contactData.message || (isNewsletter ? t.newsletterMessage : t.defaultMessage)}\n${!isNewsletter ? `- ${t.urgencyTitle} ${urgencyLabel}\n` : ''}\n${t.nextStepsTitle}\n1. ${t.steps[0]}\n2. ${t.steps[1]}\n3. ${t.steps[2]}\n\n${t.contactTitle}\nEmail: Sveta@mymirage.fr\nPhone: +40 749 111 592\n\n${t.regards}\n${t.teamName}\n${t.teamTagline}`;

  // Email to admin
  const adminMailOptions = {
    from: `"Mirage Website" <${process.env.EMAIL_USER}>`,
    to: 'Sveta@mymirage.fr',
    replyTo: contactData.email,
    subject: `🔔 New ${isNewsletter ? 'Newsletter Subscriber' : 'Quote Lead'}: ${contactData.name} [${lang.toUpperCase()}]`,
    text: adminText,
    html: emailTemplates.adminNotification(contactDataWithLabel)
  };

  // Confirmation email to user (in user's language)
  const userMailOptions = {
    from: `"Mirage Merchandising" <${process.env.EMAIL_USER}>`,
    to: contactData.email,
    replyTo: 'Sveta@mymirage.fr',
    subject: userSubject,
    text: userText,
    html: emailTemplates.userConfirmation(contactDataWithLabel, lang)
  };

  try {
    const results = await Promise.allSettled([
      sendEmail(adminMailOptions),
      sendEmail(userMailOptions)
    ]);
    return results;
  } catch (error) {
    console.error('❌ Error sending emails:', error);
    throw error;
  }
};

module.exports = {
  sendContactEmails,
  emailTemplates,
  emailTranslations
};