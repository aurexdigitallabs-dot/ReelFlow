export const getBaseTemplate = (content: string) => `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <title>ReelFlow</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    
    @media screen and (max-width: 600px) {
      .email-container { width: 100% !important; margin: auto !important; border-radius: 0 !important; }
      .header-cell { padding: 20px 20px !important; }
      .content-cell { padding: 28px 20px !important; }
      .btn-primary { width: 100% !important; text-align: center !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #0b0f19; -webkit-font-smoothing: antialiased;">
  <!-- Outer Wrapper Table -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 10px 0;">
        <!-- Card Container -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width: 600px; background-color: #131926; border-radius: 16px; overflow: hidden; border: 1px solid #1f293d; box-shadow: 0 10px 30px -5px rgba(0,0,0,0.6);">
          
          <!-- Header Banner -->
          <tr>
            <td class="header-cell" style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%); padding: 22px 32px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="width: 100%; table-layout: fixed;">
                <tr>
                  <!-- Left Edge: ReelFlow Logo + Brand Name -->
                  <td align="left" valign="middle" style="vertical-align: middle; text-align: left;">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td valign="middle" style="vertical-align: middle; padding-right: 12px;">
                          <img src="https://raw.githubusercontent.com/aurexdigitallabs-dot/ReelFlow/main/public/reelflow-white.png" width="30" height="30" alt="ReelFlow" style="display: block; width: 30px; height: 30px; border: 0;" />
                        </td>
                        <td valign="middle" style="vertical-align: middle;">
                          <span style="color: #ffffff; font-size: 21px; font-weight: 800; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; letter-spacing: -0.5px; line-height: 1;">ReelFlow</span>
                        </td>
                      </tr>
                    </table>
                  </td>

                  <!-- Right Edge: By Aurex + Aurex Logo -->
                  <td align="right" valign="middle" style="vertical-align: middle; text-align: right;">
                    <table border="0" cellpadding="0" cellspacing="0" align="right">
                      <tr>
                        <td valign="middle" style="vertical-align: middle; padding-right: 8px; white-space: nowrap;">
                          <span style="color: #ffffff; font-size: 13px; font-weight: 500; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; opacity: 0.92; line-height: 1;">By Aurex</span>
                        </td>
                        <td valign="middle" style="vertical-align: middle;">
                          <a href="https://aurexdigitals.in" target="_blank" style="text-decoration: none; display: block;">
                            <img src="https://raw.githubusercontent.com/aurexdigitallabs-dot/ReelFlow/main/public/Icon%20Only%20.png" width="22" height="22" alt="Aurex" style="display: block; width: 22px; height: 22px; border: 0;" />
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td class="content-cell" style="padding: 36px 32px; background-color: #131926;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #0d121d; border-top: 1px solid #1a2234; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #94a3b8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                This notification was sent automatically by <strong style="color: #cbd5e1;">ReelFlow</strong>.
              </p>
              <p style="margin: 0; font-size: 12px; color: #64748b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                Powered by <a href="https://aurexdigitals.in" target="_blank" style="color: #818cf8; text-decoration: none; font-weight: 600;">Aurex Digital Labs</a> &bull; Production Ready
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const getWelcomeEmail = (creatorName: string, loginUrl: string) => {
  const content = `
    <h2 style="color: #f8fafc; font-size: 22px; font-weight: 700; margin-top: 0; margin-bottom: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; letter-spacing: -0.3px;">Welcome to ReelFlow, ${creatorName}! 🎬</h2>
    <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6; margin-top: 0; margin-bottom: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      Your creator profile has been officially set up and added to our production roster.
    </p>
    
    <div style="background-color: #1a2336; border: 1px solid #28354f; border-radius: 12px; padding: 20px; margin: 24px 0;">
      <h3 style="color: #e2e8f0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 12px 0; font-weight: 700;">What you can do in your portal:</h3>
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td style="padding: 6px 0; color: #94a3b8; font-size: 14px; line-height: 1.5;">
            🗓️ <strong style="color: #f1f5f9;">View Assigned Tasks & Deadlines:</strong> Check upcoming reel shoots and due dates.
          </td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #94a3b8; font-size: 14px; line-height: 1.5;">
            📋 <strong style="color: #f1f5f9;">Access Creative Briefs:</strong> Review brand hooks, scripts, and production guides.
          </td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #94a3b8; font-size: 14px; line-height: 1.5;">
            🚀 <strong style="color: #f1f5f9;">Track Production Status:</strong> Real-time updates from Shoot to Edit to Published.
          </td>
        </tr>
      </table>
    </div>

    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 28px 0 20px 0;">
      <tr>
        <td align="center">
          <a href="${loginUrl}" class="btn-primary" style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff !important; font-weight: 600; font-size: 15px; text-decoration: none; padding: 14px 36px; border-radius: 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4);">Open Creator Portal</a>
        </td>
      </tr>
    </table>
    
    <p style="color: #64748b; font-size: 13px; margin: 20px 0 0 0; line-height: 1.5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-align: center;">
      Questions or need assistance? Reach out directly to your assigned brand admin or coordinator.
    </p>
  `;
  return getBaseTemplate(content);
};

export const getTaskAssignedEmail = (creatorName: string, taskTitle: string, dueDate: string, taskUrl: string) => {
  const content = `
    <h2 style="color: #f8fafc; font-size: 22px; font-weight: 700; margin-top: 0; margin-bottom: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; letter-spacing: -0.3px;">New Task Assigned 📌</h2>
    <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6; margin-top: 0; margin-bottom: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      Hi <strong>${creatorName}</strong>, a new reel production task has been scheduled and assigned to you.
    </p>
    
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #1a2336; border-left: 4px solid #6366f1; border-radius: 8px; margin: 20px 0;">
      <tr>
        <td style="padding: 18px 20px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="padding-bottom: 10px;">
                <span style="color: #94a3b8; font-size: 12px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Task Title</span>
                <p style="margin: 2px 0 0 0; color: #ffffff; font-size: 16px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">${taskTitle}</p>
              </td>
            </tr>
            <tr>
              <td>
                <span style="color: #94a3b8; font-size: 12px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Shoot Date / Deadline</span>
                <p style="margin: 2px 0 0 0; color: #a5b4fc; font-size: 15px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">📅 ${dueDate || 'To be scheduled'}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    
    <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 20px 0 24px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      Please review the concept hook, reference reels, and creative guidelines in your dashboard before starting production.
    </p>
    
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 28px 0 20px 0;">
      <tr>
        <td align="center">
          <a href="${taskUrl}" class="btn-primary" style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff !important; font-weight: 600; font-size: 15px; text-decoration: none; padding: 14px 36px; border-radius: 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4);">View Task Details</a>
        </td>
      </tr>
    </table>
  `;
  return getBaseTemplate(content);
};

export const getStatusUpdatedEmail = (creatorName: string, taskTitle: string, newStatus: string, taskUrl: string) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'posted':
      case 'ready':
        return { bg: 'rgba(16, 185, 129, 0.2)', text: '#34d399', border: '#059669' };
      case 'editing':
        return { bg: 'rgba(245, 158, 11, 0.2)', text: '#fbbf24', border: '#d97706' };
      case 'shot':
        return { bg: 'rgba(99, 102, 241, 0.2)', text: '#a5b4fc', border: '#4f46e5' };
      case 'cancelled':
        return { bg: 'rgba(239, 68, 68, 0.2)', text: '#f87171', border: '#dc2626' };
      default:
        return { bg: 'rgba(99, 102, 241, 0.2)', text: '#a5b4fc', border: '#4f46e5' };
    }
  };

  const style = getStatusColor(newStatus);

  const content = `
    <h2 style="color: #f8fafc; font-size: 22px; font-weight: 700; margin-top: 0; margin-bottom: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; letter-spacing: -0.3px;">Task Status Updated ⚡</h2>
    <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6; margin-top: 0; margin-bottom: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      Hi <strong>${creatorName}</strong>, the production status has been updated for one of your tasks.
    </p>
    
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #1a2336; border-left: 4px solid ${style.border}; border-radius: 8px; margin: 20px 0;">
      <tr>
        <td style="padding: 18px 20px;">
          <p style="margin: 0 0 10px 0; color: #f1f5f9; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <strong style="color: #94a3b8;">Task:</strong> ${taskTitle}
          </p>
          <div>
            <span style="color: #94a3b8; font-size: 13px; font-weight: 600; margin-right: 8px;">New Status:</span>
            <span style="display: inline-block; background-color: ${style.bg}; color: ${style.text}; border: 1px solid ${style.border}; padding: 4px 12px; border-radius: 6px; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">
              ${newStatus}
            </span>
          </div>
        </td>
      </tr>
    </table>
    
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 28px 0 20px 0;">
      <tr>
        <td align="center">
          <a href="${taskUrl}" class="btn-primary" style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff !important; font-weight: 600; font-size: 15px; text-decoration: none; padding: 14px 36px; border-radius: 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4);">View Updated Task</a>
        </td>
      </tr>
    </table>
  `;
  return getBaseTemplate(content);
};

export const getBrandAdminWelcomeEmail = (adminName: string, storeNames: string[], loginUrl: string) => {
  const storeBadges = storeNames && storeNames.length > 0
    ? storeNames.map(name => `
        <span style="display: inline-block; background-color: rgba(99, 102, 241, 0.18); color: #c7d2fe; border: 1px solid rgba(99, 102, 241, 0.45); padding: 6px 14px; border-radius: 8px; font-size: 13px; font-weight: 600; margin: 4px 4px 4px 0;">
          🛍️ ${name}
        </span>
      `).join('')
    : `<span style="display: inline-block; background-color: rgba(99, 102, 241, 0.18); color: #c7d2fe; border: 1px solid rgba(99, 102, 241, 0.45); padding: 6px 14px; border-radius: 8px; font-size: 13px; font-weight: 600;">All Assigned Stores</span>`;

  const content = `
    <h2 style="color: #f8fafc; font-size: 22px; font-weight: 700; margin-top: 0; margin-bottom: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; letter-spacing: -0.3px;">Welcome to ReelFlow, ${adminName}! 👑</h2>
    <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6; margin-top: 0; margin-bottom: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      You have been appointed as a <strong>Brand Administrator</strong> on ReelFlow.
    </p>
    
    <div style="background-color: #1a2336; border: 1px solid #28354f; border-radius: 12px; padding: 18px 20px; margin: 20px 0;">
      <span style="display: block; color: #94a3b8; font-size: 12px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 8px;">Assigned Brand Access:</span>
      <div>
        ${storeBadges}
      </div>
    </div>

    <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin-top: 0; margin-bottom: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      You can now log in to oversee content production, review social reel submissions, coordinate creator schedules, and track brand marketing performance.
    </p>
    
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 28px 0 20px 0;">
      <tr>
        <td align="center">
          <a href="${loginUrl}" class="btn-primary" style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff !important; font-weight: 600; font-size: 15px; text-decoration: none; padding: 14px 36px; border-radius: 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4);">Access Brand Portal</a>
        </td>
      </tr>
    </table>
    
    <p style="color: #64748b; font-size: 12px; margin: 20px 0 0 0; line-height: 1.5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-align: center;">
      Need additional permissions or have questions? Contact your Super Administrator.
    </p>
  `;
  return getBaseTemplate(content);
};


