import Link from "next/link";

export default function ForgotPassword() {
  return (
    <section className="grid place-content-center min-h-screen min-w-screen">
      <div>
        <h1>Forgot Password</h1>
        <p>Feature currently under development.</p>
        <p>Need Help?</p>
        <Link className="font-extrabold underline" href="/support">
          Contact Support{" "}
        </Link>
      </div>
    </section>
  );
}
