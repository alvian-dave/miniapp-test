import { useState } from "react";
import WorldIDGate from "../components/WorldIDGate";
import Dashboard from "../components/Dashboard";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOrbVerified, setIsOrbVerified] = useState(false);
  const [worldIDProof, setWorldIDProof] = useState<any>(null);

  if (!isLoggedIn) {
    return (
      <WorldIDGate
        onSuccess={(proof, orb) => {
          setIsLoggedIn(true);
          setIsOrbVerified(orb);
          setWorldIDProof(proof);
        }}
      />
    );
  }

  return (
    <Dashboard isOrbVerified={isOrbVerified} worldIDProof={worldIDProof} />
  );
}