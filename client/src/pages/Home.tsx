import { useTranslation } from "react-i18next";
import CTAButton from "../components/Button/Button";
import { useNavigate } from "react-router-dom";
import type React from "react";

const Home: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <section className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-6">
        {t("home.welcome")}
      </h1>

      <CTAButton
        onClick={() => {
          navigate("/auth");
        }}
      >
        {t("home.getStarted")}
      </CTAButton>
    </section>
  );
};

export default Home;
