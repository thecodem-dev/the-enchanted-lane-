import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAuth } from "./AuthContext";

export function SignIn() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !password) return;
    setError(null);
    setIsSubmitting(true);
    try {
      await signIn(email, password);
      navigate("/home");
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Unable to sign in");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col py-8">
      <button onClick={() => navigate("/")} aria-label="Back"> <ArrowLeft size={20} /> </button>
      <h1>Welcome back</h1>
      <p>Your journey is exactly where you left it.</p>
      <form onSubmit={handleSubmit}>
        <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" />
        <Input label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" />
        {error && <p role="alert">{error}</p>}
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Signing In..." : "Sign In"}</Button>
        <Button type="button" onClick={() => navigate("/sign-up")}>New here? Create an account</Button>
      </form>
    </div>
  );
}
