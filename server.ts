import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

interface Contact {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  phone: string;
  mobile: string;
  fax: string;
  email: string;
  website: string;
  address: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  company: string;
  role: string;
}

const app = express();
const PORT = 3000;
const CONTACTS_FILE = path.join(process.cwd(), "contacts.json");
const PRESETS_FILE = path.join(process.cwd(), "presets.json");

interface ContactPreset {
  phone: string;
  mobile: string;
  fax: string;
  email: string;
  website: string;
  address: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  company: string;
  role: string;
}

const defaultPreset: ContactPreset = {
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

// Load presets from file
function loadPreset(): ContactPreset {
  try {
    if (!fs.existsSync(PRESETS_FILE)) {
      fs.writeFileSync(PRESETS_FILE, JSON.stringify(defaultPreset, null, 2), "utf-8");
      return defaultPreset;
    }
    const data = fs.readFileSync(PRESETS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Erro ao ler arquivo de presets:", err);
    return defaultPreset;
  }
}

// Save presets to file
function savePreset(preset: ContactPreset) {
  try {
    fs.writeFileSync(PRESETS_FILE, JSON.stringify(preset, null, 2), "utf-8");
  } catch (err) {
    console.error("Erro ao salvar arquivo de presets:", err);
  }
}

// Parse JSON request bodies
app.use(express.json());

// Load contacts from file (seed if file doesn't exist)
function loadContacts(): Contact[] {
  try {
    if (!fs.existsSync(CONTACTS_FILE)) {
      const initialContacts: Contact[] = [
        {
          id: "1",
          name: "Carlos Oliveira",
          firstName: "Carlos",
          lastName: "Oliveira",
          phone: "(11) 3214-5555",
          mobile: "(11) 98765-4321",
          fax: "",
          email: "carlos.oliveira@agencycorp.com.br",
          website: "https://agencycorp.com.br",
          address: "Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-100",
          street: "Av. Paulista, 1000",
          city: "São Paulo",
          state: "SP",
          zip: "01310-100",
          country: "Brasil",
          company: "AgencyCorp Digital",
          role: "Diretor de Tecnologia"
        },
        {
          id: "2",
          name: "Juliana Mendes",
          firstName: "Juliana",
          lastName: "Mendes",
          phone: "(21) 2544-3333",
          mobile: "(21) 99888-7777",
          fax: "",
          email: "juliana.mendes@mendesdesign.com",
          website: "https://mendesdesign.com",
          address: "Rua Visconde de Pirajá, 351 - Ipanema, Rio de Janeiro - RJ, 22410-003",
          street: "Rua Visconde de Pirajá, 351",
          city: "Rio de Janeiro",
          state: "RJ",
          zip: "22410-003",
          country: "Brasil",
          company: "Mendes Design Studio",
          role: "Head de Design & UX"
        },
        {
          id: "3",
          name: "Roberto Silva",
          firstName: "Roberto",
          lastName: "Silva",
          phone: "(31) 3456-7890",
          mobile: "(31) 97654-3210",
          fax: "",
          email: "roberto@silvaadvocacia.com.br",
          website: "https://silvaadvocacia.com.br",
          address: "Av. Afonso Pena, 1500 - Centro, Belo Horizonte - MG, 30130-005",
          street: "Av. Afonso Pena, 1500",
          city: "Belo Horizonte",
          state: "MG",
          zip: "30130-005",
          country: "Brasil",
          company: "Silva & Associados",
          role: "Sócio Fundador"
        }
      ];
      fs.writeFileSync(CONTACTS_FILE, JSON.stringify(initialContacts, null, 2), "utf-8");
      return initialContacts;
    }
    const data = fs.readFileSync(CONTACTS_FILE, "utf-8");
    const parsed: any[] = JSON.parse(data);
    const normalized: Contact[] = parsed.map((c) => {
      if (c.firstName !== undefined && c.lastName !== undefined) {
        return c as Contact;
      }
      const parts = (c.name || "").trim().split(/\s+/);
      const firstName = parts[0] || "";
      const lastName = parts.slice(1).join(" ") || "";
      return {
        ...c,
        firstName,
        lastName
      } as Contact;
    });
    return normalized;
  } catch (err) {
    console.error("Erro ao ler arquivo de contatos:", err);
    return [];
  }
}

// Save contacts to file
function saveContacts(contacts: Contact[]) {
  try {
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2), "utf-8");
  } catch (err) {
    console.error("Erro ao salvar arquivo de contatos:", err);
  }
}

// API Routes

