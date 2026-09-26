import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAuth } from "../../context/AuthContext";

export function SignUp() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) return;
    setError(null);
    setMessage(null);
    setIsSubmitting(true);
    try {
      const needsEmailConfirmation = await signUp(
        firstName.trim(),
        lastName.trim(),
        email,
        password,
      );
      if (needsEmailConfirmation) {
        setMessage("Account created. Check your email to confirm it, then sign in.");
        return;
      }
      navigate("/language");
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Unable to create account");
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

      <h1 className="font-display text-[30px] leading-[1.2] text-text">Create your ticket</h1>
      <p className="mt-2 text-[13px] leading-relaxed text-text-muted">
        Register once, your Passport and progress travel with you.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-1 flex-col gap-5">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Amara"
            autoComplete="given-name"
          />
          <Input
            label="Surname"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Ndlovu"
            autoComplete="family-name"
          />
        </div>
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
          placeholder="At least 8 characters"
          autoComplete="new-password"
          minLength={8}
        />
        {error && <p role="alert" className="text-[12px] text-oxblood-light">{error}</p>}
        {message && <p role="status" className="text-[12px] text-brass-light">{message}</p>}

        <div className="mt-auto flex flex-col gap-3 pt-8">
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => navigate("/sign-in")}>
            Already have an account? Sign in
          </Button>
        </div>
      </form>
    </div>
  );
}
