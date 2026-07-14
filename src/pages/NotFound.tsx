import Icon from "../components/Icon";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-6">
      <Icon name="explore_off" className="text-6xl text-primary mb-4" />
      <h1 className="text-5xl font-extrabold text-navy font-display mb-2">404</h1>
      <p className="text-gray-500 mb-6">We couldn't find that page in your learning journey.</p>
      <Link to="/" className="bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg px-6 py-3">
        Back to Home
      </Link>
    </div>
  );
}
