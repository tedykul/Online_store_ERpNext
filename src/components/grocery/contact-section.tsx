"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type Status = "idle" | "loading" | "success";

interface ContactInfo {
  icon: typeof Mail;
  label: string;
  value: string;
  href?: string;
}

const CONTACT_INFOS: ContactInfo[] = [
  {
    icon: Phone,
    label: "Telepon",
    value: "0800-1234-5678",
    href: "tel:080012345678",
  },
  {
    icon: Mail,
    label: "Email",
    value: "halo@sayurbox.id",
    href: "mailto:halo@sayurbox.id",
  },
  {
    icon: MapPin,
    label: "Alamat",
    value: "Jl. Petani Sejahtera No. 88, Jakarta Selatan",
  },
  {
    icon: Clock,
    label: "Jam Operasional",
    value: "Setiap hari, 08.00 - 21.00 WIB",
  },
];

interface ContactSectionProps {
  /** Admin-editable content from DB. Null fields fall back to defaults. */
  content?: {
    contactPhone: string | null;
    contactEmail: string | null;
    contactAddress: string | null;
    contactHours: string | null;
  };
}

export function ContactSection({ content }: ContactSectionProps = {}) {
  const phone = content?.contactPhone ?? "0800-1234-5678";
  const email = content?.contactEmail ?? "halo@sayurbox.id";
  const address = content?.contactAddress ?? "Jl. Petani Sejahtera No. 88, Jakarta Selatan";
  const hours = content?.contactHours ?? "Setiap hari, 08.00 - 21.00 WIB";

  const contactInfos: ContactInfo[] = [
    { icon: Phone, label: "Telepon", value: phone, href: `tel:${phone.replace(/[^0-9+]/g, "")}` },
    { icon: Mail, label: "Email", value: email, href: `mailto:${email}` },
    { icon: MapPin, label: "Alamat", value: address },
    { icon: Clock, label: "Jam Operasional", value: hours },
  ];

  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!form.name || form.name.trim().length < 2) next.name = "Nama minimal 2 karakter";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Email tidak valid";
    if (!form.subject || form.subject.trim().length < 3) next.subject = "Subjek minimal 3 karakter";
    if (!form.message || form.message.trim().length < 10) next.message = "Pesan minimal 10 karakter";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Periksa kembali isian form");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        toast.success("Pesan terkirim! 🎉");
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        setStatus("idle");
        toast.error(data.message || "Gagal mengirim pesan");
        // map server-side errors back to fields
        if (data.errors) {
          const fieldErrors: Record<string, string> = {};
          for (const err of data.errors) fieldErrors[err.field] = err.message;
          setErrors(fieldErrors);
        }
      }
    } catch {
      setStatus("idle");
      toast.error("Koneksi gagal. Coba lagi.");
    }
  };

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm({ ...form, [field]: value });
    // clear field error on edit
    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  return (
    <section
      id="kontak"
      className="scroll-mt-24 bg-gradient-to-b from-background to-secondary/20"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Mail className="h-3.5 w-3.5" />
            Hubungi Kami
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-balance md:text-5xl">
            Ada Pertanyaan?{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
              Sampaikan ke Kami
            </span>
          </h2>
          <p className="mt-4 text-base text-muted-foreground md:text-lg text-balance">
            Tim customer service kami siap membantu. Isi form di bawah atau hubungi langsung via kontak kami.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-8 lg:grid-cols-5 lg:gap-12">
          {/* Contact info cards */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 space-y-4"
          >
            {contactInfos.map((info, i) => (
              <div
                key={info.label}
                className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/40"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <info.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {info.label}
                  </p>
                  {info.href ? (
                    <a
                      href={info.href}
                      className="mt-0.5 block text-sm font-semibold text-foreground hover:text-primary transition-colors break-words"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p className="mt-0.5 text-sm font-semibold text-foreground break-words">{info.value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Social proof / quick note */}
            <div className="rounded-2xl bg-primary/5 border border-primary/20 p-5">
              <p className="text-sm font-medium text-primary">💡 Tips Cepat</p>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Untuk pertanyaan umum (cara pesan, pengiriman, pembayaran), cek dulu
                section FAQ di atas. Mungkin jawabannya sudah ada! 😊
              </p>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm md:p-8">
              {status === "success" ? (
                <SuccessState
                  onReset={() => setStatus("idle")}
                />
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      label="Nama Lengkap"
                      required
                      error={errors.name}
                    >
                      <Input
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="Budi Santoso"
                        disabled={status === "loading"}
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? "err-name" : undefined}
                      />
                    </FormField>
                    <FormField
                      label="Email"
                      required
                      error={errors.email}
                    >
                      <Input
                        type="email"
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="budi@email.com"
                        disabled={status === "loading"}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "err-email" : undefined}
                      />
                    </FormField>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField label="No. Telepon (opsional)" error={errors.phone}>
                      <Input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="0812xxxxxxx"
                        disabled={status === "loading"}
                      />
                    </FormField>
                    <FormField
                      label="Subjek"
                      required
                      error={errors.subject}
                    >
                      <Input
                        value={form.subject}
                        onChange={(e) => handleChange("subject", e.target.value)}
                        placeholder="Pertanyaan tentang pesanan"
                        disabled={status === "loading"}
                        aria-invalid={!!errors.subject}
                      />
                    </FormField>
                  </div>

                  <FormField
                    label="Pesan"
                    required
                    error={errors.message}
                  >
                    <Textarea
                      value={form.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      placeholder="Tulis pesan atau pertanyaanmu di sini..."
                      rows={5}
                      disabled={status === "loading"}
                      aria-invalid={!!errors.message}
                      maxLength={2000}
                    />
                    <div className="mt-1 text-right text-xs text-muted-foreground">
                      {form.message.length}/2000
                    </div>
                  </FormField>

                  <Button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full h-12 rounded-xl text-base shadow-md transition-transform hover:scale-[1.01] disabled:opacity-60 disabled:hover:scale-100"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Kirim Pesan
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FormField({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-destructive" role="alert">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
}

function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
      >
        <CheckCircle2 className="h-9 w-9 text-primary" />
      </motion.div>
      <div>
        <h3 className="text-xl font-bold">Pesan Terkirim! 🎉</h3>
        <p className="mt-1 text-sm text-muted-foreground max-w-sm">
          Terima kasih sudah menghubungi kami. Tim customer service akan membalas
          dalam 1x24 jam via email.
        </p>
      </div>
      <Button onClick={onReset} variant="outline" className="mt-2 rounded-full">
        Kirim Pesan Lain
      </Button>
    </div>
  );
}
