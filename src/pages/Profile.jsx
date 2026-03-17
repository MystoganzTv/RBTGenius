import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Crown,
  Mail,
  Shield,
  User,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";

const fallbackUser = {
  id: "user-demo",
  full_name: "Alex Carter",
  email: "alex.carter@example.com",
  role: "student",
};

const fallbackProgress = {
  plan: "free",
  total_questions_completed: 148,
  total_correct: 118,
  study_streak_days: 6,
  study_hours: 24,
  readiness_score: 78,
};

const fallbackPayments = [];

const planInfo = {
  free: {
    name: "Free",
    icon: User,
    badgeClass: "bg-slate-100 text-slate-700",
  },
  premium_monthly: {
    name: "Premium Mensual",
    icon: Crown,
    badgeClass: "bg-blue-100 text-blue-700",
  },
  premium_yearly: {
    name: "Premium Anual",
    icon: Crown,
    badgeClass: "bg-violet-100 text-violet-700",
  },
};

function formatPaymentDate(value) {
  if (!value) {
    return "Pendiente";
  }

  try {
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "Pendiente";
  }
}

function getNextBillingLabel(plan) {
  if (plan === "premium_yearly") {
    return "15 mar 2027";
  }

  if (plan === "premium_monthly") {
    return "15 abr 2026";
  }

  return "Sin renovación";
}

