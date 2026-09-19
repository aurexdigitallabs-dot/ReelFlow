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
      .header-cell { padding: 18px 20px !important; }
      .content-cell { padding: 26px 20px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 20px 10px; background-color: #0b0f19; -webkit-font-smoothing: antialiased;">
  <!-- Outer Wrapper Table -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 10px 0;">
        <!-- Card Container -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width: 580px; background-color: #131926; border-radius: 16px; overflow: hidden; border: 1px solid #1f293d; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5);">
          
          <!-- Header Banner -->
          <tr>
            <td class="header-cell" style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%); padding: 22px 28px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="width: 100%; table-layout: fixed;">
                <tr>
                  <!-- Left Edge: ReelFlow Clapperboard + Brand Name -->
                  <td align="left" valign="middle" style="vertical-align: middle; text-align: left;">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td valign="middle" style="vertical-align: middle; padding-right: 10px;">
                          <img src="https://raw.githubusercontent.com/aurexdigitallabs-dot/ReelFlow/main/public/reelflow-white.png" width="28" height="28" alt="ReelFlow" style="display: block; width: 28px; height: 28px; border: 0;" />
                        </td>
                        <td valign="middle" style="vertical-align: middle;">
                          <span style="color: #ffffff; font-size: 20px; font-weight: 800; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; letter-spacing: -0.5px; line-height: 1;">ReelFlow</span>
                        </td>
                      </tr>
                    </table>
                  </td>

                  <!-- Right Edge: By Aurex + Aurex Logo -->
                  <td align="right" valign="middle" style="vertical-align: middle; text-align: right;">
                    <table border="0" cellpadding="0" cellspacing="0" align="right">
                      <tr>
                        <td valign="middle" style="vertical-align: middle; padding-right: 8px; white-space: nowrap;">
                          <span style="color: #ffffff; font-size: 13px; font-weight: 500; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; opacity: 0.95; line-height: 1;">By Aurex</span>
                        </td>
                        <td valign="middle" style="vertical-align: middle;">
                          <a href="https://aurexdigitals.in" target="_blank" style="text-decoration: none; display: block;">
                            <img src="https://raw.githubusercontent.com/aurexdigitallabs-dot/ReelFlow/main/public/Icon%20Only%20.png" width="22" height="22" alt="Aurex Logo" style="display: block; width: 22px; height: 22px; border: 0;" />
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
            <td style="padding: 20px 24px; background-color: #0d121d; border-top: 1px solid #1a2234; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #64748b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                Powered by <a href="https://aurexdigitals.in" target="_blank" style="color: #a5b4fc; text-decoration: underline; font-weight: 600;">Aurex</a> &bull; Streamlined Creator Management
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
    <h2 style="color: #f8fafc; font-size: 22px; font-weight: 700; margin-top: 0; margin-bottom: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; letter-spacing: -0.3px;">Welcome to ReelFlow, ${creatorName}!</h2>
    <p style="color: #94a3b8; font-size: 15px; line-height: 1.6; margin-top: 0; margin-bottom: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Your creator account has been successfully set up by the admin.</p>
    <p style="color: #94a3b8; font-size: 15px; line-height: 1.6; margin-top: 0; margin-bottom: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">You can now log in to the platform to view your assigned tasks, check brand guidelines, and upload your content.</p>
    
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 28px 0;">
      <tr>
        <td align="center">
          <a href="${loginUrl}" style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff !important; font-weight: 600; font-size: 15px; text-decoration: none; padding: 13px 32px; border-radius: 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4);">Log in to ReelFlow</a>
        </td>
      </tr>
    </table>
    
    <p style="color: #64748b; font-size: 13px; margin: 24px 0 0 0; line-height: 1.5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">If you have any questions, please contact your admin.</p>
  `;
  return getBaseTemplate(content);
};

export const getTaskAssignedEmail = (creatorName: string, taskTitle: string, dueDate: string, taskUrl: string) => {
  const content = `
    <h2 style="color: #f8fafc; font-size: 22px; font-weight: 700; margin-top: 0; margin-bottom: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; letter-spacing: -0.3px;">New Task Assigned</h2>
    <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6; margin-top: 0; margin-bottom: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Hi <strong>${creatorName}</strong>,</p>
    <p style="color: #94a3b8; font-size: 15px; line-height: 1.6; margin-top: 0; margin-bottom: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">A new content task has been assigned to you.</p>
    
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #1a2336; border-left: 4px solid #6366f1; border-radius: 8px; margin: 20px 0;">
      <tr>
        <td style="padding: 16px 20px;">
          <p style="margin: 0 0 8px 0; color: #f1f5f9; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;"><strong style="color: #94a3b8;">Task:</strong> ${taskTitle}</p>
          <p style="margin: 0; color: #f1f5f9; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;"><strong style="color: #94a3b8;">Shoot By:</strong> ${dueDate}</p>
        </td>
      </tr>
    </table>
    
    <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 20px 0 24px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Please review the concept and details in your dashboard.</p>
    
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 28px 0;">
      <tr>
        <td align="center">
          <a href="${taskUrl}" style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff !important; font-weight: 600; font-size: 15px; text-decoration: none; padding: 13px 32px; border-radius: 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4);">View Task Details</a>
        </td>
      </tr>
    </table>
  `;
  return getBaseTemplate(content);
};

export const getStatusUpdatedEmail = (creatorName: string, taskTitle: string, newStatus: string, taskUrl: string) => {
  const content = `
    <h2 style="color: #f8fafc; font-size: 22px; font-weight: 700; margin-top: 0; margin-bottom: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; letter-spacing: -0.3px;">Task Status Updated</h2>
    <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6; margin-top: 0; margin-bottom: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Hi <strong>${creatorName}</strong>,</p>
    <p style="color: #94a3b8; font-size: 15px; line-height: 1.6; margin-top: 0; margin-bottom: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">The status for one of your tasks has been updated.</p>
    
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #1a2336; border-left: 4px solid #6366f1; border-radius: 8px; margin: 20px 0;">
      <tr>
        <td style="padding: 16px 20px;">
          <p style="margin: 0 0 8px 0; color: #f1f5f9; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;"><strong style="color: #94a3b8;">Task:</strong> ${taskTitle}</p>
          <p style="margin: 0; color: #f1f5f9; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;"><strong style="color: #94a3b8;">New Status:</strong> <span style="display: inline-block; background-color: rgba(99, 102, 241, 0.25); color: #a5b4fc; padding: 3px 10px; border-radius: 6px; font-weight: 600; font-size: 13px;">${newStatus}</span></p>
        </td>
      </tr>
    </table>
    
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 28px 0;">
      <tr>
        <td align="center">
          <a href="${taskUrl}" style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff !important; font-weight: 600; font-size: 15px; text-decoration: none; padding: 13px 32px; border-radius: 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4);">View Task Details</a>
        </td>
      </tr>
    </table>
  `;
  return getBaseTemplate(content);
};
