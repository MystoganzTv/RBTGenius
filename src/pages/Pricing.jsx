import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  X,
  Crown,
  Sparkles,
  GraduationCap,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with basic RBT prep",
    features: [
      { text: "2 study files per week", included: true },
      { text: "10 practice questions daily", included: true },
      { text: "Basic progress tracking", included: true },
      { text: "5 AI tutor questions daily", included: true },
      { text: "Full mock exams", included: false },
      { text: "Advanced analytics", included: false },
      { text: "Community features", included: false },
      { text: "Unlimited access", included: false },
    ],
    cta: "Start Free",
    popular: false,
    style: "border-slate-200",
  },
  {
    name: "Premium Monthly",
    price: "$29",
    period: "/month",
    description: "Full access to pass your RBT exam",
    features: [
      { text: "Unlimited study files", included: true },
      { text: "Unlimited practice questions", included: true },
      { text: "Full progress analytics", included: true },
      { text: "Unlimited AI tutor", included: true },
      { text: "Full mock exams", included: true },
      { text: "Domain mastery tracking", included: true },
      { text: "Community access", included: true },
      { text: "Pass guarantee", included: true },
    ],
    cta: "Start Free Trial",
    popular: true,
    style: "border-[#1E5EFF] shadow-xl shadow-[#1E5EFF]/10",
  },
  {
    name: "Premium Yearly",
    price: "$199",
    period: "/year",
    description: "Best value - save 43%",
    features: [
      { text: "Everything in Premium Monthly", included: true },
      { text: "Save $149 per year", included: true },
      { text: "Priority AI tutor access", included: true },
      { text: "Exclusive study materials", included: true },
      { text: "Full mock exams", included: true },
      { text: "Domain mastery tracking", included: true },
      { text: "Community access", included: true },
      { text: "Pass guarantee + refund", included: true },
    ],
    cta: "Start Free Trial",
    popular: false,
    style: "border-[#FFB800]/30",
    badge: "Best Value",
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to={createPageUrl("Dashboard")} className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1E5EFF]">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-lg font-bold text-[#0F172A]">RBT</span>
            <span className="text-lg font-bold text-[#1E5EFF]">Genius</span>
            <Sparkles className="-mt-1 h-3.5 w-3.5 text-[#FFB800]" />
          </div>
        </Link>
        <Link to={createPageUrl("Dashboard")}>
          <Button variant="ghost" className="gap-2 rounded-xl text-sm text-slate-500">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </nav>

      <div className="px-6 pb-16 pt-12 text-center">
        <Badge className="mb-4 border-[#FFB800]/20 bg-[#FFB800]/10 text-[#FFB800]">
          <Crown className="mr-1 h-3 w-3" />
          Pricing Plans
        </Badge>
        <h1 className="mt-2 text-4xl font-bold text-[#0F172A] md:text-5xl">
          Invest in Your <span className="text-[#1E5EFF]">RBT Career</span>
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-slate-500">
          Choose the plan that fits your study needs. Upgrade anytime.
        </p>
      </div>

      <div className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative rounded-2xl border-2 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-lg",
                plan.style,
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="px-3 py-1 text-xs text-white shadow-lg shadow-[#1E5EFF]/20">
                    Most Popular
                  </Badge>
                </div>
              )}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-[#FFB800] px-3 py-1 text-xs text-white shadow-lg shadow-[#FFB800]/20">
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-semibold text-[#0F172A]">{plan.name}</h3>
                <p className="mt-1 text-sm text-slate-400">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-[#0F172A]">{plan.price}</span>
                  <span className="text-sm text-slate-400">{plan.period}</span>
                </div>
              </div>

              <Button
                className={cn(
                  "mb-6 w-full rounded-xl",
                  plan.popular
                    ? "bg-[#1E5EFF] shadow-lg shadow-[#1E5EFF]/20 hover:bg-[#1E5EFF]/90"
                    : plan.badge
                      ? "bg-[#FFB800] text-[#0F172A] shadow-lg shadow-[#FFB800]/20 hover:bg-[#FFB800]/90"
                      : "bg-slate-900 hover:bg-slate-800",
                )}
              >
                {plan.cta}
              </Button>

              <div className="space-y-3">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2.5">
                    {feature.included ? (
                      <Check className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                    ) : (
                      <X className="h-4 w-4 flex-shrink-0 text-slate-300" />
                    )}
                    <span
                      className={cn(
                        "text-sm",
                        feature.included ? "text-slate-600" : "text-slate-400",
                      )}
                    >
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
