import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles, Phone, Smartphone, Mail, Globe, MapPin, Building, Briefcase, Settings } from "lucide-react";
import { ContactPreset } from "../types";

interface PresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preset: ContactPreset) => Promise<void>;
  currentPreset: ContactPreset | null;
}

const initialPresetState: ContactPreset = {
  phone: "",
  mobile: "",
  email: "",
  website: "",
  address: "",
  company: "",
  role: ""
};

export default function PresetModal({ isOpen, onClose, onSave, currentPreset }: PresetModalProps) {
  const [presetData, setPresetData] = useState<ContactPreset>(initialPresetState);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (currentPreset) {
      setPresetData(currentPreset);
    } else {
      setPresetData(initialPresetState);
    }
  }, [currentPreset, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPresetData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await onSave(presetData);
      onClose();
    } catch (err) {
      console.error("Erro ao salvar presets padrão:", err);
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
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-slate-100 text-slate-800 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-stone-900 tracking-tight">
                    Valores Padrão de Pré-preenchimento
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Defina dados recorrentes (ex: site, endereço, empresa) para preencher automaticamente novos contatos.
                  </p>
                </div>
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
              
              {/* Seção 1: Organização padrão */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3.5">
                  Organização & Cargo Padrão
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Nome da Empresa Padrão
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                        <Building className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        name="company"
                        value={presetData.company}
                        onChange={handleChange}
                        placeholder="Ex: Minha Empresa Ltda"
                        className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 focus:border-stone-500 focus:ring-stone-500 rounded-xl text-sm transition-all focus:outline-hidden focus:ring-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Cargo / Função Padrão
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        name="role"
                        value={presetData.role}
                        onChange={handleChange}
                        placeholder="Ex: Consultor"
                        className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 focus:border-stone-500 focus:ring-stone-500 rounded-xl text-sm transition-all focus:outline-hidden focus:ring-2"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção 2: Contatos padrões */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3.5">
                  Canais de Contato Padrão
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Celular / WhatsApp Corporativo
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        name="mobile"
                        value={presetData.mobile}
                        onChange={handleChange}
                        placeholder="Ex: (11) 99999-8888"
                        className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 focus:border-stone-500 focus:ring-stone-500 rounded-xl text-sm transition-all focus:outline-hidden focus:ring-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Telefone Fixo Padrão
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        name="phone"
                        value={presetData.phone}
                        onChange={handleChange}
                        placeholder="Ex: (11) 3300-4400"
                        className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 focus:border-stone-500 focus:ring-stone-500 rounded-xl text-sm transition-all focus:outline-hidden focus:ring-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      E-mail Padrão (Ex: geral/contato)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={presetData.email}
                        onChange={handleChange}
                        placeholder="Ex: contato@minhaempresa.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 focus:border-stone-500 focus:ring-stone-500 rounded-xl text-sm transition-all focus:outline-hidden focus:ring-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Website URL Padrão
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                        <Globe className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        name="website"
                        value={presetData.website}
                        onChange={handleChange}
                        placeholder="Ex: www.minhaempresa.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 focus:border-stone-500 focus:ring-stone-500 rounded-xl text-sm transition-all focus:outline-hidden focus:ring-2"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção 3: Localização padrão */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3.5">
                  Endereço Físico Padrão
                </h3>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Endereço Completo Corporativo
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none text-stone-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <textarea
                      name="address"
                      value={presetData.address}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Ex: Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-100"
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 focus:border-stone-500 focus:ring-stone-500 rounded-xl text-sm transition-all focus:outline-hidden focus:ring-2"
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
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                {isSubmitting ? "Gravando..." : "Salvar Padrões"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
