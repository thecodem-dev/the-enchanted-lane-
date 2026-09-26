import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAuth } from "../../context/AuthContext";

export function SignIn() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
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
      <button
        onClick={() => navigate("/")}
        aria-label="Back"
        className="mb-8 flex h-9 w-9 items-center justify-center rounded-btn text-text-muted hover:text-text"
      >
        <ArrowLeft size={20} strokeWidth={1.6} />
      </button>

      <h1 className="font-display text-[30px] leading-[1.2] text-text">Welcome back</h1>
      <p className="mt-2 text-[13px] leading-relaxed text-text-muted">
        Your journey is exactly where you left it.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-1 flex-col gap-5">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
          autoComplete="current-password"
        />
        {error && <p role="alert" className="text-[12px] text-oxblood-light">{error}</p>}

        <div className="mt-auto flex flex-col gap-3 pt-8">
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Signing In..." : "Sign In"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => navigate("/sign-up")}>
            New here? Create an account
          </Button>
        </div>
      </form>
    </div>
  );
}
