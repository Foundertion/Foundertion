export default function WaitlistSection() {
  return (
    <section className="py-20 text-center">
      <h2 className="text-3xl font-bold">
        Join Our Waitlist
      </h2>

      <p className="mt-4 text-gray-400">
        Be the first to try Foundertion.
      </p>

      <form className="mt-6 flex justify-center gap-2">
        <input
          type="email"
          placeholder="Enter your email"
          className="px-4 py-2 rounded-lg border"
        />

        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-black text-white"
        >
          Join
        </button>
      </form>
    </section>
  );
}
