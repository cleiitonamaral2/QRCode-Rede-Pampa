import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, User, Phone, Smartphone, Mail, Globe, MapPin, Building, Briefcase } from "lucide-react";
import { Contact, ContactFormData, ContactPreset } from "../types";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ContactFormData) => Promise<void>;
  contact?: Contact | null;
  defaultPreset?: ContactPreset | null;
}

const initialFormState: ContactFormData = {
  name: "",
  phone: "",
  mobile: "",
  fax: "",
  email: "",
  website: "",
  address: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  country: "",
  company: "",
  role: ""
};

export default function ContactModal({ isOpen, onClose, onSave, contact, defaultPreset }: ContactModalProps) {
  const [formData, setFormData] = useState<ContactFormData>(initialFormState);
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name,
        phone: contact.phone,
        mobile: contact.mobile,
        fax: contact.fax || "",
        email: contact.email,
        website: contact.website,
        address: contact.address || "",
        street: contact.street || "",
        city: contact.city || "",
        state: contact.state || "",
        zip: contact.zip || "",
        country: contact.country || "",
        company: contact.company,
        role: contact.role
      });
    } else {
      setFormData({
        name: "",
        phone: defaultPreset?.phone || "",
        mobile: defaultPreset?.mobile || "",
        fax: defaultPreset?.fax || "",
        email: defaultPreset?.email || "",
        website: defaultPreset?.website || "",
        address: defaultPreset?.address || "",
        street: defaultPreset?.street || "",
        city: defaultPreset?.city || "",
        state: defaultPreset?.state || "",
        zip: defaultPreset?.zip || "",
        country: defaultPreset?.country || "",
        company: defaultPreset?.company || "",
        role: defaultPreset?.role || ""
      });
    }
    setErrors({});
  }, [contact, isOpen, defaultPreset]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (["street", "city", "state", "zip", "country"].includes(name)) {
        const streetPart = updated.street || "";
        const cityStatePart = [updated.city, updated.state].filter(Boolean).join(" - ");
        const zipPart = updated.zip || "";
        const countryPart = updated.country || "";
        updated.address = [streetPart, cityStatePart, zipPart, countryPart].filter(Boolean).join(", ");
      }
      return updated;
    });
    if (name === "name" && value.trim()) {
      setErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrors({ name: "O nome completo é obrigatório." });
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error("Erro ao salvar contato:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="relative bg-white border border-stone-200 w-full max-w-2xl rounded-2xl shadow-xl flex flex-col max-h-[90vh] z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
              <div>
                <h2 className="text-xl font-bold text-stone-900 tracking-tight">
                  {contact ? "Editar Contato" : "Novo Contato"}
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  {contact ? "Atualize as informações do contato corporativo." : "Insira as informações para gerar o vCard e QR Code correspondentes."}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-stone-50 text-stone-400 hover:text-stone-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Seção 1: Identificação */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3.5">
                  Dados Principais
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Nome Completo <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Ex: Carlos de Oliveira Santos"
                        className={`w-full pl-10 pr-4 py-2.5 bg-stone-50 border ${errors.name ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-stone-200 focus:border-stone-500 focus:ring-stone-500"} rounded-xl text-sm transition-all focus:outline-hidden focus:ring-2 focus:ring-offset-0`}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-xs text-red-500 mt-1 font-medium">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Empresa
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                        <Building className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Ex: AgencyCorp Digital"
                        className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 focus:border-stone-500 focus:ring-stone-500 rounded-xl text-sm transition-all focus:outline-hidden focus:ring-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Cargo
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        placeholder="Ex: Diretor Executivo"
                        className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 focus:border-stone-500 focus:ring-stone-500 rounded-xl text-sm transition-all focus:outline-hidden focus:ring-2"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção 2: Contatos e Links */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3.5">
                  Canais de Contato
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Celular (WhatsApp)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="Ex: (11) 98765-4321"
                        className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 focus:border-stone-500 focus:ring-stone-500 rounded-xl text-sm transition-all focus:outline-hidden focus:ring-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Telefone Fixo
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Ex: (11) 3214-5555"
                        className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 focus:border-stone-500 focus:ring-stone-500 rounded-xl text-sm transition-all focus:outline-hidden focus:ring-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Telefone Fax
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        name="fax"
                        value={formData.fax}
                        onChange={handleChange}
                        placeholder="Ex: (11) 3214-5556"
                        className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 focus:border-stone-500 focus:ring-stone-500 rounded-xl text-sm transition-all focus:outline-hidden focus:ring-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      E-mail Corporativo
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Ex: carlos@empresa.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 focus:border-stone-500 focus:ring-stone-500 rounded-xl text-sm transition-all focus:outline-hidden focus:ring-2"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Website (URL)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                        <Globe className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="Ex: www.empresa.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 focus:border-stone-500 focus:ring-stone-500 rounded-xl text-sm transition-all focus:outline-hidden focus:ring-2"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção 3: Endereço */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3.5">
                  Localização
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Logradouro (Rua, Avenida, Número, Bairro)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        placeholder="Ex: Avenida Ipiranga, 1500"
                        className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 focus:border-stone-500 focus:ring-stone-500 rounded-xl text-sm transition-all focus:outline-hidden focus:ring-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Cidade
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Ex: Porto Alegre"
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 focus:border-stone-500 focus:ring-stone-500 rounded-xl text-sm transition-all focus:outline-hidden focus:ring-2"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Estado (UF)
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Ex: RS"
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 focus:border-stone-500 focus:ring-stone-500 rounded-xl text-sm transition-all focus:outline-hidden focus:ring-2"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      CEP
                    </label>
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleChange}
                      placeholder="Ex: 90160-091"
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 focus:border-stone-500 focus:ring-stone-500 rounded-xl text-sm transition-all focus:outline-hidden focus:ring-2"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      País
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="Ex: Brasil"
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 focus:border-stone-500 focus:ring-stone-500 rounded-xl text-sm transition-all focus:outline-hidden focus:ring-2"
                    />
                  </div>
                </div>
              </div>

            </form>

            {/* Footer Actions */}
            <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 rounded-b-2xl flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-5 py-2 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                {isSubmitting ? "Gravando..." : "Salvar Contato"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