// 0. Get and Update Settings Presets for pre-filling
app.get("/api/presets", (req, res) => {
  const preset = loadPreset();
  res.json(preset);
});

app.post("/api/presets", (req, res) => {
  try {
    const { phone, mobile, fax, email, website, address, street, city, state, zip, country, company, role } = req.body;
    const updatedPreset = {
      phone: phone || "",
      mobile: mobile || "",
      fax: fax || "",
      email: email || "",
      website: website || "",
      address: address || "",
      street: street || "",
      city: city || "",
      state: state || "",
      zip: zip || "",
      country: country || "",
      company: company || "",
      role: role || ""
    };
    savePreset(updatedPreset);
    res.json(updatedPreset);
  } catch (error) {
    res.status(500).json({ error: "Erro ao salvar as configurações de pré-preenchimento." });
  }
});

// 1. List all contacts
app.get("/api/contacts", (req, res) => {
  const contacts = loadContacts();
  res.json(contacts);
});

// 2. Create new contact
app.post("/api/contacts", (req, res) => {
  try {
    const { firstName, lastName, phone, mobile, fax, email, website, address, street, city, state, zip, country, company, role } = req.body;
    
    const fName = (firstName || "").trim();
    const lName = (lastName || "").trim();
    const fullName = `${fName} ${lName}`.trim();

    if (!fName) {
      res.status(400).json({ error: "O nome é obrigatório." });
      return;
    }

    const contacts = loadContacts();
    const newContact: Contact = {
      id: Date.now().toString(), // Simple persistent ID generator
      name: fullName,
      firstName: fName,
      lastName: lName,
      phone: phone || "",
      mobile: mobile || "",
      fax: fax || "",
      email: email || "",
      website: website || "",
      address: address || "",
      street: street || "",
      city: city || "",
      state: state || "",
      zip: zip || "",
      country: country || "",
      company: company || "",
      role: role || ""
    };

    contacts.push(newContact);
    saveContacts(contacts);

    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor ao criar contato." });
  }
});

// 3. Update existing contact
app.put("/api/contacts/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, phone, mobile, fax, email, website, address, street, city, state, zip, country, company, role } = req.body;

    const fName = (firstName || "").trim();
    const lName = (lastName || "").trim();
    const fullName = `${fName} ${lName}`.trim();

    if (!fName) {
      res.status(400).json({ error: "O nome é obrigatório." });
      return;
    }

    const contacts = loadContacts();
    const index = contacts.findIndex((c) => c.id === id);

    if (index === -1) {
      res.status(404).json({ error: "Contato não encontrado." });
      return;
    }

    contacts[index] = {
      id,
      name: fullName,
      firstName: fName,
      lastName: lName,
      phone: phone || "",
      mobile: mobile || "",
      fax: fax || "",
      email: email || "",
      website: website || "",
      address: address || "",
      street: street || "",
      city: city || "",
      state: state || "",
      zip: zip || "",
      country: country || "",
      company: company || "",
      role: role || ""
    };

    saveContacts(contacts);
    res.json(contacts[index]);
  } catch (error) {
    res.status(500).json({ error: "Erro interno ao atualizar contato." });
  }
});

// 4. Delete contact
app.delete("/api/contacts/:id", (req, res) => {
  try {
    const { id } = req.params;
    const contacts = loadContacts();
    const filtered = contacts.filter((c) => c.id !== id);

    if (contacts.length === filtered.length) {
      res.status(404).json({ error: "Contato não encontrado." });
      return;
    }

    saveContacts(filtered);
    res.json({ message: "Contato excluído com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro interno ao excluir contato." });
  }
});

// 5. Complete Backup Export (Contacts + Preset)
app.get("/api/backup/export", (req, res) => {
  try {
    const contacts = loadContacts();
    const preset = loadPreset();
    res.json({
      version: "1.0",
      exportedAt: new Date().toISOString(),
      contacts,
      preset
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao gerar arquivo de exportação." });
  }
});

// 6. Complete Backup Import (Contacts + Preset)
app.post("/api/backup/import", express.json({ limit: "10mb" }), (req, res) => {
  try {
    const { contacts, preset } = req.body;
    
    if (contacts && Array.isArray(contacts)) {
      saveContacts(contacts);
    }
    
    if (preset && typeof preset === "object") {
      savePreset(preset);
    }
    
    res.json({ 
      success: true, 
      message: "Backup restaurado com sucesso!",
      contactsCount: contacts ? contacts.length : 0
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao restaurar o backup enviado." });
  }
});

// Vite Middleware & Static Assets

async function initServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

initServer().catch((err) => {
  console.error("Failed to start server:", err);
});
