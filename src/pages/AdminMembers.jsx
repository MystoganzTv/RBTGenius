import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Crown, Shield, Trash2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";

const PLAN_OPTIONS = [
  { value: "free", label: "Free" },
  { value: "premium_monthly", label: "Premium Monthly" },
  { value: "premium_yearly", label: "Premium Yearly" },
];

const ROLE_OPTIONS = [
  { value: "student", label: "User" },
  { value: "admin", label: "Admin" },
];

function formatJoinedDate(value) {
  if (!value) {
    return "Unknown join date";
  }

  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "Unknown join date";
  }
}

function getProviderLabel(provider) {
  switch (provider) {
    case "password":
      return "Manual";
    case "google":
      return "Google";
    case "apple":
      return "Apple";
    case "github":
      return "GitHub";
    case "microsoft":
      return "Microsoft";
    default:
      return provider || "Unknown";
  }
}

export default function AdminMembers() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [drafts, setDrafts] = useState({});

  const isAdmin = user?.role === "admin";

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["admin-members"],
    queryFn: api.listAdminMembers,
    enabled: isAdmin,
    initialData: [],
  });

  const updateMemberMutation = useMutation({
    mutationFn: ({ memberId, payload }) => api.updateAdminMember(memberId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-members"] });
      queryClient.invalidateQueries({ queryKey: ["profile-data"] });
    },
  });

  const deleteMemberMutation = useMutation({
    mutationFn: (memberId) => api.deleteAdminMember(memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-members"] });
    },
  });

  const filteredMembers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return members.filter((member) => {
      const matchesPlan = planFilter === "all" || member.plan === planFilter;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        member.full_name?.toLowerCase().includes(normalizedSearch) ||
        member.email?.toLowerCase().includes(normalizedSearch);

      return matchesPlan && matchesSearch;
    });
  }, [members, planFilter, search]);

  const premiumCount = members.filter((member) => member.plan !== "free").length;
  const adminCount = members.filter((member) => member.role === "admin").length;

  const getDraft = (member) =>
    drafts[member.id] || {
      plan: member.plan,
      role: member.role,
    };

  const updateDraft = (memberId, partial) => {
    setDrafts((current) => ({
      ...current,
      [memberId]: {
        ...current[memberId],
        ...partial,
      },
    }));
  };

  const handleSave = async (member) => {
    const draft = getDraft(member);

    await updateMemberMutation.mutateAsync({
      memberId: member.id,
      payload: {
        plan: draft.plan,
        role: draft.role,
      },
    });

    setDrafts((current) => {
      const nextDrafts = { ...current };
      delete nextDrafts[member.id];
      return nextDrafts;
    });
  };

  const handleDelete = async (member) => {
    const confirmed = window.confirm(
      `Delete ${member.full_name} (${member.email})? This will remove their profile, attempts, mock exams, payments, sessions, and tutor conversations.`,
    );

    if (!confirmed) {
      return;
    }

    await deleteMemberMutation.mutateAsync(member.id);

    setDrafts((current) => {
      const nextDrafts = { ...current };
      delete nextDrafts[member.id];
      return nextDrafts;
    });
  };

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-3xl">
        <Card className="p-10 text-center">
          <Shield className="mx-auto mb-4 h-12 w-12 text-slate-300" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Admin access only
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            This panel is only available to administrator accounts.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Member Management
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage premium access and admin roles for your members.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Total Members</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                  {members.length}
                </p>
              </div>
              <Users className="h-7 w-7 text-[#1E5EFF]" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Premium Members</p>
                <p className="text-2xl font-bold text-emerald-600">{premiumCount}</p>
              </div>
              <Crown className="h-7 w-7 text-emerald-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Admins</p>
                <p className="text-2xl font-bold text-violet-600">{adminCount}</p>
              </div>
              <Shield className="h-7 w-7 text-violet-600" />
            </div>
          </Card>
        </div>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or email"
          />

          <Select value={planFilter} onValueChange={setPlanFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              {PLAN_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <Card className="p-8 text-center text-slate-500">Loading members...</Card>
        ) : filteredMembers.length === 0 ? (
          <Card className="p-8 text-center text-slate-500">
            No members match the current filters.
          </Card>
        ) : (
          filteredMembers.map((member) => {
            const draft = getDraft(member);
            const hasChanges = draft.plan !== member.plan || draft.role !== member.role;
            const isCurrentAdmin = member.id === user?.id;

            return (
              <Card key={member.id} className="p-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                        {member.full_name}
                      </h2>
                      <Badge variant="outline">{member.role === "admin" ? "Admin" : "User"}</Badge>
                      <Badge variant="outline">{getProviderLabel(member.auth_provider)}</Badge>
                      <Badge
                        className={
                          member.plan === "free"
                            ? "bg-slate-100 text-slate-700"
                            : "bg-emerald-100 text-emerald-700"
                        }
                      >
                        {PLAN_OPTIONS.find((option) => option.value === member.plan)?.label ||
                          member.plan}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {member.email}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span>Joined {formatJoinedDate(member.created_at)}</span>
                      <span>{member.total_questions_completed} questions completed</span>
                      <span>{member.readiness_score}% readiness</span>
                      <span>{member.study_streak_days} day streak</span>
                      <span>{member.exams_count} exams</span>
                      <span>{member.payments_count || 0} payments</span>
                      <span>${Number(member.total_paid_amount || 0).toFixed(2)} paid</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-[220px_180px_auto_auto] xl:min-w-[640px]">
                    <Select
                      value={draft.plan}
                      onValueChange={(value) => updateDraft(member.id, { plan: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PLAN_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={draft.role}
                      onValueChange={(value) => updateDraft(member.id, { role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button
                      onClick={() => handleSave(member)}
                      disabled={
                        !hasChanges ||
                        updateMemberMutation.isPending ||
                        deleteMemberMutation.isPending
                      }
                      className="bg-[#1E5EFF] hover:bg-[#1E5EFF]/90"
                    >
                      Save
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleDelete(member)}
                      disabled={isCurrentAdmin || deleteMemberMutation.isPending}
                      className="border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700 dark:border-red-900/70 dark:text-red-300 dark:hover:bg-red-950/40"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
