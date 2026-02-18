export default function AuthLayout({ children }) {
  return (
    <div className="auth-layout" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'hsl(var(--background))' }}>
      {children}
    </div>
  );
}
