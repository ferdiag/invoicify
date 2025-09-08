import { useForm } from "react-hook-form";
import { useState } from "react";
import { api } from "../lib/api";
import CTAButton from "../components/Button/Button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useUserStore } from "../store/userStore";
import { PATHS } from "../../../shared/paths";
import { toApi } from "../lib/toApi";

type AuthData = {
  email: string;
  password: string;
};

const Auth: React.FC = () => {
  const [mode, setMode] = useState<"login" | "register">("register");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AuthData>();

  const AUTH_ENDPOINT: Record<"login" | "register", string> = {
    login: PATHS.AUTH.LOGIN,
    register: PATHS.AUTH.REGISTER,
  };

  const { t } = useTranslation();
  const { loginSuccess, registerSuccess, handleApiError } = useUserStore();
  const onSubmit = async (data: AuthData) => {
    console.log(data);

    try {
      const res = await api.post(toApi(AUTH_ENDPOINT[mode]), data);

      if ([200, 201].includes(res.status)) {
        if (mode === "login") {
          loginSuccess(res.data, t("auth.loginSuccess"), navigate);
        } else {
          registerSuccess(reset, t("auth.registerSuccess"), setMode);
        }
      }
    } catch (err: unknown) {
      console.log(err);
      handleApiError(err, t);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-sm">
        <div className="flex mb-6 border-b border-gray-600 flex items-center justify-center">
          <CTAButton
            variant={mode === "login" ? "primary" : "ghost"}
            onClick={() => setMode("login")}
          >
            {t("buttons.login")}
          </CTAButton>
          <CTAButton
            variant={mode === "register" ? "primary" : "ghost"}
            onClick={() => setMode("register")}
          >
            {t("buttons.register")}
          </CTAButton>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
          className="space-y-4"
        >
          <input
            type="email"
            placeholder={t("auth.placeholders.email")}
            className="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400 border border-gray-600"
            {...register("email", { required: t("validation.emailRequired") })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          <input
            type="password"
            placeholder={t("auth.placeholders.password")}
            className="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400 border border-gray-600"
            {...register("password", {
              required: t("validation.passwordRequired"),
              minLength: {
                value: 6,
                message: t("validation.passwordMinLength"),
              },
              pattern: {
                value:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/,
                message: t("validation.passwordPattern"),
              },
            })}
          />
          <div className="h-5">
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <CTAButton
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            {mode === "login" ? t("buttons.login") : t("buttons.register")}
          </CTAButton>
        </form>
      </div>
    </div>
  );
};

export default Auth;
