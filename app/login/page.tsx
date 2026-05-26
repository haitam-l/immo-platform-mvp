export default function LoginPage() {
  return (
    <section className="hero" style={{ maxWidth: 620, margin: '30px auto' }}>
      <span className="eyebrow">Espace membre</span>
      <h1>Connexion</h1>
      <p>Connectez-vous pour publier des annonces, gérer vos favoris et répondre aux messages.</p>
      <form className="form" action="/api/auth/login" method="post" style={{ boxShadow: 'none', padding: 0, border: 0 }}>
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Mot de passe" required />
        <button>Se connecter</button>
        <a className="button secondary" href="/register">Créer un compte</a>
      </form>
    </section>
  );
}
