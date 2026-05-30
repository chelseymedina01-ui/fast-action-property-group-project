const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL  = process.env.LEAD_EMAIL  || 'info@fastactionpropertygroup.org';
const FROM_NAME = 'Fast Action Website';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { address, ptype, condition, name, phone, email, timeline, notes } = req.body || {};

  if (!address || !name || !phone || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const firstName = String(name).trim().split(' ')[0] || name;

  const from = process.env.FROM_EMAIL || `${FROM_NAME} <onboarding@resend.dev>`;

  try {
    await resend.emails.send({
      from,
      to: TO_EMAIL,
      replyTo: email,
      subject: `New lead: ${name} — ${address}`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f8f6f1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<div style="max-width:600px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,.07)">

  <div style="background:#1c1c1c;padding:28px 32px;display:flex;align-items:center">
    <div>
      <div style="font-size:13px;font-weight:700;letter-spacing:2px;color:#c8962a">FAST ACTION</div>
      <div style="font-size:10px;font-weight:600;letter-spacing:2.5px;color:#726f67;margin-top:2px">PROPERTY GROUP</div>
    </div>
    <div style="margin-left:auto;background:rgba(200,150,42,.15);color:#c8962a;font-size:12px;font-weight:600;padding:5px 12px;border-radius:20px">New lead</div>
  </div>

  <div style="padding:32px">
    <h2 style="margin:0 0 6px;font-size:22px;color:#1c1c1c">Cash offer request</h2>
    <p style="margin:0 0 28px;color:#726f67;font-size:14px">Submitted via fastactionpropertygroup.org</p>

    <table style="width:100%;border-collapse:collapse;font-size:15px">
      <tr><td colspan="2" style="padding:0 0 12px"><strong style="font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#726f67">Contact</strong></td></tr>
      <tr style="background:#f8f6f1">
        <td style="padding:13px 16px;font-weight:600;color:#1c1c1c;width:38%;border-radius:8px 0 0 8px">Name</td>
        <td style="padding:13px 16px;color:#44423d;border-radius:0 8px 8px 0">${esc(name)}</td>
      </tr>
      <tr>
        <td style="padding:13px 16px;font-weight:600;color:#1c1c1c">Phone</td>
        <td style="padding:13px 16px"><a href="tel:${esc(phone)}" style="color:#c8962a;text-decoration:none;font-weight:600">${esc(phone)}</a></td>
      </tr>
      <tr style="background:#f8f6f1">
        <td style="padding:13px 16px;font-weight:600;color:#1c1c1c;border-radius:8px 0 0 8px">Email</td>
        <td style="padding:13px 16px;border-radius:0 8px 8px 0"><a href="mailto:${esc(email)}" style="color:#c8962a;text-decoration:none">${esc(email)}</a></td>
      </tr>

      <tr><td colspan="2" style="padding:24px 0 12px"><strong style="font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#726f67">Property</strong></td></tr>
      <tr style="background:#f8f6f1">
        <td style="padding:13px 16px;font-weight:600;color:#1c1c1c;border-radius:8px 0 0 8px">Address</td>
        <td style="padding:13px 16px;color:#44423d;border-radius:0 8px 8px 0">${esc(address)}</td>
      </tr>
      <tr>
        <td style="padding:13px 16px;font-weight:600;color:#1c1c1c">Type</td>
        <td style="padding:13px 16px;color:#44423d">${esc(ptype || '—')}</td>
      </tr>
      <tr style="background:#f8f6f1">
        <td style="padding:13px 16px;font-weight:600;color:#1c1c1c;border-radius:8px 0 0 8px">Condition</td>
        <td style="padding:13px 16px;color:#44423d;border-radius:0 8px 8px 0">${esc(condition || '—')}</td>
      </tr>
      <tr>
        <td style="padding:13px 16px;font-weight:600;color:#1c1c1c">Timeline</td>
        <td style="padding:13px 16px;color:#44423d">${esc(timeline || '—')}</td>
      </tr>
      ${notes ? `<tr style="background:#f8f6f1">
        <td style="padding:13px 16px;font-weight:600;color:#1c1c1c;border-radius:8px 0 0 8px;vertical-align:top">Notes</td>
        <td style="padding:13px 16px;color:#44423d;border-radius:0 8px 8px 0">${esc(notes)}</td>
      </tr>` : ''}
    </table>

    <div style="margin-top:32px;text-align:center">
      <a href="tel:${esc(phone)}" style="display:inline-block;background:#c8962a;color:#1c1c1c;font-weight:700;font-size:15px;text-decoration:none;padding:14px 36px;border-radius:8px">
        Call ${esc(firstName)} now
      </a>
    </div>
  </div>

  <div style="background:#f2eee5;padding:20px 32px;font-size:12px;color:#9b978c;text-align:center">
    Fast Action Property Group · (786) 766-5922 · info@fastactionpropertygroup.org
  </div>
</div>
</body>
</html>
`,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ error: 'Failed to send' });
  }
};

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
