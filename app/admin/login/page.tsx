
export const instant = false;

import Link from "next/link";
import { login } from "../actions";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({
  searchParams,
}: LoginPageProps) {
  const { error } = await searchParams;

  const messages: Record<string, string> = {
    missing: "कृपया Email और Password भरें।",
    invalid: "Email या Password सही नहीं है।",
    unauthorized: "आपके अकाउंट को Admin की अनुमति नहीं है।",
  };

  return (
    <main className="login-page">
      <div className="login-decoration login-decoration-one" />
      <div className="login-decoration login-decoration-two" />

      <header className="login-topbar">
        <Link href="/" className="brand" aria-label="507 HEAD मुख्य वेबसाइट">
          <span className="brand-mark">507</span>
          <span className="brand-name">
            <strong>HEAD</strong>
            <small>NEWS & JOURNALISM</small>
          </span>
        </Link>

        <span className="secure-label">
          <span className="secure-dot" />
          SECURE ADMIN PORTAL
        </span>
      </header>

      <section className="login-layout">
        <div className="login-intro">
          <div className="intro-tag">
            <span className="intro-tag-dot" />
            EDITORIAL MANAGEMENT SYSTEM
          </div>

          <h1>
            खबरों की दुनिया,
            <br />
            <span>आपके नियंत्रण में।</span>
          </h1>

          <p className="intro-description">
            507 Head के एडमिन पोर्टल में आपका स्वागत है।
            खबरों को मैनेज करें, कंटेंट प्रकाशित करें और
            अपने न्यूज़ प्लेटफॉर्म को एक जगह से संभालें।
          </p>

          <div className="intro-divider" />

          <div className="intro-features">
            <div className="feature-item">
              <span className="feature-icon">01</span>
              <div>
                <strong>Content Management</strong>
                <small>खबरें और लेख मैनेज करें</small>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-icon">02</span>
              <div>
                <strong>Secure Access</strong>
                <small>सुरक्षित एडमिन ऑथेंटिकेशन</small>
              </div>
            </div>
          </div>
        </div>

        <div className="login-card">
          <div className="card-top">
            <div className="card-icon">
              <svg
                viewBox="0 0 24 24"
                width="25"
                height="25"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="4" y="10" width="16" height="11" rx="2.5" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                <circle cx="12" cy="15" r="1" />
                <path d="M12 16v2" />
              </svg>
            </div>

            <span className="card-badge">ADMIN ACCESS</span>
          </div>

          <h2>Welcome back!</h2>

          <p className="card-description">
            लॉगिन करें और अपने डैशबोर्ड पर जाएँ।
          </p>

          {error && messages[error] && (
            <div className="login-error" role="alert">
              <span>!</span>
              {messages[error]}
            </div>
          )}

          <form action={login} className="login-form">
            <div className="form-group">
              <label htmlFor="email">EMAIL ADDRESS</label>

              <div className="input-wrap">
                <svg
                  viewBox="0 0 24 24"
                  width="19"
                  height="19"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="5" width="18" height="14" rx="3" />
                  <path d="m4 7 8 6 8-6" />
                </svg>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="password-heading">
                <label htmlFor="password">PASSWORD</label>
                <span>Authorized users only</span>
              </div>

              <div className="input-wrap">
                <svg
                  viewBox="0 0 24 24"
                  width="19"
                  height="19"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="4" y="10" width="16" height="11" rx="2.5" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>

                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="अपना password दर्ज करें"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <button type="submit" className="login-button">
              <span>Sign in to Dashboard</span>

              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </form>

          <div className="card-security">
            <svg
              viewBox="0 0 24 24"
              width="17"
              height="17"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <span>Your session is protected</span>
          </div>
        </div>
      </section>

      <footer className="login-footer">
        <span>© 2026 507 Head</span>
        <span>ADMINISTRATION PORTAL</span>
        <Link href="/">Back to Website ↗</Link>
      </footer>

      <style>{`
        .login-page,
        .login-page * {
          box-sizing: border-box;
        }

        .login-page {
          --brand: #8a4b1f;
          --brand-dark: #6b3915;
          --sand: #f7efe3;
          --text: #222222;
          --muted: #666666;
          --line: #e8d9c7;
          position: relative;
          isolation: isolate;
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100svh;
          min-height: 0;
          overflow: hidden;
          padding: 0 6.5%;
          color: var(--text);
          background:
            radial-gradient(
              ellipse at 12% 20%,
              rgba(138, 75, 31, 0.07),
              transparent 42%
            ),
            linear-gradient(135deg, #fbf7f0, var(--sand));
          font-family: Mukta, "Noto Sans Devanagari", Arial, sans-serif;
        }

        .login-decoration {
          position: absolute;
          z-index: -1;
          pointer-events: none;
          border-radius: 50%;
        }

        .login-decoration-one {
          top: -235px;
          right: 9%;
          width: 390px;
          height: 390px;
          border: 1px solid rgba(138, 75, 31, 0.09);
          box-shadow:
            0 0 0 45px rgba(138, 75, 31, 0.025),
            0 0 0 90px rgba(138, 75, 31, 0.018);
        }

        .login-decoration-two {
          bottom: -190px;
          left: 25%;
          width: 300px;
          height: 300px;
          background: rgba(138, 75, 31, 0.045);
          filter: blur(65px);
        }

        .login-topbar {
          position: relative;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          width: 100%;
          min-height: 82px;
          padding-top: 9px;
          border-bottom: 1px solid var(--line);
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          color: var(--brand-dark);
          text-decoration: none;
          transform: translateY(4px);
        }

        .brand-mark {
          display: grid;
          place-items: center;
          width: 48px;
          height: 44px;
          flex-shrink: 0;
          border-radius: 9px;
          background: var(--brand);
          color: #ffffff;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -1px;
          box-shadow: 0 4px 12px rgba(107, 57, 21, 0.14);
        }

        .brand-name {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .brand-name strong {
          font-size: 23px;
          line-height: 1;
          letter-spacing: 2.5px;
        }

        .brand-name small {
          color: var(--muted);
          font-size: 9px;
          letter-spacing: 1.2px;
        }

        .secure-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--brand-dark);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .secure-dot,
        .intro-tag-dot {
          width: 7px;
          height: 7px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #43805c;
        }

        .login-layout {
          flex: 1;
          min-height: 0;
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(330px, 0.8fr);
          align-items: center;
          gap: clamp(32px, 6vw, 82px);
          width: 100%;
          max-width: 1190px;
          margin: 0 auto;
          padding: 18px 0;
        }

        .login-intro {
          min-width: 0;
          max-width: 560px;
        }

        .intro-tag {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 9px 12px;
          border: 1px solid #e8d7c4;
          border-radius: 5px;
          background: rgba(255, 255, 255, 0.58);
          color: var(--brand-dark);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .intro-tag-dot {
          background: var(--brand);
        }

        .login-intro h1 {
          margin: 21px 0 13px;
          color: #29231f;
          font-size: clamp(33px, 3.5vw, 46px);
          font-weight: 800;
          line-height: 1.32;
          letter-spacing: -0.5px;
        }

        .login-intro h1 span {
          color: var(--brand);
        }

        .intro-description {
          max-width: 455px;
          margin: 0;
          color: var(--muted);
          font-size: 15px;
          line-height: 1.8;
        }

        .intro-divider {
          width: 48px;
          height: 3px;
          margin: 22px 0;
          border-radius: 4px;
          background: var(--brand);
        }

        .intro-features {
          display: flex;
          flex-wrap: wrap;
          gap: 18px 22px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .feature-icon {
          display: grid;
          place-items: center;
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          border: 1px solid #e5d2be;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.55);
          color: var(--brand);
          font-size: 12px;
          font-weight: 800;
        }

        .feature-item div {
          display: grid;
          gap: 4px;
        }

        .feature-item strong {
          color: #302720;
          font-size: 12px;
        }

        .feature-item small {
          color: var(--muted);
          font-size: 11px;
        }

        .login-card {
          justify-self: end;
          width: 100%;
          max-width: 410px;
          min-width: 0;
          padding: 26px 28px 23px;
          border: 1px solid #e9ddcf;
          border-radius: 12px;
          background: #ffffff;
          box-shadow: 0 12px 35px rgba(75, 48, 26, 0.08);
        }

        .card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 17px;
        }

        .card-icon {
          display: grid;
          place-items: center;
          width: 46px;
          height: 46px;
          border-radius: 9px;
          background: var(--sand);
          color: var(--brand);
        }

        .card-badge {
          padding: 8px 10px;
          border: 1px solid #e6d2be;
          border-radius: 5px;
          background: #fcf6ee;
          color: var(--brand-dark);
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .login-card h2 {
          margin: 0 0 8px;
          color: #29231f;
          font-size: 27px;
          font-weight: 800;
          line-height: 1.3;
          letter-spacing: -0.4px;
        }

        .card-description {
          margin: 0;
          color: var(--muted);
          font-size: 14px;
          line-height: 1.8;
        }

        .login-form {
          display: grid;
          gap: 17px;
          margin-top: 24px;
        }

        .form-group {
          display: grid;
          gap: 9px;
          min-width: 0;
        }

        .form-group label {
          color: #49392d;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .password-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 7px;
        }

        .password-heading span {
          color: var(--muted);
          font-size: 11px;
        }

        .input-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
          min-height: 46px;
          padding: 0 13px;
          border: 1px solid #e2d8ce;
          border-radius: 7px;
          background: #fdfbf8;
          color: #8a6c53;
          transition: border-color 0.18s, box-shadow 0.18s;
        }

        .input-wrap:focus-within {
          border-color: var(--brand);
          box-shadow: 0 0 0 3px rgba(138, 75, 31, 0.1);
        }

        .input-wrap svg {
          flex-shrink: 0;
        }

        .input-wrap input {
          width: 100%;
          min-width: 0;
          min-height: 44px;
          padding: 10px 0;
          border: 0;
          outline: none;
          background: transparent;
          color: var(--text);
          font-family: inherit;
          font-size: 14px;
        }

        .input-wrap input::placeholder {
          color: #94877c;
        }

        .login-button {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          width: 100%;
          min-height: 48px;
          margin-top: 3px;
          padding: 0 16px;
          border: 0;
          border-radius: 7px;
          background: var(--brand);
          color: #ffffff;
          font-family: inherit;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.18s, box-shadow 0.18s;
        }

        .login-button:hover {
          background: var(--brand-dark);
          box-shadow: 0 5px 14px rgba(107, 57, 21, 0.16);
        }

        .login-button:focus-visible {
          outline: 3px solid #c99b75;
          outline-offset: 3px;
        }

        .login-button svg {
          flex-shrink: 0;
        }

        .card-security {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 17px;
          padding-top: 13px;
          border-top: 1px solid #eee5dc;
          color: var(--muted);
          font-size: 12px;
        }

        .card-security svg {
          flex-shrink: 0;
          color: var(--brand);
        }

        .login-error {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 15px;
          padding: 11px;
          border: 1px solid #e8b6a8;
          border-radius: 7px;
          background: #fff5f1;
          color: #963d27;
          font-size: 13px;
          line-height: 1.6;
        }

        .login-error span {
          display: grid;
          place-items: center;
          width: 21px;
          height: 21px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #f4dfd5;
          font-weight: 800;
        }

        .login-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
          gap: 14px;
          min-height: 46px;
          border-top: 1px solid var(--line);
          color: var(--muted);
          font-size: 10px;
          letter-spacing: 0.5px;
        }

        .login-footer a {
          color: var(--brand);
          text-decoration: none;
        }

        .login-footer a:hover {
          color: var(--brand-dark);
          text-decoration: underline;
        }

        @media (max-height: 760px) and (min-width: 681px) {
          .login-topbar {
            min-height: 68px;
          }

          .login-layout {
            padding: 10px 0;
            gap: 30px;
          }

          .intro-tag {
            padding: 7px 10px;
          }

          .login-intro h1 {
            margin: 13px 0 9px;
            font-size: clamp(29px, 3vw, 37px);
            line-height: 1.28;
          }

          .intro-description {
            font-size: 13px;
            line-height: 1.6;
          }

          .intro-divider {
            margin: 14px 0;
          }

          .intro-features {
            gap: 12px;
          }

          .feature-icon {
            width: 36px;
            height: 36px;
          }

          .login-card {
            padding: 19px 24px 17px;
          }

          .card-top {
            margin-bottom: 11px;
          }

          .card-icon {
            width: 41px;
            height: 41px;
          }

          .login-card h2 {
            font-size: 24px;
          }

          .login-form {
            gap: 12px;
            margin-top: 16px;
          }

          .input-wrap {
            min-height: 43px;
          }

          .input-wrap input {
            min-height: 41px;
            padding: 8px 0;
          }

          .login-button {
            min-height: 45px;
          }

          .card-security {
            margin-top: 12px;
            padding-top: 10px;
          }

          .login-footer {
            min-height: 36px;
          }
        }

        @media (max-width: 1024px) {
          .login-page {
            padding-right: 4%;
            padding-left: 4%;
          }

          .login-layout {
            grid-template-columns: minmax(0, 1fr) minmax(310px, 0.95fr);
            gap: 26px;
          }

          .login-card {
            padding-right: 22px;
            padding-left: 22px;
          }

          .login-intro h1 {
            font-size: clamp(30px, 3.5vw, 38px);
          }

          .intro-description {
            font-size: 14px;
          }

          .intro-features {
            gap: 13px;
          }
        }

        @media (max-width: 680px) {
          .login-page {
            height: auto;
            min-height: 100svh;
            overflow-x: hidden;
            overflow-y: auto;
            padding: 0 18px;
          }

          .login-topbar {
            min-height: 72px;
            gap: 10px;
          }

          .brand {
            gap: 9px;
          }

          .brand-mark {
            width: 43px;
            height: 41px;
            font-size: 18px;
          }

          .brand-name strong {
            font-size: 20px;
          }

          .brand-name small {
            font-size: 8px;
            letter-spacing: 0.8px;
          }

          .secure-label {
            gap: 6px;
            font-size: 8px;
            letter-spacing: 0.4px;
          }

          .secure-dot {
            width: 6px;
            height: 6px;
          }

          .login-layout {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            gap: 23px;
            padding: 25px 0 27px;
          }

          .login-intro {
            max-width: none;
          }

          .intro-tag {
            padding: 8px 9px;
            font-size: 8px;
            letter-spacing: 0.6px;
          }

          .login-intro h1 {
            margin: 17px 0 10px;
            font-size: clamp(29px, 7.5vw, 36px);
            line-height: 1.4;
          }

          .intro-description {
            font-size: 14px;
            line-height: 1.8;
          }

          .intro-divider {
            margin: 16px 0;
          }

          .intro-features {
            gap: 14px 18px;
          }

          .feature-icon {
            width: 35px;
            height: 35px;
          }

          .feature-item strong {
            font-size: 11px;
          }

          .feature-item small {
            font-size: 10px;
          }

          .login-card {
            max-width: none;
            padding: 23px 20px 20px;
            border-radius: 10px;
          }

          .card-top {
            margin-bottom: 15px;
          }

          .login-card h2 {
            font-size: 26px;
          }

          .card-description {
            font-size: 14px;
          }

          .login-form {
            gap: 16px;
            margin-top: 22px;
          }

          .input-wrap {
            min-height: 46px;
          }

          .input-wrap input {
            min-height: 44px;
          }

          .login-button {
            min-height: 48px;
          }

          .login-footer {
            flex-wrap: wrap;
            min-height: 48px;
            padding: 12px 0;
            font-size: 9px;
          }

          .login-footer span:nth-child(2) {
            display: none;
          }
        }

        @media (max-width: 360px) {
          .login-page {
            padding-right: 13px;
            padding-left: 13px;
          }

          .secure-label {
            font-size: 7px;
          }

          .brand-name strong {
            font-size: 18px;
          }

          .login-card {
            padding-right: 16px;
            padding-left: 16px;
          }

          .password-heading span {
            font-size: 10px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .login-page *,
          .login-page *::before,
          .login-page *::after {
            scroll-behavior: auto !important;
            transition: none !important;
          }
        }
      `}</style>
    </main>
  );
}
