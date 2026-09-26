import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAuth } from "./AuthContext";

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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) return;
    setError(null);
    setMessage(null);
    setIsSubmitting(true);
    try {
      const needsEmailConfirmation = await signUp(firstName.trim(), lastName.trim(), email, password);
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
      <button onClick={() => navigate("/")} aria-label="Back"><ArrowLeft size={20} /></button>
      <h1>Create your ticket</h1>
      <p>Register once, your Passport and progress travel with you.</p>
      <form onSubmit={handleSubmit}>
        <Input label="First name" value={firstName} onChange={(event) => setFirstName(event.target.value)} autoComplete="given-name" />
        <Input label="Surname" value={lastName} onChange={(event) => setLastName(event.target.value)} autoComplete="family-name" />
        <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" />
        <Input label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" minLength={8} />
        {error && <p role="alert">{error}</p>}
        {message && <p role="status">{message}</p>}
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating Account..." : "Create Account"}</Button>
        <Button type="button" onClick={() => navigate("/sign-in")}>Already have an account? Sign in</Button>
      </form>
    </div>
  );
}
