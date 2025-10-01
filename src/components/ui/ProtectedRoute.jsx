import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/userAuth";
import LoginModal from "../ui/login";

export default function ProtectedRoute({ children }) {
  const { isLoggedIn, isLoading } = useAuth();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) setShowModal(true);
  }, [isLoggedIn, isLoading]);

  if (isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    <>
      {showModal && <LoginModal 
        open={showModal} 
        onClose={() => setShowModal(false)} 
        onLoginSuccess={() => setShowModal(false)}
      />}
      {isLoggedIn ? children : null}
    </>
  );
}