export default function Profile() {
  const { user: authUser, login } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ full_name: "" });
  const queryClient = useQueryClient();

  const { data: profileData } = useQuery({
    queryKey: ["profile-data"],
    queryFn: api.getProfile,
    initialData: {
      user: authUser || fallbackUser,
      progress: fallbackProgress,
      payments: fallbackPayments,
    },
  });

  const profileUser = profileData?.user || authUser || fallbackUser;
  const progress = profileData?.progress || fallbackProgress;
  const payments = profileData?.payments || fallbackPayments;
  const currentUser = profileUser || authUser || fallbackUser;
  const currentPlan = planInfo[progress?.plan || "free"] || planInfo.free;
  const CurrentPlanIcon = currentPlan.icon;

  useEffect(() => {
    setFormData({ full_name: currentUser?.full_name || "" });
  }, [currentUser?.full_name]);

  const updateProfileMutation = useMutation({
    mutationFn: api.updateProfile,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["profile-data"], (current) => ({
        ...(current || {}),
        user: updatedUser,
        progress: current?.progress || progress,
        payments: current?.payments || payments,
      }));
      queryClient.invalidateQueries({ queryKey: ["profile-data"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
      login(updatedUser);
      setEditMode(false);
    },
  });

  const handleUpdateProfile = () => {
    const fullName = formData.full_name.trim();

    if (!fullName) {
      return;
    }

    updateProfileMutation.mutate({ full_name: fullName });
  };

  const sortedPayments = useMemo(
    () =>
      [...payments].sort((left, right) => {
        const leftDate = left?.payment_date ? new Date(left.payment_date).getTime() : 0;
        const rightDate = right?.payment_date ? new Date(right.payment_date).getTime() : 0;
        return rightDate - leftDate;
      }),
    [payments],
  );

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Mi Perfil</h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestiona tu cuenta y membresia.
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="subscription">Membresia</TabsTrigger>
          <TabsTrigger value="payments">Pagos</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#1E5EFF] to-[#6366F1]">
                  <span className="text-2xl font-bold text-white">
                    {currentUser?.full_name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#0F172A]">
                    {currentUser?.full_name || "Usuario"}
                  </h2>
                  <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                    <Mail className="h-3 w-3" />
                    {currentUser?.email}
                  </p>
                </div>
              </div>

              <Badge className={cn("shrink-0", currentPlan.badgeClass)}>
                <CurrentPlanIcon className="mr-1 h-3 w-3" />
                {currentPlan.name}
              </Badge>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Nombre Completo
                </label>
                {editMode ? (
                  <Input
                    value={formData.full_name}
                    onChange={(event) =>
                      setFormData({ ...formData, full_name: event.target.value })
                    }
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-slate-600">
                    {currentUser?.full_name || "No especificado"}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Email</label>
                <p className="mt-1 text-slate-600">{currentUser?.email}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Rol</label>
                <p className="mt-1 flex items-center gap-2 text-slate-600">
                  <Shield className="h-4 w-4" />
                  {currentUser?.role === "admin" ? "Administrador" : "Usuario"}
                </p>
              </div>

              <div className="pt-4">
                {editMode ? (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleUpdateProfile}
                      disabled={
                        updateProfileMutation.isPending || !formData.full_name.trim()
                      }
                      className="bg-[#1E5EFF] hover:bg-[#1E5EFF]/90"
                    >
                      Guardar Cambios
                    </Button>
                    <Button onClick={() => setEditMode(false)} variant="outline">
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => setEditMode(true)} variant="outline">
                    Editar Perfil
                  </Button>
                )}
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="p-4">
              <p className="mb-1 text-xs text-slate-500">Preguntas Completadas</p>
              <p className="text-2xl font-bold text-[#0F172A]">
                {progress?.total_questions_completed || 0}
              </p>
            </Card>
            <Card className="p-4">
              <p className="mb-1 text-xs text-slate-500">Racha de Estudio</p>
              <p className="text-2xl font-bold text-[#FFB800]">
                {progress?.study_streak_days || 0} dias
              </p>
            </Card>
            <Card className="p-4">
              <p className="mb-1 text-xs text-slate-500">Horas de Estudio</p>
              <p className="text-2xl font-bold text-[#1E5EFF]">
                {progress?.study_hours || 0}h
              </p>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="subscription" className="space-y-6">
          <Card className="p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="mb-1 text-lg font-bold text-[#0F172A]">
                  Plan Actual
                </h3>
                <p className="text-sm text-slate-500">Gestiona tu membresia</p>
              </div>
              <Badge className="px-3 py-1 text-sm bg-[#1E5EFF]/10 text-[#1E5EFF]">
                {currentPlan.name}
              </Badge>
            </div>

            {progress?.plan === "free" ? (
              <div className="py-8 text-center">
                <Crown className="mx-auto mb-4 h-16 w-16 text-[#FFB800]" />
                <h4 className="mb-2 text-xl font-bold text-[#0F172A]">
                  Mejora a Premium
                </h4>
                <p className="mb-6 text-slate-600">
                  Desbloquea todas las funciones y accede a 500+ preguntas.
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-[#1E5EFF] hover:bg-[#1E5EFF]/90">
                      Ver Planes Premium
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Selecciona tu Plan</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <PricingOption
                        title="Premium Mensual"
                        price="$19.99"
                        period="mes"
                        features={[
                          "500+ preguntas",
                          "Flashcards ilimitados",
                          "Examenes simulados",
                          "AI Tutor avanzado",
                        ]}
                      />
                      <PricingOption
                        title="Premium Anual"
                        price="$149.99"
                        period="ano"
                        savings="Ahorra $90"
                        features={[
                          "Todo de Premium Mensual",
                          "Actualizaciones continuas",
                          "Soporte prioritario",
                        ]}
                        recommended
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-emerald-50 p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <span className="font-medium text-emerald-900">
                      Membresia Activa
                    </span>
                  </div>
                  <Badge className="bg-emerald-600 text-white">Activo</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="mb-1 text-xs text-slate-500">Proximo Pago</p>
                    <p className="text-sm font-semibold text-slate-700">
                      {getNextBillingLabel(progress?.plan)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="mb-1 text-xs text-slate-500">Monto</p>
                    <p className="text-sm font-semibold text-slate-700">
                      {progress?.plan === "premium_monthly" ? "$19.99" : "$149.99"}
                    </p>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  Cancelar Membresia
                </Button>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-bold text-[#0F172A]">
              Historial de Pagos
            </h3>

            {sortedPayments.length === 0 ? (
              <div className="py-12 text-center">
                <CreditCard className="mx-auto mb-4 h-16 w-16 text-slate-300" />
                <p className="text-slate-500">No hay pagos registrados.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between rounded-lg border border-slate-100 p-4 transition-colors hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full",
                          payment.status === "completed" && "bg-emerald-100",
                          payment.status === "pending" && "bg-amber-100",
                          payment.status === "failed" && "bg-red-100",
                        )}
                      >
                        {payment.status === "completed" && (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        )}
                        {payment.status === "pending" && (
                          <Clock className="h-5 w-5 text-amber-600" />
                        )}
                        {payment.status === "failed" && (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-[#0F172A]">
                          {payment.plan === "premium_monthly"
                            ? "Premium Mensual"
                            : "Premium Anual"}
                        </p>
                        <p className="flex items-center gap-1 text-xs text-slate-500">
                          <Calendar className="h-3 w-3" />
                          {formatPaymentDate(payment.payment_date)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#0F172A]">${payment.amount}</p>
                      <Badge
                        variant={payment.status === "completed" ? "default" : "outline"}
                        className="text-xs"
                      >
                        {payment.status === "completed"
                          ? "Completado"
                          : payment.status === "pending"
                            ? "Pendiente"
                            : "Fallido"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PricingOption({
  title,
  price,
  period,
  savings,
  features,
  recommended = false,
}) {
  return (
    <div
      className={cn(
        "rounded-xl border-2 p-6",
        recommended ? "border-[#1E5EFF] bg-[#1E5EFF]/5" : "border-slate-200",
      )}
    >
      {recommended && (
        <Badge className="mb-3 bg-[#FFB800] text-white">Recomendado</Badge>
      )}
      <h4 className="mb-1 text-lg font-bold text-[#0F172A]">{title}</h4>
      <div className="mb-4 flex items-baseline gap-1">
        <span className="text-3xl font-bold text-[#0F172A]">{price}</span>
        <span className="text-slate-500">/ {period}</span>
        {savings && (
          <Badge variant="outline" className="ml-2 text-emerald-600">
            {savings}
          </Badge>
        )}
      </div>
      <ul className="mb-6 space-y-2">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm text-slate-700">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-600" />
            {feature}
          </li>
        ))}
      </ul>
      <Button
        className={cn(
          "w-full",
          recommended && "bg-[#1E5EFF] hover:bg-[#1E5EFF]/90",
        )}
      >
        Seleccionar Plan
      </Button>
    </div>
  );
}
