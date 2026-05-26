export default function RegisterPage() {
  return (
    <section className="hero" style={{ maxWidth: 760, margin: '30px auto' }}>
      <span className="eyebrow">Inscription gratuite</span>
      <h1>Créer un compte</h1>
      <p>Un compte vous permet de publier des biens, discuter avec les acheteurs/locataires et suivre vos annonces.</p>
      <form className="form" action="/api/auth/register" method="post" style={{ boxShadow: 'none', padding: 0, border: 0 }}>
        <div className="form-grid">
          <input name="firstName" placeholder="Prénom" />
          <input name="lastName" placeholder="Nom" />
          <input name="email" type="email" placeholder="Email" required />
          <input name="phone" placeholder="Téléphone" />
          <input name="city" placeholder="Ville" />
          <select name="role"><option value="PARTICULIER">Particulier</option><option value="AGENCE">Agence</option></select>
          <input className="full" name="password" type="password" placeholder="Mot de passe — 8 caractères minimum" required />
        </div>
        <button>Créer le compte</button>
      </form>
    </section>
  );
}
