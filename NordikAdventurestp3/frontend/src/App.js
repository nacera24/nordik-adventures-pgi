
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import NavbarPublic from "./assets/components/NavbarPublic";
import NavbarMagasinier from "./assets/components/NavbarMagasinier";
import NavbarFinancier from "./assets/components/NavbarFinancier";
import NavbarClient from "./assets/components/NavbarClient";
import NavbarServiceClient from "./assets/components/NavbarServiceClient"; 

import Footer from "./assets/components/Footer";

import Accueil from "./pages/Accueil";
import Catalogue from "./pages/Catalogue";
import Connexion from "./pages/Connexion";
import DetailProduit from "./pages/DetailProduit";

// pages Magasinier
import ProduitsMagasinier from "./pages/magasinier/ProduitsMagasinier";
import ProduitDetailsMagasinier from "./pages/magasinier/ProduitDetailsMagasinier";
import AccueilMagasinier from "./pages/magasinier/AccueilMagasinier";
import Fournisseurs from "./pages/magasinier/Fournisseurs";
import ProduitNouveauMagasinier from "./pages/magasinier/ProduitNouveauMagasinier";
import CommandesAchatMagasinier from "./pages/magasinier/CommandesAchatMagasinier";
import CommandesClientsMagasinier from "./pages/magasinier/CommandesClientsMagasinier";

// pages Financier
import AccueilFinancier from "./pages/financier/AccueilFinancier";
import NouvelleCommandeFinancier from "./pages/financier/NouvelleCommande";
import FacturesAchatFinancier from "./pages/financier/FacturesAchatFinancier";
import FactureAchatDetails from "./pages/financier/FactureAchatDetails";
import SommaireAchatFinancier from "./pages/financier/SommaireAchatFinancier";

// pages Client
import PortailClient from "./pages/client/PortailClient";
import ProfilClient from "./pages/client/ProfilClient";
import ProduitClient from "./pages/client/ProduitClient";
import PanierClient from "./pages/client/PanierClient";
import DetailCommandeClient from "./pages/client/DetailCommandeClient";
import CommandeClient from "./pages/client/CommandeClient";
import PaiementClient from "./pages/client/PaiementClient";

// pages Service Client (CRM)
import PortailServiceClient from "./pages/serviceClient/PortailServiceClient";

import Reapprovisionnement from "./assets/components/Reapprovisionnement";

import "./styles/App.css";

function LayoutRouter() {
  const location = useLocation();

  const publicRoutes = ["/", "/catalogue", "/connexion"];

  const magasinierRoutes = [
    "/portail-magasinier",
    "/portail-magasinier/produits",
    "/portail-magasinier/fournisseurs",
    "/portail-magasinier/commandes-achat",
    "/portail-magasinier/commandes-clients",
    "/portail-magasinier/reapprovisionnement",
  ];

  const financierRoutes = [
    "/portail-financier",
    "/portail-financier/panier",
    "/portail-financier/factures",
    "/portail-financier/reapprovisionnement",
  ];

  const clientRoutes = [
    "/portail-client",
    "/portail-client/commandes",
    "/portail-client/panier",
    "/portail-client/profil",
    "/portail-client/produits",
    "/portail-client/produits/:id",
  ];

  //  routes service client
  const serviceClientRoutes = ["/portail-service-client"];

  let navbarToShow = null;

  if (
    publicRoutes.includes(location.pathname) ||
    location.pathname.startsWith("/produits")
  ) {
    navbarToShow = <NavbarPublic />;
  } else if (magasinierRoutes.some((path) => location.pathname.startsWith(path))) {
    navbarToShow = <NavbarMagasinier />;
  } else if (financierRoutes.some((path) => location.pathname.startsWith(path))) {
    navbarToShow = <NavbarFinancier />;
  } else if (serviceClientRoutes.some((path) => location.pathname.startsWith(path))) {
    navbarToShow = <NavbarServiceClient />; 
  } else if (clientRoutes.some((path) => location.pathname.startsWith(path))) {
    navbarToShow = <NavbarClient />;
  }

  return (
    <>
      {navbarToShow}

      <Routes>
        {/* --- PAGES PUBLIQUES --- */}
        <Route
          path="/"
          element={
            <>
              <Accueil />
              <Footer />
            </>
          }
        />
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route
          path="/produits/:id"
          element={
            <>
              <DetailProduit />
              <Footer />
            </>
          }
        />

        {/* --- PAGES CLIENT --- */}
        <Route path="/portail-client" element={<PortailClient />} />
        <Route path="/portail-client/profil" element={<ProfilClient />} />
        <Route path="/portail-client/produits" element={<ProduitClient />} />
        <Route path="/portail-client/produits/:id" element={<DetailProduit />} />
        <Route path="/portail-client/panier" element={<PanierClient />} />
        <Route path="/portail-client/commandes" element={<CommandeClient />} />
        <Route path="/portail-client/commandes/:id" element={<DetailCommandeClient />} />
        <Route path="/portail-client/paiement" element={<PaiementClient />} />

        {/* --- PAGES MAGASINIER --- */}
        <Route path="/portail-magasinier" element={<AccueilMagasinier />} />
        <Route path="/portail-magasinier/produits" element={<ProduitsMagasinier />} />
        <Route path="/portail-magasinier/produits/:id" element={<ProduitDetailsMagasinier />} />
        <Route path="/portail-magasinier/fournisseurs" element={<Fournisseurs />} />
        <Route path="/portail-magasinier/produits/nouveau" element={<ProduitNouveauMagasinier />} />
        <Route path="/portail-magasinier/commandes-achat" element={<CommandesAchatMagasinier />} />
        <Route path="/portail-magasinier/commandes-clients" element={<CommandesClientsMagasinier />} />
        <Route path="/portail-magasinier/reapprovisionnement" element={<Reapprovisionnement />} />

        {/* --- PAGES FINANCIER --- */}
        <Route path="/portail-financier" element={<AccueilFinancier />} />
        <Route path="/portail-financier/panier" element={<NouvelleCommandeFinancier />} />
        <Route path="/portail-financier/factures" element={<FacturesAchatFinancier />} />
        <Route path="/portail-financier/factures/:id" element={<FactureAchatDetails />} />
        <Route path="/portail-financier/factures/:id/sommaire" element={<SommaireAchatFinancier />} />
        <Route path="/portail-financier/reapprovisionnement" element={<Reapprovisionnement />} />

        {/* --- PAGES SERVICE CLIENT (CRM) --- */}
        <Route path="/portail-service-client" element={<PortailServiceClient />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <LayoutRouter />
    </BrowserRouter>
  );
}

export default App;
