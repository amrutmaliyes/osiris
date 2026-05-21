import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import AuthLayout from "../components/ui/AuthLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

function ActivationPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <Card subtitle={t("product_activation_panel")}>
        <div className="flex flex-col gap-5">
          <Button variant="primary" size="lg" fullWidth onClick={() => navigate("/reactivation")}>
            {t("have_activation_key")}
          </Button>
          <Button variant="outline" size="lg" fullWidth onClick={() => navigate("/new-activation")}>
            {t("register_for_activation_key")}
          </Button>
        </div>
      </Card>
    </AuthLayout>
  );
}

export default ActivationPage;
