import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, Search, Plus, Sparkles, Building, PhoneCall, QrCode, 
  CheckCircle2, AlertCircle, RefreshCw, Edit2, Trash2, Download,
  Smartphone, Mail, Globe, MapPin, Briefcase
} from "lucide-react";
import { Contact, ContactFormData } from "./types";
import ContactModal from "./components/ContactModal";
import { generateVCardString } from "./utils/vcard";
import QRCode from "qrcode";

export default function App() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"name" | "company">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Selection state for Bento Details Card
  const [highlightedContact, setHighlightedContact] = useState<Contact | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Success Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch contacts on mount
  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch("/api/contacts");
      if (!res.ok) {
        throw new Error("Falha ao carregar os contatos do servidor.");
      }
      const data = await res.json();
      setContacts(data);
    } catch (err: any) {
      setError(err.message || "Erro de conexão com o backend.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Create or Update handler
  const handleSaveContact = async (formData: ContactFormData) => {
    try {
      if (selectedContact) {
        // Edit Mode
        const res = await fetch(`/api/contacts/${selectedContact.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        if (!res.ok) throw new Error("Erro ao salvar alterações.");
        showToast("Contato atualizado com sucesso!");
      } else {
        // Add Mode
        const res = await fetch("/api/contacts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        if (!res.ok) throw new Error("Erro ao criar contato.");
        showToast("Contato cadastrado com sucesso!");
      }
      await fetchContacts();
    } catch (err: any) {
      showToast(err.message || "Ocorreu um erro ao salvar o contato.");
      throw err;
    }
  };

  // Delete handler
  const handleDeleteContact = async (id: string) => {
    if (window.confirm("Tem certeza de que deseja excluir este contato?")) {
      try {
        const res = await fetch(`/api/contacts/${id}`, {
          method: "DELETE"
        });
        if (!res.ok) throw new Error("Erro ao excluir o contato.");
        showToast("Contato removido com sucesso.");
        if (highlightedContact?.id === id) {
          setHighlightedContact(null);
        }
        await fetchContacts();
      } catch (err: any) {
        showToast(err.message || "Ocorreu um erro ao excluir.");
      }
    }
  };

  // Open modal for editing
  const handleEditClick = (contact: Contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  // Open modal for adding
  const handleAddClick = () => {
    setSelectedContact(null);
    setIsModalOpen(true);
  };

  // Toggle sorting
  const handleSortToggle = (field: "name" | "company") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Filter & sort list
  const filteredAndSortedContacts = contacts
    .filter((c) => {
      const search = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(search) ||
        c.company.toLowerCase().includes(search) ||
        c.role.toLowerCase().includes(search) ||
        c.email.toLowerCase().includes(search) ||
        c.mobile.includes(search)
      );
    })
    .sort((a, b) => {
      let valA = sortBy === "name" ? a.name : a.company;
      let valB = sortBy === "name" ? b.name : b.company;

      valA = valA.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      valB = valB.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  // Automatically determine the active/highlighted contact from list
  const activeContact = highlightedContact && filteredAndSortedContacts.some(c => c.id === highlightedContact.id)
    ? highlightedContact
    : (filteredAndSortedContacts[0] || null);

  // Calculate stats
  const totalContacts = contacts.length;
  const uniqueCompanies = Array.from(new Set(contacts.map((c) => c.company).filter(Boolean))).length;
  const contactsWithMobile = contacts.filter((c) => c.mobile).length;

  return (
    <div className="flex h-screen w-full bg-[#F4F4F5] font-sans text-slate-900 overflow-hidden">
      
      {/* Left Sidebar - Desktop only */}
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col justify-between hidden md:flex flex-shrink-0">
        <div className="p-6 flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">V-C</span>
              </div>
              <h1 className="text-lg font-extrabold tracking-tight text-slate-950">V-CONNECT</h1>
            </div>
            
            <nav className="space-y-1">
              <a href="#" className="flex items-center gap-3 px-3 py-2.5 bg-slate-100 rounded-lg text-sm font-semibold text-slate-900">
                <Users className="w-4 h-4 text-slate-800" />
                Contatos
              </a>
              
              <div className="pt-6 pb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3">Métricas</span>
              </div>
              
              <div className="space-y-3 px-3 pt-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Total de Contatos</span>
                  <span className="font-mono font-bold bg-slate-100 px-2 py-0.5 rounded-md text-slate-700">{totalContacts}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Empresas</span>
                  <span className="font-mono font-bold bg-slate-100 px-2 py-0.5 rounded-md text-slate-700">{uniqueCompanies}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Com Celular</span>
                  <span className="font-mono font-bold bg-slate-100 px-2 py-0.5 rounded-md text-slate-700">{contactsWithMobile}</span>
                </div>
              </div>
            </nav>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center text-white font-bold text-xs uppercase shadow-sm">
                CA
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Cleiton Amaral</p>
                <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Senior Developer</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header Bar */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 md:px-8 flex-shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Diretório / Corporativo</h2>
            {isLoading && <RefreshCw className="w-3.5 h-3.5 text-slate-400 animate-spin" />}
          </div>
          <button 
            onClick={handleAddClick}
            className="px-4 py-2 bg-black hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors uppercase tracking-widest flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo Contato</span>
          </button>
        </header>

        {/* Scrollable Workspace */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/60">
          
          {/* Quick Filters / Search */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Pesquise por nome, empresa, e-mail, cargo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 focus:border-slate-500 focus:ring-slate-500 rounded-xl text-xs transition-all focus:outline-hidden focus:ring-2 shadow-xs"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Ordenar por:</span>
                <button
                  onClick={() => handleSortToggle("name")}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                    sortBy === "name" 
                      ? "bg-black border-black text-white shadow-xs" 
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <span>Nome</span>
                  {sortBy === "name" && (
                    <span className="text-[10px] opacity-80">{sortOrder === "asc" ? "↑" : "↓"}</span>
                  )}
                </button>
                <button
                  onClick={() => handleSortToggle("company")}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                    sortBy === "company" 
                      ? "bg-black border-black text-white shadow-xs" 
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <span>Empresa</span>
                  {sortBy === "company" && (
                    <span className="text-[10px] opacity-80">{sortOrder === "asc" ? "↑" : "↓"}</span>
                  )}
                </button>
              </div>
              <button
                onClick={fetchContacts}
                className="p-2 text-slate-500 hover:text-slate-950 border border-slate-200 bg-white rounded-lg transition-colors shadow-xs"
                title="Recarregar"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bento Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* LARGE BENTO CONTAINER: Contacts list (col-span-2) */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-col overflow-hidden min-h-[420px]">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                <h3 className="font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  Contatos Ativos
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                    {filteredAndSortedContacts.length} total
                  </span>
                </h3>
                <div className="flex gap-2 items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Diretório Ativo</span>
                </div>
              </div>

              <div className="flex-1 overflow-x-auto">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <RefreshCw className="w-8 h-8 text-slate-400 animate-spin" />
                    <p className="text-slate-500 text-xs mt-3 font-semibold">Buscando contatos...</p>
                  </div>
                ) : error ? (
                  <div className="p-8 text-center">
                    <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <p className="text-red-500 text-xs font-semibold">{error}</p>
                    <button onClick={fetchContacts} className="mt-3 text-xs text-slate-900 underline font-bold">Tentar novamente</button>
                  </div>
                ) : filteredAndSortedContacts.length === 0 ? (
                  <div className="p-16 text-center text-slate-400 flex flex-col items-center">
                    <Users className="w-12 h-12 text-slate-200 mb-3" />
                    <p className="text-sm font-semibold text-slate-700">Nenhum contato cadastrado.</p>
                    <p className="text-xs mt-1 text-slate-400 max-w-xs">Clique em "+ Novo Contato" ou altere sua consulta de pesquisa.</p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 text-[10px] uppercase font-extrabold text-slate-400 tracking-wider border-b border-slate-100">
                        <th className="px-6 py-4">Nome / Empresa</th>
                        <th className="px-6 py-4 hidden sm:table-cell">Cargo / Função</th>
                        <th className="px-6 py-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredAndSortedContacts.map((contact) => {
                        const isSelected = activeContact?.id === contact.id;
                        return (
                          <tr 
                            key={contact.id}
                            onClick={() => setHighlightedContact(contact)}
                            className={`transition-colors cursor-pointer group ${isSelected ? "bg-slate-50" : "hover:bg-slate-50/30"}`}
                          >
                            <td className="px-6 py-4.5">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-colors ${isSelected ? "bg-black text-white" : "bg-slate-100 text-slate-800"}`}>
                                  {contact.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-slate-900 group-hover:text-black">{contact.name}</p>
                                  <p className="text-xs text-slate-500 font-medium">{contact.company || "Sem empresa"}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4.5 text-xs text-slate-600 font-medium hidden sm:table-cell">
                              {contact.role || "—"}
                            </td>
                            <td className="px-6 py-4.5 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleEditClick(contact)}
                                  className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                                  title="Editar"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteContact(contact.id)}
                                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                  title="Excluir"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* BENTO COLUMN 2: Details and QR cards */}
            <div className="space-y-6">
              
              {/* Active QR Preview Card */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 flex flex-col items-center justify-center text-center space-y-4">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Preview do QR Code Ativo</div>
                
                <ActiveQrPreview contact={activeContact} />
              </div>

              {/* Detailed Selection Card */}
              <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col justify-between shadow-md min-h-[300px]">
                <ActiveContactDetails contact={activeContact} />
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Slide-over Contact Modal */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveContact}
        contact={selectedContact}
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 bg-stone-900 border border-stone-800 text-stone-100 text-xs font-semibold px-4 py-3 rounded-xl shadow-lg flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Subcomponent: QR Previewer inside Bento Layout
function ActiveQrPreview({ contact }: { contact: Contact | null }) {
  const [qrUrl, setQrUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  useEffect(() => {
    if (!contact) {
      setQrUrl("");
      return;
    }
    const vCardData = generateVCardString(contact);
    QRCode.toDataURL(vCardData, { width: 300, margin: 1 })
      .then(setQrUrl)
      .catch(err => console.error("Error generating bento QR preview:", err));
  }, [contact]);

  const handleDownload = async () => {
    if (!contact) return;
    try {
      setIsGenerating(true);
      const vCardData = generateVCardString(contact);
      const highResUrl = await QRCode.toDataURL(vCardData, {
        width: 1024,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF"
        }
      });
      const link = document.createElement("a");
      link.href = highResUrl;
      const safeName = contact.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "_");
      link.download = `qrcode_vcard_${safeName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!contact) {
    return (
      <div className="flex flex-col items-center py-6">
        <div className="p-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 text-slate-300 flex items-center justify-center">
          <QrCode className="w-24 h-24 stroke-1" />
        </div>
        <p className="text-xs text-slate-400 mt-4">Nenhum contato selecionado</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-center shadow-xs">
        {qrUrl ? (
          <img src={qrUrl} alt="vCard QR Preview" className="w-36 h-36 object-contain" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-36 h-36 bg-slate-100 animate-pulse rounded-lg" />
        )}
      </div>
      <button 
        onClick={handleDownload}
        disabled={isGenerating}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
      >
        <Download className="w-4 h-4" />
        <span>{isGenerating ? "BAIXANDO..." : "DOWNLOAD PNG (VCARD 3.0)"}</span>
      </button>
    </div>
  );
}

// Subcomponent: Contact Details inside Bento Layout
function ActiveContactDetails({ contact }: { contact: Contact | null }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (!contact) return;
    const vCardData = generateVCardString(contact);
    navigator.clipboard.writeText(vCardData);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (!contact) {
    return (
      <div className="h-full flex flex-col justify-center py-10 text-center">
        <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Seleção Atual</p>
        <p className="text-xs text-slate-400 mt-2 max-w-[200px] mx-auto">Selecione um contato na lista para ver os detalhes completos.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between h-full space-y-6">
      <div>
        <div className="flex justify-between items-start gap-2">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Seleção Atual</span>
          <button 
            onClick={handleCopy}
            className="text-[10px] uppercase font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            {isCopied ? "Copiado!" : "Copiar vCard"}
          </button>
        </div>
        <h4 className="text-lg font-bold mt-3 text-white tracking-tight">{contact.name}</h4>
        
        {contact.role && (
          <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-slate-500" />
            {contact.role}
          </p>
        )}
        {contact.company && (
          <p className="text-xs text-slate-400 font-semibold mt-1 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-slate-500" />
            {contact.company}
          </p>
        )}

        <div className="mt-6 space-y-3 border-t border-white/10 pt-4 text-xs">
          {contact.mobile && (
            <div className="flex justify-between items-center">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                Celular
              </span>
              <span className="font-mono text-slate-200 font-medium">{contact.mobile}</span>
            </div>
          )}
          {contact.phone && (
            <div className="flex justify-between items-center">
              <span className="text-slate-400 flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-slate-500" />
                Fixo
              </span>
              <span className="font-mono text-slate-200 font-medium">{contact.phone}</span>
            </div>
          )}
          {contact.email && (
            <div className="flex justify-between items-center">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                Email
              </span>
              <span className="font-mono text-slate-200 truncate max-w-[170px] font-medium" title={contact.email}>
                {contact.email}
              </span>
            </div>
          )}
          {contact.website && (
            <div className="flex justify-between items-center">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                Website
              </span>
              <span className="font-mono text-blue-400 hover:underline truncate max-w-[170px] font-medium">
                <a href={contact.website.startsWith("http") ? contact.website : `https://${contact.website}`} target="_blank" rel="noreferrer">
                  {contact.website}
                </a>
              </span>
            </div>
          )}
        </div>
      </div>

      {contact.address && (
        <div className="pt-4 border-t border-white/10 mt-4">
          <span className="text-[9px] uppercase font-bold text-slate-500 flex items-center gap-1 mb-1.5">
            <MapPin className="w-3 h-3 text-slate-500" />
            Localização
          </span>
          <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
            {contact.address}
          </p>
        </div>
      )}
    </div>
  );
}
